// @vitest-environment happy-dom
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Window } from "happy-dom";

import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import kbyg, { type KbygInstance, type KbygWindow } from "../src/kbyg/index";

const instances: KbygInstance[] = [];

function page(html: string, audience = "delegate"): HTMLElement {
  const element = document.createElement("main");
  element.className = "kbyg-page";
  element.setAttribute("data-audience", audience);
  element.innerHTML = html;
  document.body.append(element);
  return element;
}

function get<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  assert.ok(element, `Missing fixture element: ${selector}`);
  return element;
}

function initialize(element: HTMLElement): KbygInstance {
  const instance = kbyg.initPage(element);
  assert.ok(instance);
  instances.push(instance);
  return instance;
}

function lightboxItems(link: HTMLElement): unknown[] {
  const value: unknown = JSON.parse(get(link, ".w-json").textContent ?? "{}");
  assert.ok(value !== null && typeof value === "object" && "items" in value);
  assert.ok(Array.isArray(value.items));
  return value.items;
}

beforeEach(() => {
  vi.useFakeTimers();
  const navigation = (window as unknown as Window).happyDOM.settings.navigation;
  navigation.disableMainFrameNavigation = true;
  navigation.disableChildFrameNavigation = true;
  navigation.disableChildPageNavigation = true;
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  history.replaceState(null, "", "/know-before-you-go/example-delegate");
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1280 });
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  instances.splice(0).forEach((instance) => instance.destroy());
  vi.runOnlyPendingTimers();
  vi.restoreAllMocks();
  vi.useRealTimers();
  delete (window as KbygWindow).Webflow;
  delete (window as KbygWindow).FontAwesome;
  document.body.innerHTML = "";
});

test.each(["delegate", "sponsor"])(
  "%s CMS headings, agenda introduction, and CTA survive runtime enhancement",
  (audience) => {
    history.replaceState(null, "", `/know-before-you-go/example-${audience}`);
    const element = page(
      `<h2 id="kbyg-welcome-title">Welcome to our leadership retreat!</h2>
      <h2 id="kbyg-prepare-title-${audience}">Plan your visit in four steps.</h2>
      <h2 id="kbyg-key-dates-title-sponsor">Your delivery deadlines</h2>
      <h2 id="kbyg-travel-title">Stay beside the lake.</h2>
      <h2 id="kbyg-experience-title-sponsor">Connections that matter</h2>
      <section id="agenda">
        <h2 id="kbyg-agenda-title">Explore your three-day program!</h2>
        <p class="kbyg-section__intro">Browse the <strong>Sponsor Hub</strong> for shared resources.</p>
        <a class="kbyg-button" href="https://event.example.test/program">Download the event program</a>
      </section>
      <section id="hub"><h2 class="kbyg-section__title">Your event resources</h2></section>
      <section id="sponsor-support"><h2 class="kbyg-section__title">Ask our event team!</h2></section>
      <section id="contact"><h2 class="kbyg-contact__title">Speak with your Operations Lead.</h2></section>`,
      audience,
    );
    const headings = [...element.querySelectorAll("h2")].map((heading) => ({
      heading,
      text: heading.textContent,
    }));
    const intro = get(element, "#agenda .kbyg-section__intro");
    const introMarkup = intro.innerHTML;
    const cta = get(element, "#agenda a");

    initialize(element);

    headings.forEach(({ heading, text }) => expect(heading.textContent).toBe(text));
    expect(intro.innerHTML).toBe(introMarkup);
    expect(cta.textContent).toBe("Download the event program");
    expect(cta.getAttribute("href")).toBe("https://event.example.test/program");
  },
);

test("mobile welcome headings retain the CMS accessible name", () => {
  const nativeMatchMedia = window.matchMedia.bind(window);
  vi.spyOn(window, "matchMedia").mockImplementation((query) => {
    const list = nativeMatchMedia(query);
    if (query === "(max-width: 991px)") {
      vi.spyOn(list, "matches", "get").mockReturnValue(true);
    }
    return list;
  });
  const element = page('<h2 id="kbyg-welcome-title">Welcome to our autumn retreat!</h2>');

  initialize(element);

  const title = get(element, "h2");
  expect(title.textContent).toBe("Welcome to our autumn retreat!");
  expect(title.getAttribute("aria-label") || title.textContent).toBe(
    "Welcome to our autumn retreat!",
  );
});

test("the bound Institute year prefixes the event title only once across reinitialization", () => {
  const element = page('<p class="kbyg-hero__event">Executive Leadership Institute</p>');
  element.setAttribute("data-kbyg-event-year", "2027");
  const title = get(element, ".kbyg-hero__event");

  const instance = initialize(element);

  expect(title.textContent).toBe("2027 Executive Leadership Institute");
  instance.destroy();
  initialize(element);
  expect(title.textContent).toBe("2027 Executive Leadership Institute");
});

test.each([
  ["delegate", "sponsor"],
  ["sponsor", "delegate"],
])("CMS audience %s takes precedence over a stale %s URL suffix", (audience, suffix) => {
  history.replaceState(null, "", `/know-before-you-go/example-${suffix}/`);
  const element = page(
    '<section data-kbyg-audience-branch="delegate">Delegate resources</section><section data-kbyg-audience-branch="sponsor">Sponsor resources</section>',
    audience,
  );

  expect(initialize(element).audience).toBe(audience);
  expect(element.getAttribute("data-audience")).toBe(audience);
  expect(element.querySelectorAll("[data-kbyg-audience-branch]")).toHaveLength(1);
  expect(get(element, "section").getAttribute("data-kbyg-audience-branch")).toBe(audience);
});

