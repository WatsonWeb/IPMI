import assert from "node:assert/strict";
import { createRequire } from "node:module";

import { test } from "vite-plus/test";

import kbyg from "../ipmi-kbyg.js";

const require = createRequire(import.meta.url);

class FakeClassList {
  constructor() {
    this.values = new Set();
  }

  add(value) {
    this.values.add(value);
  }

  remove(value) {
    this.values.delete(value);
  }

  toggle(value, enabled) {
    if (enabled) this.add(value);
    else this.remove(value);
  }

  contains(value) {
    return this.values.has(value);
  }
}

class FakeTarget {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    this.listeners.set(
      type,
      listeners.filter((candidate) => candidate !== listener),
    );
  }

  dispatch(type, properties = {}) {
    const event = {
      type,
      button: 0,
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      ...properties,
    };

    for (const listener of this.listeners.get(type) || []) listener(event);
    return event;
  }
}

class FakeElement extends FakeTarget {
  constructor(tagName = "div", attributes = {}) {
    super();
    this.tagName = tagName.toUpperCase();
    this.attributes = new Map();
    this.classList = new FakeClassList();
    this.children = [];
    this.hidden = false;
    this.id = "";
    this.innerText = "";
    this.textContent = "";
    this.parentNode = null;
    this.rect = { top: 0, bottom: 0, height: 0 };
    this.selectorMap = new Map();

    for (const [name, value] of Object.entries(attributes)) {
      this.setAttribute(name, value);
    }
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name === "id") this.id = String(value);
    if (name === "class") {
      this.classList = new FakeClassList();
      String(value)
        .split(/\s+/)
        .filter(Boolean)
        .forEach((className) => this.classList.add(className));
    }
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  hasAttribute(name) {
    return this.attributes.has(name);
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  querySelectorAll(selector) {
    return this.selectorMap.get(selector) || [];
  }

  querySelector(selector) {
    return (this.selectorMap.get(selector) || [])[0] || null;
  }

  getBoundingClientRect() {
    return this.rect;
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  get firstChild() {
    return this.children[0] || null;
  }

  prepend(child) {
    child.parentNode = this;
    this.children.unshift(child);
  }

  replaceChild(replacement, child) {
    const index = this.children.indexOf(child);
    if (index === -1) return null;
    child.parentNode = null;
    replacement.parentNode = this;
    this.children[index] = replacement;
    return child;
  }

  replaceChildren(...children) {
    for (const child of this.children) child.parentNode = null;
    this.children = [];
    for (const child of children) this.appendChild(child);
    this.textContent = "";
  }

  removeChild(child) {
    this.children = this.children.filter((candidate) => candidate !== child);
    child.parentNode = null;
  }

  remove() {
    if (this.parentNode) this.parentNode.removeChild(this);
  }

  click() {
    this.clicked = true;
  }

  focus() {
    this.focused = true;
  }

  closest(selector) {
    let candidate = this;
    while (candidate) {
      if (
        selector === "[data-kbyg-calendar-item]" &&
        candidate.hasAttribute("data-kbyg-calendar-item")
      ) {
        return candidate;
      }
      if (selector === ".kbyg-date-card" && candidate.classList.contains("kbyg-date-card")) {
        return candidate;
      }
      if (
        selector === "a.w-lightbox" &&
        candidate.tagName === "A" &&
        candidate.classList.contains("w-lightbox")
      ) {
        return candidate;
      }
      if (
        selector === "[data-kbyg-audience-branch]" &&
        candidate.hasAttribute("data-kbyg-audience-branch")
      ) {
        return candidate;
      }
      candidate = candidate.parentNode;
    }
    return null;
  }
}

class FakeDocument extends FakeTarget {
  constructor() {
    super();
    this.body = new FakeElement("body");
    this.documentElement = { scrollHeight: 3000 };
    this.readyState = "complete";
    this.pages = [];
    this.selectorMap = new Map();
  }

  querySelectorAll(selector) {
    return selector === ".kbyg-page" ? this.pages : this.selectorMap.get(selector) || [];
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  getElementById(id) {
    const elements = [];
    for (const page of this.pages) {
      elements.push(...(page.selectorMap.get("[data-kbyg-section]") || []));
      for (const item of page.selectorMap.get("[data-kbyg-accordion]") || []) {
        elements.push(...(item.selectorMap.get("[data-kbyg-accordion-trigger]") || []));
        elements.push(...(item.selectorMap.get("[data-kbyg-accordion-panel]") || []));
      }
    }
    return elements.find((element) => element.id === id) || null;
  }

  createElement(tagName) {
    const element = new FakeElement(tagName);
    this.lastCreatedElement = element;
    return element;
  }
}

class FakeWindow extends FakeTarget {
  constructor(documentRef) {
    super();
    this.document = documentRef;
    this.innerHeight = 800;
    this.pageYOffset = 0;
    this.scrollY = 0;
    this.location = { hash: "", pathname: "/know-before-you-go/example-delegate" };
    this.history = {
      pushState: (_state, _title, hash) => {
        this.location.hash = hash;
      },
    };
    this.reducedMotion = false;
    this.mobileLayout = false;
    this.URL = {
      createObjectURL: (blob) => {
        this.downloadedBlob = blob;
        return "blob:kbyg-test";
      },
      revokeObjectURL: (url) => {
        this.revokedUrl = url;
      },
    };
    this.Blob = Blob;
  }

  matchMedia(query) {
    const windowRef = this;
    return {
      get matches() {
        return String(query).includes("max-width")
          ? windowRef.mobileLayout
          : windowRef.reducedMotion;
      },
    };
  }

  requestAnimationFrame(callback) {
    callback();
    return 1;
  }

  cancelAnimationFrame() {}

  setTimeout(callback) {
    callback();
  }

  scrollTo(options, legacyTop) {
    this.lastScroll = typeof options === "object" ? options : { top: legacyTop, behavior: "auto" };
  }

  getComputedStyle(element) {
    return {
      position: element.computedPosition || "static",
      top: element.computedTop || "auto",
      getPropertyValue: () => "",
    };
  }
}

function accordionItem(expanded, triggerTag = "button") {
  const item = new FakeElement("article", {
    "data-kbyg-accordion": "",
    "data-initially-expanded": String(expanded),
  });
  const trigger = new FakeElement(triggerTag, { "data-kbyg-accordion-trigger": "" });
  const panel = new FakeElement("div", { "data-kbyg-accordion-panel": "" });
  item.selectorMap.set("[data-kbyg-accordion-trigger]", [trigger]);
  item.selectorMap.set("[data-kbyg-accordion-panel]", [panel]);
  return { item, trigger, panel };
}

function physicalLineByteLengths(calendar) {
  return calendar
    .split("\r\n")
    .slice(0, -1)
    .map((line) => kbyg.utf8ByteLength(line));
}

test("exports a CommonJS API that is also importable from ESM", () => {
  assert.equal(kbyg.version, "1.0.0");
  assert.equal(typeof kbyg.initPage, "function");

  const required = require("../ipmi-kbyg.js");
  assert.equal(required.version, kbyg.version);
  assert.equal(typeof required.createICalendar, "function");
});

test("infers the audience from the item URL and removes the opposite branch", () => {
  const documentRef = new FakeDocument();
  const windowRef = new FakeWindow(documentRef);
  windowRef.location.pathname = "/know-before-you-go/hchr-sept-2026-sponsor/";

  const page = new FakeElement("main", { "data-audience": "delegate" });
  const delegate = new FakeElement("section", { "data-kbyg-audience-branch": "delegate" });
  const sponsor = new FakeElement("section", { "data-kbyg-audience-branch": "sponsor" });
  page.appendChild(delegate);
  page.appendChild(sponsor);
  page.selectorMap.set("[data-kbyg-audience-branch]", [delegate, sponsor]);
  page.selectorMap.set("[data-kbyg-section]", []);
  page.selectorMap.set("[data-kbyg-jump]", []);
  page.selectorMap.set("[data-kbyg-accordion]", []);
  page.selectorMap.set("[data-kbyg-calendar]", []);
  documentRef.pages = [page];

  const instance = kbyg.initPage(page, { document: documentRef, window: windowRef });

  assert.equal(instance.audience, "sponsor");
  assert.equal(page.getAttribute("data-audience"), "sponsor");
  assert.deepEqual(page.children, [sponsor]);

  const delegatePage = new FakeElement("main");
  const agendaIntro = new FakeElement("p");
  agendaIntro.textContent =
    "Please refer to the Event Agenda in the Sponsor Hub for complete program details.";
  delegatePage.selectorMap.set("#agenda .kbyg-section__intro", [agendaIntro]);
  windowRef.location.pathname = "/know-before-you-go/example-delegate";
  const delegateInstance = kbyg.initPage(delegatePage, {
    document: documentRef,
    window: windowRef,
  });
  assert.equal(delegateInstance.audience, "delegate");
  assert.equal(
    agendaIntro.textContent,
    "Please refer to the Event Agenda in the Attendee Hub for complete program details.",
  );
});

test("creates all-day events with an RFC-exclusive DTEND and stable UID", () => {
  const event = {
    title: "Registration deadline",
    start: "2026-09-04",
    end: "2026-09-06",
    allDay: true,
  };
  const first = kbyg.createICalendar(event, { now: "2026-01-02T03:04:05Z" });
  const second = kbyg.createICalendar(event, { now: "2026-02-03T04:05:06Z" });

  assert.match(first, /DTSTART;VALUE=DATE:20260904\r\n/);
  assert.match(first, /DTEND;VALUE=DATE:20260907\r\n/);
  assert.match(first, /DTSTAMP:20260102T030405Z\r\n/);
  assert.equal(first.match(/^UID:(.+)$/m)[1], second.match(/^UID:(.+)$/m)[1]);
  assert.ok(first.endsWith("END:VCALENDAR\r\n"));
  assert.doesNotMatch(first, /(^|[^\r])\n/);

  const oneDay = kbyg.createICalendar(
    { title: "Deadline", start: "2026-09-04", end: "2026-09-04", allDay: true },
    { now: "2026-01-02T03:04:05Z" },
  );
  assert.match(oneDay, /DTEND;VALUE=DATE:20260905\r\n/);

  const delegateUid = kbyg
    .createICalendar({ ...event, context: "/know-before-you-go/example-delegate" })
    .match(/^UID:(.+)$/m)[1];
  const sponsorUid = kbyg
    .createICalendar({ ...event, context: "/know-before-you-go/example-sponsor" })
    .match(/^UID:(.+)$/m)[1];
  assert.notEqual(delegateUid, sponsorUid);
});

test("removes every line-break form from calendar URL values", () => {
  const calendar = kbyg.createICalendar({
    title: "Safe URL",
    start: "2026-09-04",
    allDay: true,
    url: "https://example.com/a\rb\nc\u2028d\u2029e",
  });

  assert.match(calendar, /URL:https:\/\/example\.com\/abcde\r\n/);
});

test("preserves floating local times and converts zoned timestamps to UTC", () => {
  const local = kbyg.createICalendar(
    {
      title: "Local meeting",
      start: "2026-09-04T09:15:00",
      end: "2026-09-04T10:45:00",
      allDay: false,
    },
    { now: "2026-01-02T03:04:05Z" },
  );
  assert.match(local, /DTSTART:20260904T091500\r\n/);
  assert.match(local, /DTEND:20260904T104500\r\n/);
  assert.doesNotMatch(local, /DTSTART:20260904T091500Z/);

  const zoned = kbyg.createICalendar(
    {
      title: "Central meeting",
      start: "2026-09-04T09:15:00-05:00",
      end: "2026-09-04T10:45:00-05:00",
      allDay: false,
    },
    { now: "2026-01-02T03:04:05Z" },
  );
  assert.match(zoned, /DTSTART:20260904T141500Z\r\n/);
  assert.match(zoned, /DTEND:20260904T154500Z\r\n/);
});

test("escapes TEXT values and folds every physical line to 75 UTF-8 octets", () => {
  const title = "Café, planning; " + "🚀".repeat(30);
  const calendar = kbyg.createICalendar(
    {
      title,
      description: "First line\nSecond \\ line, with; punctuation",
      start: "2026-09-04",
      allDay: true,
    },
    { now: "2026-01-02T03:04:05Z" },
  );

  assert.ok(physicalLineByteLengths(calendar).every((length) => length <= 75));
  assert.match(calendar, /DESCRIPTION:First line\\nSecond \\\\ line\\, with\\; punctuation/);

  const unfolded = calendar.replace(/\r\n[ \t]/g, "");
  assert.ok(unfolded.includes(`SUMMARY:${kbyg.escapeICalText(title)}`));
});

test("initializes navigation per page, accounts for sticky UI, and is idempotent", () => {
  const documentRef = new FakeDocument();
  const windowRef = new FakeWindow(documentRef);
  documentRef.defaultView = windowRef;

  const page = new FakeElement("main", { class: "kbyg-page" });
  page.ownerDocument = documentRef;
  documentRef.pages = [page];

  const welcome = new FakeElement("section", {
    id: "welcome",
    "data-kbyg-section": "",
  });
  welcome.rect = { top: 0, bottom: 900, height: 900 };
  const agenda = new FakeElement("section", {
    id: "agenda",
    "data-kbyg-section": "",
  });
  agenda.rect = { top: 1000, bottom: 1900, height: 900 };
  const welcomeLink = new FakeElement("a", {
    href: "#welcome",
    "data-kbyg-jump": "welcome",
  });
  const agendaLink = new FakeElement("a", {
    href: "#agenda",
    "data-kbyg-jump": "agenda",
  });
  const select = new FakeElement("select", { "data-kbyg-jump": "" });
  select.options = [{ value: "#welcome" }, { value: "agenda" }];
  select.value = "#welcome";
  const sticky = new FakeElement("nav", { "data-kbyg-jump-nav": "" });
  sticky.computedPosition = "sticky";
  sticky.computedTop = "0px";
  sticky.rect = { top: 0, bottom: 60, height: 60 };

  page.selectorMap.set("[data-kbyg-section]", [welcome, agenda]);
  page.selectorMap.set("[data-kbyg-jump]", [welcomeLink, agendaLink, select]);
  page.selectorMap.set(
    "[data-kbyg-sticky], [data-kbyg-jump-nav], .kbyg-jump-nav, .kbyg-jump-navigation",
    [sticky],
  );
  page.selectorMap.set("[data-kbyg-accordion]", []);
  page.selectorMap.set("[data-kbyg-calendar]", []);

  const first = kbyg.initPage(page, { document: documentRef, window: windowRef });
  const second = kbyg.initPage(page, { document: documentRef, window: windowRef });
  assert.equal(first, second);
  assert.equal(agendaLink.listeners.get("click").length, 1);
  assert.equal(select.getAttribute("aria-label"), "Jump to section");
  assert.equal(welcomeLink.getAttribute("aria-current"), "location");

  const click = agendaLink.dispatch("click");
  assert.equal(click.defaultPrevented, true);
  assert.deepEqual(windowRef.lastScroll, { top: 940, behavior: "smooth" });
  assert.equal(windowRef.location.hash, "#agenda");
  assert.ok(agendaLink.classList.contains("is-active"));
  assert.equal(agendaLink.getAttribute("aria-current"), "location");
  assert.equal(welcomeLink.getAttribute("aria-current"), null);
  assert.equal(select.value, "agenda");

  windowRef.reducedMotion = true;
  welcomeLink.dispatch("click");
  assert.equal(windowRef.lastScroll.behavior, "auto");

  first.destroy();
  assert.equal(agendaLink.listeners.get("click").length, 0);
  assert.notEqual(kbyg.initPage(page, { document: documentRef, window: windowRef }), first);
});

test("accordions expose correct ARIA state, allow one open item, and support keyboard use", () => {
  const documentRef = new FakeDocument();
  const windowRef = new FakeWindow(documentRef);
  documentRef.defaultView = windowRef;
  const page = new FakeElement("main");
  page.ownerDocument = documentRef;
  documentRef.pages = [page];
  const first = accordionItem(true);
  const second = accordionItem(true, "div");
  const firstMarker = new FakeElement("span", {
    "data-kbyg-initially-expanded-marker": "",
  });
  first.item.removeAttribute("data-initially-expanded");
  first.item.selectorMap.set("[data-kbyg-initially-expanded-marker]", [firstMarker]);

  page.selectorMap.set("[data-kbyg-section]", []);
  page.selectorMap.set("[data-kbyg-jump]", []);
  page.selectorMap.set("[data-kbyg-accordion]", [first.item, second.item]);
  page.selectorMap.set("[data-kbyg-calendar]", []);
  page.selectorMap.set(
    "[data-kbyg-sticky], [data-kbyg-jump-nav], .kbyg-jump-nav, .kbyg-jump-navigation",
    [],
  );

  kbyg.initPage(page, { document: documentRef, window: windowRef });
  assert.equal(first.trigger.getAttribute("aria-expanded"), "true");
  assert.equal(first.panel.hidden, false);
  assert.ok(first.item.classList.contains("is-open"));
  assert.equal(second.trigger.getAttribute("aria-expanded"), "false");
  assert.equal(second.panel.hidden, true);
  assert.notEqual(first.trigger.id, first.panel.id);
  assert.equal(first.trigger.getAttribute("aria-controls"), first.panel.id);
  assert.equal(first.panel.getAttribute("aria-labelledby"), first.trigger.id);
  assert.equal(first.panel.getAttribute("role"), "region");

  const keyboardEvent = second.trigger.dispatch("keydown", { key: "Enter" });
  assert.equal(keyboardEvent.defaultPrevented, true);
  assert.equal(second.trigger.getAttribute("role"), "button");
  assert.equal(second.trigger.getAttribute("tabindex"), "0");
  assert.equal(second.trigger.getAttribute("aria-expanded"), "true");
  assert.equal(first.trigger.getAttribute("aria-expanded"), "false");
  assert.equal(first.panel.hidden, true);
});

test("responsive welcome heading exposes the compact mobile accessible name", () => {
  const documentRef = new FakeDocument();
  const windowRef = new FakeWindow(documentRef);
  windowRef.mobileLayout = true;
  documentRef.defaultView = windowRef;
  const page = new FakeElement("main");
  page.ownerDocument = documentRef;
  const title = new FakeElement("h2");
  title.textContent = "Welcome, we’re excited to see you soon!";
  page.selectorMap.set("#kbyg-welcome-title", [title]);

  const instance = kbyg.initPage(page, { document: documentRef, window: windowRef });
  assert.equal(title.getAttribute("aria-label"), "Welcome!");

  instance.destroy();
  assert.equal(title.getAttribute("aria-label"), null);
});

test("replaces standard KBYG glyph assets with the existing Font Awesome kit convention", () => {
  const documentRef = new FakeDocument();
  const windowRef = new FakeWindow(documentRef);
  windowRef.location.pathname = "/know-before-you-go/example-sponsor";
  documentRef.defaultView = windowRef;
  const page = new FakeElement("main", { class: "kbyg-page", "data-audience": "sponsor" });
  page.ownerDocument = documentRef;
  documentRef.pages = [page];

  const section = new FakeElement("section", {
    id: "welcome",
    "data-kbyg-section": "welcome",
  });
  section.rect = { top: 0, bottom: 800, height: 800 };
  const jumpLink = new FakeElement("a", {
    href: "#welcome",
    "data-kbyg-jump": "welcome",
  });
  const iconParent = new FakeElement("article");
  const iconImage = new FakeElement("img", {
    class: "kbyg-icon kbyg-icon-card__icon",
    src: "https://cdn.example.test/kbyg-building.svg",
  });
  iconParent.appendChild(iconImage);
  const leadershipParent = new FakeElement("article");
  const leadershipImage = new FakeElement("img", {
    class: "kbyg-icon kbyg-icon-card__icon",
    src: "https://cdn.example.test/kbyg-podium.svg",
  });
  leadershipParent.appendChild(leadershipImage);
  const travelIcon = new FakeElement("span", {
    class: "kbyg-icon kbyg-icon--small kbyg-travel-card__icon",
  });
  const travelImage = new FakeElement("img", {
    src: "https://cdn.example.test/kbyg-hotel.svg",
  });
  travelIcon.appendChild(travelImage);
  const heroBadge = new FakeElement("span", { class: "kbyg-hero__badge" });
  const industryIcon = new FakeElement("img", {
    src: "https://cdn.example.test/IPMI-Healthcare-Icon.svg",
  });
  heroBadge.appendChild(industryIcon);
  heroBadge.selectorMap.set("img", [industryIcon]);
  const heroTitle = new FakeElement("h1", { class: "kbyg-hero__title" });
  heroTitle.textContent = "Know Before You Go.";
  const methodTitle = new FakeElement("h4", { class: "kbyg-meeting-method__item-title" });
  methodTitle.textContent = "Mutual Requests";
  const map = new FakeElement("iframe", {
    class: "kbyg-travel-gallery__map",
    loading: "lazy",
  });
  const phoneGlyph = new FakeElement("span", {
    class: "kbyg-glyph kbyg-glyph--mask kbyg-glyph--phone",
  });

  page.selectorMap.set("[data-kbyg-section]", [section]);
  page.selectorMap.set("[data-kbyg-jump]", [jumpLink]);
  page.selectorMap.set(".kbyg-jump__link", [jumpLink]);
  page.selectorMap.set("[data-kbyg-accordion]", []);
  page.selectorMap.set("[data-kbyg-calendar]", []);
  page.selectorMap.set("img.kbyg-icon, .kbyg-icon > img", [
    iconImage,
    leadershipImage,
    travelImage,
  ]);
  page.selectorMap.set(".kbyg-glyph--phone", [phoneGlyph]);
  page.selectorMap.set(".kbyg-hero__badge", [heroBadge]);
  page.selectorMap.set(".kbyg-hero__title", [heroTitle]);
  page.selectorMap.set(".kbyg-meeting-method__item-title", [methodTitle]);
  page.selectorMap.set(".kbyg-travel-gallery__map, .kbyg-travel-gallery iframe", [map]);

  kbyg.initPage(page, { document: documentRef, window: windowRef });

  const iconWrapper = iconParent.children[0];
  assert.equal(iconWrapper.tagName, "SPAN");
  assert.ok(iconWrapper.classList.contains("kbyg-icon"));
  assert.ok(iconWrapper.children[0].classList.contains("fa-light"));
  assert.ok(iconWrapper.children[0].classList.contains("fa-building"));
  assert.ok(leadershipParent.children[0].children[0].classList.contains("fa-keynote"));
  assert.equal(travelIcon.children.length, 1);
  assert.ok(travelIcon.children[0].classList.contains("fa-hotel"));
  assert.equal(heroBadge.children[0], industryIcon);
  assert.ok(industryIcon.classList.contains("kbyg-hero__industry-icon"));
  assert.ok(heroBadge.classList.contains("kbyg-hero__badge--industry"));
  assert.ok(phoneGlyph.children[0].classList.contains("fa-solid"));
  assert.ok(phoneGlyph.children[0].classList.contains("fa-phone"));
  assert.ok(jumpLink.children[0].classList.contains("kbyg-jump__icon"));
  assert.ok(jumpLink.children[0].children[0].classList.contains("fa-id-card"));
  assert.equal(heroTitle.children[0].textContent, "Know Before You Go");
  assert.equal(heroTitle.children[1].textContent, ".");
  assert.ok(heroTitle.children[1].classList.contains("kbyg-accent"));
  assert.equal(methodTitle.textContent, "1. Mutual Requests");
  assert.equal(map.getAttribute("loading"), "eager");
});

test("calendar controls can read title and rich description text from their CMS item", async () => {
  const documentRef = new FakeDocument();
  const windowRef = new FakeWindow(documentRef);
  documentRef.defaultView = windowRef;
  const page = new FakeElement("main");
  page.ownerDocument = documentRef;
  documentRef.pages = [page];

  const item = new FakeElement("article", { "data-kbyg-calendar-item": "" });
  const title = new FakeElement("h3", { "data-kbyg-calendar-title": "" });
  title.textContent = "Sponsor arrival";
  const description = new FakeElement("div", { "data-kbyg-calendar-description": "" });
  description.textContent = "Bring ID\nand confirmation.";
  const control = new FakeElement("a", {
    href: "#",
    "aria-label": "Sponsor arrival",
    "data-kbyg-calendar": "",
    "data-kbyg-start": "September 3, 2026",
    "data-kbyg-end": "September 3, 2026",
    "data-kbyg-all-day": "true",
  });
  const card = new FakeElement("article");
  const month = new FakeElement("span");
  const day = new FakeElement("span");
  const displayDate = new FakeElement("p");
  displayDate.textContent = "Friday, September 4, 2026";
  card.classList.add("kbyg-date-card");
  card.selectorMap.set(".kbyg-date-card__month", [month]);
  card.selectorMap.set(".kbyg-date-card__day", [day]);
  card.selectorMap.set(".kbyg-date-card__display-date", [displayDate]);
  item.selectorMap.set("[data-kbyg-calendar-title]", [title]);
  item.selectorMap.set("[data-kbyg-calendar-description]", [description]);
  item.appendChild(card);
  card.appendChild(control);

  page.selectorMap.set("[data-kbyg-section]", []);
  page.selectorMap.set("[data-kbyg-jump]", []);
  page.selectorMap.set("[data-kbyg-accordion]", []);
  page.selectorMap.set("[data-kbyg-calendar]", [control]);
  page.selectorMap.set(
    "[data-kbyg-sticky], [data-kbyg-jump-nav], .kbyg-jump-nav, .kbyg-jump-navigation",
    [],
  );

  kbyg.initPage(page, { document: documentRef, window: windowRef });
  assert.equal(month.textContent, "SEP");
  assert.equal(day.textContent, "4");
  assert.equal(control.getAttribute("aria-label"), "Add Sponsor arrival to calendar");
  const event = control.dispatch("click");
  assert.equal(event.defaultPrevented, true);
  assert.equal(control.getAttribute("aria-disabled"), null);

  const calendar = await windowRef.downloadedBlob.text();
  assert.match(calendar, /SUMMARY:Sponsor arrival\r\n/);
  assert.match(calendar, /DESCRIPTION:Bring ID\\nand confirmation\.\r\n/);
  assert.match(calendar, /DTEND;VALUE=DATE:20260905\r\n/);
  assert.equal(documentRef.lastCreatedElement.download, "sponsor-arrival.ics");
  assert.equal(windowRef.revokedUrl, "blob:kbyg-test");
});

function keyDatesFixture(count = 4) {
  const documentRef = new FakeDocument();
  const windowRef = new FakeWindow(documentRef);
  const page = new FakeElement("main");
  const section = new FakeElement("section", { id: "key-dates" });
  const grid = new FakeElement("div", { class: "kbyg-dates-grid" });
  const control = new FakeElement("a", { class: "kbyg-button--calendar-link", href: "#hub" });
  control.textContent = "VIEW ALL KEY DATES";
  const cards = Array.from(
    { length: count },
    () => new FakeElement("article", { class: "kbyg-date-card" }),
  );
  const items = cards.map((card) => {
    const item = new FakeElement("div", { class: "w-dyn-item" });
    item.appendChild(card);
    grid.appendChild(item);
    return item;
  });
  page.selectorMap.set("#key-dates", [section]);
  section.selectorMap.set(".kbyg-dates-grid", [grid]);
  section.selectorMap.set(".kbyg-button--calendar-link, [data-kbyg-dates-toggle]", [control]);
  grid.selectorMap.set(".kbyg-date-card", cards);
  return { documentRef, windowRef, page, section, grid, control, cards, items };
}

test("key dates reveal all CMS records, manage focus, and retain expansion across breakpoints", () => {
  const fixture = keyDatesFixture(6);
  const { documentRef, windowRef, page, grid, control, cards, items } = fixture;
  const instance = kbyg.initPage(page, { document: documentRef, window: windowRef });
  assert.deepEqual(
    items.map((item) => item.hidden),
    [false, false, false, false, true, true],
  );
  assert.equal(control.getAttribute("aria-controls"), grid.id);
  assert.equal(control.getAttribute("role"), "button");
  assert.equal(control.getAttribute("aria-expanded"), "false");
  assert.notEqual(control.getAttribute("href"), "#hub");

  const click = control.dispatch("click");
  assert.equal(click.defaultPrevented, true);
  assert.ok(items.every((item) => !item.hidden));
  assert.equal(control.getAttribute("aria-expanded"), "true");
  assert.equal(control.children[0].textContent, "SHOW FEWER KEY DATES");
  assert.equal(cards[4].focused, true);
  assert.equal(cards[4].getAttribute("tabindex"), "-1");
  assert.equal(windowRef.location.hash, "");

  windowRef.mobileLayout = true;
  windowRef.dispatch("resize");
  assert.ok(items.every((item) => !item.hidden));
  const key = control.dispatch("keydown", { key: " " });
  assert.equal(key.defaultPrevented, true);
  assert.deepEqual(
    items.map((item) => item.hidden),
    [false, false, false, true, true, true],
  );
  assert.equal(control.getAttribute("aria-expanded"), "false");
  assert.equal(control.focused, true);
  assert.equal(grid.getAttribute("data-kbyg-dates-expanded"), "false");

  windowRef.reducedMotion = true;
  control.dispatch("click");
  assert.equal(windowRef.lastScroll.behavior, "auto");
  instance.destroy();
  assert.equal(control.listeners.get("click").length, 0);
});

test("key dates hide the disclosure when every CMS date is already visible", () => {
  const { documentRef, windowRef, page, control, items } = keyDatesFixture();
  kbyg.initPage(page, { document: documentRef, window: windowRef });
  assert.equal(control.hidden, true);
  assert.ok(items.every((item) => !item.hidden));
  windowRef.mobileLayout = true;
  windowRef.dispatch("resize");
  assert.equal(control.hidden, false);
  assert.equal(items[3].hidden, true);
});

test("venue addresses become correct external Google Maps links without changing telephone links", () => {
  const documentRef = new FakeDocument();
  const page = new FakeElement("main");
  const parent = new FakeElement("p");
  const address = new FakeElement("span");
  const phone = new FakeElement("a", { href: "tel:+14072062400" });
  address.textContent = "4012 Central Florida Parkway, Orlando, FL 32837";
  parent.appendChild(address);
  page.selectorMap.set(
    "[data-kbyg-address], .kbyg-travel-card__meta-line > span:not(.kbyg-glyph)",
    [address],
  );

  const instance = kbyg.initPage(page, {
    document: documentRef,
    window: new FakeWindow(documentRef),
  });
  const [link] = instance.venueLinks.links;
  const url = new URL(link.getAttribute("href"));
  assert.equal(link.tagName, "A");
  assert.equal(parent.children[0], link);
  assert.equal(url.origin, "https://www.google.com");
  assert.equal(url.searchParams.get("query"), address.textContent);
  assert.equal(link.getAttribute("target"), "_blank");
  assert.equal(link.getAttribute("rel"), "noopener noreferrer");
  assert.equal(phone.getAttribute("href"), "tel:+14072062400");
});

test("Sponsor Hub CTAs use an external placeholder while preserving real CMS destinations", () => {
  const documentRef = new FakeDocument();
  const windowRef = new FakeWindow(documentRef);
  windowRef.location.pathname = "/know-before-you-go/example-sponsor";
  const page = new FakeElement("main");
  const placeholder = new FakeElement("a", { href: "mailto:lead@ipmievents.com" });
  placeholder.textContent = "OPEN SPONSOR HUB";
  const realLink = new FakeElement("a", { href: "https://hub.example.test/event?id=2026" });
  realLink.textContent = "VISIT THE SPONSOR HUB";
  page.selectorMap.set("#hub .kbyg-button--external, #sponsor-support .kbyg-button--external", [
    placeholder,
    realLink,
  ]);
  kbyg.initPage(page, { document: documentRef, window: windowRef });
  assert.equal(placeholder.getAttribute("href"), "https://example.com/sponsor-hub");
  assert.equal(realLink.getAttribute("href"), "https://hub.example.test/event?id=2026");
  for (const link of [placeholder, realLink]) {
    assert.equal(link.getAttribute("target"), "_blank");
    assert.equal(link.getAttribute("rel"), "noopener noreferrer");
    assert.doesNotMatch(link.getAttribute("aria-label"), /email/i);
  }
});

test("venue photos form a native Webflow lightbox group and retain full-image fallback links", () => {
  const documentRef = new FakeDocument();
  const windowRef = new FakeWindow(documentRef);
  let readyCalls = 0;
  windowRef.Webflow = {
    push: (callback) => callback(),
    require: (name) =>
      name === "lightbox"
        ? {
            ready: () => {
              readyCalls += 1;
            },
          }
        : null,
  };
  const page = new FakeElement("main");
  const gallery = new FakeElement("div");
  const photos = ["Exterior", "Pool"].map((caption) => {
    const photo = new FakeElement("img", {
      class: "kbyg-travel-gallery__image",
      src: `https://cdn.example.test/${caption}.webp`,
      alt: caption,
    });
    gallery.appendChild(photo);
    return photo;
  });
  page.selectorMap.set(".kbyg-travel-gallery__image", photos);
  const instance = kbyg.initPage(page, { document: documentRef, window: windowRef });
  const [first, second] = instance.venueLightboxes.links;
  assert.equal(readyCalls, 1);
  assert.equal(first.children[0], photos[0]);
  assert.ok(first.classList.contains("w-lightbox"));
  assert.equal(first.getAttribute("href"), photos[0].getAttribute("src"));
  assert.equal(first.getAttribute("aria-haspopup"), "dialog");
  const firstData = JSON.parse(first.children[1].textContent);
  const secondData = JSON.parse(second.children[1].textContent);
  assert.equal(firstData.group, secondData.group);
  assert.deepEqual(firstData.items[0], {
    url: photos[0].getAttribute("src"),
    type: "image",
    caption: "Exterior",
  });
  assert.equal(kbyg.initPage(page, { document: documentRef, window: windowRef }), instance);
  assert.equal(readyCalls, 1);
});

test("industry fallback is healthcare-specific and preserves delegate confirmation artwork", () => {
  for (const audience of ["sponsor", "delegate"]) {
    const documentRef = new FakeDocument();
    const windowRef = new FakeWindow(documentRef);
    windowRef.location.pathname = `/know-before-you-go/example-${audience}`;
    const page = new FakeElement("main");
    const title = new FakeElement("p");
    title.textContent = "2026 Healthcare HR Management Institute";
    const badge = new FakeElement("span");
    const artwork = new FakeElement("svg");
    badge.appendChild(artwork);
    page.selectorMap.set(".kbyg-hero__badge", [badge]);
    page.selectorMap.set(".kbyg-hero__event", [title]);
    kbyg.initPage(page, { document: documentRef, window: windowRef });
    if (audience === "sponsor") {
      assert.match(badge.children[0].getAttribute("src"), /IPMI-Healthcare-Icon\.svg$/);
      assert.ok(badge.classList.contains("kbyg-hero__badge--industry"));
    } else {
      assert.equal(badge.children[0], artwork);
      assert.equal(badge.classList.contains("kbyg-hero__badge--industry"), false);
    }
  }
});

test("empty native Webflow lightboxes receive image data without duplicate wrappers", () => {
  const documentRef = new FakeDocument();
  const page = new FakeElement("main");
  const link = new FakeElement("a", { class: "w-lightbox" });
  const image = new FakeElement("img", {
    src: "https://cdn.example.test/hotel.webp",
    alt: "Hotel",
  });
  const data = new FakeElement("script", { class: "w-json", type: "application/json" });
  data.textContent = '{"items":[],"group":""}';
  link.appendChild(image);
  link.appendChild(data);
  link.selectorMap.set(".w-json", [data]);
  page.selectorMap.set(".kbyg-travel-gallery__image", [image]);
  const instance = kbyg.initPage(page, {
    document: documentRef,
    window: new FakeWindow(documentRef),
  });
  assert.equal(instance.venueLightboxes.links[0], link);
  assert.equal(link.children.length, 2);
  assert.equal(JSON.parse(data.textContent).items[0].url, image.getAttribute("src"));
  assert.ok(JSON.parse(data.textContent).group.startsWith("KBYG Venue Images"));
});

test("CMS industry categories select the corresponding brand while explicit artwork takes precedence", () => {
  const categories = {
    Healthcare: "IPMI-Healthcare-Icon.svg",
    "Human Resources": "IPMI-HR-Icon.svg",
    "Sales & Marketing": "IPMI-Sales-Icon.svg",
    "Environmental Health & Safety": "IPMI-Environmental-Icon.svg",
    Legal: "IPMI-Legal-Icon.svg",
  };
  for (const [category, filename] of Object.entries(categories)) {
    const documentRef = new FakeDocument();
    const windowRef = new FakeWindow(documentRef);
    windowRef.location.pathname = "/know-before-you-go/example-sponsor";
    const page = new FakeElement("main");
    const meta = new FakeElement("meta", { name: "kbyg-industry", content: category });
    documentRef.selectorMap.set('meta[name="kbyg-industry"]', [meta]);
    const badge = new FakeElement("span");
    const image = new FakeElement("img", {
      src: "https://cdn.example.test/IPMI-Healthcare-Icon.svg",
    });
    badge.appendChild(image);
    badge.selectorMap.set("img", [image]);
    page.selectorMap.set(".kbyg-hero__badge", [badge]);
    const instance = kbyg.initPage(page, { document: documentRef, window: windowRef });
    assert.ok(image.getAttribute("src").endsWith(filename), category);
    instance.destroy();

    badge.setAttribute("data-kbyg-industry-icon-src", "https://cdn.example.test/custom-brand.svg");
    kbyg.initPage(page, { document: documentRef, window: windowRef });
    assert.equal(image.getAttribute("src"), "https://cdn.example.test/custom-brand.svg");
  }
});
