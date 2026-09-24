// @vitest-environment happy-dom
import { afterEach, expect, test } from "vite-plus/test";
import { initPhotoAccessibility } from "../src/site/photo-accessibility";

let cleanup: (() => void) | undefined;
afterEach(() => {
  cleanup?.();
  cleanup = undefined;
  document.body.innerHTML = "";
});
const first = "https://cdn.prod.website-files.com/site/first.webp";
const second = "https://cdn.prod.website-files.com/site/second.jpg";
const settle = () => new Promise((resolve) => setTimeout(resolve, 10));
function source(url: string, description: string, extra = ""): string {
  return `<a class="w-lightbox" href="#" aria-label="open lightbox" ${extra}><img src="${url}" srcset="${url}?width=500 500w" alt="${description}"><p>Confirmed event caption</p><script class="w-json" type="application/json">${JSON.stringify({ items: [{ url, type: "image" }], group: "Retained group" })}</script></a>`;
}
function fixture(): void {
  document.body.innerHTML =
    source(first, "Participants talking at a table") +
    source(second, "A presenter on stage") +
    `<form><input name="Phone"></form><span class="swiper-notification" aria-live="assertive">Next slide</span>`;
}
function viewer(url: string): HTMLImageElement {
  const image = document.createElement("img");
  image.className = "w-lightbox-image";
  image.src = url;
  document.body.append(image);
  return image;
}

test("names native links while preserving captions, files, groups and event behavior", () => {
  fixture();
  const links = [...document.querySelectorAll<HTMLAnchorElement>("a")];
  const images = links.map((link) => link.querySelector("img")!.outerHTML);
  const media = links.map((link) => link.querySelector("script")!.textContent);
  const form = document.querySelector("form")!.outerHTML;
  let clicked = 0;
  links[0]!.addEventListener("click", () => clicked++);
  cleanup = initPhotoAccessibility();
  expect(links.map((link) => link.getAttribute("aria-label"))).toEqual([
    "View photo: Participants talking at a table",
    "View photo: A presenter on stage",
  ]);
  links[0]!.click();
  expect(clicked).toBe(1);
  expect(links.map((link) => link.querySelector("img")!.outerHTML)).toEqual(images);
  expect(links.map((link) => link.querySelector("script")!.textContent)).toEqual(media);
  expect(document.querySelector("form")!.outerHTML).toBe(form);
  expect(document.querySelector(".swiper-notification")!.getAttribute("aria-live")).toBe(
    "assertive",
  );
});

test("late viewer images and next/previous source changes receive the current description", async () => {
  fixture();
  cleanup = initPhotoAccessibility();
  const image = viewer(first.replace("cdn.prod.website-files.com", "uploads-ssl.webflow.com"));
  await settle();
  expect(image.alt).toBe("Participants talking at a table");
  image.src = second;
  await settle();
  expect(image.alt).toBe("A presenter on stage");
  image.src = first;
  await settle();
  expect(image.alt).toBe("Participants talking at a table");
  document.querySelector("a img")!.setAttribute("alt", "Updated native description");
  await settle();
  expect(image.alt).toBe("Updated native description");
});

test("unknown assets preserve their own accessible data and cannot inherit a stale description", async () => {
  fixture();
  document.body.insertAdjacentHTML(
    "beforeend",
    `<a class="w-lightbox" aria-label="Watch approved video"><img alt="Existing media"><script class="w-json">invalid</script></a>`,
  );
  const image = viewer(first);
  image.alt = "Existing fallback";
  cleanup = initPhotoAccessibility();
  image.src = "https://other.example/site/first.webp";
  await settle();
  expect(image.alt).toBe("Existing fallback");
  expect(document.querySelectorAll("a")[2]!.getAttribute("aria-label")).toBe(
    "Watch approved video",
  );
  const unknown = viewer("https://other.example/unknown.jpg");
  unknown.alt = "Original unknown description";
  await settle();
  expect(unknown.alt).toBe("Original unknown description");
});

test("thumbnail tabs have descriptive names and silent duplicate images", async () => {
  fixture();
  cleanup = initPhotoAccessibility();
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="w-lightbox-item" role="tab" aria-label="show item 2 of 2" tabindex="0" aria-selected="true"><img class="w-lightbox-thumbnail-image" src="${second}"></div>`,
  );
  await settle();
  const tab = document.querySelector("[role=tab]")!;
  expect(tab.getAttribute("aria-label")).toBe("show item 2 of 2: A presenter on stage");
  expect(tab.querySelector("img")!.getAttribute("alt")).toBe("");
  expect(tab.getAttribute("aria-selected")).toBe("true");
  expect(tab.getAttribute("tabindex")).toBe("0");
});

test("repeat initialization is idempotent; cleanup restores state and detaches observation", async () => {
  fixture();
  const before = document.body.innerHTML;
  cleanup = initPhotoAccessibility();
  expect(initPhotoAccessibility()).toBe(cleanup);
  const image = viewer(first);
  await settle();
  cleanup();
  expect(image.hasAttribute("alt")).toBe(false);
  image.remove();
  expect(document.body.innerHTML).toBe(before);
  const detached = viewer(first);
  await settle();
  expect(detached.hasAttribute("alt")).toBe(false);
  cleanup = initPhotoAccessibility();
  expect(detached.alt).toBe("Participants talking at a table");
});

test("removing the native description clears managed names and leaves editor overrides intact", async () => {
  fixture();
  cleanup = initPhotoAccessibility();
  const link = document.querySelector("a")!;
  const image = viewer(first);
  await settle();
  link.querySelector("img")!.alt = "";
  await settle();
  expect(link.getAttribute("aria-label")).toBe("open lightbox");
  expect(image.hasAttribute("alt")).toBe(false);
  link.setAttribute("aria-label", "Editor's new accessible name");
  cleanup();
  expect(link.getAttribute("aria-label")).toBe("Editor's new accessible name");
});

test("meaningful external labels win while descriptions remain present; explicit non-photo media is skipped", async () => {
  fixture();
  document.body.insertAdjacentHTML(
    "beforeend",
    source("https://example.test/video", "Video poster").replace(
      '"type":"image"',
      '"type":"video"',
    ),
  );
  cleanup = initPhotoAccessibility();
  const link = document.querySelector("a")!;
  link.setAttribute("aria-label", "Read the approved accessible photo name");
  await settle();
  expect(link.getAttribute("aria-label")).toBe("Read the approved accessible photo name");
  expect(document.querySelectorAll("a")[2]!.getAttribute("aria-label")).toBe("open lightbox");
  cleanup();
  expect(link.getAttribute("aria-label")).toBe("Read the approved accessible photo name");
});
