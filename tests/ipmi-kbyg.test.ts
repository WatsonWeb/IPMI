// @vitest-environment happy-dom
import assert from "node:assert/strict";
import type { Window } from "happy-dom";

import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import kbyg, { type KbygInstance, type KbygWindow } from "../src/kbyg/index";

const instances: KbygInstance[] = [];
let reducedMotion = false;

function page(html = ""): HTMLElement {
  const element = document.createElement("main");
  element.className = "kbyg-page";
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

function click(element: HTMLElement, options: MouseEventInit = {}): MouseEvent {
  const event = new MouseEvent("click", { bubbles: true, cancelable: true, ...options });
  element.dispatchEvent(event);
  return event;
}

function key(element: HTMLElement, value: string): KeyboardEvent {
  const event = new KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

function viewport(width: number): void {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  window.dispatchEvent(new Event("resize"));
}

function geometry(element: HTMLElement, top: number, height = 900): void {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue(new DOMRect(0, top, 600, height));
}

beforeEach(() => {
  vi.useFakeTimers();
  // Unhandled anchors must retain their native default without allowing this
  // unit test's external-link checks to navigate or make network requests.
  const navigation = (window as unknown as Window).happyDOM.settings.navigation;
  navigation.disableMainFrameNavigation = true;
  navigation.disableChildFrameNavigation = true;
  navigation.disableChildPageNavigation = true;
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  history.replaceState(null, "", "/know-before-you-go/example-delegate");
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: 3000,
  });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  viewport(1280);
  reducedMotion = false;
  const nativeMatchMedia = window.matchMedia.bind(window);
  vi.spyOn(window, "matchMedia").mockImplementation((query) => {
    const list = nativeMatchMedia(query);
    // Happy DOM has no layout engine. Keep its real MediaQueryList/EventTarget
    // while supplying the viewport feature used by the responsive controller.
    if (query === "(max-width: 991px)") {
      vi.spyOn(list, "matches", "get").mockImplementation(() => window.innerWidth <= 991);
    }
    if (query === "(prefers-reduced-motion: reduce)") {
      vi.spyOn(list, "matches", "get").mockImplementation(() => reducedMotion);
    }
    return list;
  });
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  instances.splice(0).forEach((instance) => instance.destroy());
  vi.runOnlyPendingTimers();
  vi.restoreAllMocks();
  vi.useRealTimers();
  delete (window as KbygWindow).Webflow;
  delete (window as KbygWindow).FontAwesome;
  delete window.IPMIKBYG;
  Reflect.deleteProperty(document, Symbol.for("ipmi.kbyg.auto-init"));
  document.body.innerHTML = "";
});

test("the typed ES module exposes the API without initializing the document", () => {
  const element = page();
  expect(kbyg.version).toBe("1.0.0");
  expect(window.IPMIKBYG).toBeUndefined();
  expect(element.getAttribute("data-audience")).toBeNull();
  expect(kbyg.initPage(null)).toBeNull();
});

test("audience inference removes only the opposite native DOM branch and adjusts delegate copy", () => {
  history.replaceState(null, "", "/know-before-you-go/hchr-sept-2026-sponsor/");
  const element = page(
    '<section data-kbyg-audience-branch="delegate"></section><section data-kbyg-audience-branch="sponsor"></section>',
  );
  element.setAttribute("data-audience", "delegate");
  expect(initialize(element).audience).toBe("sponsor");
  expect(element.querySelector('[data-kbyg-audience-branch="delegate"]')).toBeNull();
  expect(element.children).toHaveLength(1);
  history.replaceState(null, "", "/know-before-you-go/example-delegate");
  const delegate = page(
    '<section id="agenda"><p class="kbyg-section__intro">Find details in the Sponsor Hub.</p></section>',
  );
  expect(initialize(delegate).audience).toBe("delegate");
  expect(get(delegate, "p").textContent).toBe("Find details in the Attendee Hub.");
});

test("all-day calendars use exclusive DTEND, stable scoped UIDs, and CRLF line endings", () => {
  const event = {
    title: "Registration deadline",
    start: "2026-09-04",
    end: "2026-09-06",
    allDay: true,
  };
  const first = kbyg.createICalendar(event, { now: "2026-01-02T03:04:05Z" });
  const second = kbyg.createICalendar(event, { now: "2026-02-03T04:05:06Z" });
  expect(first).toContain("DTSTART;VALUE=DATE:20260904\r\n");
  expect(first).toContain("DTEND;VALUE=DATE:20260907\r\n");
  expect(first).toContain("DTSTAMP:20260102T030405Z\r\n");
  expect(first.match(/^UID:(.+)$/m)?.[1]).toBe(second.match(/^UID:(.+)$/m)?.[1]);
  expect(first).not.toMatch(/(^|[^\r])\n/);
  expect(first.endsWith("END:VCALENDAR\r\n")).toBe(true);
  expect(kbyg.createICalendar({ ...event, end: event.start })).toContain(
    "DTEND;VALUE=DATE:20260905\r\n",
  );
  const delegate = kbyg.normalizeCalendarEvent({ ...event, context: "/example-delegate" });
  const sponsor = kbyg.normalizeCalendarEvent({ ...event, context: "/example-sponsor" });
  expect(delegate.uid).not.toBe(sponsor.uid);
  expect(kbyg.stableUid(delegate)).toBe(delegate.uid);
});