const meetingMethodTitles = [
  "Shared interests",
  "Your top choices",
  "Partner invitations",
] as const;
const experienceTitles = [
  "Personal schedule",
  "Evening reception",
  "Conversation breaks",
  "Venue activities",
  "Departure details",
];

function experiencePage(titles: string[], audience = "sponsor"): HTMLElement {
  return page(
    `<section id="experience">
      <div class="kbyg-meeting-method__list">
        <h4 class="kbyg-meeting-method__item-title">1. Shared   interests</h4>
        <h4 class="kbyg-meeting-method__item-title">Your\n top choices</h4>
        <h4 class="kbyg-meeting-method__item-title">3. Partner invitations</h4>
      </div>
      <div class="kbyg-experience-grid w-dyn-items">
        ${titles.map((title) => `<div class="w-dyn-item"><article class="kbyg-icon-card"><h3 class="kbyg-icon-card__title">${title}</h3><p class="kbyg-icon-card__body">Details for ${title}</p></article></div>`).join("")}
      </div>
    </section>`,
    audience,
  );
}

function renderedExperienceTitles(element: HTMLElement): string[] {
  return [...element.querySelectorAll(".kbyg-experience-grid .kbyg-icon-card__title")].map(
    (title) => title.textContent ?? "",
  );
}

test("Sponsor Experience removes the three duplicated meeting methods from a full eight-item CMS list", () => {
  const element = experiencePage([
    "Shared interests",
    "2. Your top choices",
    "Partner\n invitations",
    ...experienceTitles,
  ]);

  initialize(element);

  expect(renderedExperienceTitles(element)).toEqual(experienceTitles);
  expect(element.querySelectorAll(".kbyg-experience-grid .w-dyn-item")).toHaveLength(5);
  expect(element.querySelectorAll(".kbyg-meeting-method__item-title")).toHaveLength(3);
});

test("an already sliced Sponsor Experience list keeps all five selected items", () => {
  const element = experiencePage(experienceTitles);

  initialize(element);

  expect(renderedExperienceTitles(element)).toEqual(experienceTitles);
});

test("Sponsor Experience leaves the entire list unchanged when any leading title does not match", () => {
  const titles = [
    meetingMethodTitles[0],
    meetingMethodTitles[1],
    "A different method",
    ...experienceTitles,
  ];
  const element = experiencePage(titles);

  initialize(element);

  expect(renderedExperienceTitles(element)).toEqual(titles);
  expect(element.querySelectorAll(".kbyg-experience-grid .w-dyn-item")).toHaveLength(8);
});

test("Sponsor Experience duplicate removal remains idempotent after method headings are numbered", () => {
  const element = experiencePage([...meetingMethodTitles, ...experienceTitles]);
  const first = initialize(element);
  expect(renderedExperienceTitles(element)).toEqual(experienceTitles);

  first.destroy();
  initialize(element);

  expect(renderedExperienceTitles(element)).toEqual(experienceTitles);
  expect(element.querySelectorAll(".kbyg-experience-grid .w-dyn-item")).toHaveLength(5);
});

test("Delegate Experience retains matching meeting-method titles", () => {
  const titles = [...meetingMethodTitles, ...experienceTitles];
  const element = experiencePage(titles, "delegate");

  initialize(element);

  expect(renderedExperienceTitles(element)).toEqual(titles);
});

test.each([
  ["delegate", '<div class="kbyg-dates-grid"></div>'],
  ["sponsor", ""],
])(
  "%s Key Dates hides the disclosure for an empty native list without changing empty-state copy",
  (audience, grid) => {
    const emptyText = "Check back soon for Key Dates & Deliverables!";
    const element = page(
      `<section id="key-dates">
        <div data-kbyg-audience-branch="${audience}">
          <div class="w-dyn-list">${grid}<div class="w-dyn-empty">${emptyText}</div></div>
          <a class="kbyg-button kbyg-button--calendar-link" data-kbyg-dates-toggle href="#key-dates">VIEW ALL KEY DATES</a>
        </div>
      </section>`,
      audience,
    );
    const toggle = get(element, "[data-kbyg-dates-toggle]");

    initialize(element);

    expect(toggle.hidden).toBe(true);
    expect(get(element, ".w-dyn-empty").textContent).toBe(emptyText);
  },
);

test("Sponsor Hub and Support retain separate CMS destinations despite a legacy shared URL", () => {
  history.replaceState(null, "", "/know-before-you-go/example-sponsor");
  const element = page(
    '<section id="hub"><a class="kbyg-button--external" href="https://hub.example.test/retreat?audience=sponsor">Open your resources</a></section><section id="sponsor-support"><a class="kbyg-button--external" href="mailto:tori@example.test?subject=Event%20support">Email Tori</a></section>',
    "sponsor",
  );
  element.setAttribute("data-kbyg-hub-url", "https://legacy.example.test/shared-hub");

  initialize(element);

  expect(get(element, "#hub a").getAttribute("href")).toBe(
    "https://hub.example.test/retreat?audience=sponsor",
  );
  expect(get(element, "#sponsor-support a").getAttribute("href")).toBe(
    "mailto:tori@example.test?subject=Event%20support",
  );
});

