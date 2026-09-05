import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { validateKbygThemeContract } from "./kbyg-theme-contract.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = path.join(root, "Page HTML", "KBYG Pages", "KBYG-Template.html");
const html = await readFile(templatePath, "utf8");
const head = await readFile(path.join(root, "Page HTML", "KBYG Pages", "KBYG-Head.html"), "utf8");
const stylesEmbed = await readFile(
  path.join(root, "Page HTML", "KBYG Pages", "KBYG-Styles-Embed.html"),
  "utf8",
);
const visibleText = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const failures = validateKbygThemeContract(head, html, stylesEmbed);

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) failures.push(`Duplicate ids: ${duplicateIds.join(", ")}`);

const sectionIds = new Set(
  [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"[^>]*\bdata-kbyg-section=/g)].map(
    (match) => match[1],
  ),
);
for (const match of html.matchAll(/\bdata-kbyg-jump="([^"]+)"/g)) {
  const target = match[1].replace(/^#/, "");
  if (!sectionIds.has(target)) failures.push(`Jump target does not resolve: ${target}`);
}

const requiredSections = [
  "welcome",
  "prepare",
  "key-dates",
  "agenda",
  "hub",
  "hotel-travel",
  "experience",
  "faq",
  "sponsor-support",
  "contact",
];
for (const id of requiredSections) {
  if (!sectionIds.has(id)) failures.push(`Missing required section: ${id}`);
}

const requiredFragments = [
  'class="kbyg-page"',
  'data-audience="delegate"',
  'data-kbyg-audience-branch="delegate"',
  'data-kbyg-audience-branch="sponsor"',
  "Preparing for your Institute is as easy as 1-2-3.",
  "Key Dates &amp; Deliverables.",
  "Agenda At-A-Glance.",
  "The Ritz-Carlton Orlando, Grande Lakes",
  "Katrina Brightling",
  "kbrightling@ipmievents.com",
  "data-kbyg-accordion",
  "data-kbyg-calendar",
];
for (const fragment of requiredFragments) {
  if (!html.includes(fragment)) failures.push(`Missing markup contract fragment: ${fragment}`);
}

if (!visibleText.includes("Know Before You Go.")) {
  failures.push("Missing visible Figma heading: Know Before You Go.");
}

if (/\bhref="#"/.test(html)) failures.push('Dead href="#" remains in the template.');
if (/\bdisabled(?:\s|>)/.test(html)) failures.push("A disabled interactive control remains.");
if (/R0lGODlhAQABAIAAAAAA/.test(html)) failures.push("A transparent placeholder image remains.");
if ((html.match(/(?<![-\w])data-kbyg-calendar(?=[\s=>])/g) || []).length !== 8) {
  failures.push("Expected exactly eight key-date calendar controls.");
}
if ((html.match(/\bdata-kbyg-accordion(?:\s|>)/g) || []).length !== 5) {
  failures.push("Expected exactly five Delegate FAQ accordions.");
}
if ((html.match(/\bdata-kbyg-curve=/g) || []).length !== 10) {
  failures.push("Expected exactly ten alternating curve placeholders.");
}

const calendarLabels = [
  ...html.matchAll(/\bdata-kbyg-calendar\b[^>]*\baria-label="([^"]+)"/gs),
].map((match) => match[1]);
if (calendarLabels.length !== 8 || new Set(calendarLabels).size !== 8) {
  failures.push("Calendar controls must have eight unique accessible labels.");
}

for (const fragment of [
  "6a9a6b00eb4c917e35e13982_kbyg-hero-orlando-skyline.webp",
  "6a9a69f8fd883fff73e394fb_kbyg-hero-attendee-clean.webp",
  "https://ipmionline.sharepoint.com/:b:/s/IPMIExternal/IQDhY6Ng2S5QQ4ydRO30tLytAd2eoi55aaOvVa0DMGPXDKw",
  'href="mailto:kbrightling@ipmievents.com"',
]) {
  if (!html.includes(fragment)) failures.push(`Missing required live asset or link: ${fragment}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("KBYG template markup contract is valid.");
}