test("calendar URLs cannot inject line breaks and TEXT folding counts UTF-8 octets", () => {
  const title = "Café, planning; " + "🚀".repeat(30);
  const calendar = kbyg.createICalendar({
    title,
    start: "2026-09-04",
    allDay: true,
    description: "First line\nSecond \\ line, with; punctuation",
    url: "https://example.com/a\rb\nc\u2028d\u2029e",
  });
  expect(calendar).toContain("URL:https://example.com/abcde\r\n");
  expect(calendar.split("\r\n").every((line) => kbyg.utf8ByteLength(line) <= 75)).toBe(true);
  expect(calendar).toContain("DESCRIPTION:First line\\nSecond \\\\ line\\, with\\; punctuation");
  expect(calendar.replace(/\r\n[ \t]/g, "")).toContain(`SUMMARY:${kbyg.escapeICalText(title)}`);
});

test("CMS scalar normalization does not invoke arbitrary object coercion hooks", () => {
  const toString = vi.fn(() => "Injected title");
  const event = kbyg.normalizeCalendarEvent({
    title: { toString },
    start: "2026-09-04",
    allDay: true,
    description: { unexpected: "object" },
  });
  expect(event.title).toBe("IPMI Event");
  expect(event.description).toBe("");
  expect(toString).not.toHaveBeenCalled();
});

test.each([
  ["2026-09-04T09:15:00", "2026-09-04T10:45:00", "20260904T091500", "20260904T104500"],
  [
    "2026-09-04T09:15:00-05:00",
    "2026-09-04T10:45:00-05:00",
    "20260904T141500Z",
    "20260904T154500Z",
  ],
  ["2026-09-04T09:15:00Z", "2026-09-04T08:00:00Z", "20260904T091500Z", "20260904T101500Z"],
])(
  "timed calendar preserves timezone semantics for %s",
  (start, end, expectedStart, expectedEnd) => {
    const calendar = kbyg.createICalendar({ title: "Meeting", start, end, allDay: false });
    expect(calendar).toContain(`DTSTART:${expectedStart}\r\n`);
    expect(calendar).toContain(`DTEND:${expectedEnd}\r\n`);
  },
);

test.each(["2026-02-30", "2026-00-01", "not-a-date"])(
  "invalid all-day date %s is rejected",
  (start) => {
    expect(() => kbyg.normalizeCalendarEvent({ start, allDay: true })).toThrow(TypeError);
  },
);

test("navigation uses real links/selects, respects sticky offsets, and removes listeners on destroy", () => {
  const element = page(
    '<nav data-kbyg-jump-nav style="position:sticky;top:0px"></nav><a href="#welcome" data-kbyg-jump="welcome">Welcome</a><a href="#agenda" data-kbyg-jump="agenda">Agenda</a><select data-kbyg-jump><option value="#welcome">Welcome</option><option value="agenda">Agenda</option></select><section id="welcome" data-kbyg-section></section><section id="agenda" data-kbyg-section></section>',
  );
  geometry(get(element, "#welcome"), 0);
  geometry(get(element, "#agenda"), 1000);
  geometry(get(element, "nav"), 0, 60);
  const welcome = get(element, 'a[href="#welcome"]');
  const agenda = get(element, 'a[href="#agenda"]');
  const select = get<HTMLSelectElement>(element, "select");
  const instance = initialize(element);
  expect(kbyg.initPage(element)).toBe(instance);
  expect(select.getAttribute("aria-label")).toBe("Jump to section");
  expect(welcome.getAttribute("aria-current")).toBe("location");
  expect(click(agenda).defaultPrevented).toBe(true);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 940, behavior: "smooth" });
  expect(location.hash).toBe("#agenda");
  expect(agenda.classList.contains("is-active")).toBe(true);
  expect(welcome.getAttribute("aria-current")).toBeNull();
  expect(select.value).toBe("agenda");
  reducedMotion = true;
  click(welcome);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "auto" });
  const scrollCalls = vi.mocked(window.scrollTo).mock.calls.length;
  expect(click(agenda, { ctrlKey: true }).defaultPrevented).toBe(false);
  expect(vi.mocked(window.scrollTo).mock.calls).toHaveLength(scrollCalls);
  instance.destroy();
  expect(click(agenda).defaultPrevented).toBe(false);
  expect(vi.mocked(window.scrollTo).mock.calls).toHaveLength(scrollCalls);
  expect(initialize(element)).not.toBe(instance);
});

