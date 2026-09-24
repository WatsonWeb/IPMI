const instances = new WeakMap<Document, () => void>();

/** Add descriptions to Webflow's generated viewer without replacing its behavior. */
export function initPhotoAccessibility(doc: Document = document): () => void {
  const existing = instances.get(doc);
  if (existing) return existing;
  const owned = new Map<Element, Map<string, { before: string | null; value: string }>>();
  let stopped = false;

  function key(value: string): string {
    try {
      const url = new URL(value, doc.baseURI);
      if (!/^https?:$/.test(url.protocol)) return "";
      // Webflow serializes the same CMS asset under either of these hosts.
      if (url.hostname === "uploads-ssl.webflow.com") url.hostname = "cdn.prod.website-files.com";
      return url.href;
    } catch {
      return "";
    }
  }

  function restore(element: Element, name: string): void {
    const attributes = owned.get(element);
    const state = attributes?.get(name);
    if (!state) return;
    if (element.getAttribute(name) === state.value) {
      if (state.before === null) element.removeAttribute(name);
      else element.setAttribute(name, state.before);
    }
    attributes?.delete(name);
    if (!attributes?.size) owned.delete(element);
  }

  function update(): void {
    if (stopped) return;
    const touched = new Map<Element, Set<string>>();
    function set(element: Element, name: string, value: string): void {
      let attributes = owned.get(element);
      if (!attributes) owned.set(element, (attributes = new Map()));
      const state = attributes.get(name);
      // Preserve a later native/editor change as the value to restore.
      if (!state || element.getAttribute(name) !== state.value)
        attributes.set(name, { before: element.getAttribute(name), value });
      else state.value = value;
      if (element.getAttribute(name) !== value) element.setAttribute(name, value);
      let names = touched.get(element);
      if (!names) touched.set(element, (names = new Set()));
      names.add(name);
    }

    const descriptions = new Map<string, string>();
    doc.querySelectorAll<HTMLAnchorElement>("a.w-lightbox").forEach((link) => {
      if (link.closest(".w-lightbox-backdrop")) return;
      const image = link.querySelector<HTMLImageElement>("img");
      const description = image?.getAttribute("alt")?.trim();
      if (!image || !description) return;
      const data = link.querySelector("script.w-json");
      try {
        const config: unknown = JSON.parse(data?.textContent ?? "");
        if (!config || typeof config !== "object" || !("items" in config)) return;
        const items = config.items;
        // One thumbnail describes one native destination; never label an unseen multi-image set.
        if (!Array.isArray(items) || items.length !== 1) return;
        const item: unknown = items[0];
        if (!item || typeof item !== "object" || !("url" in item) || typeof item.url !== "string")
          return;
        if ("type" in item && item.type !== "image") return;
        const destination = key(item.url);
        if (!destination) return;
        descriptions.set(destination, description);
        const label = link.getAttribute("aria-label");
        if (
          !label ||
          label.toLowerCase() === "open lightbox" ||
          owned.get(link)?.get("aria-label")?.value === label
        )
          set(link, "aria-label", `View photo: ${description}`);
      } catch {
        // Unrelated/malformed media retains Webflow's original accessible information.
      }
    });

    doc.querySelectorAll<HTMLImageElement>(".w-lightbox-image").forEach((image) => {
      const description = descriptions.get(key(image.getAttribute("src") ?? ""));
      if (description) set(image, "alt", description);
    });
    doc.querySelectorAll<HTMLElement>(".w-lightbox-item[role=tab]").forEach((tab) => {
      const image = tab.querySelector<HTMLImageElement>(".w-lightbox-thumbnail-image");
      const description = image && descriptions.get(key(image.getAttribute("src") ?? ""));
      if (!image || !description) return;
      const current = tab.getAttribute("aria-label");
      const state = owned.get(tab)?.get("aria-label");
      const original = state?.value === current ? state.before : current;
      if (!original || !/^show item \d+ of \d+$/i.test(original)) return;
      set(tab, "aria-label", `${original}: ${description}`);
      set(image, "alt", "");
    });
    if (descriptions.size && doc.body) set(doc.body, "data-ipmi-photo-accessibility", "");
    for (const [element, attributes] of owned)
      for (const name of attributes.keys())
        if (!touched.get(element)?.has(name)) restore(element, name);
  }

  const observer = new MutationObserver(update);
  update();
  observer.observe(doc.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["src", "srcset", "alt", "aria-label"],
  });
  const cleanup = (): void => {
    stopped = true;
    observer.disconnect();
    for (const [element, attributes] of owned)
      for (const name of attributes.keys()) restore(element, name);
    instances.delete(doc);
  };
  instances.set(doc, cleanup);
  return cleanup;
}