test("the Institute map query replaces a stale iframe location and accessible title", () => {
  const query = "Lake & Conference Resort, Montréal, QC";
  const element = page(
    '<iframe class="kbyg-travel-gallery__map" src="https://www.google.com/maps?q=Stale%20Hotel&amp;output=embed" title="Map showing Stale Hotel"></iframe>',
  );
  element.setAttribute("data-kbyg-map-query", query);

  initialize(element);

  const map = get<HTMLIFrameElement>(element, "iframe");
  const url = new URL(map.src);
  expect(url.origin).toBe("https://www.google.com");
  expect(url.searchParams.get("q")).toBe(query);
  expect(url.searchParams.get("output")).toBe("embed");
  expect(map.title).toContain(query);
  expect(map.title).not.toContain("Stale Hotel");
});

test.each([
  ["address", "85 Lakeshore Drive, Montréal, QC"],
  ["venue title", "Lake & Conference Resort"],
])("a blank map query falls back to the bound %s", (source, expected) => {
  const element = page(
    `<h3 class="kbyg-travel-card__title">Lake &amp; Conference Resort</h3>
    <h3 class="kbyg-travel-card__title">Reservation details</h3>
    ${source === "address" ? "<span data-kbyg-address>85 Lakeshore Drive, Montréal, QC</span>" : ""}
    <iframe class="kbyg-travel-gallery__map" src="https://www.google.com/maps?q=Stale%20Hotel&amp;output=embed" title="Map showing Stale Hotel"></iframe>`,
  );
  element.setAttribute("data-kbyg-map-query", "  ");

  initialize(element);

  const map = get<HTMLIFrameElement>(element, "iframe");
  expect(new URL(map.src).searchParams.get("q")).toBe(expected);
  expect(map.title).toContain(expected);
  expect(map.title).not.toContain("Stale Hotel");
});

test.each(["thumbnail", "image override", "link override"])(
  "venue lightboxes use the CMS %s instead of stale saved JSON",
  (source) => {
    const thumbnail = "https://cdn.example.test/current-venue.webp";
    const fullImage = "https://cdn.example.test/current-venue-original.webp";
    const element = page(
      `<a class="w-lightbox" href="https://cdn.example.test/stale-venue.webp">
        <img class="kbyg-travel-gallery__image" src="${thumbnail}" alt="Current venue lakeside terrace">
        <script class="w-json" type="application/json">{"items":[{"url":"https://cdn.example.test/stale-venue.webp","type":"image","caption":"Previous venue"}],"group":"Venue"}</script>
      </a>`,
    );
    const link = get(element, "a");
    if (source === "image override") {
      get(element, "img").setAttribute("data-kbyg-full-image-src", fullImage);
    } else if (source === "link override") {
      link.setAttribute("data-kbyg-full-image-src", fullImage);
    }

    initialize(element);

    const expected = source === "thumbnail" ? thumbnail : fullImage;
    expect(lightboxItems(link)).toEqual([
      { url: expected, type: "image", caption: "Current venue lakeside terrace" },
    ]);
    expect(link.getAttribute("href")).toBe(expected);
    expect(get(element, "img").getAttribute("src")).toBe(thumbnail);
  },
);

test.each(["native lightbox", "unwrapped image"])(
  "an empty bound gallery image cannot expose its stale %s",
  (structure) => {
    const image =
      '<img class="kbyg-travel-gallery__image w-dyn-bind-empty" src="https://cdn.example.test/stale-venue.webp" alt="Previous venue">';
    const element = page(
      structure === "native lightbox"
        ? `<a class="w-lightbox" href="https://cdn.example.test/stale-venue.webp">${image}<script class="w-json" type="application/json">{"items":[{"url":"https://cdn.example.test/stale-venue.webp","type":"image"}],"group":"Venue"}</script></a>`
        : image,
    );
    const staleContent = get(element, structure === "native lightbox" ? "a" : "img");

    const instance = initialize(element);

    expect(instance.venueLightboxes.links).toHaveLength(0);
    expect(staleContent.isConnected).toBe(false);
    expect(element.querySelector(".w-lightbox .w-json")).toBeNull();
  },
);