test("navigation generates unique IDs, synchronizes select/hash changes, and isolates pages", () => {
  const first = page(
    '<form data-kbyg-jump-form><select data-kbyg-jump><option value="agenda">Agenda</option><option value="welcome">Welcome</option></select></form><section data-kbyg-section="agenda"></section><section data-kbyg-section="welcome"></section>',
  );
  const second = page(
    '<section data-kbyg-section="agenda"></section><a data-kbyg-jump="agenda" href="#agenda">Agenda</a>',
  );
  const one = initialize(first);
  const two = initialize(second);
  expect(one.navigation.sections[0]?.id).not.toBe(two.navigation.sections[0]?.id);
  const select = get<HTMLSelectElement>(first, "select");
  select.value = "welcome";
  select.dispatchEvent(new Event("change"));
  expect(first.getAttribute("data-kbyg-active-section")).toBe(one.navigation.sections[1]?.id);
  expect(two.navigation.navigateTo("missing")).toBe(false);
  const submit = new Event("submit", { cancelable: true });
  get(first, "form").dispatchEvent(submit);
  expect(submit.defaultPrevented).toBe(true);
  history.replaceState(null, "", "#agenda");
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  expect(first.getAttribute("data-kbyg-active-section")).toBe(one.navigation.sections[0]?.id);
});

function stickyNavigationFixture(mobile = false, innerInset = 0) {
  const element =
    page(`<div class="kbyg-hero__actions"><a id="hero-agenda" href="#agenda">Agenda</a></div>
    <a id="nav-agenda" data-kbyg-jump="agenda" href="#agenda">Agenda</a>
    <select data-kbyg-jump><option value="welcome">Welcome</option><option value="agenda">Agenda</option></select>
    <section id="welcome" data-kbyg-section></section>
    <div id="agenda-curve" class="kbyg-curve"></div>
    <nav data-kbyg-jump-nav style="position:sticky;top:${mobile ? 10 : 14}px;transform:matrix(1,0,0,1,0,${mobile ? 67 : 16})"><div class="kbyg-jump__inner"></div></nav>
    <div hidden style="display:none" id="hidden-sibling"></div><div id="empty-sibling"></div>
    <section id="agenda" data-kbyg-section><header class="kbyg-section__header" hidden style="display:none">Hidden header</header><header class="kbyg-section__header" id="visible-header"><h2>Agenda</h2></header></section>`);
  element.style.setProperty("--kbyg-scroll-offset", "96px");
  const section = get(element, "#agenda");
  const curve = get(element, "#agenda-curve");
  const nav = get(element, "nav");
  const inner = get(element, ".kbyg-jump__inner");
  const header = get(element, "#visible-header");
  const height = mobile ? 54 : 62;
  const stickyTop = mobile ? 77 : 30;
  function documentGeometry(target: HTMLElement, top: number, boxHeight: number) {
    vi.spyOn(target, "getBoundingClientRect").mockImplementation(
      () => new DOMRect(0, top - window.scrollY, 600, boxHeight),
    );
  }
  documentGeometry(get(element, "#welcome"), 0, 1000);
  documentGeometry(curve, 1000, mobile ? 34 : 84);
  documentGeometry(section, mobile ? 1034 : 1084, 900);
  documentGeometry(header, mobile ? 1044 : 1160, 80);
  documentGeometry(get(header, "h2"), mobile ? 1044 : 1160, 40);
  geometry(get(element, "#hidden-sibling"), 0, 0);
  geometry(get(element, "#empty-sibling"), 0, 0);
  geometry(get(element, "header[hidden]"), 0, 0);
  vi.spyOn(nav, "getBoundingClientRect").mockImplementation(
    () => new DOMRect(0, window.scrollY === 0 ? 700 : stickyTop, 600, height + innerInset),
  );
  vi.spyOn(inner, "getBoundingClientRect").mockImplementation(
    () => new DOMRect(0, (window.scrollY === 0 ? 700 : stickyTop) + innerInset, 600, height),
  );
  return { element, section, curve, nav, inner, header };
}

test.each([
  ["desktop", false, 981],
  ["mobile", true, 897],
] as const)(
  "%s anchors predict the translated sticky pill before and after it sticks",
  (_label, mobile, expectedTop) => {
    viewport(mobile ? 375 : 1280);
    const { element } = stickyNavigationFixture(mobile);
    const instance = initialize(element);
    const ancestor = vi.fn();
    element.addEventListener("click", ancestor);
    const select = get<HTMLSelectElement>(element, "select");
    for (const currentScroll of [0, 1200]) {
      Object.defineProperty(window, "scrollY", { configurable: true, value: currentScroll });
      expect(click(get(element, "#nav-agenda")).defaultPrevented).toBe(true);
      expect(window.scrollTo).toHaveBeenLastCalledWith({ top: expectedTop, behavior: "smooth" });
      expect(location.hash).toBe("#agenda");
      expect(select.value).toBe("agenda");
      expect(get(element, "#nav-agenda").getAttribute("aria-current")).toBe("location");
      expect(click(get(element, "#hero-agenda")).defaultPrevented).toBe(true);
      expect(window.scrollTo).toHaveBeenLastCalledWith({ top: expectedTop, behavior: "smooth" });
    }
    expect(ancestor).not.toHaveBeenCalled();
    reducedMotion = true;
    select.value = "agenda";
    select.dispatchEvent(new Event("change"));
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: expectedTop, behavior: "auto" });
    history.replaceState(null, "", "#agenda");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: expectedTop, behavior: "auto" });
    const calls = vi.mocked(window.scrollTo).mock.calls.length;
    instance.destroy();
    expect(click(get(element, "#hero-agenda")).defaultPrevented).toBe(false);
    expect(click(get(element, "#nav-agenda")).defaultPrevented).toBe(false);
    expect(ancestor).toHaveBeenCalledTimes(2);
    expect(vi.mocked(window.scrollTo).mock.calls).toHaveLength(calls);
  },
);

