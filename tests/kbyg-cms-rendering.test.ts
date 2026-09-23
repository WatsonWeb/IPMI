// @vitest-environment happy-dom
import assert from "node:assert/strict";
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
