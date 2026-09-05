// @vitest-environment happy-dom
import assert from "node:assert/strict";
import { afterEach, beforeEach, test, vi } from "vite-plus/test";
import { initNavigation } from "../src/site/navigation";
import { initInstituteFilters } from "../src/site/filters";
import { initHorizon } from "../src/site/horizon";
import { unlockRecap } from "../src/site/recap-access";
import { initContact } from "../src/site/contact";
import { initAttend } from "../src/site/attend";
import { initHome } from "../src/site/home";
import { initAbout } from "../src/site/about";
import { initInstitute } from "../src/site/institute";
import { initVtt } from "../src/site/vtt";
import { initVttList } from "../src/site/vtt-list";
import { initRecap } from "../src/site/recap";
import { initGallery } from "../src/site/gallery";
import { initFaq } from "../src/site/faq";
import { initSpeakerModal, parseSpeaker } from "../src/site/speaker-modal";
import { initStatistics } from "../src/site/statistics";
import { applyLegacyRedirects, legacyRedirects } from "../src/site/admin-redirects";
import type { SwiperOptions } from "../src/site/vendors";
import { statisticsVendors, swiper } from "../src/site/vendors";

const swipers: { selector: string; options: SwiperOptions }[] = [];
const counters: { id: string; value: number }[] = [];
const started: string[] = [];
const circles: string[] = [];
class SwiperStub {
  constructor(selector: string, options: SwiperOptions) {
    swipers.push({ selector, options });
  }
}
class CountUpStub {
  constructor(
    private readonly id: string,
    value: number,
  ) {
    counters.push({ id, value });
  }
  start() {
    started.push(this.id);
  }
}
class CircleStub {
  constructor(private readonly id: string) {}
  initial() {
    circles.push(this.id);
  }
}
function element<T extends HTMLElement = HTMLElement>(selector: string): T {
  const result = document.querySelector<T>(selector);
  assert.ok(result, `Missing fixture ${selector}`);
  return result;
}
async function ready(): Promise<void> {
  document.dispatchEvent(new Event("DOMContentLoaded"));
  await flushRequests();
}
async function flushRequests(): Promise<void> {
  for (let turn = 0; turn < 12; turn++) await Promise.resolve();
}
beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = "";
  document.body.className = "";
  window.history.replaceState(null, "", "/");
  swipers.length = counters.length = started.length = circles.length = 0;
  Reflect.deleteProperty(window, "$");
  Reflect.deleteProperty(window, "jQuery");
  assert.equal("$" in window, false);
  assert.equal("jQuery" in window, false);
  Object.assign(window, {
    Swiper: SwiperStub,
    countUp: { CountUp: CountUpStub },
    CircularProgressBar: CircleStub,
  });
});
afterEach(() => {
  assert.equal("$" in window, false);
  assert.equal("jQuery" in window, false);
  vi.clearAllTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

test("canonical navigation opens/closes independently and applies Safari curve attributes", () => {
  document.body.innerHTML = `<button class="mobile-menu-button"></button><div class="mobile-menu-wrap">
    <div class="mobile-menu"><button class="inside"></button><button class="mobile-close-button"></button></div></div>
    <footer class="footer"><button class="footer-open-button"></button><button class="footer-close-button"></button></footer>
    <div class="curve"><svg></svg></div>`;
  initNavigation();
  element(".mobile-menu-button").click();
  assert.ok(element(".mobile-menu-wrap").classList.contains("open"));
  element(".inside").click();
  assert.ok(element(".mobile-menu-wrap").classList.contains("open"));
  element(".mobile-close-button").click();
  assert.ok(!element(".mobile-menu-wrap").classList.contains("open"));
  element(".footer-open-button").click();
  assert.ok(element(".footer").classList.contains("open"));
  element(".footer-close-button").click();
  assert.ok(!element(".footer").classList.contains("open"));
  assert.equal(document.querySelector("svg")?.getAttribute("preserveAspectRatio"), "none");
});

test("list filters preserve first-click isolation and subsequent checkbox toggles", () => {
  document.body.innerHTML = `<button id="filter-button"></button><div id="filter-buttons">${[
    "a",
    "b",
    "c",
  ]
    .map(
      (id) =>
        `<button id="${id}" class="institute-filter-button active"><input class="institute-filter-checkbox" type="checkbox" checked></button>`,
    )
    .join("")}</div>`;
  initInstituteFilters();
  element("#filter-button").click();
  assert.ok(element("#filter-buttons").classList.contains("active"));
  element("#a").click();
  assert.equal(element<HTMLInputElement>("#a input").checked, true);
  assert.equal(element<HTMLInputElement>("#b input").checked, false);
  assert.equal(element<HTMLInputElement>("#c input").checked, false);
  element("#a").click();
  assert.equal(element<HTMLInputElement>("#a input").checked, false);
  element("#a").click();
  assert.equal(element<HTMLInputElement>("#a input").checked, true);
});

test("Horizon keeps card, dropdown, industry outline, URL selection, and field states synchronized", () => {
  document.body.innerHTML = `<select id="field-institute"><option value="">Choose</option></select>
    ${["alpha", "beta"].map((slug) => `<div id="${slug}" class="horizon-card-inner-wrap"><div class="horizon-selector-button" style="background-color:rgb(37,148,138)"></div><div class="event-info" data-slug="${slug}" data-label="${slug} label"></div></div>`).join("")}
    <select class="company-size"><option>One</option><option>Hidden</option></select><div class="field-wrapper"><input class="field"></div>`;
  initHorizon(document, "?i=beta");
  const select = element<HTMLSelectElement>("#field-institute");
  assert.equal(select.options.length, 3);
  assert.equal(select.value, "beta label");
  assert.ok(element("#beta").classList.contains("selected"));
  element("#alpha").click();
  assert.equal(select.value, "alpha label");
  assert.notEqual(element("#alpha").style.outlineColor, "transparent");
  select.value = "";
  select.dispatchEvent(new Event("change", { bubbles: true }));
  assert.equal(document.querySelectorAll(".selected").length, 0);
  assert.ok(element<HTMLOptionElement>(".company-size option:last-child").hidden);
  element<HTMLInputElement>(".field").focus();
  assert.ok(element(".field-wrapper").classList.contains("focused"));
  element<HTMLInputElement>(".field").blur();
  assert.ok(!element(".field-wrapper").classList.contains("focused"));
});

test("recap presentation gate accepts only an exact nonempty CMS value and does not log it", () => {
  const log = vi.spyOn(console, "log");
  document.body.innerHTML = `<meta name="ipmi-download-password" content="test value">`;
  document.body.className = "locked";
  assert.equal(unlockRecap(document, "?p=wrong"), false);
  assert.ok(document.body.classList.contains("locked"));
  assert.equal(unlockRecap(document, "?p=test+value"), true);
  assert.ok(!document.body.classList.contains("locked"));
  element<HTMLMetaElement>('meta[name="ipmi-download-password"]').content = "";
  assert.equal(unlockRecap(document, "?p="), false);
  assert.equal(log.mock.calls.length, 0);
});

test("Contact retains native focus and blur behavior without a DOM-library global", async () => {
  document.body.innerHTML = `<div class="field-wrapper"><input class="field"></div>`;
  initContact();
  await ready();
  element<HTMLInputElement>(".field").focus();
  assert.ok(element(".field-wrapper").classList.contains("focused"));
  element<HTMLInputElement>(".field").blur();
  assert.ok(!element(".field-wrapper").classList.contains("focused"));
});

test("Attend preserves upcoming options, category recipients, hidden fields, and slider setup", async () => {
  document.body.innerHTML = `<div id="upcoming-institutes"><div class="upcoming-institute"><span class="upcoming-institute-name">Institute</span><span class="upcoming-institute-date">October</span></div></div>
    <select id="field-institute"></select><input id="field-category"><input id="field-recipient"><input id="field-speak-address" value="speaker@example.test">
    <a class="form-category-link speak-category"><span class="form-category-label">Speak</span></a>
    <div class="field-wrapper hide-speak"></div><select class="company-size"><option value="first">First</option><option value="last">Last</option></select>
    <section class="attend-section" id="attend"><div class="attend-slider-wrap"><div class="gallery-slider"><div class="gallery-wrapper"></div></div></div><div class="attend-mobile-slider-wrap"><div class="attend-mobile-slider"><div class="gallery-wrapper"></div></div></div></section>`;
  initAttend();
  await ready();
  assert.equal(
    element<HTMLSelectElement>("#field-institute").options[0]?.value,
    "Institute - October",
  );
  assert.equal(swipers.length, 2);
  element(".speak-category").click();
  assert.equal(element<HTMLInputElement>("#field-category").value, "Speaker");
  assert.equal(element<HTMLInputElement>("#field-recipient").value, "speaker@example.test");
  assert.ok(element(".hide-speak").classList.contains("hidden-field"));
  vi.advanceTimersByTime(210);
  assert.equal(element<HTMLSelectElement>(".company-size").value, "last");
});

test("Home and About retain their distinct slider configurations and statistical targets", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  document.body.innerHTML = `<div class="stats-cards"></div>`;
  initHome();
  await ready();
  assert.equal(swipers.length, 6);
  assert.equal(
    swipers.find((item) => item.selector === "#features-swiper")?.options.breakpoints?.[992]
      ?.enabled,
    false,
  );
  assert.deepEqual(
    counters.map((item) => item.value),
    [17, 2000, 300, 200],
  );
  assert.equal(started.length, 4);
  swipers.length = counters.length = started.length = circles.length = 0;
  initAbout();
  await ready();
  assert.equal(swipers.length, 2);
  assert.equal(
    swipers.find((item) => item.selector === "#staff-swiper")?.options.breakpoints?.[992]
      ?.slidesPerView,
    4,
  );
  assert.deepEqual(
    counters.map((item) => item.value),
    [17, 2000, 300, 200],
  );
});

test.each([
  ["Attend", initAttend, "Speaker"],
  ["Institute", initInstitute, "Speaker"],
  ["Recap", initRecap, "Speak"],
] as const)(
  "%s form categories preserve labels, recipients and each select's own options",
  async (_page, initialize, speakLabel) => {
    document.body.innerHTML = `<input id="field-category"><input id="field-recipient">
    <input id="field-speak-address" value="speaker@example.test"><input id="field-attend-address" value="attend@example.test">
    <button class="form-category-link speak-category"><span class="form-category-label">Speak</span></button>
    <button class="form-category-link attend-category"><span class="form-category-label">Attend</span></button>
    <div class="field-wrapper hide-speak"><input class="field"></div><div class="field-wrapper hide-attend"></div>
    <select class="company-size" id="size-one"><option value="first-one">First</option><option value="last-one">Hidden</option></select>
    <select class="company-size" id="size-two"><option value="first-two">First</option><option value="last-two">Hidden</option></select>`;
    initialize();
    await ready();
    element(".speak-category").click();
    assert.equal(element<HTMLInputElement>("#field-category").value, speakLabel);
    assert.equal(element<HTMLInputElement>("#field-recipient").value, "speaker@example.test");
    assert.ok(element(".hide-speak").classList.contains("hidden-field"));
    vi.advanceTimersByTime(200);
    assert.equal(element<HTMLSelectElement>("#size-one").value, "last-one");
    assert.equal(element<HTMLSelectElement>("#size-two").value, "last-two");
    assert.ok(element<HTMLOptionElement>("#size-one option:last-child").hidden);
    assert.ok(element<HTMLOptionElement>("#size-two option:last-child").hidden);
    element(".attend-category").click();
    assert.equal(element<HTMLInputElement>("#field-recipient").value, "attend@example.test");
    assert.ok(!element(".hide-speak").classList.contains("hidden-field"));
    assert.ok(element(".hide-attend").classList.contains("hidden-field"));
    assert.equal(element<HTMLSelectElement>("#size-one").value, "first-one");
    assert.equal(element<HTMLSelectElement>("#size-two").value, "first-two");
    // A rapid category change must cancel the older delayed hidden-option selection.
    element(".speak-category").click();
    vi.advanceTimersByTime(100);
    element(".attend-category").click();
    vi.advanceTimersByTime(200);
    assert.equal(element<HTMLSelectElement>("#size-one").value, "first-one");
    assert.equal(element<HTMLSelectElement>("#size-two").value, "first-two");
    element<HTMLInputElement>(".field").focus();
    assert.ok(element(".hide-speak").classList.contains("focused"));
    element<HTMLInputElement>(".field").blur();
    assert.ok(!element(".hide-speak").classList.contains("focused"));
  },
);

test("statistics observer preserves visibility threshold and staggered start order", () => {
  vi.useFakeTimers();
  document.body.innerHTML = `<div class="stats-cards"></div>`;
  let callback: IntersectionObserverCallback | undefined;
  let threshold: number | number[] | undefined;
  const unobserve = vi.fn();
  class ObserverStub {
    constructor(fn: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      callback = fn;
      threshold = options?.threshold;
    }
    observe() {}
    unobserve = unobserve;
  }
  vi.stubGlobal("IntersectionObserver", ObserverStub);
  initStatistics({ colorCircle: "#52525B", threshold: 0.75, minimumRatio: 0.5 });
  assert.equal(threshold, 0.75);
  assert.ok(callback);
  const observer = { unobserve } as unknown as IntersectionObserver;
  callback(
    [
      {
        isIntersecting: true,
        intersectionRatio: 0.8,
        target: element(".stats-cards"),
        boundingClientRect: new DOMRect(),
        intersectionRect: new DOMRect(),
        rootBounds: null,
        time: 0,
      },
    ],
    observer,
  );
  assert.deepEqual(started, ["stat-institutes"]);
  vi.advanceTimersByTime(1500);
  assert.deepEqual(started, ["stat-institutes", "stat-cxos", "stat-speakers", "stat-partners"]);
  assert.equal(unobserve.mock.calls.length, 1);
  vi.unstubAllGlobals();
});

test("remaining page modules retain their slider inventory and VTT field icons", async () => {
  document.body.innerHTML = `<div id="activecampaign-form"><div class="_form_element"><div class="_field-wrapper"><input type="text" id="firstname"></div></div></div>`;
  initInstitute();
  initVtt();
  initVttList();
  initRecap();
  initGallery();
  await ready();
  assert.equal(swipers.length, 16);
  assert.ok(swipers.some((item) => item.selector === "#partners-swiper-new"));
  assert.ok(swipers.some((item) => item.selector === "#networking-swiper"));
  assert.equal(
    element("#firstname").nextElementSibling?.querySelector(".fa-regular")?.textContent,
    "",
  );
});

test("VTT native field focus and icon decoration preserve branded glyphs without duplicates", async () => {
  const fields = [
    ["firstname", ""],
    ["lastname", ""],
    ["jobtitle", ""],
    ["customer_account", ""],
    ["email", ""],
    ["phone", ""],
    ["date", ""],
    ["time", ""],
  ];
  document.body.innerHTML = `<div id="activecampaign-form">${fields.map(([id]) => `<div class="_form_element"><div class="_field-wrapper"><input type="text" id="${id}"></div></div>`).join("")}</div>`;
  initVtt();
  await ready();
  initVtt();
  await ready();
  assert.equal(document.querySelectorAll(".field-icon").length, fields.length);
  for (const [id, glyph] of fields) {
    const field = element<HTMLInputElement>(`#${id}`);
    const icon = field.nextElementSibling;
    assert.ok(icon?.classList.contains("accent-gradient"));
    assert.equal(icon?.querySelector(".fa-regular")?.textContent, glyph);
    field.focus();
    assert.ok(field.closest("._form_element")?.classList.contains("focused"));
    field.blur();
    assert.ok(!field.closest("._form_element")?.classList.contains("focused"));
  }
});

test("FAQ keeps accordion ARIA, hash-link opening, and per-question gallery IDs", async () => {
  document.body.innerHTML = `<div class="faq-question"><span class="faq-id" id="arrival"></span><button class="faq-header" aria-expanded="false"></button><div class="gallery-wrapper"></div><div class="swiper-pagination"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div><a class="footer-link" href="/faq#arrival"></a>`;
  initFaq();
  await ready();
  window.dispatchEvent(new Event("load"));
  element(".footer-link").dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );
  assert.equal(element(".faq-header").getAttribute("aria-expanded"), "true");
  assert.ok(element(".faq-question").classList.contains("open"));
  element(".faq-header").click();
  assert.equal(element(".faq-header").getAttribute("aria-expanded"), "false");
  assert.equal(swipers[0]?.selector, "#arrival-swiper");
});