test("sticky centering includes the inner pill's relative top and the declared offset floor", () => {
  const { element, header } = stickyNavigationFixture(false, 8);
  const instance = initialize(element);
  instance.navigation.navigateTo("agenda");
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 973, behavior: "smooth" });
  // With a larger explicit clearance the visible heading, not the curve, limits the scroll.
  element.setAttribute("data-kbyg-scroll-offset", "210");
  geometry(header, 1160, 80);
  instance.navigation.navigateTo("agenda");
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 934, behavior: "smooth" });
});

test("heading clearance accounts for every sticky overlay and falls back to the first visible h2", () => {
  const { element, header } = stickyNavigationFixture();
  header.classList.remove("kbyg-section__header");
  const overlay = document.createElement("div");
  overlay.setAttribute("data-kbyg-sticky", "");
  overlay.style.cssText = "position:fixed;top:130px";
  element.prepend(overlay);
  geometry(overlay, 130, 60);
  const hiddenHeading = document.createElement("h2");
  hiddenHeading.hidden = true;
  hiddenHeading.style.display = "none";
  header.prepend(hiddenHeading);
  geometry(hiddenHeading, 0, 0);
  initialize(element).navigation.navigateTo("agenda");
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 954, behavior: "smooth" });
});

test.each([
  "missing curve",
  "hidden curve",
  "zero-height curve",
  "no sticky nav",
  "hidden nav",
  "previous section",
])(
  "%s retains section-top scrolling instead of borrowing a different section's curve",
  (condition) => {
    const { element, curve, nav, section } = stickyNavigationFixture();
    if (condition === "missing curve") curve.remove();
    if (condition === "hidden curve") {
      curve.style.display = "none";
      geometry(curve, 0, 0);
    }
    if (condition === "zero-height curve") geometry(curve, 1000, 0);
    if (condition === "no sticky nav") nav.remove();
    if (condition === "hidden nav") {
      nav.style.display = "none";
      geometry(nav, 0, 0);
    }
    if (condition === "previous section") {
      const preceding = document.createElement("section");
      preceding.setAttribute("data-kbyg-section", "intervening");
      section.before(preceding);
      geometry(preceding, 1040, 40);
    }
    initialize(element).navigation.navigateTo("agenda");
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 988, behavior: "smooth" });
  },
);

test("an early section cannot scroll above the document origin", () => {
  const { element, curve, section, header } = stickyNavigationFixture();
  geometry(curve, 0, 34);
  geometry(section, 34, 900);
  geometry(header, 44, 80);
  initialize(element).navigation.navigateTo("agenda");
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "smooth" });
});

test("hero ownership accepts same-document URLs and leaves excluded or modified links to the browser", () => {
  const { element } = stickyNavigationFixture();
  const hero = get(element, ".kbyg-hero__actions");
  const sameDocument = `${location.origin}${location.pathname}`;
  hero.insertAdjacentHTML(
    "beforeend",
    `<a id="absolute-hero" href="${sameDocument}#agenda">Same document</a>
      <a id="other-page" href="/other-page#agenda">Other page</a>
      <a id="external-page" href="https://example.test/other#agenda">External</a>
      <a id="blank-hero" href="#agenda" target="_blank">New tab</a>
      <a id="download-hero" href="#agenda" download>Download</a>
      <a id="unknown-hero" href="#missing">Missing section</a>`,
  );
  element.insertAdjacentHTML(
    "beforeend",
    '<a id="unknown-nav" data-kbyg-jump="missing" href="#missing">Missing navigation</a>',
  );
  initialize(element);
  const ancestor = vi.fn();
  element.addEventListener("click", ancestor);
  expect(click(get(element, "#absolute-hero")).defaultPrevented).toBe(true);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 981, behavior: "smooth" });
  expect(ancestor).not.toHaveBeenCalled();
  const calls = vi.mocked(window.scrollTo).mock.calls.length;
  for (const id of [
    "other-page",
    "external-page",
    "blank-hero",
    "download-hero",
    "unknown-hero",
    "unknown-nav",
  ]) {
    expect(click(get(element, `#${id}`)).defaultPrevented).toBe(false);
    expect(key(get(element, `#${id}`), " ").defaultPrevented).toBe(false);
  }
  for (const options of [
    { ctrlKey: true },
    { metaKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
  ]) {
    for (const id of ["hero-agenda", "nav-agenda"])
      expect(click(get(element, `#${id}`), options).defaultPrevented).toBe(false);
  }
  expect(ancestor).toHaveBeenCalledTimes(16);
  expect(vi.mocked(window.scrollTo).mock.calls).toHaveLength(calls);
});

