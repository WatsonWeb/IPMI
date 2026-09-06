import {
  createICalendar,
  normalizeCalendarEvent,
  parseBoolean,
  slug,
  parseDateOnly,
  parseDisplayDate,
  escapeICalText,
  foldICalLine,
  utf8ByteLength,
  stableUid,
} from "./calendar";
import type {
  AccordionRecord,
  Audience,
  CalendarInput,
  Cleanup,
  InitOptions,
  KeyDatesRecord,
  KbygInstance,
  KbygWindow,
  NavigationOptions,
  SectionRecord,
  WebflowRuntime,
} from "./types";
export type * from "./types";
export {
  createICalendar,
  normalizeCalendarEvent,
  escapeICalText,
  foldICalLine,
  utf8ByteLength,
  stableUid,
} from "./calendar";
interface HeadingSegment {
  text: string;
  accent?: boolean;
  breakBefore?: boolean;
  tabletBreak?: boolean;
}
import { scalarText } from "./text";

let VERSION = "1.0.0";
const INSTANCE_KEY = Symbol.for("ipmi.kbyg.page-instance");
const AUTO_INIT_KEY = Symbol.for("ipmi.kbyg.auto-init");
type InitializedPage = HTMLElement & { [INSTANCE_KEY]?: KbygInstance | null };
type InitializedDocument = Document & { [AUTO_INIT_KEY]?: boolean };
let pageCounter = 0;

function toArray<T>(value: ArrayLike<T> | Iterable<T> | null | undefined): T[] {
  return Array.from(value ?? []);
}

function queryAll<T extends Element = HTMLElement>(
  root: ParentNode | null | undefined,
  selector: string,
): T[] {
  if (!root) return [];
  try {
    return Array.from(root.querySelectorAll<T>(selector));
  } catch {
    return [];
  }
}

function query<T extends Element = HTMLElement>(
  root: ParentNode | null | undefined,
  selector: string,
): T | null {
  if (!root) return null;
  try {
    return root.querySelector<T>(selector);
  } catch {
    return null;
  }
}

function getAttribute(element: Element | null | undefined, name: string): string | null {
  return element?.getAttribute(name) ?? null;
}
function hasAttribute(element: Element | null | undefined, name: string): boolean {
  return element?.hasAttribute(name) ?? false;
}
function setAttribute(element: Element | null | undefined, name: string, value: unknown): void {
  element?.setAttribute(name, scalarText(value));
}
function removeAttribute(element: Element | null | undefined, name: string): void {
  element?.removeAttribute(name);
}
function addClass(element: Element | null | undefined, name: string): void {
  element?.classList.add(name);
}
function removeClass(element: Element | null | undefined, name: string): void {
  element?.classList.remove(name);
}
function hasClass(element: Element | null | undefined, name: string): boolean {
  return element?.classList.contains(name) ?? false;
}
function toggleClass(element: Element | null | undefined, name: string, enabled: boolean): void {
  element?.classList.toggle(name, enabled);
}

let FONT_AWESOME_IMAGE_MAP: [string, string][] = [
  ["calendar-clock", "calendar-clock"],
  ["calendar-check", "calendar-check"],
  ["calendar-plus", "calendar-plus"],
  ["airplane", "plane-departure"],
  ["prohibited", "ban"],
  ["handshake", "handshake"],
  ["building", "building"],
  ["profile", "id-card"],
  ["people", "users"],
  ["group", "users"],
  ["hotel", "hotel"],
  ["chair", "chair"],
  ["podium", "keynote"],
  ["glasses", "champagne-glasses"],
  ["car", "car-side"],
  ["bed", "bed"],
  ["question", "circle-question"],
  ["heartbeat", "heart-pulse"],
  ["external-link", "arrow-up-right-from-square"],
  ["mail", "envelope"],
  ["phone", "phone"],
];

let FONT_AWESOME_JUMP_MAP: Record<string, string> = {
  welcome: "id-card",
  prepare: "building",
  "key-dates": "calendar-check",
  agenda: "calendar-days",
  hub: "laptop",
  "hotel-travel": "hotel",
  experience: "handshake",
  faq: "circle-question",
  "sponsor-support": "circle-question",
  contact: "envelope",
};

function addClasses(element: Element | null, classNames: string | null | undefined) {
  String(classNames || "")
    .split(/\s+/)
    .filter(Boolean)
    .forEach(function (className) {
      addClass(element, className);
    });
}

function removeClasses(element: Element | null, classNames: string) {
  String(classNames || "")
    .split(/\s+/)
    .filter(Boolean)
    .forEach(function (className) {
      removeClass(element, className);
    });
}

function clearChildren(element: Element | null) {
  if (!element) return;
  if (typeof element.replaceChildren === "function") {
    element.replaceChildren();
    return;
  }

  while (element.firstChild && typeof element.removeChild === "function") {
    element.removeChild(element.firstChild);
  }
  element.textContent = "";
}

function createFontAwesomeIcon(
  documentRef: Document,
  iconName: string,
  weight?: string,
  extraClasses?: string,
) {
  if (!documentRef || typeof documentRef.createElement !== "function") return null;
  let icon = documentRef.createElement("span");
  addClasses(icon, "kbyg-fa " + (weight || "fa-light") + " fa-" + iconName);
  addClasses(icon, extraClasses);
  setAttribute(icon, "aria-hidden", "true");
  return icon;
}

function prependChild(parent: Element | null, child: Node | null) {
  if (!parent || !child) return;
  if (typeof parent.prepend === "function") parent.prepend(child);
  else if (parent.firstChild && typeof parent.insertBefore === "function") {
    parent.insertBefore(child, parent.firstChild);
  } else if (typeof parent.appendChild === "function") {
    parent.appendChild(child);
  }
}

function appendFontAwesomeIcon(
  parent: Element | null,
  documentRef: Document,
  iconName: string,
  weight?: string,
  extraClasses?: string,
) {
  let icon = createFontAwesomeIcon(documentRef, iconName, weight, extraClasses);
  if (icon && parent && typeof parent.appendChild === "function") parent.appendChild(icon);
  return icon;
}

function iconNameFromImage(image: Element) {
  let source = String(getAttribute(image, "src") || "").toLowerCase();
  for (let index = 0; index < FONT_AWESOME_IMAGE_MAP.length; index += 1) {
    if (source.indexOf(FONT_AWESOME_IMAGE_MAP[index][0]) !== -1) {
      return FONT_AWESOME_IMAGE_MAP[index][1];
    }
  }
  return "";
}

function replaceCmsIconImage(image: HTMLElement, documentRef: Document) {
  let iconName = iconNameFromImage(image);
  let parent = image.parentElement;
  if (!iconName || !parent || typeof parent.replaceChild !== "function") return null;

  if (hasClass(parent, "kbyg-icon")) {
    clearChildren(parent);
    setAttribute(parent, "data-kbyg-font-awesome", iconName);
    appendFontAwesomeIcon(parent, documentRef, iconName, "fa-light");
    return parent;
  }

  let wrapper = documentRef.createElement("span");
  addClasses(wrapper, getAttribute(image, "class"));
  setAttribute(wrapper, "aria-hidden", "true");
  setAttribute(wrapper, "data-kbyg-font-awesome", iconName);
  appendFontAwesomeIcon(wrapper, documentRef, iconName, "fa-light");
  parent.replaceChild(wrapper, image);
  return wrapper;
}

function replaceGlyphWithFontAwesome(
  element: HTMLElement | null,
  documentRef: Document,
  iconName: string,
  weight?: string,
) {
  if (!element || !iconName) return null;
  clearChildren(element);
  removeClasses(
    element,
    "kbyg-glyph--mask kbyg-glyph--phone kbyg-glyph--mail kbyg-glyph--calendar-check kbyg-glyph--calendar-plus kbyg-glyph--external-link",
  );
  addClass(element, "kbyg-glyph--font-awesome");
  setAttribute(element, "data-kbyg-font-awesome", iconName);
  return appendFontAwesomeIcon(element, documentRef, iconName, weight || "fa-light");
}

