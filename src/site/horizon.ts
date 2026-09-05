function selectCard(cards: readonly HTMLElement[], selected: HTMLElement | null): void {
  cards.forEach((card) => {
    card.classList.toggle("selected", card === selected);
    card.style.outlineColor =
      card === selected ? (card.dataset.accentColor ?? "transparent") : "transparent";
  });
}

function selectOption(select: HTMLSelectElement | null, slug: string): void {
  const option = Array.from(select?.options ?? []).find((item) => item.dataset.slug === slug);
  if (option) option.selected = true;
}

export function initHorizon(doc: Document = document, search = window.location.search): void {
  const cards = Array.from(doc.querySelectorAll<HTMLElement>(".horizon-card-inner-wrap"));
  const select = doc.querySelector<HTMLSelectElement>("#field-institute");
  cards.forEach((card) => {
    card.style.outlineColor = "transparent";
    const button = card.querySelector(".horizon-selector-button");
    if (button) {
      const color = window.getComputedStyle(button).backgroundColor;
      if (color && color !== "rgba(0, 0, 0, 0)" && color !== "transparent")
        card.dataset.accentColor = color;
    }
    const event = card.querySelector<HTMLElement>(".event-info");
    const slug = event?.dataset.slug;
    const label = event?.dataset.label;
    if (select && slug && label) {
      const option = doc.createElement("option");
      option.textContent = label;
      option.value = label;
      option.dataset.slug = slug;
      select.add(option);
    }
    card.addEventListener("click", () => {
      selectCard(cards, card);
      if (slug) selectOption(select, slug);
    });
  });
  const requested = new URLSearchParams(search).get("i");
  if (requested) {
    const card = cards.find(
      (item) => item.querySelector<HTMLElement>(".event-info")?.dataset.slug === requested,
    );
    if (card) {
      selectCard(cards, card);
      selectOption(select, requested);
    }
  }
  select?.addEventListener("change", () => {
    const slug = select.selectedOptions[0]?.dataset.slug;
    const card = cards.find(
      (item) => item.querySelector<HTMLElement>(".event-info")?.dataset.slug === slug,
    );
    selectCard(cards, slug ? (card ?? null) : null);
  });
  doc
    .querySelectorAll<HTMLOptionElement>("select.company-size option:last-child")
    .forEach((option) => {
      option.hidden = true;
    });
  doc.querySelectorAll(".field").forEach((field) => {
    field.addEventListener("focus", () =>
      field.closest(".field-wrapper")?.classList.add("focused"),
    );
    field.addEventListener("blur", () =>
      field.closest(".field-wrapper")?.classList.remove("focused"),
    );
  });
}