test("scroll tracking selects the last section at document end and stops pending updates after destroy", () => {
  const element = page(
    '<a href="#welcome" data-kbyg-jump="welcome">Welcome</a><a href="#contact" data-kbyg-jump="contact">Contact</a><section id="welcome" data-kbyg-section></section><section id="contact" data-kbyg-section></section>',
  );
  geometry(get(element, "#welcome"), 0);
  geometry(get(element, "#contact"), 1500);
  const instance = initialize(element);
  expect(kbyg.findActiveSection(instance.navigation.sections, 60, 800)?.id).toBe("welcome");
  Object.defineProperty(window, "scrollY", { configurable: true, value: 2200 });
  window.dispatchEvent(new Event("scroll"));
  vi.advanceTimersByTime(20);
  expect(element.getAttribute("data-kbyg-active-section")).toBe("contact");
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  window.dispatchEvent(new Event("scroll"));
  instance.destroy();
  vi.advanceTimersByTime(20);
  expect(element.getAttribute("data-kbyg-active-section")).toBe("contact");
});

test("runtime enhancements preserve explicit industry accent custom properties", () => {
  const element = page('<span class="kbyg-hero__badge"></span>');
  element.style.setProperty("--kbyg-accent", "#8b49a6");
  element.style.setProperty("--kbyg-accent-dark", "#763e8c");
  initialize(element);
  expect(element.style.getPropertyValue("--kbyg-accent")).toBe("#8b49a6");
  expect(element.style.getPropertyValue("--kbyg-accent-dark")).toBe("#763e8c");
});

test("accordions expose ARIA relationships, one-open state, and native/non-native keyboard behavior", () => {
  const element = page(
    '<article data-kbyg-accordion><span data-kbyg-initially-expanded-marker></span><button data-kbyg-accordion-trigger>One</button><div data-kbyg-accordion-panel>Panel one</div></article><article data-kbyg-accordion data-initially-expanded="true"><div data-kbyg-accordion-trigger>Two</div><div data-kbyg-accordion-panel>Panel two</div></article>',
  );
  const instance = initialize(element);
  const [first, second] = instance.accordions.items;
  assert.ok(first && second);
  expect(first.trigger.getAttribute("aria-controls")).toBe(first.panel.id);
  expect(first.panel.getAttribute("aria-labelledby")).toBe(first.trigger.id);
  expect(first.panel.getAttribute("role")).toBe("region");
  expect(first.panel.hidden).toBe(false);
  expect(second.panel.hidden).toBe(true);
  expect(key(second.trigger, "Enter").defaultPrevented).toBe(true);
  expect(second.trigger.getAttribute("role")).toBe("button");
  expect(second.trigger.getAttribute("tabindex")).toBe("0");
  expect(second.panel.hidden).toBe(false);
  expect(first.panel.hidden).toBe(true);
  expect(instance.accordions.open(100)).toBe(false);
  expect(instance.accordions.open(0)).toBe(true);
  instance.accordions.closeAll();
  expect(first.panel.hidden).toBe(true);
  instance.destroy();
  click(second.trigger);
  expect(second.panel.hidden).toBe(true);
});

test("responsive welcome accessible labels update and restore their original value", () => {
  viewport(768);
  const element = page(
    '<h2 id="kbyg-welcome-title" aria-label="Original welcome">Welcome, we’re excited to see you soon!</h2>',
  );
  const instance = initialize(element);
  const title = get(element, "h2");
  expect(title.getAttribute("aria-label")).toBe("Welcome!");
  viewport(1280);
  instance.responsiveWelcomeTitle?.mediaQuery.dispatchEvent(new Event("change"));
  expect(title.getAttribute("aria-label")).toBe("Original welcome");
  viewport(768);
  instance.responsiveWelcomeTitle?.mediaQuery.dispatchEvent(new Event("change"));
  instance.destroy();
  expect(title.getAttribute("aria-label")).toBe("Original welcome");
});