function setHeadingSegments(
  heading: HTMLElement | null,
  documentRef: Document,
  segments: HeadingSegment[],
) {
  if (!heading || !documentRef || typeof documentRef.createElement !== "function") return;
  clearChildren(heading);

  segments.forEach(function (segment) {
    let span = documentRef.createElement("span");
    if (segment.accent) addClass(span, "kbyg-accent");
    if (segment.breakBefore) addClass(span, "kbyg-title-break");
    if (segment.tabletBreak) addClass(span, "kbyg-tablet-break");
    span.textContent = segment.text;
    heading.appendChild(span);
  });
}

function setupFontAwesome(page: HTMLElement, documentRef: Document, windowRef: KbygWindow | null) {
  let replacedImages: HTMLElement[] = [];
  queryAll(page, "img.kbyg-icon, .kbyg-icon > img").forEach(function (image) {
    let replacement = replaceCmsIconImage(image, documentRef);
    if (replacement) replacedImages.push(replacement);
  });

  [
    [".kbyg-glyph--phone", "phone", "fa-solid"],
    [".kbyg-glyph--mail", "envelope", "fa-solid"],
    [".kbyg-glyph--calendar-check", "calendar-check", "fa-regular"],
    [".kbyg-glyph--calendar-plus", "calendar-plus", "fa-regular"],
    [".kbyg-glyph--external-link", "arrow-up-right-from-square", "fa-light"],
  ].forEach(function (record) {
    queryAll(page, record[0]).forEach(function (element) {
      replaceGlyphWithFontAwesome(element, documentRef, record[1], record[2]);
    });
  });

  queryAll(page, ".kbyg-travel-gallery__map, .kbyg-travel-gallery iframe").forEach(function (map) {
    setAttribute(map, "loading", "eager");
  });

  queryAll(page, ".kbyg-jump__link").forEach(function (link) {
    if (query(link, ".kbyg-jump__icon")) return;
    let iconName = FONT_AWESOME_JUMP_MAP[readJumpValue(link)];
    if (!iconName) return;
    let wrapper = documentRef.createElement("span");
    addClass(wrapper, "kbyg-jump__icon");
    setAttribute(wrapper, "aria-hidden", "true");
    appendFontAwesomeIcon(wrapper, documentRef, iconName, "fa-light");
    prependChild(link, wrapper);
  });

  queryAll(page, "[data-kbyg-jump-form]").forEach(function (form) {
    if (query(form, ".kbyg-jump__select-icon")) return;
    let wrapper = documentRef.createElement("span");
    addClasses(wrapper, "kbyg-jump__icon kbyg-jump__select-icon");
    setAttribute(wrapper, "aria-hidden", "true");
    appendFontAwesomeIcon(wrapper, documentRef, "id-card", "fa-light");
    prependChild(form, wrapper);
  });

  queryAll(page, ".kbyg-button").forEach(function (button) {
    if (hasAttribute(button, "data-kbyg-calendar")) {
      clearChildren(button);
      appendFontAwesomeIcon(button, documentRef, "calendar-plus", "fa-regular", "kbyg-button__fa");
      let label = documentRef.createElement("span");
      addClass(label, "kbyg-button__label");
      label.textContent = "ADD TO CALENDAR";
      button.appendChild(label);
      return;
    }

    let iconName = "";
    let weight = "fa-light";
    if (button.closest && button.closest(".kbyg-hero__actions")) {
      iconName = "arrow-down";
      weight = "fa-solid";
    } else if (hasClass(button, "kbyg-button--calendar-link")) {
      iconName = "calendar-check";
      weight = "fa-regular";
    } else if (button.closest && button.closest("#agenda")) {
      iconName = "calendar-clock";
      clearChildren(button);
      let agendaLabel = documentRef.createElement("span");
      addClass(agendaLabel, "kbyg-button__label");
      agendaLabel.textContent = "VIEW ";
      let fullLabel = documentRef.createElement("span");
      addClass(fullLabel, "kbyg-button__desktop-word");
      fullLabel.textContent = "FULL ";
      agendaLabel.appendChild(fullLabel);
      let instituteLabel = documentRef.createElement("span");
      instituteLabel.textContent = "INSTITUTE AGENDA";
      agendaLabel.appendChild(instituteLabel);
      button.appendChild(agendaLabel);
    } else if (hasClass(button, "kbyg-button--external")) {
      iconName = "arrow-up-right-from-square";
    }

    if (iconName && !query(button, ".kbyg-button__fa")) {
      let icon = createFontAwesomeIcon(documentRef, iconName, weight, "kbyg-button__fa");
      if (
        hasClass(button, "kbyg-button--calendar-link") ||
        hasClass(button, "kbyg-button--external") ||
        (button.closest && button.closest("#agenda"))
      ) {
        prependChild(button, icon);
      } else if (icon) {
        button.appendChild(icon);
      }
    }
  });

  queryAll(page, ".kbyg-agenda-card__header").forEach(function (header) {
    let wrapper = query(header, ".kbyg-agenda-card__icon");
    if (!wrapper) {
      wrapper = documentRef.createElement("span");
      addClass(wrapper, "kbyg-agenda-card__icon");
      setAttribute(wrapper, "aria-hidden", "true");
      prependChild(header, wrapper);
    }
    clearChildren(wrapper);
    setAttribute(wrapper, "data-kbyg-font-awesome", "calendar-pen");
    appendFontAwesomeIcon(wrapper, documentRef, "calendar-pen", "fa-light");
  });

  queryAll(page, ".kbyg-agenda-card .kbyg-rich-text p").forEach(function (row) {
    let strong = query(row, "strong");
    if (!strong || hasClass(row, "kbyg-agenda-card__row")) return;
    let time = String(strong.textContent || "").trim();
    let item = String(row.textContent || "")
      .slice(time.length)
      .replace(/^[\s\u2013\u2014-]+/, "")
      .trim();
    clearChildren(row);
    addClass(row, "kbyg-agenda-card__row");
    addClass(strong, "kbyg-agenda-card__time");
    strong.textContent = time;
    row.appendChild(strong);
    let itemSpan = documentRef.createElement("span");
    addClass(itemSpan, "kbyg-agenda-card__item");
    itemSpan.textContent = item;
    row.appendChild(itemSpan);
  });

  queryAll(page, ".kbyg-faq-item__toggle").forEach(function (toggle) {
    clearChildren(toggle);
    addClass(toggle, "has-font-awesome");
    appendFontAwesomeIcon(toggle, documentRef, "plus", "fa-light", "kbyg-fa--plus");
    appendFontAwesomeIcon(toggle, documentRef, "minus", "fa-light", "kbyg-fa--minus");
  });

  queryAll(page, ".kbyg-contact-card__eyebrow").forEach(function (eyebrow) {
    if (/^your operations lead$/i.test(String(eyebrow.textContent || "").trim())) {
      eyebrow.textContent = "OPERATIONS LEAD";
    }
  });

  queryAll(page, ".kbyg-meeting-method__item-title").forEach(function (title, index) {
    if (!/^\d+\.\s/.test(String(title.textContent || "").trim())) {
      title.textContent = index + 1 + ". " + String(title.textContent || "").trim();
    }
  });

  let heroTitle = query(page, ".kbyg-hero__title");
  if (heroTitle) {
    setHeadingSegments(heroTitle, documentRef, [
      { text: "Know Before You Go" },
      { accent: true, text: "." },
    ]);
  }

  let welcomeTitle = query(page, "#kbyg-welcome-title");
  if (welcomeTitle) {
    setHeadingSegments(welcomeTitle, documentRef, [
      { text: "Welcome, we’re excited to see you soon" },
      { accent: true, text: "!" },
    ]);
  }

  let agendaTitle = query(page, "#kbyg-agenda-title");
  if (agendaTitle) {
    setHeadingSegments(agendaTitle, documentRef, [
      { text: "Agenda At-A-Glance" },
      { accent: true, text: "." },
    ]);
  }

  let hubTitle = query(page, "#hub .kbyg-section__title");
  if (hubTitle) {
    setHeadingSegments(hubTitle, documentRef, [
      { text: String(hubTitle.textContent || "").replace(/\.$/, "") },
      { accent: true, text: "." },
    ]);
  }

  let supportTitle = query(page, "#sponsor-support .kbyg-section__title");
  if (supportTitle) {
    setHeadingSegments(supportTitle, documentRef, [
      { accent: true, text: "Sponsor Support" },
      { text: " Lives in the Hub." },
    ]);
  }

  if (getAttribute(page, "data-audience") === "sponsor") {
    let prepareTitle = query(page, "#kbyg-prepare-title-sponsor");
    if (prepareTitle) {
      setHeadingSegments(prepareTitle, documentRef, [
        { text: "Preparing for your Institute is as easy as " },
        { accent: true, text: "1-2-3." },
      ]);
    }

    let keyDatesTitle = query(page, "#kbyg-key-dates-title-sponsor");
    if (keyDatesTitle) {
      setHeadingSegments(keyDatesTitle, documentRef, [
        { text: "Key Dates & Deliverables" },
        { accent: true, text: "." },
      ]);
    }

    let travelTitle = query(page, "#kbyg-travel-title");
    if (travelTitle) {
      setHeadingSegments(travelTitle, documentRef, [
        { text: "Hotel & Travel" },
        { accent: true, text: "." },
      ]);
    }

    let experienceTitle = query(page, "#kbyg-experience-title-sponsor");
    if (experienceTitle) {
      setHeadingSegments(experienceTitle, documentRef, [
        { text: "Business Meetings & Onsite Experience" },
        { accent: true, text: "." },
      ]);
    }
  } else {
    let delegateAgendaIntro = query(page, "#agenda .kbyg-section__intro");
    if (delegateAgendaIntro) {
      delegateAgendaIntro.textContent = String(delegateAgendaIntro.textContent || "").replace(
        /Sponsor Hub/g,
        "Attendee Hub",
      );
    }

    let delegatePrepareTitle = query(page, "#kbyg-prepare-title-delegate");
    if (delegatePrepareTitle) {
      setHeadingSegments(delegatePrepareTitle, documentRef, [
        { tabletBreak: true, text: "Preparing for your Institute" },
        { text: " is as easy as " },
        { accent: true, text: "1-2-3." },
      ]);
    }
  }

  let contactTitle = query(page, "#contact .kbyg-contact__title");
  if (contactTitle) {
    setHeadingSegments(contactTitle, documentRef, [
      { text: "Questions Before You Go? " },
      { accent: true, breakBefore: true, text: "We’re Here to Help." },
    ]);
  }

  let fontAwesome = windowRef && windowRef.FontAwesome;
  if (fontAwesome && fontAwesome.dom && typeof fontAwesome.dom.i2svg === "function") {
    try {
      let conversion = fontAwesome.dom.i2svg({ node: page });
      if (conversion && typeof conversion.catch === "function") conversion.catch(function () {});
    } catch {
      // The kit's mutation observer will retry once its icon data is ready.
    }
  }

  return { replacedImages: replacedImages };
}