test.each(["no thumbnail", "a stale thumbnail"])(
  "an authoritative native CMS gallery with %s expands its ordered items without rewriting source JSON",
  (thumbnail) => {
    const ready = vi.fn();
    (window as KbygWindow).Webflow = { push: (callback) => callback(), require: () => ({ ready }) };
    const items = [
      {
        _id: "lake-photo",
        type: "image",
        url: "https://cdn.example.test/lake-full.webp",
        thumbnailUrl: "https://cdn.example.test/lake-thumb.webp",
        caption: "Our lakeside setting",
        alt: "Lake viewed from the venue terrace",
        width: 1800,
        height: 1200,
        fileName: "lake-full.webp",
      },
      {
        _id: "lobby-photo",
        type: "image",
        url: "https://cdn.example.test/lobby.webp",
        caption: "The main lobby",
        alt: "Bright lobby with a central staircase",
        width: 1600,
        height: 1000,
        fileName: "lobby.webp",
      },
    ];
    const sourceJson = JSON.stringify({ items, group: "Venue" }, null, 2);
    const element = page(
      `<div class="kbyg-travel-gallery">
        <a class="w-lightbox" data-kbyg-cms-gallery="true">
          ${thumbnail === "a stale thumbnail" ? '<img class="kbyg-travel-gallery__image" src="https://cdn.example.test/stale-venue.webp" alt="Previous venue">' : ""}
          <script class="w-json" type="application/json">${sourceJson}</script>
        </a>
      </div>`,
    );
    const source = get(element, "[data-kbyg-cms-gallery]");
    const data = get(source, ".w-json");

    function expectGallery(instance: KbygInstance) {
      expect(instance.venueLightboxes.links).toHaveLength(items.length);
      expect(element.querySelectorAll(".w-lightbox")).toHaveLength(items.length);
      expect(data.textContent).toBe(sourceJson);
      expect(!source.isConnected || !source.matches(".w-lightbox")).toBe(true);
      expect(
        !source.isConnected ||
          source.closest("[hidden]") !== null ||
          getComputedStyle(source).display === "none",
      ).toBe(true);
      instance.venueLightboxes.links.forEach((link, index) => {
        const item = items[index];
        assert.ok(item);
        const image = get<HTMLImageElement>(link, "img");
        expect(image.src).toBe(item.thumbnailUrl || item.url);
        expect(image.alt).toBe(item.alt);
        expect(link.getAttribute("href")).toBe(item.url);
        expect(lightboxItems(link)).toEqual([item]);
        const configuration: unknown = JSON.parse(get(link, ".w-json").textContent ?? "{}");
        expect(configuration).toMatchObject({ group: "Venue" });
      });
    }

    const first = initialize(element);
    expectGallery(first);
    expect(ready).toHaveBeenCalledTimes(1);
    expect(kbyg.initPage(element)).toBe(first);
    expect(ready).toHaveBeenCalledTimes(1);

    first.destroy();
    const second = initialize(element);
    expectGallery(second);
    expect(ready).toHaveBeenCalledTimes(2);
  },
);

test.each(["matching", "blank", "unmatched", "multiple institutes", "ambiguous descriptions"])(
  "native venue metadata uses exact media identity and fails closed for %s sources",
  (scenario) => {
    const urls = [
      "https://cdn.prod.website-files.com/6312ee46f4c52faf21ee8ab5/6ab525d2ac5a08c76d1eeed8_Four%20Seasons%20Hotel%20Austin%20TX%20-%20Front%20of%20Hotel.webp",
      "https://cdn.prod.website-files.com/6312ee46f4c52faf21ee8ab5/6ab525d204624f9027bea52a_Four%20Seasons%20Hotel%20Austin%20TX%20-%20Hotel%20Garden.webp",
    ];
    const alts = [
      "Hotel entrance framed by trees and landscaping",
      "Hotel garden with lawn, trees and outdoor seating",
    ];
    const items = urls.map((url) => ({ url, type: "image" }));
    const sourceJson = JSON.stringify({ items, group: "Venue" });
    const element = page(
      `<div class="kbyg-travel-gallery"><a class="w-lightbox" data-kbyg-cms-gallery="true"><script class="w-json" type="application/json">${sourceJson}</script></a></div>`,
    );
    const images = urls
      .map(
        (url, index) =>
          `<img src="${scenario === "unmatched" ? url + "?different" : url.replace("cdn.prod.website-files.com", "uploads-ssl.webflow.com")}" alt="${scenario === "blank" ? "" : alts[index]}">`,
      )
      .join("");
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div id="kbyg-venue-metadata" hidden><div class="w-dyn-items"><div class="w-dyn-item">${images}${scenario === "ambiguous descriptions" ? `<img src="${urls[0]}" alt="Conflicting description">` : ""}</div>${scenario === "multiple institutes" ? `<div class="w-dyn-item">${images}</div>` : ""}</div></div>`,
    );
    const instance = initialize(element);
    expect(instance.venueLightboxes.links).toHaveLength(2);
    instance.venueLightboxes.links.forEach((link, index) => {
      const expected =
        scenario === "matching" || (scenario === "ambiguous descriptions" && index === 1)
          ? alts[index]
          : "Event venue";
      expect(get<HTMLImageElement>(link, "img").alt).toBe(expected);
      expect(link.getAttribute("aria-label")).toBe(`Open photo: ${expected}`);
      expect(lightboxItems(link)).toEqual([items[index]]);
      expect(link.getAttribute("href")).toBe(urls[index]);
    });
    expect(get(element, "[data-kbyg-cms-gallery] .w-json").textContent).toBe(sourceJson);
  },
);

test("an empty authoritative CMS gallery hides its source and creates no lightboxes", () => {
  const ready = vi.fn();
  (window as KbygWindow).Webflow = { push: (callback) => callback(), require: () => ({ ready }) };
  const sourceJson = '{"items":[],"group":"Venue"}';
  const element = page(
    `<div class="kbyg-travel-gallery"><a class="w-lightbox" data-kbyg-cms-gallery="true"><script class="w-json" type="application/json">${sourceJson}</script></a></div>`,
  );
  const source = get(element, "[data-kbyg-cms-gallery]");
  const data = get(source, ".w-json");

  const instance = initialize(element);

  expect(instance.venueLightboxes.links).toHaveLength(0);
  expect(element.querySelectorAll(".w-lightbox")).toHaveLength(0);
  expect(data.textContent).toBe(sourceJson);
  expect(
    !source.isConnected ||
      source.closest("[hidden]") !== null ||
      getComputedStyle(source).display === "none",
  ).toBe(true);
  expect(ready).not.toHaveBeenCalled();
});

test.each(["source", "ancestor"])(
  "a CMS gallery with a conditionally invisible %s retains JSON without generating links",
  (hiddenElement) => {
    const sourceJson = JSON.stringify({
      items: [{ url: "https://cdn.example.test/conditional-venue.webp", type: "image" }],
      group: "Venue",
    });
    const element = page(
      `<div class="kbyg-travel-gallery ${hiddenElement === "ancestor" ? "w-condition-invisible" : ""}">
        <a class="w-lightbox ${hiddenElement === "source" ? "w-condition-invisible" : ""}" data-kbyg-cms-gallery="true">
          <script class="w-json" type="application/json">${sourceJson}</script>
        </a>
      </div>`,
    );
    const data = get(element, "[data-kbyg-cms-gallery] .w-json");

    const instance = initialize(element);

    expect(data.textContent).toBe(sourceJson);
    expect(instance.venueLightboxes.links).toHaveLength(0);
    expect(element.querySelectorAll("[data-kbyg-cms-gallery-item]")).toHaveLength(0);
  },
);

test.each([
  ["w-condition-invisible", true],
  ["w-dyn-bind-empty", true],
  ["", false],
] as const)(
  "optional hotel details with CMS state '%s' set card visibility despite retained text",
  (state, hidden) => {
    const element = page(
      `<article class="kbyg-travel-card">
        <h3 class="kbyg-travel-card__title">Transportation</h3>
        <div class="kbyg-rich-text ${state}"><p>Transportation details from the template.</p></div>
      </article>`,
    );

    initialize(element);

    const card = get(element, ".kbyg-travel-card");
    expect(card.hidden || getComputedStyle(card).display === "none").toBe(hidden);
  },
);

test("marked Hub groups with only invalid CTA destinations show one Coming Soon notice", () => {
  const hrefs = ["", "#", "mailto:", "tel:"];
  const element = page(
    hrefs
      .map(
        (href, index) =>
          `<section id="empty-hub-${index}" data-kbyg-empty-message="Check back soon for Hub resources!"><a data-kbyg-content href="${href}">Open your resources</a></section>`,
      )
      .join(""),
  );

  initialize(element);

  hrefs.forEach((_href, index) => {
    const group = get(element, `#empty-hub-${index}`);
    expect(group.querySelectorAll("[data-kbyg-generated-empty-notice]")).toHaveLength(1);
    expect(get(group, ".kbyg-empty-notice").textContent).toBe("Check back soon for Hub resources!");
  });
});

