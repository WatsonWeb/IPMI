import {
  addDays,
  COVERAGE_END,
  dateLabel,
  dayOfWeek,
  eventsOn,
  monthStart,
  readCalendarEvents,
  shiftMonth,
  siteToday,
} from "./institutes-calendar-model";
import type { InstituteCalendarEvent } from "./institutes-calendar-model";

export function initInstitutesCalendar(
  doc: Document = document,
  now: () => Date = () => new Date(),
): void {
  const open = doc.querySelector<HTMLButtonElement>("[data-ipmi-calendar-open]");
  const dialog = doc.querySelector<HTMLDialogElement>("[data-ipmi-calendar-dialog]");
  const source = doc.getElementById("ipmi-calendar-data");
  if (!open || !dialog || !source || dialog.dataset.initialized) return;
  const grid = dialog.querySelector<HTMLElement>("[data-ipmi-calendar-grid]")!;
  const details = dialog.querySelector<HTMLElement>("[data-ipmi-calendar-details]")!;
  const monthLabel = dialog.querySelector<HTMLElement>("[data-ipmi-calendar-month]")!;
  const prev = dialog.querySelector<HTMLButtonElement>("[data-ipmi-calendar-prev]")!;
  const next = dialog.querySelector<HTMLButtonElement>("[data-ipmi-calendar-next]")!;
  const close = dialog.querySelector<HTMLButtonElement>("[data-ipmi-calendar-close]")!;
  if (!grid || !details || !monthLabel || !prev || !next || !close) return;
  dialog.dataset.initialized = "true";
  source.hidden = true;
  let today = siteToday(now());
  let lower = monthStart(today);
  let selected = today;
  let month = lower;
  let events: InstituteCalendarEvent[] = [];
  let previousOverflow = "";
  let scrollX = 0;
  let scrollY = 0;
  const view = doc.defaultView!;
  const element = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string) => {
    const node = doc.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const clamp = (date: string) =>
    date < lower ? lower : date > COVERAGE_END ? COVERAGE_END : date;
  function renderDetails() {
    details.replaceChildren(element("h3", dateLabel(selected, { weekday: "long" })));
    const matches = eventsOn(events, selected);
    if (!matches.length) {
      details.append(element("p", "No Institutes scheduled for this day."));
      return;
    }
    const list = element("ul");
    for (const event of matches) {
      const item = element("li");
      item.append(
        element("h4", event.title),
        element("p", `${dateLabel(event.start)} – ${dateLabel(event.end)}`),
        element("p", event.location),
      );
      if (event.horizon)
        item.append(element("p", "On the Horizon — registration is not yet available."));
      else if (event.url) {
        const link = element("a", `View ${event.title}`);
        link.href = event.url;
        item.append(link);
      }
      list.append(item);
    }
    details.append(list);
  }
  function render(focus = false) {
    monthLabel.textContent = dateLabel(month, { day: undefined });
    prev.disabled = month <= lower;
    next.disabled = month >= "2027-12-01";
    grid.replaceChildren();
    const headings = element("div");
    headings.setAttribute("role", "row");
    for (const day of ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]) {
      const heading = element("span", day);
      heading.setAttribute("role", "columnheader");
      headings.append(heading);
    }
    grid.append(headings);
    let date = addDays(month, -dayOfWeek(month));
    const last = addDays(shiftMonth(month, 1), -1);
    while (date <= last) {
      const row = element("div");
      row.setAttribute("role", "row");
      for (let weekday = 0; weekday < 7; weekday++) {
        const cell = element("div");
        cell.setAttribute("role", "gridcell");
        if (date.slice(0, 7) === month.slice(0, 7)) {
          const day = date;
          const count = eventsOn(events, day).length;
          const button = element("button", String(Number(day.slice(-2))));
          button.type = "button";
          button.dataset.date = day;
          button.tabIndex = day === selected ? 0 : -1;
          button.setAttribute(
            "aria-label",
            `${dateLabel(day, { weekday: "long" })}, ${count} ${count === 1 ? "Institute" : "Institutes"}`,
          );
          button.setAttribute("aria-pressed", String(day === selected));
          if (day === today) button.setAttribute("aria-current", "date");
          if (count) {
            button.dataset.hasEvents = "true";
            button.append(element("small", `${count}`));
          }
          button.addEventListener("click", () => {
            selected = day;
            render(true);
          });
          button.addEventListener("keydown", (event) => {
            let target: string;
            switch (event.key) {
              case "ArrowLeft":
                target = addDays(day, -1);
                break;
              case "ArrowRight":
                target = addDays(day, 1);
                break;
              case "ArrowUp":
                target = addDays(day, -7);
                break;
              case "ArrowDown":
                target = addDays(day, 7);
                break;
              case "Home":
                target = addDays(day, -dayOfWeek(day));
                break;
              case "End":
                target = addDays(day, 6 - dayOfWeek(day));
                break;
              case "PageUp":
                target = shiftMonth(day, -1);
                break;
              case "PageDown":
                target = shiftMonth(day, 1);
                break;
              default:
                return;
            }
            event.preventDefault();
            selected = clamp(target);
            month = monthStart(selected);
            render(true);
          });
          cell.append(button);
        }
        row.append(cell);
        date = addDays(date, 1);
      }
      grid.append(row);
    }
    renderDetails();
    if (focus)
      grid
        .querySelector<HTMLButtonElement>(`[data-date="${selected}"]`)
        ?.focus({ preventScroll: true });
  }
  function dismiss() {
    dialog!.close();
  }
  function availability() {
    today = siteToday(now());
    // Native collections cap at 100. Fail closed rather than advertise a potentially truncated calendar.
    open!.hidden =
      today > COVERAGE_END || source!.querySelectorAll("[data-ipmi-calendar-event]").length >= 100;
  }
  availability();
  open.addEventListener("click", () => {
    availability();
    if (open.hidden) return;
    lower = monthStart(today);
    selected = today;
    month = lower;
    events = readCalendarEvents(source, today);
    scrollX = view.scrollX;
    scrollY = view.scrollY;
    previousOverflow = doc.documentElement.style.overflow;
    doc.documentElement.style.overflow = "hidden";
    render();
    dialog.showModal();
    grid
      .querySelector<HTMLButtonElement>(`[data-date="${selected}"]`)
      ?.focus({ preventScroll: true });
  });
  prev.addEventListener("click", () => {
    selected = clamp(shiftMonth(selected, -1));
    month = monthStart(selected);
    render(month <= lower);
  });
  next.addEventListener("click", () => {
    selected = clamp(shiftMonth(selected, 1));
    month = monthStart(selected);
    render(month >= "2027-12-01");
  });
  close.addEventListener("click", dismiss);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    dismiss();
  });
  dialog.addEventListener("close", () => {
    doc.documentElement.style.overflow = previousOverflow;
    view.scrollTo(scrollX, scrollY);
    open.focus({ preventScroll: true });
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dismiss();
      return;
    }
    if (event.key !== "Tab") return;
    const controls = Array.from(
      dialog.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]"),
    ).filter((node) => node.tabIndex >= 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  view.addEventListener("pageshow", availability);
  doc.addEventListener("visibilitychange", () => {
    if (!doc.hidden && !dialog.open) availability();
  });
}