test("FAQ loaded after the page load still opens the current hash and binds native controls", async () => {
  window.history.replaceState(null, "", "/faq#arrival");
  document.body.innerHTML = `<div class="faq-question"><span class="faq-id" id="arrival"></span><button class="faq-header" aria-expanded="false"></button><div class="gallery-wrapper"></div></div>`;
  vi.spyOn(document, "readyState", "get").mockReturnValue("complete");
  initFaq();
  await flushRequests();
  assert.equal(element(".faq-header").getAttribute("aria-expanded"), "true");
  element(".faq-header").click();
  assert.equal(element(".faq-header").getAttribute("aria-expanded"), "false");
});

test("speaker response validation and modal rendering preserve CMS fields without a photo", async () => {
  assert.deepEqual(parseSpeaker(null), {});
  assert.deepEqual(
    parseSpeaker({ name: 22, biography: "<p>Bio</p>", "profile-photo": { url: false } }),
    { biography: "<p>Bio</p>" },
  );
  document.body.innerHTML = `<div class="w-dyn-item"><a class="modal-link"></a><span class="cms-id">speaker-id</span><span class="loading"></span></div><div id="profile-modal"><div class="profile-wrap"><button class="modal-close"></button><div class="bio-photo-wrap"><img class="bio-photo"></div><h2 class="bio-name"></h2><div class="bio-accolades"></div><div class="bio-job-title"></div><div class="bio-company"></div><div class="bio-content"><div class="bio-text"></div></div></div></div>`;
  const response = {
    name: "Speaker",
    accolades: "Award",
    "job-title": "Director",
    "company-organization": "Company",
    biography: "<p>Biography</p>",
  };
  element(".bio-text").scrollTop = 90;
  const request = mockSpeakerRequest(response);
  initSpeakerModal();
  element(".modal-link").click();
  await flushRequests();
  assert.equal(
    request.mock.calls[0]?.[0],
    "https://ipmi-express-server.vercel.app/cms-items/speaker-id",
  );
  assert.equal(element(".bio-name").textContent, "Speaker");
  assert.equal(element(".bio-text").innerHTML, "<p>Biography</p>");
  assert.equal(element(".bio-accolades").textContent, "Award");
  assert.equal(element(".bio-job-title").textContent, "Director");
  assert.equal(element(".bio-company").textContent, "Company");
  assert.equal(element(".bio-text").scrollTop, 0);
  assert.ok(element(".bio-photo-wrap").classList.contains("hidden"));
  assert.ok(element("#profile-modal").classList.contains("open"));
  element(".profile-wrap").click();
  assert.ok(element("#profile-modal").classList.contains("open"));
  element(".modal-close").click();
  assert.ok(!element("#profile-modal").classList.contains("open"));
});

