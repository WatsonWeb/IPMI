/** Supplements the published Horizon selector; does not initialize it again. */
export function initHorizonRouting(doc: Document = document): void {
  const select = doc.querySelector<HTMLSelectElement>("#field-institute");
  const recipient = doc.querySelector<HTMLInputElement>("#field-recipient");
  const category = doc.querySelector<HTMLInputElement>("#field-category");
  const form = select?.form;
  if (!select || !recipient || !category || !form || form.dataset.horizonRouting) return;
  form.dataset.horizonRouting = "1";

  const sync = () => {
    const kind = category.value.toLowerCase();
    const baseline = doc.querySelector<HTMLInputElement>(`#field-${kind}-address`)?.value ?? "";
    const hit =
      kind === "attend" && select.options[select.selectedIndex]?.dataset.slug === "hit-2027";
    const address = hit
      ? (doc
          .querySelector<HTMLElement>('.event-info[data-slug="hit-2027"]')
          ?.dataset.attendRecipient?.trim() ?? "")
      : baseline;
    // Empty CMS routing must not silently fall back to another person's inbox.
    recipient.value = address;
    select.setCustomValidity(
      hit && !address ? "Inquiry routing awaits the confirmed recipient." : "",
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
      target.closest(".horizon-card-inner-wrap, .form-category-link")
    )
      sync();
  });
  form.addEventListener("reset", () => queueMicrotask(sync));
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