test("valid marked Hub CTA destinations suppress fallback even without body copy", () => {
  const element = page(
    `<section data-kbyg-empty-message="Check back soon for Hub resources!"><a data-kbyg-content href="https://resources.example.test/event">Open resources</a></section>
    <section data-kbyg-empty-message="Check back soon for Support!"><a data-kbyg-content href="mailto:lead@example.test">Contact your lead</a></section>`,
  );
  const links = [...element.querySelectorAll("a")];
  const destinations = links.map((link) => link.getAttribute("href"));

  initialize(element);

  expect(element.querySelectorAll("[data-kbyg-generated-empty-notice]")).toHaveLength(0);
  expect(links.map((link) => link.getAttribute("href"))).toEqual(destinations);
});

test("blank and native-hidden marked rich text produces fallback despite retained template copy", () => {
  const element = page(
    `<section id="blank-copy" data-kbyg-empty-message="Check back soon for Welcome!"><div class="kbyg-rich-text" data-kbyg-content> \n<br><p> &nbsp; </p></div></section>
    <section id="conditional-copy" data-kbyg-empty-message="Check back soon for Agenda!"><div class="kbyg-rich-text w-condition-invisible" data-kbyg-content>Previous event agenda</div></section>
    <section id="empty-binding" data-kbyg-empty-message="Check back soon for Experience!"><div class="kbyg-rich-text w-dyn-bind-empty" data-kbyg-content>Previous event experience</div></section>`,
  );

  initialize(element);

  ["blank-copy", "conditional-copy", "empty-binding"].forEach((id) => {
    const group = get(element, `#${id}`);
    expect(group.querySelectorAll("[data-kbyg-generated-empty-notice]")).toHaveLength(1);
    expect(get(group, ".kbyg-empty-notice").textContent).toBe(
      group.getAttribute("data-kbyg-empty-message"),
    );
  });
});

test("marked optional hotel cards remain visible for fallback while unmarked empty cards stay hidden", () => {
  const element = page(
    `<article id="marked-hotel" class="kbyg-travel-card" data-kbyg-empty-message="Check back soon for Transportation!"><h3>Transportation</h3><div class="kbyg-rich-text w-dyn-bind-empty" data-kbyg-content>Template directions</div></article>
    <article id="unmarked-hotel" class="kbyg-travel-card"><h3>Reservation details</h3><div class="kbyg-rich-text w-dyn-bind-empty"></div></article>`,
  );

  initialize(element);

  const marked = get(element, "#marked-hotel");
  expect(marked.hidden).toBe(false);
  expect(getComputedStyle(marked).display).not.toBe("none");
  expect(get(marked, ".kbyg-empty-notice").textContent).toBe("Check back soon for Transportation!");
  const unmarked = get(element, "#unmarked-hotel");
  expect(unmarked.hidden).toBe(true);
  expect(unmarked.querySelector(".kbyg-empty-notice")).toBeNull();
});

