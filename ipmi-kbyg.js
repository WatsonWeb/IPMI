(function (globalScope, factory) {
  "use strict";

  var api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (globalScope && globalScope.document) {
    globalScope.IPMIKBYG = api;
    api.autoInit(globalScope.document);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var VERSION = "1.0.0";
  var INSTANCE_KEY =
    typeof Symbol === "function"
      ? Symbol.for("ipmi.kbyg.page-instance")
      : "__ipmiKbygPageInstance__";
  var AUTO_INIT_KEY =
    typeof Symbol === "function" ? Symbol.for("ipmi.kbyg.auto-init") : "__ipmiKbygAutoInit__";
  var pageCounter = 0;

  function toArray(value) {
    return Array.prototype.slice.call(value || []);
  }

  function queryAll(root, selector) {
    if (!root || typeof root.querySelectorAll !== "function") return [];

    try {
      return toArray(root.querySelectorAll(selector));
    } catch {
      return [];
    }
  }

  function query(root, selector) {
    if (!root || typeof root.querySelector !== "function") return null;

    try {
      return root.querySelector(selector);
    } catch {
      return null;
    }
  }

  function getAttribute(element, name) {
    if (!element || typeof element.getAttribute !== "function") return null;
    return element.getAttribute(name);
  }

  function hasAttribute(element, name) {
    return Boolean(
      element && typeof element.hasAttribute === "function" && element.hasAttribute(name),
    );
  }

  function setAttribute(element, name, value) {
    if (element && typeof element.setAttribute === "function") {
      element.setAttribute(name, String(value));
    }
  }

  function removeAttribute(element, name) {
    if (element && typeof element.removeAttribute === "function") {
      element.removeAttribute(name);
    }
  }

  function addClass(element, className) {
    if (element && element.classList) element.classList.add(className);
  }

  function removeClass(element, className) {
    if (element && element.classList) element.classList.remove(className);
  }

  function hasClass(element, className) {
    return Boolean(
      element &&
      element.classList &&
      typeof element.classList.contains === "function" &&
      element.classList.contains(className),
    );
  }

  function toggleClass(element, className, enabled) {
    if (!element || !element.classList) return;

    if (typeof element.classList.toggle === "function") {
      element.classList.toggle(className, Boolean(enabled));
    } else if (enabled) {
      addClass(element, className);
    } else {
      removeClass(element, className);
    }
  }

  var FONT_AWESOME_IMAGE_MAP = [
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

  var FONT_AWESOME_JUMP_MAP = {
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

  function addClasses(element, classNames) {
    String(classNames || "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach(function (className) {
        addClass(element, className);
      });
  }

  function removeClasses(element, classNames) {
    String(classNames || "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach(function (className) {
        removeClass(element, className);
      });
  }

  function clearChildren(element) {
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

  function createFontAwesomeIcon(documentRef, iconName, weight, extraClasses) {
    if (!documentRef || typeof documentRef.createElement !== "function") return null;
    var icon = documentRef.createElement("span");
    addClasses(icon, "kbyg-fa " + (weight || "fa-light") + " fa-" + iconName);
    addClasses(icon, extraClasses);
    setAttribute(icon, "aria-hidden", "true");
    return icon;
  }

  function prependChild(parent, child) {
    if (!parent || !child) return;
    if (typeof parent.prepend === "function") parent.prepend(child);
    else if (parent.firstChild && typeof parent.insertBefore === "function") {
      parent.insertBefore(child, parent.firstChild);
    } else if (typeof parent.appendChild === "function") {
      parent.appendChild(child);
    }
  }

  function appendFontAwesomeIcon(parent, documentRef, iconName, weight, extraClasses) {
    var icon = createFontAwesomeIcon(documentRef, iconName, weight, extraClasses);
    if (icon && parent && typeof parent.appendChild === "function") parent.appendChild(icon);
    return icon;
  }

  function iconNameFromImage(image) {
    var source = String(getAttribute(image, "src") || "").toLowerCase();
    for (var index = 0; index < FONT_AWESOME_IMAGE_MAP.length; index += 1) {
      if (source.indexOf(FONT_AWESOME_IMAGE_MAP[index][0]) !== -1) {
        return FONT_AWESOME_IMAGE_MAP[index][1];
      }
    }
    return "";
  }

  function replaceCmsIconImage(image, documentRef) {
    var iconName = iconNameFromImage(image);
    var parent = image && image.parentNode;
    if (!iconName || !parent || typeof parent.replaceChild !== "function") return null;

    if (hasClass(parent, "kbyg-icon")) {
      clearChildren(parent);
      setAttribute(parent, "data-kbyg-font-awesome", iconName);
      appendFontAwesomeIcon(parent, documentRef, iconName, "fa-light");
      return parent;
    }

    var wrapper = documentRef.createElement("span");
    addClasses(wrapper, getAttribute(image, "class"));
    setAttribute(wrapper, "aria-hidden", "true");
    setAttribute(wrapper, "data-kbyg-font-awesome", iconName);
    appendFontAwesomeIcon(wrapper, documentRef, iconName, "fa-light");
    parent.replaceChild(wrapper, image);
    return wrapper;
  }

  function replaceGlyphWithFontAwesome(element, documentRef, iconName, weight) {
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

  function setHeadingSegments(heading, documentRef, segments) {
    if (!heading || !documentRef || typeof documentRef.createElement !== "function") return;
    clearChildren(heading);

    segments.forEach(function (segment) {
      var span = documentRef.createElement("span");
      if (segment.accent) addClass(span, "kbyg-accent");
      if (segment.breakBefore) addClass(span, "kbyg-title-break");
      if (segment.tabletBreak) addClass(span, "kbyg-tablet-break");
      span.textContent = segment.text;
      heading.appendChild(span);
    });
  }

  function setupFontAwesome(page, documentRef, windowRef) {
    var replacedImages = [];
    queryAll(page, "img.kbyg-icon, .kbyg-icon > img").forEach(function (image) {
      var replacement = replaceCmsIconImage(image, documentRef);
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

    queryAll(page, ".kbyg-travel-gallery__map, .kbyg-travel-gallery iframe").forEach(
      function (map) {
        setAttribute(map, "loading", "eager");
      },
    );

    queryAll(page, ".kbyg-jump__link").forEach(function (link) {
      if (query(link, ".kbyg-jump__icon")) return;
      var iconName = FONT_AWESOME_JUMP_MAP[readJumpValue(link)];
      if (!iconName) return;
      var wrapper = documentRef.createElement("span");
      addClass(wrapper, "kbyg-jump__icon");
      setAttribute(wrapper, "aria-hidden", "true");
      appendFontAwesomeIcon(wrapper, documentRef, iconName, "fa-light");
      prependChild(link, wrapper);
    });

    queryAll(page, "[data-kbyg-jump-form]").forEach(function (form) {
      if (query(form, ".kbyg-jump__select-icon")) return;
      var wrapper = documentRef.createElement("span");
      addClasses(wrapper, "kbyg-jump__icon kbyg-jump__select-icon");
      setAttribute(wrapper, "aria-hidden", "true");
      appendFontAwesomeIcon(wrapper, documentRef, "id-card", "fa-light");
      prependChild(form, wrapper);
    });

    queryAll(page, ".kbyg-button").forEach(function (button) {
      if (hasAttribute(button, "data-kbyg-calendar")) {
        clearChildren(button);
        appendFontAwesomeIcon(
          button,
          documentRef,
          "calendar-plus",
          "fa-regular",
          "kbyg-button__fa",
        );
        var label = documentRef.createElement("span");
        addClass(label, "kbyg-button__label");
        label.textContent = "ADD TO CALENDAR";
        button.appendChild(label);
        return;
      }

      var iconName = "";
      var weight = "fa-light";
      if (button.closest && button.closest(".kbyg-hero__actions")) {
        iconName = "arrow-down";
        weight = "fa-solid";
      } else if (hasClass(button, "kbyg-button--calendar-link")) {
        iconName = "calendar-check";
        weight = "fa-regular";
      } else if (button.closest && button.closest("#agenda")) {
        iconName = "calendar-clock";
        clearChildren(button);
        var agendaLabel = documentRef.createElement("span");
        addClass(agendaLabel, "kbyg-button__label");
        agendaLabel.textContent = "VIEW ";
        var fullLabel = documentRef.createElement("span");
        addClass(fullLabel, "kbyg-button__desktop-word");
        fullLabel.textContent = "FULL ";
        agendaLabel.appendChild(fullLabel);
        var instituteLabel = documentRef.createElement("span");
        instituteLabel.textContent = "INSTITUTE AGENDA";
        agendaLabel.appendChild(instituteLabel);
        button.appendChild(agendaLabel);
      } else if (hasClass(button, "kbyg-button--external")) {
        iconName = "arrow-up-right-from-square";
      }

      if (iconName && !query(button, ".kbyg-button__fa")) {
        var icon = createFontAwesomeIcon(documentRef, iconName, weight, "kbyg-button__fa");
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
      var wrapper = query(header, ".kbyg-agenda-card__icon");
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
      var strong = query(row, "strong");
      if (!strong || hasClass(row, "kbyg-agenda-card__row")) return;
      var time = String(strong.textContent || "").trim();
      var item = String(row.textContent || "")
        .slice(time.length)
        .replace(/^[\s\u2013\u2014-]+/, "")
        .trim();
      clearChildren(row);
      addClass(row, "kbyg-agenda-card__row");
      addClass(strong, "kbyg-agenda-card__time");
      strong.textContent = time;
      row.appendChild(strong);
      var itemSpan = documentRef.createElement("span");
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

    var heroTitle = query(page, ".kbyg-hero__title");
    if (heroTitle) {
      setHeadingSegments(heroTitle, documentRef, [
        { text: "Know Before You Go" },
        { accent: true, text: "." },
      ]);
    }

    var welcomeTitle = query(page, "#kbyg-welcome-title");
    if (welcomeTitle) {
      setHeadingSegments(welcomeTitle, documentRef, [
        { text: "Welcome, we’re excited to see you soon" },
        { accent: true, text: "!" },
      ]);
    }

    var agendaTitle = query(page, "#kbyg-agenda-title");
    if (agendaTitle) {
      setHeadingSegments(agendaTitle, documentRef, [
        { text: "Agenda At-A-Glance" },
        { accent: true, text: "." },
      ]);
    }

    var hubTitle = query(page, "#hub .kbyg-section__title");
    if (hubTitle) {
      setHeadingSegments(hubTitle, documentRef, [
        { text: String(hubTitle.textContent || "").replace(/\.$/, "") },
        { accent: true, text: "." },
      ]);
    }

    var supportTitle = query(page, "#sponsor-support .kbyg-section__title");
    if (supportTitle) {
      setHeadingSegments(supportTitle, documentRef, [
        { accent: true, text: "Sponsor Support" },
        { text: " Lives in the Hub." },
      ]);
    }

    if (getAttribute(page, "data-audience") === "sponsor") {
      var prepareTitle = query(page, "#kbyg-prepare-title-sponsor");
      if (prepareTitle) {
        setHeadingSegments(prepareTitle, documentRef, [
          { text: "Preparing for your Institute is as easy as " },
          { accent: true, text: "1-2-3." },
        ]);
      }

      var keyDatesTitle = query(page, "#kbyg-key-dates-title-sponsor");
      if (keyDatesTitle) {
        setHeadingSegments(keyDatesTitle, documentRef, [
          { text: "Key Dates & Deliverables" },
          { accent: true, text: "." },
        ]);
      }

      var travelTitle = query(page, "#kbyg-travel-title");
      if (travelTitle) {
        setHeadingSegments(travelTitle, documentRef, [
          { text: "Hotel & Travel" },
          { accent: true, text: "." },
        ]);
      }

      var experienceTitle = query(page, "#kbyg-experience-title-sponsor");
      if (experienceTitle) {
        setHeadingSegments(experienceTitle, documentRef, [
          { text: "Business Meetings & Onsite Experience" },
          { accent: true, text: "." },
        ]);
      }
    } else {
      var delegateAgendaIntro = query(page, "#agenda .kbyg-section__intro");
      if (delegateAgendaIntro) {
        delegateAgendaIntro.textContent = String(delegateAgendaIntro.textContent || "").replace(
          /Sponsor Hub/g,
          "Attendee Hub",
        );
      }

      var delegatePrepareTitle = query(page, "#kbyg-prepare-title-delegate");
      if (delegatePrepareTitle) {
        setHeadingSegments(delegatePrepareTitle, documentRef, [
          { tabletBreak: true, text: "Preparing for your Institute" },
          { text: " is as easy as " },
          { accent: true, text: "1-2-3." },
        ]);
      }
    }

    var contactTitle = query(page, "#contact .kbyg-contact__title");
    if (contactTitle) {
      setHeadingSegments(contactTitle, documentRef, [
        { text: "Questions Before You Go? " },
        { accent: true, breakBefore: true, text: "We’re Here to Help." },
      ]);
    }

    var fontAwesome = windowRef && windowRef.FontAwesome;
    if (fontAwesome && fontAwesome.dom && typeof fontAwesome.dom.i2svg === "function") {
      try {
        var conversion = fontAwesome.dom.i2svg({ node: page });
        if (conversion && typeof conversion.catch === "function") conversion.catch(function () {});
      } catch {
        // The kit's mutation observer will retry once its icon data is ready.
      }
    }

    return { replacedImages: replacedImages };
  }

  function addListener(target, type, listener, options, cleanups) {
    if (!target || typeof target.addEventListener !== "function") return;

    target.addEventListener(type, listener, options);
    cleanups.push(function () {
      if (typeof target.removeEventListener === "function") {
        target.removeEventListener(type, listener, options);
      }
    });
  }

  function tagName(element) {
    return String((element && element.tagName) || "").toUpperCase();
  }

  function parseBoolean(value, fallback) {
    if (value === null || typeof value === "undefined") return Boolean(fallback);
    if (typeof value === "boolean") return value;

    var normalized = String(value).trim().toLowerCase();
    if (normalized === "" && fallback === true) return true;
    if (["true", "1", "yes", "on"].indexOf(normalized) !== -1) return true;
    if (["false", "0", "no", "off"].indexOf(normalized) !== -1) return false;
    return Boolean(fallback);
  }

  function safeDecode(value) {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  function targetKey(value) {
    if (value === null || typeof value === "undefined") return "";

    var normalized = String(value).trim();
    if (!normalized) return "";

    var hashIndex = normalized.indexOf("#");
    if (hashIndex !== -1) normalized = normalized.slice(hashIndex + 1);

    return safeDecode(normalized).trim();
  }

  function slug(value, fallback) {
    var input = String(value || "");
    var normalized = (typeof input.normalize === "function" ? input.normalize("NFKD") : input)
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);

    return normalized || fallback;
  }

  function claimId(element, suggestedId, claimedIds, documentRef) {
    var currentId = String((element && element.id) || "").trim();
    var currentOwner =
      currentId && documentRef && typeof documentRef.getElementById === "function"
        ? documentRef.getElementById(currentId)
        : element;

    if (currentId && !claimedIds.has(currentId) && (!currentOwner || currentOwner === element)) {
      claimedIds.add(currentId);
      return currentId;
    }

    var base = slug(suggestedId, "kbyg-control");
    var candidate = base;
    var suffix = 2;

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

  function isSelect(element) {
    return tagName(element) === "SELECT";
  }

  function isNativeButton(element) {
    var name = tagName(element);
    return name === "BUTTON" || (name === "INPUT" && getAttribute(element, "type") !== "hidden");
  }

  function isNativeInteractive(element) {
    var name = tagName(element);
    return (
      isNativeButton(element) ||
      name === "SELECT" ||
      name === "TEXTAREA" ||
      (name === "A" && hasAttribute(element, "href"))
    );
  }

  function installKeyboardActivation(element, activate, cleanups) {
    if (isNativeButton(element)) return;

    if (!isNativeInteractive(element)) {
      if (!hasAttribute(element, "role")) setAttribute(element, "role", "button");
      if (!hasAttribute(element, "tabindex")) setAttribute(element, "tabindex", "0");
    }

    addListener(
      element,
      "keydown",
      function (event) {
        var key = event && (event.key || event.code);
        var isAnchor = tagName(element) === "A";
        var shouldActivate = key === " " || key === "Spacebar" || (!isAnchor && key === "Enter");

        if (!shouldActivate) return;
        if (event && typeof event.preventDefault === "function") event.preventDefault();
        activate(event);
      },
      false,
      cleanups,
    );
  }

  function getWindow(page, options) {
    var documentRef =
      (options && options.document) ||
      (page && page.ownerDocument) ||
      (typeof document !== "undefined" ? document : null);
    var windowRef =
      (options && options.window) ||
      (documentRef && documentRef.defaultView) ||
      (typeof window !== "undefined" ? window : null);

    return { document: documentRef, window: windowRef };
  }

  function normalizeAudience(value) {
    var audience = String(value || "")
      .trim()
      .toLowerCase();
    return audience === "delegate" || audience === "sponsor" ? audience : "";
  }

  function resolveAudience(page, windowRef) {
    var pathname = String((windowRef && windowRef.location && windowRef.location.pathname) || "")
      .toLowerCase()
      .replace(/\/+$/, "");
    var pathMatch = pathname.match(/-(delegate|sponsor)$/);

    return (
      normalizeAudience(pathMatch && pathMatch[1]) ||
      normalizeAudience(getAttribute(page, "data-audience")) ||
      "delegate"
    );
  }

  function setupAudience(page, windowRef) {
    var audience = resolveAudience(page, windowRef);
    setAttribute(page, "data-audience", audience);

    queryAll(page, "[data-kbyg-audience-branch]").forEach(function (branch) {
      var branchAudience = normalizeAudience(getAttribute(branch, "data-kbyg-audience-branch"));
      if (!branchAudience || branchAudience === audience) return;

      if (typeof branch.remove === "function") branch.remove();
      else if (branch.parentNode && typeof branch.parentNode.removeChild === "function") {
        branch.parentNode.removeChild(branch);
      }
    });

    return audience;
  }

  function prefersReducedMotion(windowRef) {
    if (!windowRef || typeof windowRef.matchMedia !== "function") return false;

    try {
      return windowRef.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  }

  function setupResponsiveWelcomeTitle(page, windowRef, cleanups) {
    var title = query(page, "#kbyg-welcome-title");
    if (!title || !windowRef || typeof windowRef.matchMedia !== "function") return null;

    var mediaQuery;
    try {
      mediaQuery = windowRef.matchMedia("(max-width: 991px)");
    } catch {
      return null;
    }

    var originalLabel = getAttribute(title, "aria-label");

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

  function numericCssValue(value) {
    var number = Number.parseFloat(String(value || ""));
    return Number.isFinite(number) && number > 0 ? number : 0;
  }

  function getStickyOffset(page, windowRef) {
    var offset = numericCssValue(getAttribute(page, "data-kbyg-scroll-offset"));
    var getStyle =
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
      "[data-kbyg-sticky], [data-kbyg-jump-nav], .kbyg-jump-nav, .kbyg-jump-navigation",
    ).forEach(function (element) {
      if (!element || typeof element.getBoundingClientRect !== "function") return;

      var rect = element.getBoundingClientRect();
      var style = null;
      if (getStyle) {
        try {
          style = getStyle(element);
        } catch {
          style = null;
        }
      }

      var position = style && style.position;
      var declaredTop = numericCssValue(style && style.top);
      var height = Math.max(0, Number(rect.height) || Number(rect.bottom) - Number(rect.top) || 0);
      var isSticky =
        hasAttribute(element, "data-kbyg-sticky") ||
        hasAttribute(element, "data-kbyg-jump-nav") ||
        position === "sticky" ||
        position === "fixed";

      if (!isSticky) return;

      if (position === "sticky" || position === "fixed") {
        offset = Math.max(offset, declaredTop + height);
      }

      if (Number(rect.top) <= offset + 1 && Number(rect.bottom) > 0) {
        offset = Math.max(offset, Number(rect.bottom));
      }
    });

    return Math.ceil(offset);
  }

  function scrollToSection(page, section, windowRef, behavior) {
    if (!section || typeof section.getBoundingClientRect !== "function") return false;

    var offset = getStickyOffset(page, windowRef);
    var rect = section.getBoundingClientRect();
    var currentScroll = Number((windowRef && (windowRef.scrollY || windowRef.pageYOffset)) || 0);
    var top = Math.max(0, currentScroll + Number(rect.top || 0) - offset);

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

  function findActiveSection(sectionRecords, stickyOffset, viewportHeight) {
    if (!sectionRecords.length) return null;

    var activationLine =
      stickyOffset + Math.min(Math.max(Number(viewportHeight) || 0, 0) * 0.2, 160);
    var firstAhead = null;
    var active = null;

    sectionRecords.forEach(function (record) {
      if (!record.element || typeof record.element.getBoundingClientRect !== "function") return;
      var rect = record.element.getBoundingClientRect();

      if (!firstAhead && Number(rect.bottom) > stickyOffset) firstAhead = record;
      if (Number(rect.top) <= activationLine && Number(rect.bottom) > stickyOffset) active = record;
    });

    return active || firstAhead || sectionRecords[sectionRecords.length - 1];
  }

  function isAtDocumentEnd(documentRef, windowRef) {
    if (!documentRef || !windowRef) return false;
    var root = documentRef.documentElement;
    var body = documentRef.body;
    var documentHeight = Math.max(
      Number(root && root.scrollHeight) || 0,
      Number(body && body.scrollHeight) || 0,
    );
    var viewportBottom =
      Number(windowRef.scrollY || windowRef.pageYOffset) + Number(windowRef.innerHeight || 0);

    return documentHeight > 0 && viewportBottom >= documentHeight - 2;
  }

  function readJumpValue(control) {
    if (isSelect(control)) return targetKey(control.value);

    return (
      targetKey(getAttribute(control, "data-kbyg-jump")) || targetKey(getAttribute(control, "href"))
    );
  }

  function ensureSelectLabel(select) {
    if (
      hasAttribute(select, "aria-label") ||
      hasAttribute(select, "aria-labelledby") ||
      (select.labels && select.labels.length)
    ) {
      return;
    }

    setAttribute(
      select,
      "aria-label",
      getAttribute(select, "data-kbyg-label") || "Jump to section",
    );
  }

  function setSelectToSection(select, record) {
    var options = toArray(select.options || queryAll(select, "option"));
    var match = options.find(function (option) {
      return record.keys.has(targetKey(option.value));
    });

    if (match) select.value = match.value;
  }

  function isModifiedClick(event) {
    return Boolean(
      event &&
      ((typeof event.button === "number" && event.button !== 0) ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey),
    );
  }

  function setupNavigation(page, pageToken, documentRef, windowRef, cleanups) {
    var claimedIds = new Set();
    var sections = queryAll(page, "[data-kbyg-section]").map(function (section, index) {
      var declaredKey = targetKey(getAttribute(section, "data-kbyg-section"));
      var suggestedId = declaredKey || "kbyg-section-" + pageToken + "-" + (index + 1);
      var id = claimId(section, suggestedId, claimedIds, documentRef);
      var keys = new Set([id]);
      if (declaredKey) keys.add(declaredKey);

      return { element: section, id: id, keys: keys };
    });
    var controls = queryAll(page, "[data-kbyg-jump]");
    var selects = controls.filter(isSelect);
    var links = controls.filter(function (control) {
      return !isSelect(control);
    });
    var activeRecord = null;
    var frameId = null;
    var destroyed = false;

    function recordForKey(key) {
      var normalized = targetKey(key);
      if (!normalized) return null;

      return (
        sections.find(function (record) {
          return record.keys.has(normalized);
        }) || null
      );
    }

    function updateControls(record) {
      if (!record || activeRecord === record) return;
      activeRecord = record;
      setAttribute(page, "data-kbyg-active-section", record.id);

      links.forEach(function (control) {
        var linkedRecord = recordForKey(readJumpValue(control));
        var isActive = linkedRecord === record;
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

      var active = isAtDocumentEnd(documentRef, windowRef)
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

    function updateHash(record) {
      if (!windowRef || !windowRef.location) return;
      var nextHash = "#" + encodeURIComponent(record.id);
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

    function navigate(record, options) {
      if (!record) return false;
      var navigationOptions = options || {};
      var behavior =
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

    links.forEach(function (control) {
      function activate(event) {
        if (isModifiedClick(event)) return;
        var record = recordForKey(readJumpValue(control));
        if (!record) return;
        if (event && typeof event.preventDefault === "function") event.preventDefault();
        navigate(record);
      }

      addListener(control, "click", activate, false, cleanups);
      installKeyboardActivation(control, activate, cleanups);
    });

    addListener(windowRef, "scroll", scheduleUpdate, { passive: true }, cleanups);
    addListener(windowRef, "resize", scheduleUpdate, { passive: true }, cleanups);
    addListener(
      windowRef,
      "hashchange",
      function () {
        var record = recordForKey(windowRef && windowRef.location && windowRef.location.hash);
        if (record) navigate(record, { updateHash: false, behavior: "auto" });
      },
      false,
      cleanups,
    );

    var hashRecord = recordForKey(windowRef && windowRef.location && windowRef.location.hash);
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
      navigateTo: function (key, options) {
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

  function accordionParts(item) {
    var trigger =
      query(item, "[data-kbyg-accordion-trigger]") ||
      query(item, ".kbyg-accordion__trigger") ||
      query(item, "button[aria-controls]") ||
      query(item, "button");
    var panel =
      query(item, "[data-kbyg-accordion-panel]") ||
      query(item, ".kbyg-accordion__panel") ||
      query(item, "[role='region']");

    if (!panel && trigger) panel = trigger.nextElementSibling;
    if (!trigger || !panel || trigger === panel) return null;

    return { item: item, trigger: trigger, panel: panel };
  }

  function initiallyExpanded(item, trigger) {
    var marker = query(item, "[data-kbyg-initially-expanded-marker]");
    if (marker && !hasClass(marker, "w-condition-invisible")) return true;

    if (hasAttribute(item, "data-initially-expanded")) {
      return parseBoolean(getAttribute(item, "data-initially-expanded"), true);
    }

    if (hasAttribute(item, "data-kbyg-initially-expanded")) {
      return parseBoolean(getAttribute(item, "data-kbyg-initially-expanded"), true);
    }

    return parseBoolean(getAttribute(trigger, "aria-expanded"), false);
  }

  function setupAccordions(page, pageToken, documentRef, cleanups) {
    var claimedIds = new Set();
    var accordions = queryAll(page, "[data-kbyg-accordion]").map(accordionParts).filter(Boolean);
    var openAccordion = null;

    function setExpanded(accordion, expanded) {
      var shouldExpand = Boolean(expanded);
      toggleClass(accordion.item, "is-open", shouldExpand);
      setAttribute(accordion.trigger, "aria-expanded", shouldExpand ? "true" : "false");
      accordion.panel.hidden = !shouldExpand;
      if (shouldExpand) removeAttribute(accordion.panel, "hidden");
      else setAttribute(accordion.panel, "hidden", "");
      if (shouldExpand) openAccordion = accordion;
      else if (openAccordion === accordion) openAccordion = null;
    }

    function toggle(accordion) {
      var willOpen = getAttribute(accordion.trigger, "aria-expanded") !== "true";

      if (willOpen) {
        accordions.forEach(function (candidate) {
          if (candidate !== accordion) setExpanded(candidate, false);
        });
      }

      setExpanded(accordion, willOpen);
    }

    accordions.forEach(function (accordion, index) {
      var base = "kbyg-accordion-" + pageToken + "-" + (index + 1);
      var triggerId = claimId(accordion.trigger, base + "-trigger", claimedIds, documentRef);
      var panelId = claimId(accordion.panel, base + "-panel", claimedIds, documentRef);

      setAttribute(accordion.trigger, "aria-controls", panelId);
      setAttribute(accordion.panel, "aria-labelledby", triggerId);
      setAttribute(accordion.panel, "role", "region");

      function activate(event) {
        if (event && typeof event.preventDefault === "function") event.preventDefault();
        toggle(accordion);
      }

      addListener(accordion.trigger, "click", activate, false, cleanups);
      installKeyboardActivation(accordion.trigger, activate, cleanups);
    });

    accordions.forEach(function (accordion) {
      var shouldOpen = !openAccordion && initiallyExpanded(accordion.item, accordion.trigger);
      setExpanded(accordion, shouldOpen);
    });

    return {
      items: accordions,
      open: function (index) {
        var accordion = accordions[index];
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

  function utf8ByteLength(value) {
    var length = 0;

    for (var character of String(value)) {
      var point = character.codePointAt(0);
      if (point <= 0x7f) length += 1;
      else if (point <= 0x7ff) length += 2;
      else if (point <= 0xffff) length += 3;
      else length += 4;
    }

    return length;
  }

  function foldICalLine(line) {
    var parts = [];
    var current = "";
    var currentBytes = 0;
    var byteLimit = 75;

    for (var character of String(line)) {
      var characterBytes = utf8ByteLength(character);

      if (current && currentBytes + characterBytes > byteLimit) {
        parts.push(current);
        current = character;
        currentBytes = characterBytes;
        byteLimit = 74;
      } else {
        current += character;
        currentBytes += characterBytes;
      }
    }

    parts.push(current);
    return parts.join("\r\n ");
  }

  function escapeICalText(value) {
    return String(value === null || typeof value === "undefined" ? "" : value)
      .replace(/\\/g, "\\\\")
      .replace(/\r\n|\r|\n/g, "\\n")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,");
  }

  function pad(number, width) {
    return String(number).padStart(width || 2, "0");
  }

  function daysInMonth(year, month) {
    if (month === 2) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
    }
    return [4, 6, 9, 11].indexOf(month) !== -1 ? 30 : 31;
  }

  function validDateParts(year, month, day) {
    return (
      Number.isInteger(year) &&
      year >= 1 &&
      year <= 9999 &&
      Number.isInteger(month) &&
      month >= 1 &&
      month <= 12 &&
      Number.isInteger(day) &&
      day >= 1 &&
      day <= daysInMonth(year, month)
    );
  }

  function parseDateOnly(value) {
    var match = String(value || "")
      .trim()
      .match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;

    var parts = {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
    };

    if (!validDateParts(parts.year, parts.month, parts.day)) return null;
    parts.iso = pad(parts.year, 4) + "-" + pad(parts.month) + "-" + pad(parts.day);
    parts.value = pad(parts.year, 4) + pad(parts.month) + pad(parts.day);
    parts.serial = Date.UTC(parts.year, parts.month - 1, parts.day);
    return parts;
  }

  function parseDisplayDate(value) {
    var match = String(value || "")
      .trim()
      .match(
        /^(?:[A-Za-z]+,\s*)?(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s*(\d{4})$/i,
      );
    if (!match) return null;

    var monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    var month = monthNames.indexOf(match[1].toLowerCase()) + 1;
    return parseDateOnly(match[3] + "-" + pad(month) + "-" + pad(Number(match[2])));
  }

  function addDays(parts, amount) {
    var date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + amount));
    return parseDateOnly(
      pad(date.getUTCFullYear(), 4) +
        "-" +
        pad(date.getUTCMonth() + 1) +
        "-" +
        pad(date.getUTCDate()),
    );
  }

  function utcPartsFromMilliseconds(milliseconds) {
    var date = new Date(milliseconds);
    if (!Number.isFinite(date.getTime())) return null;

    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
      second: date.getUTCSeconds(),
    };
  }

  function formatDateTimeParts(parts, isUtc) {
    return (
      pad(parts.year, 4) +
      pad(parts.month) +
      pad(parts.day) +
      "T" +
      pad(parts.hour) +
      pad(parts.minute) +
      pad(parts.second) +
      (isUtc ? "Z" : "")
    );
  }

  function parseDateTime(value) {
    var match = String(value || "")
      .trim()
      .match(
        /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,9})?)?(?:\s*(Z|[+-]\d{2}:?\d{2}))?$/i,
      );

    if (!match) return null;

    var parts = {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
      hour: Number(match[4]),
      minute: Number(match[5]),
      second: Number(match[6] || 0),
    };
    var zone = String(match[7] || "").toUpperCase();

    if (
      !validDateParts(parts.year, parts.month, parts.day) ||
      parts.hour > 23 ||
      parts.minute > 59 ||
      parts.second > 59
    ) {
      return null;
    }

    var serial = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    );
    var isUtc = Boolean(zone);

    if (zone && zone !== "Z") {
      var zoneMatch = zone.match(/^([+-])(\d{2}):?(\d{2})$/);
      var zoneHours = zoneMatch ? Number(zoneMatch[2]) : 99;
      var zoneMinutes = zoneMatch ? Number(zoneMatch[3]) : 99;
      if (!zoneMatch || zoneHours > 23 || zoneMinutes > 59) return null;
      var offset = (zoneHours * 60 + zoneMinutes) * 60 * 1000;
      serial += zoneMatch[1] === "+" ? -offset : offset;
      parts = utcPartsFromMilliseconds(serial);
    }

    return {
      isUtc: isUtc,
      serial: serial,
      parts: parts,
      value: formatDateTimeParts(parts, isUtc),
    };
  }

  function addHour(dateTime) {
    var parts = utcPartsFromMilliseconds(dateTime.serial + 60 * 60 * 1000);
    return {
      isUtc: dateTime.isUtc,
      serial: dateTime.serial + 60 * 60 * 1000,
      parts: parts,
      value: formatDateTimeParts(parts, dateTime.isUtc),
    };
  }

  function harmonizeEnd(start, end) {
    if (!end) return addHour(start);
    if (start.isUtc === end.isUtc) return end.serial > start.serial ? end : addHour(start);

    var adjusted = {
      isUtc: start.isUtc,
      serial: end.serial,
      parts: end.parts,
      value: formatDateTimeParts(end.parts, start.isUtc),
    };
    return adjusted.serial > start.serial ? adjusted : addHour(start);
  }

  function hashString(value) {
    var hash = 0x811c9dc5;
    var bytes = [];

    for (var character of String(value)) {
      var point = character.codePointAt(0);
      if (point <= 0x7f) {
        bytes.push(point);
      } else if (point <= 0x7ff) {
        bytes.push(0xc0 | (point >> 6), 0x80 | (point & 0x3f));
      } else if (point <= 0xffff) {
        bytes.push(0xe0 | (point >> 12), 0x80 | ((point >> 6) & 0x3f), 0x80 | (point & 0x3f));
      } else {
        bytes.push(
          0xf0 | (point >> 18),
          0x80 | ((point >> 12) & 0x3f),
          0x80 | ((point >> 6) & 0x3f),
          0x80 | (point & 0x3f),
        );
      }
    }

    bytes.forEach(function (byte) {
      hash ^= byte;
      hash = Math.imul(hash, 0x01000193);
    });

    return (hash >>> 0).toString(16).padStart(8, "0");
  }

  function stableUid(event) {
    var identity = [
      event.context || "",
      event.eventId || "",
      event.title,
      event.startValue,
      event.endValue,
      event.allDay ? "all-day" : "timed",
      event.location,
      event.description,
    ].join("\u001f");
    var reverseIdentity = Array.from(identity).reverse().join("");
    return "kbyg-" + hashString(identity) + hashString(reverseIdentity) + "@ipmievents.com";
  }

  function normalizeCalendarEvent(input) {
    var raw = input || {};
    var title = String(raw.title || raw.summary || "IPMI Event").trim() || "IPMI Event";
    var startRaw = String(raw.start || raw.startDate || "").trim();
    var inferredAllDay = /^\d{4}-\d{2}-\d{2}$/.test(startRaw);
    var allDay = parseBoolean(raw.allDay, inferredAllDay);
    var normalized = {
      context: String(raw.context || "")
        .replace(/[\r\n\u2028\u2029]+/g, "")
        .trim(),
      eventId: String(raw.eventId || raw.id || "")
        .replace(/[\r\n\u2028\u2029]+/g, "")
        .trim(),
      title: title,
      description: String(raw.description || "").trim(),
      location: String(raw.location || "").trim(),
      url: String(raw.url || "").trim(),
      allDay: allDay,
      filename: String(raw.filename || "").trim(),
    };

    if (allDay) {
      var startDate = parseDateOnly(startRaw);
      if (!startDate) throw new TypeError("A valid calendar start date is required.");

      var endDate = parseDateOnly(raw.end || raw.endDate);
      if (!endDate || endDate.serial < startDate.serial) endDate = startDate;
      endDate = addDays(endDate, 1);
      normalized.startValue = startDate.value;
      normalized.endValue = endDate.value;
    } else {
      var startDateTime = parseDateTime(startRaw);
      if (!startDateTime) throw new TypeError("A valid ISO-8601 calendar start time is required.");

      var endDateTime = harmonizeEnd(startDateTime, parseDateTime(raw.end || raw.endDate));
      normalized.startValue = startDateTime.value;
      normalized.endValue = endDateTime.value;
      normalized.utc = startDateTime.isUtc;
    }

    normalized.uid =
      String(raw.uid || "")
        .replace(/[\r\n]/g, "")
        .trim() || stableUid(normalized);
    normalized.filename =
      slug(normalized.filename.replace(/\.ics$/i, "") || title, "ipmi-event") + ".ics";
    return normalized;
  }

  function formatUtcDate(date) {
    var value = date instanceof Date ? date : new Date(date);
    if (!Number.isFinite(value.getTime())) value = new Date();

    return formatDateTimeParts(
      {
        year: value.getUTCFullYear(),
        month: value.getUTCMonth() + 1,
        day: value.getUTCDate(),
        hour: value.getUTCHours(),
        minute: value.getUTCMinutes(),
        second: value.getUTCSeconds(),
      },
      true,
    );
  }

  function createICalendar(input, options) {
    var event =
      input && input.startValue && input.endValue && input.uid
        ? input
        : normalizeCalendarEvent(input);
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//IPMI//Know Before You Go//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:" + escapeICalText(event.uid),
      "DTSTAMP:" + formatUtcDate(options && options.now),
    ];

    if (event.allDay) {
      lines.push("DTSTART;VALUE=DATE:" + event.startValue);
      lines.push("DTEND;VALUE=DATE:" + event.endValue);
    } else {
      lines.push("DTSTART:" + event.startValue);
      lines.push("DTEND:" + event.endValue);
    }

    lines.push("SUMMARY:" + escapeICalText(event.title));
    if (event.description) lines.push("DESCRIPTION:" + escapeICalText(event.description));
    if (event.location) lines.push("LOCATION:" + escapeICalText(event.location));
    if (event.url) lines.push("URL:" + event.url.replace(/[\r\n\u2028\u2029]+/g, ""));
    lines.push("STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR");

    return lines.map(foldICalLine).join("\r\n") + "\r\n";
  }

  function calendarDataFromElement(control) {
    var rawValue = String(getAttribute(control, "data-kbyg-calendar") || "").trim();
    var embedded = {};

    if (rawValue.charAt(0) === "{") {
      try {
        embedded = JSON.parse(rawValue);
      } catch {
        embedded = {};
      }
    }

    function field(name, aliases) {
      if (embedded[name] !== null && typeof embedded[name] !== "undefined") {
        return embedded[name];
      }

      var attributeNames = aliases || ["data-kbyg-" + name.replace(/[A-Z]/g, "-$&").toLowerCase()];
      for (var index = 0; index < attributeNames.length; index += 1) {
        var value = getAttribute(control, attributeNames[index]);
        if (value !== null && value !== "") return value;
      }

      return "";
    }

    var item =
      control && typeof control.closest === "function"
        ? control.closest("[data-kbyg-calendar-item]")
        : null;
    var titleElement = query(item, "[data-kbyg-calendar-title]");
    var descriptionElement = query(item, "[data-kbyg-calendar-description]");
    var fallbackTitle = String(
      (titleElement && (titleElement.textContent || titleElement.innerText)) ||
        (control && (control.textContent || control.innerText)) ||
        "",
    ).trim();
    var fallbackDescription = String(
      (descriptionElement && (descriptionElement.textContent || descriptionElement.innerText)) ||
        "",
    ).trim();
    var allDay = field("allDay", ["data-kbyg-all-day", "data-kbyg-calendar-all-day"]);
    var start = field("start", ["data-kbyg-start", "data-kbyg-calendar-start"]);
    var end = field("end", ["data-kbyg-end", "data-kbyg-calendar-end"]);
    var card =
      control && typeof control.closest === "function" ? control.closest(".kbyg-date-card") : null;
    var displayDateElement = query(card, ".kbyg-date-card__display-date");
    var displayDate = parseDisplayDate(
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

  function triggerDownload(control, calendar, filename, documentRef, windowRef) {
    var BlobConstructor =
      (windowRef && windowRef.Blob) || (typeof Blob !== "undefined" ? Blob : null);
    var urlApi =
      (windowRef && (windowRef.URL || windowRef.webkitURL)) ||
      (typeof URL !== "undefined" ? URL : null);
    var downloadUrl = "";
    var shouldRevoke = false;

    if (BlobConstructor && urlApi && typeof urlApi.createObjectURL === "function") {
      var blob = new BlobConstructor([calendar], { type: "text/calendar;charset=utf-8" });
      downloadUrl = urlApi.createObjectURL(blob);
      shouldRevoke = true;
    } else {
      downloadUrl = "data:text/calendar;charset=utf-8," + encodeURIComponent(calendar);
    }

    var anchor =
      documentRef && typeof documentRef.createElement === "function"
        ? documentRef.createElement("a")
        : null;
    if (!anchor) return false;

    anchor.href = downloadUrl;
    anchor.download = filename;
    anchor.hidden = true;
    setAttribute(anchor, "aria-hidden", "true");

    var parent = documentRef.body || (control && control.parentNode);
    if (parent && typeof parent.appendChild === "function") parent.appendChild(anchor);
    if (typeof anchor.click === "function") anchor.click();
    if (typeof anchor.remove === "function") anchor.remove();
    else if (anchor.parentNode && typeof anchor.parentNode.removeChild === "function") {
      anchor.parentNode.removeChild(anchor);
    }

    if (shouldRevoke && typeof urlApi.revokeObjectURL === "function") {
      var schedule =
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

  function setupCalendars(page, documentRef, windowRef, cleanups) {
    var controls = queryAll(page, "[data-kbyg-calendar]");

    controls.forEach(function (control) {
      var labelData = calendarDataFromElement(control);
      var card =
        control && typeof control.closest === "function"
          ? control.closest(".kbyg-date-card")
          : null;
      var startDate = parseDateOnly(labelData.start);

      if (card && startDate) {
        var month = query(card, ".kbyg-date-card__month");
        var day = query(card, ".kbyg-date-card__day");
        var monthNames = [
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
        setAttribute(control, "aria-label", "Add " + labelData.title + " to calendar");
      }

      function download(event) {
        if (isModifiedClick(event)) return;
        if (event && typeof event.preventDefault === "function") event.preventDefault();

        try {
          var raw = calendarDataFromElement(control);
          raw.context =
            windowRef && windowRef.location ? String(windowRef.location.pathname || "") : "";
          var normalized = normalizeCalendarEvent(raw);
          var calendar = createICalendar(normalized);
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

  function setupIndustryIcons(page, documentRef) {
    var eventTitle = query(page, ".kbyg-hero__event");
    var industryMeta = query(documentRef, 'meta[name="kbyg-industry"]');
    var assetRoot = "https://cdn.prod.website-files.com/62f30d583ebbed2d6d47f9a5/";
    var industryIcons = {
      healthcare: assetRoot + "638989f462c2a24e78ab5665_IPMI-Healthcare-Icon.svg",
      "human resources": assetRoot + "63898af5538b8f3d9ad17d52_IPMI-HR-Icon.svg",
      "sales & marketing": assetRoot + "638989f40e53ef633be7b449_IPMI-Sales-Icon.svg",
      "environmental health & safety":
        assetRoot + "638989f342ab4a19e6bc4aad_IPMI-Environmental-Icon.svg",
      legal: assetRoot + "638989f3adcfdbfe3540efba_IPMI-Legal-Icon.svg",
    };
    var isSponsor = getAttribute(page, "data-audience") === "sponsor";

    queryAll(page, ".kbyg-hero__badge").forEach(function (badge) {
      if (
        !isSponsor &&
        !hasClass(badge, "kbyg-hero__badge--industry") &&
        !hasAttribute(badge, "data-kbyg-industry-icon-src")
      )
        return;

      var existing = query(badge, "img");
      var industry = String(
        getAttribute(badge, "data-kbyg-industry") ||
          getAttribute(page, "data-kbyg-industry") ||
          getAttribute(industryMeta, "content") ||
          "",
      )
        .trim()
        .toLowerCase();
      var source =
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

      var image = existing || documentRef.createElement("img");
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

  function setupKeyDates(page, pageToken, documentRef, windowRef, cleanups) {
    var section = query(page, "#key-dates");
    var claimedIds = new Set();
    var compactQuery =
      windowRef && typeof windowRef.matchMedia === "function"
        ? windowRef.matchMedia("(max-width: 991px)")
        : null;
    var records = queryAll(section, ".kbyg-dates-grid")
      .map(function (grid, index) {
        var branch = (grid.closest && grid.closest("[data-kbyg-audience-branch]")) || section;
        var control = query(branch, ".kbyg-button--calendar-link, [data-kbyg-dates-toggle]");
        var cards = queryAll(grid, ".kbyg-date-card");
        if (!control || !cards.length) return null;

        var items = cards.map(function (card) {
          return hasClass(card.parentNode, "w-dyn-item") ? card.parentNode : card;
        });
        var id = claimId(
          grid,
          "kbyg-dates-" + pageToken + "-" + (index + 1),
          claimedIds,
          documentRef,
        );
        var label = documentRef.createElement("span");
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

        var record = { grid: grid, control: control, cards: cards, items: items, expanded: false };

        function previewCount() {
          return compactQuery && compactQuery.matches ? 3 : 4;
        }

        function update() {
          var limit = previewCount();
          setAttribute(grid, "data-kbyg-dates-expanded", record.expanded ? "true" : "false");
          setAttribute(control, "aria-expanded", record.expanded ? "true" : "false");
          label.textContent = record.expanded ? "SHOW FEWER KEY DATES" : "VIEW ALL KEY DATES";
          control.hidden = items.length <= limit;
          items.forEach(function (item, itemIndex) {
            item.hidden = !record.expanded && itemIndex >= limit;
          });
        }

        function toggle(event) {
          if (isModifiedClick(event)) return;
          if (event && typeof event.preventDefault === "function") event.preventDefault();
          var firstRevealed = record.cards[previewCount()];
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
          } else if (typeof control.focus === "function") {
            control.focus({ preventScroll: true });
          }
        }

        addListener(control, "click", toggle, false, cleanups);
        installKeyboardActivation(control, toggle, cleanups);
        addListener(windowRef, "resize", update, false, cleanups);
        update();
        return record;
      })
      .filter(Boolean);

    return { records: records };
  }

  function externalHttpUrl(value) {
    var normalized = String(value || "").trim();
    if (!/^https?:\/\//i.test(normalized)) return "";
    try {
      return new URL(normalized).href;
    } catch {
      return "";
    }
  }

  function setupVenueLinks(page, documentRef) {
    var links = [];
    queryAll(
      page,
      "[data-kbyg-address], .kbyg-travel-card__meta-line > span:not(.kbyg-glyph)",
    ).forEach(function (address) {
      var text = String(address.textContent || "").trim();
      if (!text) return;
      var link = address;
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

  function setupHubLinks(page) {
    if (getAttribute(page, "data-audience") !== "sponsor") return { links: [] };
    var links = queryAll(
      page,
      "#hub .kbyg-button--external, #sponsor-support .kbyg-button--external",
    );
    links.forEach(function (link) {
      var explicitUrl =
        externalHttpUrl(getAttribute(link, "data-kbyg-hub-url")) ||
        externalHttpUrl(getAttribute(page, "data-kbyg-hub-url"));
      var url =
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

  function setupVenueLightboxes(page, pageToken, documentRef, windowRef, cleanups) {
    var links = [];
    queryAll(page, ".kbyg-travel-gallery__image").forEach(function (image) {
      var source = externalHttpUrl(getAttribute(image, "src"));
      if (!source || !image.parentNode) return;
      var link = image.closest && image.closest("a.w-lightbox");
      if (!link) {
        link = documentRef.createElement("a");
        image.parentNode.replaceChild(link, image);
        link.appendChild(image);
      }
      var data = query(link, ".w-json");
      if (!data) {
        data = documentRef.createElement("script");
        link.appendChild(data);
      }
      var configuration = {};
      try {
        configuration = JSON.parse(data.textContent || "{}") || {};
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
      var destroyed = false;
      cleanups.push(function () {
        destroyed = true;
      });
      var webflow = (windowRef.Webflow = windowRef.Webflow || []);
      function initialize() {
        if (destroyed || typeof webflow.require !== "function") return;
        var lightbox = webflow.require("lightbox");
        if (lightbox && typeof lightbox.ready === "function") lightbox.ready();
      }
      if (typeof webflow.push === "function") webflow.push(initialize);
      else initialize();
    }

    return { links: links };
  }

  function initPage(page, options) {
    if (!page || typeof page.querySelectorAll !== "function") return null;
    if (page[INSTANCE_KEY]) return page[INSTANCE_KEY];

    pageCounter += 1;
    var pageToken = pageCounter;
    var environment = getWindow(page, options);
    var cleanups = [];
    var audience = setupAudience(page, environment.window);
    var responsiveWelcomeTitle = setupResponsiveWelcomeTitle(page, environment.window, cleanups);
    var navigation = setupNavigation(
      page,
      pageToken,
      environment.document,
      environment.window,
      cleanups,
    );
    var accordions = setupAccordions(page, pageToken, environment.document, cleanups);
    var calendars = setupCalendars(page, environment.document, environment.window, cleanups);
    var keyDates = setupKeyDates(
      page,
      pageToken,
      environment.document,
      environment.window,
      cleanups,
    );
    var venueLinks = setupVenueLinks(page, environment.document);
    var hubLinks = setupHubLinks(page);
    var venueLightboxes = setupVenueLightboxes(
      page,
      pageToken,
      environment.document,
      environment.window,
      cleanups,
    );
    setupIndustryIcons(page, environment.document);
    var fontAwesome = setupFontAwesome(page, environment.document, environment.window);
    var instance = {
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
          delete page[INSTANCE_KEY];
        } catch {
          page[INSTANCE_KEY] = null;
        }
      },
    };

    try {
      Object.defineProperty(page, INSTANCE_KEY, {
        configurable: true,
        value: instance,
      });
    } catch {
      page[INSTANCE_KEY] = instance;
    }

    return instance;
  }

  function init(root, options) {
    var scope = root || (typeof document !== "undefined" ? document : null);
    if (!scope) return [];

    var pages = [];
    if (typeof scope.matches === "function" && scope.matches(".kbyg-page")) {
      pages.push(scope);
    }
    pages = pages.concat(queryAll(scope, ".kbyg-page"));

    return pages.map(function (page) {
      return initPage(page, options);
    });
  }

  function autoInit(documentRef) {
    if (!documentRef || documentRef[AUTO_INIT_KEY]) return;

    try {
      Object.defineProperty(documentRef, AUTO_INIT_KEY, {
        configurable: true,
        value: true,
      });
    } catch {
      documentRef[AUTO_INIT_KEY] = true;
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

  return {
    version: VERSION,
    autoInit: autoInit,
    init: init,
    initPage: initPage,
    createICalendar: createICalendar,
    normalizeCalendarEvent: normalizeCalendarEvent,
    resolveAudience: resolveAudience,
    escapeICalText: escapeICalText,
    foldICalLine: foldICalLine,
    utf8ByteLength: utf8ByteLength,
    stableUid: stableUid,
    findActiveSection: findActiveSection,
  };
});