test("standard glyphs use Font Awesome while industry artwork, heading copy, and agenda markup retain their contracts", () => {
  history.replaceState(null, "", "/know-before-you-go/example-sponsor");
  const element = page(
    '<h1 class="kbyg-hero__title">Know Before You Go.</h1><span class="kbyg-hero__badge"><img src="https://cdn.example.test/IPMI-Healthcare-Icon.svg"></span><article id="building"><img class="kbyg-icon kbyg-icon-card__icon" src="https://cdn.example.test/kbyg-building.svg"></article><article id="podium"><img class="kbyg-icon" src="https://cdn.example.test/kbyg-podium.svg"></article><span class="kbyg-icon kbyg-icon--small"><img src="https://cdn.example.test/kbyg-hotel.svg"></span><span class="kbyg-glyph kbyg-glyph--mask kbyg-glyph--phone"></span><a class="kbyg-jump__link" href="#welcome" data-kbyg-jump="welcome">Welcome</a><section id="welcome" data-kbyg-section></section><h4 class="kbyg-meeting-method__item-title">Mutual Requests</h4><iframe class="kbyg-travel-gallery__map" loading="lazy"></iframe><article class="kbyg-agenda-card"><header class="kbyg-agenda-card__header">Monday</header><div class="kbyg-rich-text"><p><strong>8:00 AM</strong> — Breakfast</p></div></article>',
  );
  const artwork = get(element, ".kbyg-hero__badge img");
  const i2svg = vi.fn(async () => {});
  (window as KbygWindow).FontAwesome = { dom: { i2svg } };
  initialize(element);
  expect(get(element, "#building .fa-building").classList.contains("fa-light")).toBe(true);
  expect(get(element, "#podium .fa-keynote")).toBeTruthy();
  expect(get(element, ".kbyg-icon--small").children).toHaveLength(1);
  expect(get(element, ".kbyg-icon--small .fa-hotel")).toBeTruthy();
  expect(get(element, ".kbyg-hero__badge img")).toBe(artwork);
  expect(artwork.classList.contains("kbyg-hero__industry-icon")).toBe(true);
  expect(get(element, ".kbyg-glyph--font-awesome .fa-phone").classList.contains("fa-solid")).toBe(
    true,
  );
  expect(get(element, ".kbyg-jump__icon .fa-id-card")).toBeTruthy();
  expect(get(element, ".kbyg-hero__title .kbyg-accent").textContent).toBe(".");
  expect(get(element, ".kbyg-meeting-method__item-title").textContent).toBe("1. Mutual Requests");
  expect(get(element, "iframe").getAttribute("loading")).toBe("eager");
  expect(get(element, ".kbyg-agenda-card__item").textContent).toBe("Breakfast");
  expect(get(element, ".kbyg-agenda-card__time").textContent).toBe("8:00 AM");
  expect(i2svg).toHaveBeenCalledWith({ node: element });
});

test("CMS calendar controls honor visible dates, download a Blob, and revoke the object URL", async () => {
  const element = page(
    '<article data-kbyg-calendar-item><h3 data-kbyg-calendar-title>Sponsor arrival</h3><div data-kbyg-calendar-description>Bring ID\nand confirmation.</div><article class="kbyg-date-card"><span class="kbyg-date-card__month"></span><span class="kbyg-date-card__day"></span><p class="kbyg-date-card__display-date">Friday, September 4, 2026</p><a class="kbyg-button" href="#" data-kbyg-calendar data-kbyg-start="September 3, 2026" data-kbyg-end="September 3, 2026" data-kbyg-all-day="true">Add to calendar</a></article></article>',
  );
  let downloaded: Blob | undefined;
  vi.spyOn(URL, "createObjectURL").mockImplementation((value) => {
    assert.ok(value instanceof Blob);
    downloaded = value;
    return "blob:kbyg-test";
  });
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  const downloads: { href: string; filename: string }[] = [];
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
    function (this: HTMLAnchorElement) {
      downloads.push({ href: this.href, filename: this.download });
    },
  );
  initialize(element);
  const control = get(element, "[data-kbyg-calendar]");
  expect(get(element, ".kbyg-date-card__month").textContent).toBe("SEP");
  expect(get(element, ".kbyg-date-card__day").textContent).toBe("4");
  expect(control.getAttribute("aria-label")).toBe("Add Sponsor arrival to calendar");
  expect(click(control).defaultPrevented).toBe(true);
  assert.ok(downloaded);
  const calendar = await downloaded.text();
  expect(calendar).toContain("SUMMARY:Sponsor arrival\r\n");
  expect(calendar).toContain("DESCRIPTION:Bring ID\\nand confirmation.\r\n");
  expect(calendar).toContain("DTEND;VALUE=DATE:20260905\r\n");
  expect(downloads).toEqual([{ href: "blob:kbyg-test", filename: "sponsor-arrival.ics" }]);
  vi.runOnlyPendingTimers();
  expect(revoke).toHaveBeenCalledWith("blob:kbyg-test");
  expect(document.querySelector("a[download]")).toBeNull();
});

test("invalid calendar data sets an accessible error without downloading or throwing", () => {
  const element = page(
    '<button data-kbyg-calendar="{bad-json}" data-kbyg-start="invalid">Calendar</button>',
  );
  initialize(element);
  const control = get(element, "button");
  expect(() => click(control)).not.toThrow();
  expect(control.classList.contains("has-error")).toBe(true);
  expect(control.getAttribute("aria-disabled")).toBe("true");
});

function dateFixture(count: number): {
  element: HTMLElement;
  control: HTMLElement;
  cards: HTMLElement[];
  items: HTMLElement[];
} {
  const markup = Array.from(
    { length: count },
    (_, index) =>
      `<div class="w-dyn-item"><article class="kbyg-date-card">Date ${index}</article></div>`,
  ).join("");
  const element = page(
    `<section id="key-dates"><div class="kbyg-dates-grid">${markup}</div><a class="kbyg-button--calendar-link" href="#hub">View all</a></section>`,
  );
  return {
    element,
    control: get(element, "a"),
    cards: [...element.querySelectorAll<HTMLElement>(".kbyg-date-card")],
    items: [...element.querySelectorAll<HTMLElement>(".w-dyn-item")],
  };
}