test("historical redirects are inert until explicitly applied through a supplied admin adapter", () => {
  assert.equal(legacyRedirects.length, 316);
  const written: { source: string; target: string }[] = [];
  const scope = {
    redirectPath: "",
    redirectTarget: "",
    addRedirect() {
      written.push({ source: this.redirectPath, target: this.redirectTarget });
    },
  };
  assert.equal(written.length, 0);
  applyLegacyRedirects(scope, legacyRedirects.slice(0, 2));
  assert.deepEqual(written, legacyRedirects.slice(0, 2));
});

function mountSpeakerFixture(): HTMLImageElement {
  document.body.innerHTML = `<div class="w-dyn-item"><a class="modal-link"></a><span class="cms-id">speaker-id</span><span class="loading"></span></div>
    <div id="profile-modal"><div class="profile-wrap"><button class="modal-close"></button><div class="bio-photo-wrap"><img class="bio-photo"></div><div class="bio-name"></div><div class="bio-content"><div class="bio-text"></div></div></div></div>`;
  return element<HTMLImageElement>(".bio-photo");
}

function mockSpeakerRequest(response: unknown, status = 200) {
  const request = vi
    .fn<typeof fetch>()
    .mockResolvedValue(new Response(JSON.stringify(response), { status }));
  vi.stubGlobal("fetch", request);
  return request;
}