function addListener<K extends keyof WindowEventMap>(
  target: EventTarget | null,
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options: boolean | AddEventListenerOptions,
  cleanups: Cleanup[],
): void {
  if (!target) return;
  // The event-name generic defines the native event payload at this boundary.
  const callback: EventListener = (event) => listener(event as WindowEventMap[K]);
  target.addEventListener(type, callback, options);
  cleanups.push(() => target.removeEventListener(type, callback, options));
}

function tagName(element: Element | null) {
  return String((element && element.tagName) || "").toUpperCase();
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function targetKey(value: unknown) {
  if (value === null || typeof value === "undefined") return "";

  let normalized = scalarText(value).trim();
  if (!normalized) return "";

  let hashIndex = normalized.indexOf("#");
  if (hashIndex !== -1) normalized = normalized.slice(hashIndex + 1);

  return safeDecode(normalized).trim();
}

function claimId(
  element: HTMLElement,
  suggestedId: string,
  claimedIds: Set<string>,
  documentRef: Document,
) {
  let currentId = String((element && element.id) || "").trim();
  let currentOwner =
    currentId && documentRef && typeof documentRef.getElementById === "function"
      ? documentRef.getElementById(currentId)
      : element;

  if (currentId && !claimedIds.has(currentId) && (!currentOwner || currentOwner === element)) {
    claimedIds.add(currentId);
    return currentId;
  }

  let base = slug(suggestedId, "kbyg-control");
  let candidate = base;
  let suffix = 2;

  while (
    claimedIds.has(candidate) ||
    (documentRef &&
      typeof documentRef.getElementById === "function" &&
      documentRef.getElementById(candidate) &&
      documentRef.getElementById(candidate) !== element)
  ) {
    candidate = base + "-" + suffix;
    suffix += 1;
  }

  element.id = candidate;
  setAttribute(element, "id", candidate);
  claimedIds.add(candidate);
  return candidate;
}

function isSelect(element: Element | null): element is HTMLSelectElement {
  return tagName(element) === "SELECT";
}

function isNativeButton(element: Element | null) {
  let name = tagName(element);
  return name === "BUTTON" || (name === "INPUT" && getAttribute(element, "type") !== "hidden");
}

function isNativeInteractive(element: Element | null) {
  let name = tagName(element);
  return (
    isNativeButton(element) ||
    name === "SELECT" ||
    name === "TEXTAREA" ||
    (name === "A" && hasAttribute(element, "href"))
  );
}

function installKeyboardActivation(
  element: HTMLElement,
  activate: (event: Event) => void,
  cleanups: Cleanup[],
) {
  if (isNativeButton(element)) return;

  if (!isNativeInteractive(element)) {
    if (!hasAttribute(element, "role")) setAttribute(element, "role", "button");
    if (!hasAttribute(element, "tabindex")) setAttribute(element, "tabindex", "0");
  }

  addListener(
    element,
    "keydown",
    function (event) {
      let key = event && (event.key || event.code);
      let isAnchor = tagName(element) === "A";
      let shouldActivate = key === " " || key === "Spacebar" || (!isAnchor && key === "Enter");

      if (!shouldActivate) return;
      if (event && typeof event.preventDefault === "function") event.preventDefault();
      activate(event);
    },
    false,
    cleanups,
  );
}

function getWindow(page: HTMLElement, options?: InitOptions) {
  let documentRef =
    (options && options.document) ||
    (page && page.ownerDocument) ||
    (typeof document !== "undefined" ? document : null);
  let windowRef =
    (options && options.window) ||
    (documentRef && documentRef.defaultView) ||
    (typeof window !== "undefined" ? window : null);

  return { document: documentRef, window: windowRef };
}

function normalizeAudience(value: unknown): Audience | "" {
  let audience = scalarText(value || "")
    .trim()
    .toLowerCase();
  return audience === "delegate" || audience === "sponsor" ? audience : "";
}

export function resolveAudience(page: HTMLElement | null, windowRef: KbygWindow | null): Audience {
  let pathname = String((windowRef && windowRef.location && windowRef.location.pathname) || "")
    .toLowerCase()
    .replace(/\/+$/, "");
  let pathMatch = pathname.match(/-(delegate|sponsor)$/);

  return (
    normalizeAudience(pathMatch && pathMatch[1]) ||
    normalizeAudience(getAttribute(page, "data-audience")) ||
    "delegate"
  );
}

function setupAudience(page: HTMLElement, windowRef: KbygWindow | null) {
  let audience = resolveAudience(page, windowRef);
  setAttribute(page, "data-audience", audience);

  queryAll(page, "[data-kbyg-audience-branch]").forEach(function (branch) {
    let branchAudience = normalizeAudience(getAttribute(branch, "data-kbyg-audience-branch"));
    if (!branchAudience || branchAudience === audience) return;

    if (typeof branch.remove === "function") branch.remove();
    else if (branch.parentNode && typeof branch.parentNode.removeChild === "function") {
      branch.parentNode.removeChild(branch);
    }
  });

  return audience;
}

function prefersReducedMotion(windowRef: KbygWindow | null) {
  if (!windowRef || typeof windowRef.matchMedia !== "function") return false;

  try {
    return windowRef.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function setupResponsiveWelcomeTitle(
  page: HTMLElement,
  windowRef: KbygWindow | null,
  cleanups: Cleanup[],
) {
  let title = query(page, "#kbyg-welcome-title");
  if (!title || !windowRef || typeof windowRef.matchMedia !== "function") return null;

  let mediaQuery: MediaQueryList;
  try {
    mediaQuery = windowRef.matchMedia("(max-width: 991px)");
  } catch {
    return null;
  }

  let originalLabel = getAttribute(title, "aria-label");

  function syncLabel() {
    if (mediaQuery.matches) {
      setAttribute(title, "aria-label", "Welcome!");
    } else if (originalLabel === null) {
      removeAttribute(title, "aria-label");
    } else {
      setAttribute(title, "aria-label", originalLabel);
    }
  }

  syncLabel();

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", syncLabel);
    cleanups.push(function () {
      mediaQuery.removeEventListener("change", syncLabel);
    });
  } else if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(syncLabel);
    cleanups.push(function () {
      mediaQuery.removeListener(syncLabel);
    });
  }

  cleanups.push(function () {
    if (originalLabel === null) removeAttribute(title, "aria-label");
    else setAttribute(title, "aria-label", originalLabel);
  });

  return { title: title, mediaQuery: mediaQuery };
}

function numericCssValue(value: unknown) {
  let number = Number.parseFloat(scalarText(value || ""));
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function getStickyGeometry(page: HTMLElement, windowRef: KbygWindow | null) {
  let offset = numericCssValue(getAttribute(page, "data-kbyg-scroll-offset"));
  let navCenter: number | null = null;
  let getStyle =
    windowRef && typeof windowRef.getComputedStyle === "function"
      ? windowRef.getComputedStyle.bind(windowRef)
      : null;

  if (getStyle) {
    try {
      offset = Math.max(
        offset,
        numericCssValue(getStyle(page).getPropertyValue("--kbyg-scroll-offset")),
      );
    } catch {
      // A test double or a detached node may not support computed styles.
    }
  }

  queryAll(
    page,
    "[data-kbyg-sticky], [data-kbyg-jump-nav], .kbyg-jump, .kbyg-jump-nav, .kbyg-jump-navigation",
  ).forEach(function (element) {
    if (!element || typeof element.getBoundingClientRect !== "function") return;

    let rect = element.getBoundingClientRect();
    let style = null;
    if (getStyle) {
      try {
        style = getStyle(element);
      } catch {
        style = null;
      }
    }

    let position = style && style.position;
    let declaredTop = numericCssValue(style && style.top);
    let height = Math.max(0, Number(rect.height) || Number(rect.bottom) - Number(rect.top) || 0);
    let isSticky =
      hasAttribute(element, "data-kbyg-sticky") ||
      hasAttribute(element, "data-kbyg-jump-nav") ||
      position === "sticky" ||
      position === "fixed";

    if (!isSticky || height <= 0 || style?.visibility === "hidden") return;

    if (position === "sticky" || position === "fixed") {
      // The responsive pill is translated below its sticky inset. Measure its
      // eventual position, not its current (possibly still in-flow) viewport Y.
      let translation = 0;
      if (style?.transform && style.transform !== "none") {
        try {
          translation = new DOMMatrixReadOnly(style.transform).m42;
        } catch {
          // A detached document/test environment may not implement DOMMatrix.
        }
      }
      let top = declaredTop + translation;
      offset = Math.max(offset, top + height);
      if (
        element.matches("[data-kbyg-jump-nav], .kbyg-jump, .kbyg-jump-nav, .kbyg-jump-navigation")
      ) {
        let inner = query(element, ".kbyg-jump__inner");
        let pill = inner?.getBoundingClientRect();
        let pillTop = top + (pill && pill.height > 0 ? pill.top - rect.top : 0);
        let pillHeight = pill && pill.height > 0 ? pill.height : height;
        offset = Math.max(offset, pillTop + pillHeight);
        navCenter = pillTop + pillHeight / 2;
      }
    } else if (Number(rect.top) <= offset + 1 && Number(rect.bottom) > 0) {
      offset = Math.max(offset, Number(rect.bottom));
    }
  });

  return { offset: Math.ceil(offset), navCenter };
}

function getStickyOffset(page: HTMLElement, windowRef: KbygWindow | null) {
  return getStickyGeometry(page, windowRef).offset;
}

function precedingSectionCurve(section: HTMLElement) {
  // Welcome has the jump nav between it and the hero curve. CMS conditions can
  // also leave hidden siblings; never borrow a curve across another section.
  let sibling = section.previousElementSibling;
  while (sibling) {
    let rect = sibling.getBoundingClientRect();
    if (rect.height > 0) {
      if (sibling.matches(".kbyg-curve, [data-kbyg-curve]")) return rect;
      if (sibling.matches("[data-kbyg-section]")) return null;
    }
    sibling = sibling.previousElementSibling;
  }
  return null;
}

function scrollToSection(
  page: HTMLElement,
  section: HTMLElement,
  windowRef: KbygWindow | null,
  behavior: ScrollBehavior,
) {
  if (!section || typeof section.getBoundingClientRect !== "function") return false;

  let { offset, navCenter } = getStickyGeometry(page, windowRef);
  let rect = section.getBoundingClientRect();
  let currentScroll = Number((windowRef && (windowRef.scrollY || windowRef.pageYOffset)) || 0);
  let top = currentScroll + Number(rect.top || 0) - offset;

  // Card reveals share this helper but should not jump back to a section curve.
  if (hasAttribute(section, "data-kbyg-section") && navCenter !== null) {
    let curve = precedingSectionCurve(section);
    if (curve) {
      top = currentScroll + curve.top + curve.height / 2 - navCenter;
      let heading = queryAll(section, ".kbyg-section__header, h2")
        .map((element) => element.getBoundingClientRect())
        .find((bounds) => bounds.height > 0);
      // On narrow screens the curve can be shorter than the pill. Keep the
      // first heading/eyebrow at least 16px below every sticky obstruction.
      if (heading) top = Math.min(top, currentScroll + heading.top - offset - 16);
    }
  }
  top = Math.max(0, top);

  if (windowRef && typeof windowRef.scrollTo === "function") {
    try {
      windowRef.scrollTo({ top: top, behavior: behavior });
      return true;
    } catch {
      try {
        windowRef.scrollTo(0, top);
        return true;
      } catch {
        // Fall through to scrollIntoView.
      }
    }
  }

  if (typeof section.scrollIntoView === "function") {
    try {
      section.scrollIntoView({ behavior: behavior, block: "start" });
    } catch {
      section.scrollIntoView();
    }
    return true;
  }

  return false;
}

export function findActiveSection(
  sectionRecords: SectionRecord[],
  stickyOffset: number,
  viewportHeight: number | null,
): SectionRecord | null {
  if (!sectionRecords.length) return null;

  let activationLine = stickyOffset + Math.min(Math.max(Number(viewportHeight) || 0, 0) * 0.2, 160);
  let firstAhead: SectionRecord | null = null;
  let active: SectionRecord | null = null;

  sectionRecords.forEach(function (record) {
    if (!record.element || typeof record.element.getBoundingClientRect !== "function") return;
    let rect = record.element.getBoundingClientRect();

    if (!firstAhead && Number(rect.bottom) > stickyOffset) firstAhead = record;
    if (Number(rect.top) <= activationLine && Number(rect.bottom) > stickyOffset) active = record;
  });

  return active || firstAhead || sectionRecords[sectionRecords.length - 1];
}

function isAtDocumentEnd(documentRef: Document, windowRef: KbygWindow | null) {
  if (!documentRef || !windowRef) return false;
  let root = documentRef.documentElement;
  let body = documentRef.body;
  let documentHeight = Math.max(
    Number(root && root.scrollHeight) || 0,
    Number(body && body.scrollHeight) || 0,
  );
  let viewportBottom =
    Number(windowRef.scrollY || windowRef.pageYOffset) + Number(windowRef.innerHeight || 0);

  return documentHeight > 0 && viewportBottom >= documentHeight - 2;
}

function readJumpValue(control: HTMLElement) {
  if (isSelect(control)) return targetKey(control.value);

  return (
    targetKey(getAttribute(control, "data-kbyg-jump")) || targetKey(getAttribute(control, "href"))
  );
}

function ensureSelectLabel(select: HTMLSelectElement) {
  if (
    hasAttribute(select, "aria-label") ||
    hasAttribute(select, "aria-labelledby") ||
    (select.labels && select.labels.length)
  ) {
    return;
  }

  setAttribute(select, "aria-label", getAttribute(select, "data-kbyg-label") || "Jump to section");
}

function setSelectToSection(select: HTMLSelectElement, record: SectionRecord) {
  let options = toArray(select.options);
  let match = options.find(function (option) {
    return record.keys.has(targetKey(option.value));
  });

  if (match) select.value = match.value;
}

function isModifiedClick(event: Event): boolean {
  return (
    ("button" in event && typeof event.button === "number" && event.button !== 0) ||
    ["metaKey", "ctrlKey", "shiftKey", "altKey"].some(
      (key) => key in event && Boolean(Reflect.get(event, key)),
    )
  );
}

function setupNavigation(
  page: HTMLElement,
  pageToken: number,
  documentRef: Document,
  windowRef: KbygWindow | null,
  cleanups: Cleanup[],
) {
  let claimedIds = new Set<string>();
  let sections = queryAll(page, "[data-kbyg-section]").map(function (section, index) {
    let declaredKey = targetKey(getAttribute(section, "data-kbyg-section"));
    let suggestedId = declaredKey || "kbyg-section-" + pageToken + "-" + (index + 1);
    let id = claimId(section, suggestedId, claimedIds, documentRef);
    let keys = new Set([id]);
    if (declaredKey) keys.add(declaredKey);

    return { element: section, id: id, keys: keys };
  });
  let controls = queryAll(page, "[data-kbyg-jump]");
  let selects = controls.filter(isSelect);
  let links = controls.filter(function (control) {
    return !isSelect(control);
  });
  let activeRecord: SectionRecord | null = null;
  let frameId: number | null = null;
  let destroyed = false;

  function recordForKey(key: unknown) {
    let normalized = targetKey(key);
    if (!normalized) return null;

    return (
      sections.find(function (record) {
        return record.keys.has(normalized);
      }) || null
    );
  }

  function recordForLink(control: HTMLElement) {
    let href = getAttribute(control, "href");
    let target = getAttribute(control, "target");
    if (hasAttribute(control, "download") || (target && target.toLowerCase() !== "_self"))
      return null;
    if (href) {
      try {
        let url = new URL(href, documentRef.baseURI);
        let current = new URL(documentRef.URL);
        if (
          url.origin !== current.origin ||
          url.pathname !== current.pathname ||
          url.search !== current.search
        )
          return null;
      } catch {
        return null;
      }
    }
    return recordForKey(readJumpValue(control));
  }

  function updateControls(record: SectionRecord | null) {
    if (!record || activeRecord === record) return;
    activeRecord = record;
    setAttribute(page, "data-kbyg-active-section", record.id);

    links.forEach(function (control) {
      let linkedRecord = recordForKey(readJumpValue(control));
      let isActive = linkedRecord === record;
      toggleClass(control, "is-active", isActive);
      if (isActive) setAttribute(control, "aria-current", "location");
      else removeAttribute(control, "aria-current");
    });

    selects.forEach(function (select) {
      setSelectToSection(select, record);
    });
  }

  function updateFromScroll() {
    frameId = null;
    if (destroyed) return;

    let active = isAtDocumentEnd(documentRef, windowRef)
      ? sections[sections.length - 1]
      : findActiveSection(
          sections,
          getStickyOffset(page, windowRef),
          windowRef && windowRef.innerHeight,
        );
    if (active) updateControls(active);
  }

  function scheduleUpdate() {
    if (frameId !== null || destroyed) return;

    if (windowRef && typeof windowRef.requestAnimationFrame === "function") {
      frameId = windowRef.requestAnimationFrame(updateFromScroll);
    } else {
      updateFromScroll();
    }
  }

  function updateHash(record: SectionRecord) {
    if (!windowRef || !windowRef.location) return;
    let nextHash = "#" + encodeURIComponent(record.id);
    if (windowRef.location.hash === nextHash) return;

    if (windowRef.history && typeof windowRef.history.pushState === "function") {
      try {
        windowRef.history.pushState(null, "", nextHash);
        return;
      } catch {
        // Setting location.hash below is the safe fallback for restricted contexts.
      }
    }

    try {
      windowRef.location.hash = nextHash;
    } catch {
      // Ignore navigation failures in embedded or sandboxed documents.
    }
  }

  function navigate(record: SectionRecord | null, options?: NavigationOptions) {
    if (!record) return false;
    let navigationOptions = options || {};
    let behavior =
      navigationOptions.behavior || (prefersReducedMotion(windowRef) ? "auto" : "smooth");

    scrollToSection(page, record.element, windowRef, behavior);
    updateControls(record);
    if (navigationOptions.updateHash !== false) updateHash(record);
    return true;
  }

  selects.forEach(function (select) {
    ensureSelectLabel(select);
    addListener(
      select,
      "change",
      function () {
        navigate(recordForKey(readJumpValue(select)));
      },
      false,
      cleanups,
    );
  });

  queryAll(page, "[data-kbyg-jump-form]").forEach(function (form) {
    addListener(
      form,
      "submit",
      function (event) {
        if (event && typeof event.preventDefault === "function") event.preventDefault();
      },
      false,
      cleanups,
    );
  });

  // CMS-bound hero CTAs do not carry data-kbyg-jump in existing Webflow pages.
  // Resolve their actual href so external guides keep their native behavior.
  let jumpLinks = new Set([...links, ...queryAll(page, ".kbyg-hero__actions a[href]")]);
  jumpLinks.forEach(function (control) {
    function activate(event: Event) {
      if (isModifiedClick(event)) return;
      let record = recordForLink(control);
      if (!record) return;
      event.preventDefault();
      // Webflow delegates its smooth scrolling to document. Only owned jumps
      // stop here, preventing a second unoffset scroll from overriding ours.
      event.stopPropagation();
      navigate(record);
    }

    addListener(control, "click", activate, false, cleanups);
    if (recordForLink(control)) installKeyboardActivation(control, activate, cleanups);
  });

  addListener(windowRef, "scroll", scheduleUpdate, { passive: true }, cleanups);
  addListener(windowRef, "resize", scheduleUpdate, { passive: true }, cleanups);
  addListener(
    windowRef,
    "hashchange",
    function () {
      let record = recordForKey(windowRef && windowRef.location && windowRef.location.hash);
      if (record) navigate(record, { updateHash: false, behavior: "auto" });
    },
    false,
    cleanups,
  );

  let hashRecord = recordForKey(windowRef && windowRef.location && windowRef.location.hash);
  if (hashRecord) {
    if (windowRef && typeof windowRef.requestAnimationFrame === "function") {
      windowRef.requestAnimationFrame(function () {
        if (!destroyed) navigate(hashRecord, { updateHash: false, behavior: "auto" });
      });
    } else {
      navigate(hashRecord, { updateHash: false, behavior: "auto" });
    }
  } else {
    updateFromScroll();
  }

  return {
    sections: sections,
    controls: controls,
    navigateTo: function (key: unknown, options?: NavigationOptions) {
      return navigate(recordForKey(key), options);
    },
    refresh: updateFromScroll,
    destroy: function () {
      destroyed = true;
      if (frameId !== null && windowRef && typeof windowRef.cancelAnimationFrame === "function") {
        windowRef.cancelAnimationFrame(frameId);
      }
    },
  };
}

function accordionParts(item: HTMLElement) {
  let trigger =
    query(item, "[data-kbyg-accordion-trigger]") ||
    query(item, ".kbyg-accordion__trigger") ||
    query(item, "button[aria-controls]") ||
    query(item, "button");
  let panel =
    query(item, "[data-kbyg-accordion-panel]") ||
    query(item, ".kbyg-accordion__panel") ||
    query(item, "[role='region']");

  if (!panel && trigger && trigger.nextElementSibling instanceof HTMLElement)
    panel = trigger.nextElementSibling;
  if (!trigger || !panel || trigger === panel) return null;

  return { item: item, trigger: trigger, panel: panel };
}

function initiallyExpanded(item: HTMLElement, trigger: HTMLElement) {
  let marker = query(item, "[data-kbyg-initially-expanded-marker]");
  if (marker && !hasClass(marker, "w-condition-invisible")) return true;

  if (hasAttribute(item, "data-initially-expanded")) {
    return parseBoolean(getAttribute(item, "data-initially-expanded"), true);
  }

  if (hasAttribute(item, "data-kbyg-initially-expanded")) {
    return parseBoolean(getAttribute(item, "data-kbyg-initially-expanded"), true);
  }

  return parseBoolean(getAttribute(trigger, "aria-expanded"), false);
}

function setupAccordions(
  page: HTMLElement,
  pageToken: number,
  documentRef: Document,
  cleanups: Cleanup[],
) {
  let claimedIds = new Set<string>();
  let accordions = queryAll(page, "[data-kbyg-accordion]")
    .map(accordionParts)
    .filter((item): item is AccordionRecord => item !== null);
  let openAccordion: AccordionRecord | null = null;

  function setExpanded(accordion: AccordionRecord, expanded: boolean) {
    let shouldExpand = Boolean(expanded);
    toggleClass(accordion.item, "is-open", shouldExpand);
    setAttribute(accordion.trigger, "aria-expanded", shouldExpand ? "true" : "false");
    accordion.panel.hidden = !shouldExpand;
    if (shouldExpand) removeAttribute(accordion.panel, "hidden");
    else setAttribute(accordion.panel, "hidden", "");
    if (shouldExpand) openAccordion = accordion;
    else if (openAccordion === accordion) openAccordion = null;
  }

  function toggle(accordion: AccordionRecord) {
    let willOpen = getAttribute(accordion.trigger, "aria-expanded") !== "true";

    if (willOpen) {
      accordions.forEach(function (candidate) {
        if (candidate !== accordion) setExpanded(candidate, false);
      });
    }

    setExpanded(accordion, willOpen);
  }

  accordions.forEach(function (accordion, index) {
    let base = "kbyg-accordion-" + pageToken + "-" + (index + 1);
    let triggerId = claimId(accordion.trigger, base + "-trigger", claimedIds, documentRef);
    let panelId = claimId(accordion.panel, base + "-panel", claimedIds, documentRef);

    setAttribute(accordion.trigger, "aria-controls", panelId);
    setAttribute(accordion.panel, "aria-labelledby", triggerId);
    setAttribute(accordion.panel, "role", "region");

    function activate(event: Event) {
      if (event && typeof event.preventDefault === "function") event.preventDefault();
      toggle(accordion);
    }

    addListener(accordion.trigger, "click", activate, false, cleanups);
    installKeyboardActivation(accordion.trigger, activate, cleanups);
  });

  accordions.forEach(function (accordion) {
    let shouldOpen = !openAccordion && initiallyExpanded(accordion.item, accordion.trigger);
    setExpanded(accordion, shouldOpen);
  });

  return {
    items: accordions,
    open: function (index: number) {
      let accordion = accordions[index];
      if (!accordion) return false;
      accordions.forEach(function (candidate) {
        setExpanded(candidate, candidate === accordion);
      });
      return true;
    },
    closeAll: function () {
      accordions.forEach(function (accordion) {
        setExpanded(accordion, false);
      });
    },
  };
}

function calendarDataFromElement(control: HTMLElement): CalendarInput {
  let rawValue = String(getAttribute(control, "data-kbyg-calendar") || "").trim();
  let embedded: Record<string, unknown> = {};

  if (rawValue.charAt(0) === "{") {
    try {
      const parsed: unknown = JSON.parse(rawValue);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
        embedded = parsed as Record<string, unknown>;
    } catch {
      embedded = {};
    }
  }

  function field(name: string, aliases?: string[]): unknown {
    if (embedded[name] !== null && typeof embedded[name] !== "undefined") {
      return embedded[name];
    }

    let attributeNames = aliases || ["data-kbyg-" + name.replace(/[A-Z]/g, "-$&").toLowerCase()];
    for (let index = 0; index < attributeNames.length; index += 1) {
      let value = getAttribute(control, attributeNames[index]);
      if (value !== null && value !== "") return value;
    }

    return "";
  }

  let item =
    control && typeof control.closest === "function"
      ? control.closest("[data-kbyg-calendar-item]")
      : null;
  let titleElement = query(item, "[data-kbyg-calendar-title]");
  let descriptionElement = query(item, "[data-kbyg-calendar-description]");
  let fallbackTitle = String(
    (titleElement && (titleElement.textContent || titleElement.innerText)) ||
      (control && (control.textContent || control.innerText)) ||
      "",
  ).trim();
  let fallbackDescription = String(
    (descriptionElement && (descriptionElement.textContent || descriptionElement.innerText)) || "",
  ).trim();
  let allDay = field("allDay", ["data-kbyg-all-day", "data-kbyg-calendar-all-day"]);
  let start = field("start", ["data-kbyg-start", "data-kbyg-calendar-start"]);
  let end = field("end", ["data-kbyg-end", "data-kbyg-calendar-end"]);
  let card =
    control && typeof control.closest === "function" ? control.closest(".kbyg-date-card") : null;
  let displayDateElement = query(card, ".kbyg-date-card__display-date");
  let displayDate = parseDisplayDate(
    displayDateElement && (displayDateElement.textContent || displayDateElement.innerText),
  );

  // Webflow serializes DateTime fields in custom attributes using the site
  // timezone, which can shift midnight UTC values back one day. The visible
  // CMS display date is authoritative for these all-day deadline cards.
  if (parseBoolean(allDay, false) && displayDate) {
    start = displayDate.iso;
    end = displayDate.iso;
  }

  return {
    title: field("title") || fallbackTitle,
    description: field("description") || fallbackDescription,
    start: start,
    end: end,
    allDay: allDay,
    location: field("location"),
    url: field("url"),
    filename: field("filename"),
    uid: field("uid"),
    eventId: field("eventId", ["data-kbyg-event-id"]),
  };
}

function triggerDownload(
  control: HTMLElement,
  calendar: string,
  filename: string,
  documentRef: Document,
  windowRef: KbygWindow | null,
) {
  let BlobConstructor =
    (windowRef && windowRef.Blob) || (typeof Blob !== "undefined" ? Blob : null);
  const urlApi =
    (windowRef && (windowRef.URL || windowRef.webkitURL)) ||
    (typeof URL !== "undefined" ? URL : null);
  let downloadUrl = "";
  let shouldRevoke = false;

  if (BlobConstructor && urlApi && typeof urlApi.createObjectURL === "function") {
    let blob = new BlobConstructor([calendar], { type: "text/calendar;charset=utf-8" });
    downloadUrl = urlApi.createObjectURL(blob);
    shouldRevoke = true;
  } else {
    downloadUrl = "data:text/calendar;charset=utf-8," + encodeURIComponent(calendar);
  }

  let anchor =
    documentRef && typeof documentRef.createElement === "function"
      ? documentRef.createElement("a")
      : null;
  if (!anchor) return false;

  anchor.href = downloadUrl;
  anchor.download = filename;
  anchor.hidden = true;
  setAttribute(anchor, "aria-hidden", "true");

  let parent = documentRef.body || (control && control.parentNode);
  if (parent && typeof parent.appendChild === "function") parent.appendChild(anchor);
  if (typeof anchor.click === "function") anchor.click();
  if (typeof anchor.remove === "function") anchor.remove();
  else if (anchor.parentNode && typeof anchor.parentNode.removeChild === "function") {
    anchor.parentNode.removeChild(anchor);
  }

  if (shouldRevoke && urlApi && typeof urlApi.revokeObjectURL === "function") {
    let schedule =
      windowRef && typeof windowRef.setTimeout === "function"
        ? windowRef.setTimeout.bind(windowRef)
        : typeof setTimeout === "function"
          ? setTimeout
          : null;
    if (schedule)
      schedule(function () {
        urlApi.revokeObjectURL(downloadUrl);
      }, 0);
    else urlApi.revokeObjectURL(downloadUrl);
  }

  return true;
}

function setupCalendars(
  page: HTMLElement,
  documentRef: Document,
  windowRef: KbygWindow | null,
  cleanups: Cleanup[],
) {
  let controls = queryAll(page, "[data-kbyg-calendar]");

  controls.forEach(function (control) {
    let labelData = calendarDataFromElement(control);
    let card =
      control && typeof control.closest === "function" ? control.closest(".kbyg-date-card") : null;
    let startDate = parseDateOnly(labelData.start);

    if (card && startDate) {
      let month = query(card, ".kbyg-date-card__month");
      let day = query(card, ".kbyg-date-card__day");
      let monthNames = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];

      if (month) month.textContent = monthNames[startDate.month - 1];
      if (day) day.textContent = String(startDate.day);
    }

    if (labelData.title) {
      setAttribute(control, "aria-label", "Add " + scalarText(labelData.title) + " to calendar");
    }

    function download(event: Event) {
      if (isModifiedClick(event)) return;
      if (event && typeof event.preventDefault === "function") event.preventDefault();

      try {
        let raw = calendarDataFromElement(control);
        raw.context =
          windowRef && windowRef.location ? String(windowRef.location.pathname || "") : "";
        let normalized = normalizeCalendarEvent(raw);
        let calendar = createICalendar(normalized);
        removeClass(control, "has-error");
        removeAttribute(control, "aria-disabled");
        triggerDownload(control, calendar, normalized.filename, documentRef, windowRef);
      } catch {
        addClass(control, "has-error");
        setAttribute(control, "aria-disabled", "true");
      }
    }

    addListener(control, "click", download, false, cleanups);
    installKeyboardActivation(control, download, cleanups);
  });

  return { controls: controls };
}

function setupIndustryIcons(page: HTMLElement, documentRef: Document) {
  let eventTitle = query(page, ".kbyg-hero__event");
  let industryMeta = query(documentRef, 'meta[name="kbyg-industry"]');
  let assetRoot = "https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/";
  let industryIcons: Record<string, string> = {
    healthcare: assetRoot + "638989f462c2a24e78ab5665_IPMI-Healthcare-Icon.svg",
    "human resources": assetRoot + "63898af5538b8f3d9ad17d52_IPMI-HR-Icon.svg",
    "sales & marketing": assetRoot + "638989f40e53ef633be7b449_IPMI-Sales-Icon.svg",
    "environmental health & safety":
      assetRoot + "638989f342ab4a19e6bc4aad_IPMI-Environmental-Icon.svg",
    legal: assetRoot + "638989f3adcfdbfe3540efba_IPMI-Legal-Icon.svg",
  };
  let isSponsor = getAttribute(page, "data-audience") === "sponsor";

  queryAll(page, ".kbyg-hero__badge").forEach(function (badge) {
    if (
      !isSponsor &&
      !hasClass(badge, "kbyg-hero__badge--industry") &&
      !hasAttribute(badge, "data-kbyg-industry-icon-src")
    )
      return;

    let existing = query(badge, "img");
    let industry = String(
      getAttribute(badge, "data-kbyg-industry") ||
        getAttribute(page, "data-kbyg-industry") ||
        getAttribute(industryMeta, "content") ||
        "",
    )
      .trim()
      .toLowerCase();
    let source =
      getAttribute(badge, "data-kbyg-industry-icon-src") ||
      getAttribute(page, "data-kbyg-industry-icon-src") ||
      industryIcons[industry] ||
      getAttribute(existing, "src") ||
      (!industry &&
      isSponsor &&
      /\bhealthcare\b/i.test(String((eventTitle && eventTitle.textContent) || ""))
        ? industryIcons.healthcare
        : "");
    if (!source) return;

    let image = existing || documentRef.createElement("img");
    setAttribute(image, "src", source);
    setAttribute(image, "alt", "");
    setAttribute(image, "aria-hidden", "true");
    addClass(image, "kbyg-hero__industry-icon");
    addClass(badge, "kbyg-hero__badge--industry");
    if (!existing) {
      clearChildren(badge);
      badge.appendChild(image);
    }
  });
}

function setupKeyDates(
  page: HTMLElement,
  pageToken: number,
  documentRef: Document,
  windowRef: KbygWindow | null,
  cleanups: Cleanup[],
) {
  let section = query(page, "#key-dates");
  let claimedIds = new Set<string>();
  let compactQuery =
    windowRef && typeof windowRef.matchMedia === "function"
      ? windowRef.matchMedia("(max-width: 991px)")
      : null;
  let records = queryAll(section, ".kbyg-dates-grid")
    .map(function (grid, index) {
      let branch = (grid.closest && grid.closest("[data-kbyg-audience-branch]")) || section;
      const control = query(branch, ".kbyg-button--calendar-link, [data-kbyg-dates-toggle]");
      let cards = queryAll(grid, ".kbyg-date-card");
      if (!control || !cards.length) return null;

      let items = cards.map(function (card) {
        return card.parentElement && hasClass(card.parentElement, "w-dyn-item")
          ? card.parentElement
          : card;
      });
      let id = claimId(
        grid,
        "kbyg-dates-" + pageToken + "-" + (index + 1),
        claimedIds,
        documentRef,
      );
      let label = documentRef.createElement("span");
      addClass(label, "kbyg-button__label");
      clearChildren(control);
      control.appendChild(label);
      setAttribute(control, "data-kbyg-dates-toggle", "");
      setAttribute(control, "aria-controls", id);
      if (isNativeButton(control)) setAttribute(control, "type", "button");
      else {
        setAttribute(control, "role", "button");
        setAttribute(control, "href", "#" + id);
      }

      let record: KeyDatesRecord = {
        grid: grid,
        control: control,
        cards: cards,
        items: items,
        expanded: false,
      };

      function previewCount() {
        return compactQuery && compactQuery.matches ? 3 : 4;
      }

      function update() {
        let limit = previewCount();
        setAttribute(grid, "data-kbyg-dates-expanded", record.expanded ? "true" : "false");
        setAttribute(control, "aria-expanded", record.expanded ? "true" : "false");
        label.textContent = record.expanded ? "SHOW FEWER KEY DATES" : "VIEW ALL KEY DATES";
        record.control.hidden = items.length <= limit;
        items.forEach(function (item, itemIndex) {
          item.hidden = !record.expanded && itemIndex >= limit;
        });
      }

      function toggle(event: Event) {
        if (isModifiedClick(event)) return;
        if (event && typeof event.preventDefault === "function") event.preventDefault();
        let firstRevealed = record.cards[previewCount()];
        record.expanded = !record.expanded;
        update();

        if (record.expanded && firstRevealed) {
          setAttribute(firstRevealed, "tabindex", "-1");
          if (typeof firstRevealed.focus === "function")
            firstRevealed.focus({ preventScroll: true });
          scrollToSection(
            page,
            firstRevealed,
            windowRef,
            prefersReducedMotion(windowRef) ? "auto" : "smooth",
          );
        } else if (typeof record.control.focus === "function") {
          record.control.focus({ preventScroll: true });
        }
      }

      addListener(control, "click", toggle, false, cleanups);
      installKeyboardActivation(control, toggle, cleanups);
      addListener(windowRef, "resize", update, false, cleanups);
      update();
      return record;
    })
    .filter((record): record is KeyDatesRecord => record !== null);

  return { records: records };
}

function externalHttpUrl(value: unknown) {
  let normalized = scalarText(value || "").trim();
  if (!/^https?:\/\//i.test(normalized)) return "";
  try {
    return new URL(normalized).href;
  } catch {
    return "";
  }
}

function setupVenueLinks(page: HTMLElement, documentRef: Document) {
  let links: HTMLElement[] = [];
  queryAll(
    page,
    "[data-kbyg-address], .kbyg-travel-card__meta-line > span:not(.kbyg-glyph)",
  ).forEach(function (address) {
    let text = String(address.textContent || "").trim();
    if (!text) return;
    let link = address;
    if (tagName(address) !== "A") {
      if (!address.parentNode || typeof address.parentNode.replaceChild !== "function") return;
      link = documentRef.createElement("a");
      link.textContent = text;
      address.parentNode.replaceChild(link, address);
    }
    setAttribute(link, "data-kbyg-address", "");
    addClass(link, "kbyg-travel-card__address-link");
    setAttribute(
      link,
      "href",
      "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(text),
    );
    setAttribute(link, "target", "_blank");
    setAttribute(link, "rel", "noopener noreferrer");
    setAttribute(link, "aria-label", text + " (opens in Google Maps in a new tab)");
    links.push(link);
  });
  return { links: links };
}

function setupHubLinks(page: HTMLElement) {
  if (getAttribute(page, "data-audience") !== "sponsor") return { links: [] };
  let links = queryAll(
    page,
    "#hub .kbyg-button--external, #sponsor-support .kbyg-button--external",
  );
  links.forEach(function (link) {
    let explicitUrl =
      externalHttpUrl(getAttribute(link, "data-kbyg-hub-url")) ||
      externalHttpUrl(getAttribute(page, "data-kbyg-hub-url"));
    let url =
      explicitUrl ||
      externalHttpUrl(getAttribute(link, "href")) ||
      "https://example.com/sponsor-hub";
    setAttribute(link, "href", url);
    setAttribute(link, "target", "_blank");
    setAttribute(link, "rel", "noopener noreferrer");
    setAttribute(
      link,
      "aria-label",
      String(link.textContent || "Sponsor Hub").trim() + " (opens in a new tab)",
    );
  });
  return { links: links };
}

function setupVenueLightboxes(
  page: HTMLElement,
  pageToken: number,
  documentRef: Document,
  windowRef: KbygWindow | null,
  cleanups: Cleanup[],
) {
  let links: HTMLElement[] = [];
  queryAll(page, ".kbyg-travel-gallery__image").forEach(function (image) {
    let source = externalHttpUrl(getAttribute(image, "src"));
    if (!source || !image.parentNode) return;
    let link = image.closest<HTMLAnchorElement>("a.w-lightbox");
    if (!link) {
      link = documentRef.createElement("a");
      image.parentNode.replaceChild(link, image);
      link.appendChild(image);
    }
    let data = query(link, ".w-json");
    if (!data) {
      data = documentRef.createElement("script");
      link.appendChild(data);
    }
    let configuration: Record<string, unknown> = {};
    try {
      const parsed: unknown = JSON.parse(data.textContent || "{}");
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
        configuration = parsed as Record<string, unknown>;
    } catch {
      // A native empty Lightbox still needs its CMS image configured.
    }
    if (!Array.isArray(configuration.items) || !configuration.items.length) {
      configuration.items = [
        { url: source, type: "image", caption: getAttribute(image, "alt") || "" },
      ];
    }
    configuration.group = configuration.group || "KBYG Venue Images " + pageToken;
    setAttribute(data, "type", "application/json");
    addClass(data, "w-json");
    data.textContent = JSON.stringify(configuration);
    addClasses(link, "kbyg-travel-gallery__lightbox w-inline-block w-lightbox");
    setAttribute(link, "href", source);
    setAttribute(link, "target", "_blank");
    setAttribute(link, "rel", "noopener noreferrer");
    setAttribute(
      link,
      "aria-label",
      "Open photo: " + (getAttribute(image, "alt") || "Event venue"),
    );
    setAttribute(link, "aria-haspopup", "dialog");
    links.push(link);
  });

  if (links.length && windowRef) {
    let destroyed = false;
    cleanups.push(function () {
      destroyed = true;
    });
    let webflow: WebflowRuntime = (windowRef.Webflow = windowRef.Webflow || ([] as (() => void)[]));
    function initialize() {
      if (destroyed || typeof webflow.require !== "function") return;
      let lightbox = webflow.require("lightbox");
      if (lightbox && typeof lightbox.ready === "function") lightbox.ready();
    }
    if (typeof webflow.push === "function") webflow.push(initialize);
    else initialize();
  }

  return { links: links };
}

export function initPage(page: HTMLElement | null, options?: InitOptions): KbygInstance | null {
  if (!page || typeof page.querySelectorAll !== "function") return null;
  const existing = (page as InitializedPage)[INSTANCE_KEY];
  if (existing) return existing;

  pageCounter += 1;
  let pageToken = pageCounter;
  let environment = getWindow(page, options);
  let cleanups: Cleanup[] = [];
  let audience = setupAudience(page, environment.window);
  let responsiveWelcomeTitle = setupResponsiveWelcomeTitle(page, environment.window, cleanups);
  let navigation = setupNavigation(
    page,
    pageToken,
    environment.document,
    environment.window,
    cleanups,
  );
  let accordions = setupAccordions(page, pageToken, environment.document, cleanups);
  let calendars = setupCalendars(page, environment.document, environment.window, cleanups);
  let keyDates = setupKeyDates(page, pageToken, environment.document, environment.window, cleanups);
  let venueLinks = setupVenueLinks(page, environment.document);
  let hubLinks = setupHubLinks(page);
  let venueLightboxes = setupVenueLightboxes(
    page,
    pageToken,
    environment.document,
    environment.window,
    cleanups,
  );
  setupIndustryIcons(page, environment.document);
  let fontAwesome = setupFontAwesome(page, environment.document, environment.window);
  let instance: KbygInstance = {
    page: page,
    navigation: navigation,
    accordions: accordions,
    calendars: calendars,
    keyDates: keyDates,
    venueLinks: venueLinks,
    hubLinks: hubLinks,
    venueLightboxes: venueLightboxes,
    fontAwesome: fontAwesome,
    audience: audience,
    responsiveWelcomeTitle: responsiveWelcomeTitle,
    destroy: function () {
      navigation.destroy();
      cleanups.splice(0).forEach(function (cleanup) {
        cleanup();
      });
      try {
        delete (page as InitializedPage)[INSTANCE_KEY];
      } catch {
        (page as InitializedPage)[INSTANCE_KEY] = null;
      }
    },
  };

  try {
    Object.defineProperty(page, INSTANCE_KEY, {
      configurable: true,
      value: instance,
    });
  } catch {
    (page as InitializedPage)[INSTANCE_KEY] = instance;
  }

  return instance;
}

export function init(
  root?: Document | HTMLElement | DocumentFragment | null,
  options?: InitOptions,
): KbygInstance[] {
  let scope = root || (typeof document !== "undefined" ? document : null);
  if (!scope) return [];

  let pages: HTMLElement[] = [];
  if ("matches" in scope && typeof scope.matches === "function" && scope.matches(".kbyg-page")) {
    pages.push(scope);
  }
  pages = pages.concat(queryAll(scope, ".kbyg-page"));

  return pages
    .map(function (page) {
      return initPage(page, options);
    })
    .filter((instance): instance is KbygInstance => instance !== null);
}

export function autoInit(documentRef: Document | null): void {
  if (!documentRef || (documentRef as InitializedDocument)[AUTO_INIT_KEY]) return;

  try {
    Object.defineProperty(documentRef, AUTO_INIT_KEY, {
      configurable: true,
      value: true,
    });
  } catch {
    (documentRef as InitializedDocument)[AUTO_INIT_KEY] = true;
  }

  if (documentRef.readyState === "loading") {
    documentRef.addEventListener(
      "DOMContentLoaded",
      function () {
        init(documentRef);
      },
      { once: true },
    );
  } else {
    init(documentRef);
  }
}

export const version = VERSION;
const kbyg = {
  version,
  autoInit,
  init,
  initPage,
  createICalendar,
  normalizeCalendarEvent,
  resolveAudience,
  escapeICalText,
  foldICalLine,
  utf8ByteLength,
  stableUid,
  findActiveSection,
};
export default kbyg;