test("key dates reveal all CMS items, manage focus, and retain expansion through responsive changes", () => {
  const { element, control, cards, items } = dateFixture(6);
  const instance = initialize(element);
  expect(items.map((item) => item.hidden)).toEqual([false, false, false, false, true, true]);
  expect(control.getAttribute("aria-controls")).toBe(get(element, ".kbyg-dates-grid").id);
  expect(control.getAttribute("role")).toBe("button");
  expect(click(control).defaultPrevented).toBe(true);
  expect(items.every((item) => !item.hidden)).toBe(true);
  expect(control.textContent).toBe("SHOW FEWER KEY DATES");
  expect(document.activeElement).toBe(cards[4]);
  expect(location.hash).toBe("");
  viewport(768);
  expect(items.every((item) => !item.hidden)).toBe(true);
  expect(key(control, " ").defaultPrevented).toBe(true);
  expect(items.map((item) => item.hidden)).toEqual([false, false, false, true, true, true]);
  expect(document.activeElement).toBe(control);
  reducedMotion = true;
  click(control);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "auto" });
  instance.destroy();
  click(control);
  expect(control.getAttribute("aria-expanded")).toBe("true");
});

test("key-date disclosure hides when all records fit, then appears on mobile", () => {
  const { element, control, items } = dateFixture(4);
  initialize(element);
  expect(control.hidden).toBe(true);
  viewport(768);
  expect(control.hidden).toBe(false);
  expect(items[3]?.hidden).toBe(true);
});

test("revealed date cards use sticky clearance without centering a preceding decorative curve", () => {
  const { element, control, cards } = dateFixture(6);
  element.style.setProperty("--kbyg-scroll-offset", "96px");
  element.insertAdjacentHTML(
    "afterbegin",
    '<nav data-kbyg-jump-nav style="position:sticky;top:14px;transform:matrix(1,0,0,1,0,16)"><div class="kbyg-jump__inner"></div></nav>',
  );
  geometry(get(element, "nav"), 700, 62);
  geometry(get(element, ".kbyg-jump__inner"), 700, 62);
  const card = cards[4];
  assert.ok(card);
  const curve = document.createElement("div");
  curve.className = "kbyg-curve";
  card.before(curve);
  geometry(curve, 1616, 84);
  geometry(card, 1700, 240);
  initialize(element);
  click(control);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1604, behavior: "smooth" });
  expect(document.activeElement).toBe(card);
});

test("addresses link to Google Maps while phone links and real Sponsor Hub URLs are preserved", () => {
  history.replaceState(null, "", "/know-before-you-go/example-sponsor");
  const element = page(
    '<p class="kbyg-travel-card__meta-line"><span>4012 Central Florida Parkway, Orlando, FL 32837</span><a href="tel:+14072062400">Call</a></p><section id="hub"><a class="kbyg-button--external" href="mailto:lead@ipmievents.com">Open Sponsor Hub</a></section><section id="sponsor-support"><a class="kbyg-button--external" href="https://hub.example.test/event?id=2026">Visit Sponsor Hub</a></section>',
  );
  const instance = initialize(element);
  const address = instance.venueLinks.links[0];
  assert.ok(address);
  const url = new URL(address.getAttribute("href") ?? "");
  expect(url.origin).toBe("https://www.google.com");
  expect(url.searchParams.get("query")).toBe("4012 Central Florida Parkway, Orlando, FL 32837");
  expect(address.getAttribute("target")).toBe("_blank");
  expect(address.getAttribute("rel")).toBe("noopener noreferrer");
  expect(get(element, 'a[href^="tel:"]').getAttribute("href")).toBe("tel:+14072062400");
  expect(get(element, "#hub a").getAttribute("href")).toBe("https://example.com/sponsor-hub");
  expect(get(element, "#sponsor-support a").getAttribute("href")).toBe(
    "https://hub.example.test/event?id=2026",
  );
  element.setAttribute("data-kbyg-hub-url", "https://hub.example.test/cms");
  instance.destroy();
  initialize(element);
  expect(get(element, "#hub a").getAttribute("href")).toBe("https://hub.example.test/cms");
});

function lightboxData(link: HTMLElement): { group: string; items: unknown[] } {
  const value: unknown = JSON.parse(get(link, ".w-json").textContent ?? "{}");
  assert.ok(value !== null && typeof value === "object" && "group" in value && "items" in value);
  assert.equal(typeof value.group, "string");
  assert.ok(Array.isArray(value.items));
  return { group: String(value.group), items: value.items };
}

test("venue images form one native Webflow lightbox group with accessible full-image fallbacks", () => {
  const ready = vi.fn();
  (window as KbygWindow).Webflow = { push: (callback) => callback(), require: () => ({ ready }) };
  const element = page(
    '<div class="kbyg-travel-gallery"><img class="kbyg-travel-gallery__image" src="https://cdn.example.test/exterior.webp" alt="Exterior"><img class="kbyg-travel-gallery__image" src="https://cdn.example.test/pool.webp" alt="Pool"></div>',
  );
  const photos = [...element.querySelectorAll("img")];
  const instance = initialize(element);
  const [first, second] = instance.venueLightboxes.links;
  assert.ok(first && second);
  expect(ready).toHaveBeenCalledTimes(1);
  expect(first.firstElementChild).toBe(photos[0]);
  expect(first.getAttribute("href")).toBe("https://cdn.example.test/exterior.webp");
  expect(first.getAttribute("aria-haspopup")).toBe("dialog");
  expect(lightboxData(first).group).toBe(lightboxData(second).group);
  expect(lightboxData(first).items[0]).toEqual({
    url: "https://cdn.example.test/exterior.webp",
    type: "image",
    caption: "Exterior",
  });
  expect(kbyg.initPage(element)).toBe(instance);
  expect(ready).toHaveBeenCalledTimes(1);
});