test.each(["cached", "load", "error"] as const)(
  "speaker modal settles %s photos and clears the opener loading state",
  async (state) => {
    vi.useFakeTimers();
    const image = mountSpeakerFixture();
    Object.defineProperty(image, "complete", { configurable: true, value: state === "cached" });
    mockSpeakerRequest({
      name: "Photo Speaker",
      "profile-photo": { url: "https://example.test/photo.jpg" },
    });
    initSpeakerModal();
    element(".modal-link").click();
    await flushRequests();
    assert.equal(image.getAttribute("src"), "https://example.test/photo.jpg");
    assert.ok(element(".loading").classList.contains("opening"));
    assert.ok(!element(".bio-photo-wrap").classList.contains("hidden"));
    if (state !== "cached") {
      assert.ok(!element("#profile-modal").classList.contains("open"));
      image.dispatchEvent(new Event(state));
    }
    await flushRequests();
    assert.ok(element("#profile-modal").classList.contains("open"));
    vi.advanceTimersByTime(299);
    assert.ok(element(".loading").classList.contains("opening"));
    vi.advanceTimersByTime(1);
    assert.ok(!element(".loading").classList.contains("opening"));
  },
);

test("failed speaker HTTP response keeps the modal shut and clears loading after the existing delay", async () => {
  vi.useFakeTimers();
  mountSpeakerFixture();
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  mockSpeakerRequest({ message: "Unavailable" }, 503);
  initSpeakerModal();
  element(".modal-link").click();
  await flushRequests();
  assert.ok(!element("#profile-modal").classList.contains("open"));
  assert.ok(element(".loading").classList.contains("opening"));
  assert.deepEqual(error.mock.calls, [["Error loading Speaker Bio"]]);
  vi.advanceTimersByTime(300);
  assert.ok(!element(".loading").classList.contains("opening"));
});

