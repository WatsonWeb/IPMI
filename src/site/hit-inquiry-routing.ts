/** Supplements published selectors without initializing forms or options again. */
export function initHitInquiryRouting(doc: Document = document): void {
  const select = doc.querySelector<HTMLSelectElement>("#field-institute");
  const recipient = doc.querySelector<HTMLInputElement>("#field-recipient");
  const category = doc.querySelector<HTMLInputElement>("#field-category");
  const form = select?.form;
  if (!select || !recipient || !category || !form || form.dataset.hitInquiryRouting) return;
  form.dataset.hitInquiryRouting = "1";

  const sync = () => {
    const kind = category.value.toLowerCase().replace(/^speaker$/, "speak");
    const baseline = doc.querySelector<HTMLInputElement>(`#field-${kind}-address`)?.value ?? "";
    const option = select.options[select.selectedIndex];
    const rows = Array.from(
      doc.querySelectorAll<HTMLElement>("#upcoming-institutes .upcoming-institute"),
    );
    // Generic Attend appends one option per native CMS row in order. Verify
    // position and full label; identity comes from its CMS slug, not its title.
    const row = rows[select.selectedIndex - 1];
    const label = row
      ? `${row.querySelector(".upcoming-institute-name")?.textContent ?? ""} - ${row.querySelector(".upcoming-institute-date")?.textContent ?? ""}`
      : "";
    const mapped =
      rows.length > 0 && select.options.length === rows.length + 1 && option?.value === label;
    const slug = rows.length ? (mapped ? row?.dataset.slug : undefined) : option?.dataset.slug;
    const hit = kind === "attend" && slug === "hit-2027";
    const unmatched =
      kind === "attend" && rows.length > 0 && select.selectedIndex > 0 && (!mapped || !slug);
    const address = hit
      ? ((rows.length
          ? row
          : doc.querySelector<HTMLElement>('.event-info[data-slug="hit-2027"]')
        )?.dataset.attendRecipient?.trim() ?? "")
      : unmatched
        ? ""
        : baseline;
    // Empty CMS routing must not silently fall back to another person's inbox.
    recipient.value = address;
    select.setCustomValidity(
      (hit && !address) || unmatched ? "Inquiry routing awaits the confirmed recipient." : "",
    );
  };
  select.addEventListener("change", sync);
  category.addEventListener("change", sync);
  // The live selector changes selected options without dispatching change.
  // Delegation runs after its card listener and any existing category listener.
  doc.addEventListener("click", (event) => {
    const target = event.target;
    if (
      target instanceof Element &&
      target.closest(
        ".horizon-card-inner-wrap, .form-category-link, #attend-button, #speak-button, #partner-button",
      )
    )
      sync();
  });
  form.addEventListener("reset", () => queueMicrotask(sync));
  // jQuery ready can populate Generic Attend after DOMContentLoaded.
  const observer = new MutationObserver(sync);
  observer.observe(select, { childList: true });
  form.addEventListener(
    "submit",
    (event) => {
      sync();
      if (!select.validity.valid) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );
  sync();
}