test("existing native lightboxes are repaired without wrappers, preserve configured data, and respect destroy before queued initialization", () => {
  const queue: (() => void)[] = [];
  const ready = vi.fn();
  const webflow = Object.assign(queue, { require: () => ({ ready }) });
  (window as KbygWindow).Webflow = webflow;
  const element = page(
    '<a class="w-lightbox"><img class="kbyg-travel-gallery__image" src="https://cdn.example.test/hotel.webp" alt="Hotel"><script class="w-json" type="application/json">{"items":[],"group":""}</script></a><a class="w-lightbox"><img class="kbyg-travel-gallery__image" src="https://cdn.example.test/pool.webp" alt="Pool"><script class="w-json" type="application/json">{"items":[{"url":"https://cdn.example.test/full-pool.webp","type":"image"}],"group":"Existing"}</script></a>',
  );
  const first = get(element, "a");
  const instance = initialize(element);
  expect(instance.venueLightboxes.links[0]).toBe(first);
  expect(first.children).toHaveLength(2);
  expect(lightboxData(first).items[0]).toEqual({
    url: "https://cdn.example.test/hotel.webp",
    type: "image",
    caption: "Hotel",
  });
  const second = instance.venueLightboxes.links[1];
  assert.ok(second);
  expect(lightboxData(second)).toEqual({
    group: "Existing",
    items: [{ url: "https://cdn.example.test/full-pool.webp", type: "image" }],
  });
  instance.destroy();
  queue.forEach((callback) => callback());
  expect(ready).not.toHaveBeenCalled();
});

test.each([
  ["Healthcare", "IPMI-Healthcare-Icon.svg"],
  ["Human Resources", "IPMI-HR-Icon.svg"],
  ["Sales & Marketing", "IPMI-Sales-Icon.svg"],
  ["Environmental Health & Safety", "IPMI-Environmental-Icon.svg"],
  ["Legal", "IPMI-Legal-Icon.svg"],
])(
  "CMS industry %s chooses branded artwork, with explicit CMS artwork taking precedence",
  (category, filename) => {
    history.replaceState(null, "", "/know-before-you-go/example-sponsor");
    const meta = document.createElement("meta");
    meta.name = "kbyg-industry";
    meta.content = category;
    document.head.append(meta);
    const element = page(
      '<span class="kbyg-hero__badge"><img src="https://cdn.example.test/IPMI-Healthcare-Icon.svg"></span>',
    );
    const instance = initialize(element);
    expect(get(element, "img").getAttribute("src")?.endsWith(filename)).toBe(true);
    instance.destroy();
    get(element, ".kbyg-hero__badge").setAttribute(
      "data-kbyg-industry-icon-src",
      "https://cdn.example.test/custom-brand.svg",
    );
    initialize(element);
    expect(get(element, "img").getAttribute("src")).toBe(
      "https://cdn.example.test/custom-brand.svg",
    );
  },
);

test("healthcare fallback does not replace delegate confirmation artwork", () => {
  for (const audience of ["sponsor", "delegate"]) {
    history.replaceState(null, "", `/know-before-you-go/example-${audience}`);
    const element = page(
      '<p class="kbyg-hero__event">2026 Healthcare HR Management Institute</p><span class="kbyg-hero__badge"><svg aria-hidden="true"></svg></span>',
    );
    const artwork = get(element, "svg");
    initialize(element);
    if (audience === "sponsor")
      expect(get(element, ".kbyg-hero__badge img").getAttribute("src")).toMatch(
        /IPMI-Healthcare-Icon\.svg$/,
      );
    else expect(get(element, ".kbyg-hero__badge").firstElementChild).toBe(artwork);
  }
});

test("autoInit runs once at DOM readiness and the browser entry alone exposes the global API", async () => {
  const element = page();
  vi.spyOn(document, "readyState", "get").mockReturnValue("loading");
  const listeners = vi.spyOn(document, "addEventListener");
  kbyg.autoInit(document);
  kbyg.autoInit(document);
  expect(listeners.mock.calls.filter(([name]) => name === "DOMContentLoaded")).toHaveLength(1);
  expect(element.getAttribute("data-audience")).toBeNull();
  document.dispatchEvent(new Event("DOMContentLoaded"));
  instances.push(...kbyg.init(document));
  expect(element.getAttribute("data-audience")).toBe("delegate");
  await import("../src/entries/ipmi-kbyg");
  expect(window.IPMIKBYG).toBe(kbyg);
});