test("native Sponsor Experience notices deduplicate only visible notices, ignoring a hidden first notice", () => {
  const element = page(
    `<div id="hidden-experience-notice" class="w-dyn-empty w-condition-invisible" data-kbyg-empty-notice data-kbyg-empty-group="sponsor-experience">Hidden native notice</div>
    <div id="first-experience-notice" class="w-dyn-empty" data-kbyg-empty-notice data-kbyg-empty-group="sponsor-experience">Check back soon for Experience!</div>
    <div id="second-experience-notice" class="w-dyn-empty" data-kbyg-empty-notice data-kbyg-empty-group="sponsor-experience">Check back soon for Experience!</div>`,
    "sponsor",
  );
  const hidden = get(element, "#hidden-experience-notice");
  const first = get(element, "#first-experience-notice");
  const second = get(element, "#second-experience-notice");

  initialize(element);

  expect(hidden.textContent).toBe("Hidden native notice");
  expect(first.isConnected).toBe(true);
  expect(first.hidden).toBe(false);
  expect(getComputedStyle(first).display).not.toBe("none");
  expect(
    !second.isConnected ||
      second.hidden ||
      second.classList.contains("w-condition-invisible") ||
      getComputedStyle(second).display === "none",
  ).toBe(true);
});

test("Coming Soon fallback preserves populated CMS markup and media across reinitialization", () => {
  const element = page(
    `<section id="populated-copy" data-kbyg-empty-message="Check back soon for Welcome!"><div data-kbyg-content class="kbyg-rich-text"><p>Welcome to <strong>our next Institute</strong>.</p></div></section>
    <section id="populated-media" data-kbyg-empty-message="Check back soon for Agenda!"><div data-kbyg-content class="kbyg-rich-text"><img src="https://cdn.example.test/program.webp" alt="Institute program"></div></section>
    <section id="empty-content" data-kbyg-empty-message="Check back soon for Resources!"></section>
    <div id="unmarked-content"><span class="w-dyn-bind-empty"></span></div>`,
  );
  const copy = get(element, "#populated-copy [data-kbyg-content]");
  const markup = copy.innerHTML;
  const image = get(element, "#populated-media img");

  const first = initialize(element);
  first.destroy();
  initialize(element);

  expect(get(element, "#populated-copy [data-kbyg-content]")).toBe(copy);
  expect(copy.innerHTML).toBe(markup);
  expect(get(element, "#populated-media img")).toBe(image);
  expect(element.querySelectorAll("[data-kbyg-generated-empty-notice]")).toHaveLength(1);
  expect(get(element, "#empty-content .kbyg-empty-notice").textContent).toBe(
    "Check back soon for Resources!",
  );
  expect(get(element, "#unmarked-content").querySelector(".kbyg-empty-notice")).toBeNull();
});

test("a missing marked contact name produces one group notice without photo or phone placeholders", () => {
  const element = page(
    `<article class="kbyg-contact-card" data-kbyg-empty-message="Check back soon for your Operations Lead!">
      <h3 data-kbyg-content class="w-dyn-bind-empty"></h3>
      <img class="kbyg-contact-card__image" src="https://cdn.example.test/old-lead.webp" alt="">
      <ul><li class="kbyg-contact-card__meta-item"><a class="kbyg-contact-card__meta-link" href="tel:"><span class="kbyg-contact-card__meta-value w-dyn-bind-empty"></span></a></li></ul>
    </article>`,
  );

  initialize(element);

  expect(element.querySelectorAll("[data-kbyg-generated-empty-notice]")).toHaveLength(1);
  expect(get(element, ".kbyg-empty-notice").textContent).toBe(
    "Check back soon for your Operations Lead!",
  );
  expect(
    get(element, ".kbyg-contact-card__meta-item").querySelector(".kbyg-empty-notice"),
  ).toBeNull();
});

test("compiled contact styles hide empty identity and metadata only while a generated notice is present", () => {
  const stylesheet = document.createElement("style");
  stylesheet.textContent = readFileSync("ipmi-kbyg-styles.css", "utf8");
  document.head.append(stylesheet);
  const element = page(
    `<article id="missing-contact" class="kbyg-contact-card" data-kbyg-empty-message="Check back soon for your Operations Lead!">
      <div class="kbyg-contact-card__identity"><h3 data-kbyg-content class="w-dyn-bind-empty"></h3></div>
      <ul class="kbyg-contact-card__meta"><li>Template contact details</li></ul>
    </article>
    <article id="populated-contact" class="kbyg-contact-card" data-kbyg-empty-message="Check back soon for your Operations Lead!">
      <div class="kbyg-contact-card__identity"><h3 data-kbyg-content>Tori Di Clemente</h3></div>
      <ul class="kbyg-contact-card__meta"><li>Selected lead contact details</li></ul>
    </article>`,
  );

  const first = initialize(element);

  const missing = get(element, "#missing-contact");
  const populated = get(element, "#populated-contact");
  [".kbyg-contact-card__identity", ".kbyg-contact-card__meta"].forEach((selector) => {
    expect(getComputedStyle(get(missing, selector)).display).toBe("none");
    expect(getComputedStyle(get(populated, selector)).display).not.toBe("none");
  });
  expect(getComputedStyle(get(missing, "[data-kbyg-generated-empty-notice]")).display).not.toBe(
    "none",
  );
  expect(populated.querySelector("[data-kbyg-generated-empty-notice]")).toBeNull();

  first.destroy();
  const name = get(missing, "[data-kbyg-content]");
  name.classList.remove("w-dyn-bind-empty");
  name.textContent = "Tori Di Clemente";
  initialize(element);

  expect(missing.querySelector("[data-kbyg-generated-empty-notice]")).toBeNull();
  expect(getComputedStyle(get(missing, ".kbyg-contact-card__identity")).display).not.toBe("none");
  expect(getComputedStyle(get(missing, ".kbyg-contact-card__meta")).display).not.toBe("none");
  stylesheet.remove();
});

