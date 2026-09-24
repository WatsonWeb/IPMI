import { parse, type DefaultTreeAdapterMap } from "parse5";

export type ReviewRuntimeMode = "baseline" | "development" | "production";
type HtmlNode = DefaultTreeAdapterMap["node"];

export function insertBeforeClosingTag(
  html: string,
  tag: "head" | "body",
  content: string,
): string {
  const parsed = parse(html, { sourceCodeLocationInfo: true });
  let position: number | undefined;
  function find(node: HtmlNode): void {
    if ("tagName" in node && node.tagName === tag)
      position = node.sourceCodeLocation?.endTag?.startOffset;
    if ("childNodes" in node) for (const child of node.childNodes) find(child);
  }
  find(parsed);
  if (position === undefined) throw new Error(`Review snapshot is missing its ${tag} closing tag.`);
  return html.slice(0, position) + content + html.slice(position);
}

export function reviewEntryNames(route: string): string[] {
  if (route === "/") return ["site", "home"];
  if (route === "/institutes/healthcare-gci-oct-2026") return ["site", "institute"];
  if (/^\/know-before-you-go\/hchr-sept-2026-(sponsor|delegate)$/.test(route))
    return ["site", "ipmi-kbyg"];
  throw new Error(`No reviewed JavaScript entry mapping for ${route}`);
}

function isLegacyWebpLoader(source: string): boolean {
  try {
    const url = new URL(source);
    if (url.origin === "https://watsonweb.github.io")
      return /^\/IPMI\/js\/webp-polyfill(?:-min)?\.js$/.test(url.pathname);
    if (url.origin === "https://cdn.jsdelivr.net")
      return /^\/gh\/WatsonWeb\/IPMI@[^/]+\/js\/webp-polyfill(?:-min)?\.js$/.test(url.pathname);
  } catch {
    // Unknown or relative URLs are not recognized first-party dependencies.
  }
  return false;
}

// Replace only identified first-party code. Webflow, analytics, FontAwesome,
// vendor CDN scripts, and CMS-bound configuration remain untouched.
export function rewriteReviewScripts(html: string, route: string, mode: ReviewRuntimeMode): string {
  if (mode === "baseline") return html;
  const entries = reviewEntryNames(route);
  const document = parse(html, { sourceCodeLocationInfo: true });
  const replacements: { start: number; end: number }[] = [];
  const found = new Set<string>();
  const completeExternalEntries = new Set<string>();
  const instituteFragments = new Set<"modal" | "sliders">();
  function visit(node: HtmlNode): void {
    if ("tagName" in node && node.tagName === "script" && node.sourceCodeLocation) {
      const src = node.attrs.find((attribute) => attribute.name === "src")?.value;
      const text = node.childNodes
        .filter((child) => "value" in child)
        .map((child) => ("value" in child ? child.value : ""))
        .join("");
      let entry: string | undefined;
      let legacyWebpLoader = false;
      if (src) {
        // This legacy file combines vendor detection with a first-party loader;
        // the site entry now owns it. Keep it only in the untouched baseline.
        // Query/hash suffixes do not change the owned script being replaced.
        legacyWebpLoader = isLegacyWebpLoader(src);
        const match = src.match(
          /^https:\/\/(?:cdn\.jsdelivr\.net\/gh\/WatsonWeb\/IPMI@[^/]+|watsonweb\.github\.io\/IPMI)\/(?:dist\/)?([a-z][a-z0-9-]*)\.js$/,
        );
        if (match && entries.includes(match[1])) {
          entry = match[1];
          completeExternalEntries.add(entry);
        }
      } else if (
        text.includes("mobile-menu-wrap") &&
        text.includes("footer-open-button") &&
        text.includes("preserveAspectRatio")
      ) {
        entry = "site";
      } else if (
        route === "/" &&
        text.includes("featuresSwiper") &&
        text.includes("statInstitutes") &&
        text.includes("new Swiper")
      ) {
        entry = "home";
      } else if (route.startsWith("/institutes/")) {
        const modal =
          text.includes("https://ipmi-express-server.vercel.app/cms-items/") &&
          text.includes("modal-link");
        const sliders = text.includes("advisorsSwiper") && text.includes("new Swiper");
        if (modal) instituteFragments.add("modal");
        if (sliders) instituteFragments.add("sliders");
        if (modal || sliders) entry = "institute";
      }
      if (entry || legacyWebpLoader) {
        if (entry) found.add(entry);
        replacements.push({
          start: node.sourceCodeLocation.startOffset,
          end: node.sourceCodeLocation.endOffset,
        });
      }
    }
    if ("childNodes" in node) for (const child of node.childNodes) visit(child);
  }
  visit(document);
  const missing = entries.filter((entry) => !found.has(entry));
  if (entries.includes("institute") && !completeExternalEntries.has("institute")) {
    for (const fragment of ["modal", "sliders"] as const) {
      if (!instituteFragments.has(fragment)) missing.push(`institute ${fragment} fragment`);
    }
  }
  if (missing.length)
    throw new Error(
      `Cannot safely replace staging JavaScript: missing ${missing.join(", ")} on ${route}. Review the upstream markup.`,
    );
  let result = html;
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    result = result.slice(0, replacement.start) + result.slice(replacement.end);
  }
  const tags = entries
    .map((entry) =>
      mode === "development"
        ? `<script type="module" src="/src/entries/${entry}.ts"></script>`
        : `<script defer src="/${entry}.js"></script>`,
    )
    .join("\n");
  return insertBeforeClosingTag(result, "body", `${tags}\n`);
}