test.each(["network", "invalid JSON"] as const)(
  "speaker %s failures settle without opening stale content",
  async (failure) => {
    mountSpeakerFixture();
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const request = vi.fn<typeof fetch>();
    if (failure === "network") request.mockRejectedValue(new TypeError("Network unavailable"));
    else request.mockResolvedValue(new Response("{invalid JSON", { status: 200 }));
    vi.stubGlobal("fetch", request);
    initSpeakerModal();
    element(".modal-link").click();
    await flushRequests();
    assert.ok(!element("#profile-modal").classList.contains("open"));
    assert.equal(error.mock.calls.length, 1);
    vi.advanceTimersByTime(300);
    assert.ok(!element(".loading").classList.contains("opening"));
  },
);

function pendingResponse() {
  let resolve!: (response: Response) => void;
  const promise = new Promise<Response>((accept) => {
    resolve = accept;
  });
  return { promise, resolve };
}

test("latest speaker request wins even if the aborted older fetch eventually resolves", async () => {
  mountSpeakerFixture();
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div class="w-dyn-item"><a class="modal-link" id="second-speaker"></a><span class="cms-id">second-id</span><span class="loading"></span></div>`,
  );
  const older = pendingResponse();
  const newer = pendingResponse();
  const request = vi
    .fn<typeof fetch>()
    .mockReturnValueOnce(older.promise)
    .mockReturnValueOnce(newer.promise);
  vi.stubGlobal("fetch", request);
  initSpeakerModal();
  element(".modal-link:not(#second-speaker)").click();
  element("#second-speaker").click();
  assert.equal(request.mock.calls[0]?.[1]?.signal?.aborted, true);
  newer.resolve(
    new Response(JSON.stringify({ name: "Latest Speaker", biography: "Latest biography" })),
  );
  await flushRequests();
  assert.equal(element(".bio-name").textContent, "Latest Speaker");
  assert.ok(element("#profile-modal").classList.contains("open"));
  older.resolve(
    new Response(JSON.stringify({ name: "Stale Speaker", biography: "Stale biography" })),
  );
  await flushRequests();
  assert.equal(element(".bio-name").textContent, "Latest Speaker");
  assert.equal(element(".bio-text").textContent, "Latest biography");
  vi.advanceTimersByTime(300);
  assert.equal(document.querySelectorAll(".loading.opening").length, 0);
});

test.each([".modal-close", "#profile-modal"])(
  "closing via %s before a speaker response prevents stale reopening",
  async (closeSelector) => {
    mountSpeakerFixture();
    const response = pendingResponse();
    const request = vi.fn<typeof fetch>().mockReturnValue(response.promise);
    vi.stubGlobal("fetch", request);
    initSpeakerModal();
    element(".modal-link").click();
    element(closeSelector).click();
    assert.equal(request.mock.calls[0]?.[1]?.signal?.aborted, true);
    response.resolve(new Response(JSON.stringify({ name: "Late Speaker" })));
    await flushRequests();
    assert.ok(!element("#profile-modal").classList.contains("open"));
    vi.advanceTimersByTime(300);
    assert.ok(!element(".loading").classList.contains("opening"));
  },
);

test("closing while a speaker photo loads prevents a late load from reopening the modal", async () => {
  const image = mountSpeakerFixture();
  Object.defineProperty(image, "complete", { configurable: true, value: false });
  mockSpeakerRequest({
    name: "Speaker",
    "profile-photo": { url: "https://example.test/pending.jpg" },
  });
  initSpeakerModal();
  element(".modal-link").click();
  await flushRequests();
  assert.equal(image.getAttribute("src"), "https://example.test/pending.jpg");
  element(".modal-close").click();
  image.dispatchEvent(new Event("load"));
  await flushRequests();
  assert.ok(!element("#profile-modal").classList.contains("open"));
  vi.advanceTimersByTime(300);
  assert.ok(!element(".loading").classList.contains("opening"));
});

test("missing speaker photo elements do not strand a valid response", async () => {
  mountSpeakerFixture().remove();
  mockSpeakerRequest({
    name: "Speaker",
    "profile-photo": { url: "https://example.test/photo.jpg" },
  });
  initSpeakerModal();
  element(".modal-link").click();
  await flushRequests();
  assert.ok(element("#profile-modal").classList.contains("open"));
  vi.advanceTimersByTime(300);
  assert.ok(!element(".loading").classList.contains("opening"));
});

function mountAboutFixture(): void {
  document.body.innerHTML = `<div class="advisors"><div class="w-dyn-item"><a href="/advisors/profile">Advisor</a><span class="loading"></span></div></div>
    <div id="profile-modal"><div class="profile-wrap"><button class="modal-close"></button><div id="modal-container"></div></div></div>`;
}

test("About imports only biography fragments and removes scripts without executing them", async () => {
  mountAboutFixture();
  const request = vi
    .fn<typeof fetch>()
    .mockResolvedValue(
      new Response(
        `<html><body><div class="unrelated">Not biography</div><div class="bio-columns"><h2>Advisor Bio</h2><script>window.__ipmiInjectedScript = true;</script><p onclick="window.__ipmiInjectedScript = true">Biography</p><a class="unsafe" href="javascript:window.__ipmiInjectedScript=true">Unsafe link</a><iframe srcdoc="<script>window.__ipmiInjectedScript=true</script>"></iframe><a class="safe" href="/safe">Safe link</a></div></body></html>`,
      ),
    );
  vi.stubGlobal("fetch", request);
  initAbout();
  await ready();
  element(".advisors a").click();
  await flushRequests();
  assert.equal(request.mock.calls.length, 1);
  assert.equal(element("#modal-container h2").textContent, "Advisor Bio");
  assert.equal(document.querySelector("#modal-container .unrelated"), null);
  assert.equal(document.querySelector("#modal-container script"), null);
  assert.equal(document.querySelector("#modal-container iframe"), null);
  assert.equal(element("#modal-container p").hasAttribute("onclick"), false);
  assert.equal(element("#modal-container .unsafe").hasAttribute("href"), false);
  assert.equal(element("#modal-container .safe").getAttribute("href"), "/safe");
  assert.equal("__ipmiInjectedScript" in window, false);
  assert.ok(element("#profile-modal").classList.contains("open"));
  assert.ok(!element(".loading").classList.contains("opening"));
  element(".profile-wrap").click();
  assert.ok(element("#profile-modal").classList.contains("open"));
  element(".modal-close").click();
  assert.ok(!element("#profile-modal").classList.contains("open"));
});

test.each(["HTTP error", "network error", "missing fragment"] as const)(
  "About %s leaves the modal closed and clears loading",
  async (failure) => {
    mountAboutFixture();
    vi.spyOn(console, "error").mockImplementation(() => {});
    const request = vi.fn<typeof fetch>();
    if (failure === "network error")
      request.mockRejectedValue(new TypeError("Network unavailable"));
    else
      request.mockResolvedValue(
        new Response("<p>Not a biography fragment</p>", {
          status: failure === "HTTP error" ? 503 : 200,
        }),
      );
    vi.stubGlobal("fetch", request);
    initAbout();
    await ready();
    element(".advisors a").click();
    await flushRequests();
    assert.ok(!element("#profile-modal").classList.contains("open"));
    assert.ok(!element(".loading").classList.contains("opening"));
  },
);

test("closing About before the fetched fragment arrives aborts without reopening", async () => {
  mountAboutFixture();
  const response = pendingResponse();
  const request = vi.fn<typeof fetch>().mockReturnValue(response.promise);
  vi.stubGlobal("fetch", request);
  initAbout();
  await ready();
  element(".advisors a").click();
  element(".modal-close").click();
  assert.equal(request.mock.calls[0]?.[1]?.signal?.aborted, true);
  response.resolve(new Response(`<div class="bio-columns"><h2>Late Advisor</h2></div>`));
  await flushRequests();
  assert.ok(!element("#profile-modal").classList.contains("open"));
  assert.ok(!element(".loading").classList.contains("opening"));
});

test("missing vendor globals fail explicitly instead of bundling replacement runtimes", () => {
  Object.assign(window, {
    Swiper: undefined,
    countUp: undefined,
    CircularProgressBar: undefined,
  });
  assert.throws(swiper, /Swiper 8/);
  assert.throws(statisticsVendors, /CountUp and CircularProgressBar/);
});