test.each(["native rich text", "explicit description"])(
  "calendar downloads use %s without a calendar-item wrapper",
  async (source) => {
    const element = page(
      `<article class="kbyg-date-card">
        <h3 data-kbyg-calendar-title>Registration deadline</h3>
        <div class="kbyg-rich-text" data-kbyg-calendar-description><p>Bring <strong>your confirmation</strong> and photo ID.</p></div>
        <a href="#" data-kbyg-calendar data-kbyg-start="2027-04-16" data-kbyg-all-day="true" ${source === "explicit description" ? 'data-kbyg-description="Use the confirmed CMS instructions."' : ""}>Add to calendar</a>
      </article>`,
    );
    let downloaded: Blob | undefined;
    vi.spyOn(URL, "createObjectURL").mockImplementation((value) => {
      assert.ok(value instanceof Blob);
      downloaded = value;
      return "blob:kbyg-native-description";
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    initialize(element);
    get(element, "[data-kbyg-calendar]").dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    );

    assert.ok(downloaded);
    const calendar = await downloaded.text();
    const expected =
      source === "explicit description"
        ? "Use the confirmed CMS instructions."
        : "Bring your confirmation and photo ID.";
    expect(calendar).toContain(`DESCRIPTION:${expected}\r\n`);
  },
);

test("explicit CMS calendar dates win over an outdated display date in downloads", async () => {
  const element = page(
    `<article data-kbyg-calendar-item>
      <h3 data-kbyg-calendar-title>Event sessions</h3>
      <article class="kbyg-date-card">
        <span class="kbyg-date-card__month"></span><span class="kbyg-date-card__day"></span>
        <p class="kbyg-date-card__display-date">Friday, September 4, 2026</p>
        <a href="#" data-kbyg-calendar data-kbyg-start="2026-10-12" data-kbyg-end="2026-10-14" data-kbyg-all-day="true">Add to calendar</a>
      </article>
    </article>`,
  );
  let downloaded: Blob | undefined;
  vi.spyOn(URL, "createObjectURL").mockImplementation((value) => {
    assert.ok(value instanceof Blob);
    downloaded = value;
    return "blob:kbyg-cms-calendar";
  });
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

  initialize(element);
  get(element, "[data-kbyg-calendar]").dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );

  assert.ok(downloaded);
  const calendar = await downloaded.text();
  expect(calendar).toContain("DTSTART;VALUE=DATE:20261012\r\n");
  expect(calendar).toContain("DTEND;VALUE=DATE:20261015\r\n");
  expect(calendar).not.toContain("20260904");
  expect(get(element, ".kbyg-date-card__month").textContent).toBe("OCT");
  expect(get(element, ".kbyg-date-card__day").textContent).toBe("12");
});

function calendarSourcePage(options: {
  sourceStart?: string;
  sourceEnd?: string;
  timezone?: string | null;
  allDay?: boolean;
  localDate?: string;
  controlStart?: string;
  controlEnd?: string;
}): HTMLElement {
  const element = page(
    `<article class="kbyg-date-card">
      <h3 data-kbyg-calendar-title>CMS deadline</h3>
      <span class="kbyg-date-card__month"></span><span class="kbyg-date-card__day"></span>
      <p class="kbyg-date-card__display-date">Friday, September 4, 2026</p>
      <a href="#" data-kbyg-calendar>Add to calendar</a>
    </article>`,
  );
  const control = get(element, "[data-kbyg-calendar]");
  control.setAttribute("data-kbyg-start", options.controlStart ?? "2026-09-04");
  control.setAttribute("data-kbyg-end", options.controlEnd ?? "2026-09-04");
  control.setAttribute("data-kbyg-all-day", String(options.allDay ?? true));
  if (options.sourceStart !== undefined) {
    const source = document.createElement("span");
    source.hidden = true;
    source.setAttribute("data-kbyg-calendar-source", "");
    if (options.localDate !== undefined)
      source.setAttribute("data-kbyg-all-day-local-date", options.localDate);
    source.setAttribute("data-kbyg-start", options.sourceStart);
    source.setAttribute("data-kbyg-end", options.sourceEnd ?? options.sourceStart);
    if (options.timezone !== null) {
      source.setAttribute("data-kbyg-calendar-timezone", options.timezone ?? "America/Toronto");
    }
    control.before(source);
  }
  return element;
}

async function downloadCalendar(element: HTMLElement): Promise<string | null> {
  let downloaded: Blob | undefined;
  vi.spyOn(URL, "createObjectURL").mockImplementation((value) => {
    assert.ok(value instanceof Blob);
    downloaded = value;
    return "blob:kbyg-source-calendar";
  });
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  initialize(element);
  get(element, "[data-kbyg-calendar]").dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );
  return downloaded ? downloaded.text() : null;
}

test.each([
  ["summer", "2026-07-28 20:00", "20260728", "20260729"],
  ["winter", "2026-01-28 19:00", "20260128", "20260129"],
  ["EHS December deadline", "2026-12-18 20:00", "20261218", "20261219"],
  ["EHS January deadline", "2027-01-13 20:00", "20270113", "20270114"],
  ["EHS January arrival", "2027-01-14 20:00", "20270114", "20270115"],
])(
  "the native Toronto all-day source preserves its authored date for %s",
  async (_season, sourceStart, expectedStart, expectedEnd) => {
    const element = calendarSourcePage({ sourceStart, localDate: "true" });

    const calendar = await downloadCalendar(element);

    expect(calendar).toContain(`DTSTART;VALUE=DATE:${expectedStart}\r\n`);
    expect(calendar).toContain(`DTEND;VALUE=DATE:${expectedEnd}\r\n`);
    expect(calendar).not.toContain("20260904");
    expect(get(element, ".kbyg-date-card__day").textContent).toBe(
      String(Number(expectedStart.slice(-2))),
    );
  },
);

test("timed native calendar sources retain the Toronto instant across the UTC date boundary", async () => {
  const element = calendarSourcePage({
    sourceStart: "2026-07-28 20:00",
    sourceEnd: "2026-07-28 21:30",
    allDay: false,
    localDate: "true",
  });

  const calendar = await downloadCalendar(element);

  expect(calendar).toContain("DTSTART:20260729T000000Z\r\n");
  expect(calendar).toContain("DTEND:20260729T013000Z\r\n");
});

test.each([
  ["Delegate 1", "2026-07-28 20:00", "20260729"],
  ["Delegate 2", "2026-08-18 20:00", "20260819"],
  ["Delegate 3", "2026-08-18 20:00", "20260819"],
  ["Delegate 4", "2026-08-23 20:00", "20260824"],
  ["Sponsor 1", "2026-07-21 20:00", "20260722"],
  ["Sponsor 2", "2026-08-13 20:00", "20260814"],
  ["Sponsor 3", "2026-08-13 20:00", "20260814"],
  ["Sponsor 4", "2026-08-25 20:00", "20260826"],
])(
  "legacy HCHR %s retains its authored UTC-encoded date",
  async (_label, sourceStart, expected) => {
    const element = calendarSourcePage({ sourceStart });
    expect(await downloadCalendar(element)).toContain(`DTSTART;VALUE=DATE:${expected}\r\n`);
    expect(get(element, ".kbyg-date-card__day").textContent).toBe(
      String(Number(expected.slice(-2))),
    );
  },
);

test("unknown native date-basis markers fail closed", async () => {
  const element = calendarSourcePage({ sourceStart: "2026-12-18 20:00", localDate: "local-ish" });
  expect(await downloadCalendar(element)).toBeNull();
  expect(get(element, "[data-kbyg-calendar]").getAttribute("aria-disabled")).toBe("true");
});

test("blank native source dates fall back to valid control dates without timezone conversion", async () => {
  const element = calendarSourcePage({ sourceStart: "  ", sourceEnd: "" });

  const calendar = await downloadCalendar(element);

  expect(calendar).toContain("DTSTART;VALUE=DATE:20260904\r\n");
  expect(calendar).toContain("DTEND;VALUE=DATE:20260905\r\n");
  expect(get(element, "[data-kbyg-calendar]").getAttribute("aria-disabled")).toBeNull();
});

test.each([
  ["invalid start", "not-a-date", "2026-07-28 20:00"],
  ["invalid end", "2026-07-28 20:00", "not-a-date"],
  ["ambiguous wall time", "2026-11-01 01:30", "2026-11-01 01:30"],
  ["nonexistent wall time", "2026-03-08 02:30", "2026-03-08 02:30"],
])(
  "a native Toronto source with %s disables downloads instead of reusing stale control dates",
  async (_condition, sourceStart, sourceEnd) => {
    const element = calendarSourcePage({ sourceStart, sourceEnd });

    const calendar = await downloadCalendar(element);

    expect(calendar).toBeNull();
    const control = get(element, "[data-kbyg-calendar]");
    expect(control.getAttribute("aria-disabled")).toBe("true");
    expect(control.classList.contains("has-error")).toBe(true);
  },
);

test("native wall times without a source timezone marker cannot silently become floating events", async () => {
  const element = calendarSourcePage({
    sourceStart: "2026-07-28 20:00",
    sourceEnd: "2026-07-28 21:30",
    timezone: null,
    allDay: false,
  });

  const calendar = await downloadCalendar(element);

  expect(calendar).toBeNull();
  expect(get(element, "[data-kbyg-calendar]").getAttribute("aria-disabled")).toBe("true");
});

test.each([
  [true, "2026-07-29", "2026-07-30", "DTSTART;VALUE=DATE:20260729", "DTEND;VALUE=DATE:20260731"],
  [
    false,
    "2026-07-29T09:30:00-04:00",
    "2026-07-29T10:30:00-04:00",
    "DTSTART:20260729T133000Z",
    "DTEND:20260729T143000Z",
  ],
] as const)(
  "calendar controls without native sources preserve existing allDay=%s date semantics",
  async (allDay, controlStart, controlEnd, expectedStart, expectedEnd) => {
    const element = calendarSourcePage({ allDay, controlStart, controlEnd });

    const calendar = await downloadCalendar(element);

    expect(calendar).toContain(`${expectedStart}\r\n`);
    expect(calendar).toContain(`${expectedEnd}\r\n`);
  },
);
