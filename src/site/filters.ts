// Institute and Recap lists intentionally use the same native filter controls.
export function initInstituteFilters(doc: Document = document): void {
  let filterClicked = false;
  const filterButton = doc.getElementById("filter-button");
  const filterButtons = doc.getElementById("filter-buttons");
  const trigger = (button: Element) => {
    const control =
      button.querySelector<HTMLElement>(".institute-filter-checkbox") ??
      button.querySelector<HTMLInputElement>('input[type="checkbox"]');
    control?.click();
  };
  filterButton?.addEventListener("click", () => {
    if (!filterButtons) return;
    filterButton.classList.toggle("active");
    filterButtons.classList.toggle("active");
  });
  doc
    .querySelectorAll(".institute-filter-checkbox")
    .forEach((control) => control.addEventListener("click", (event) => event.stopPropagation()));
  doc.querySelectorAll(".institute-filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      const checkbox = button.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (!checkbox) return;
      if (!filterClicked) {
        Array.from(button.parentElement?.children ?? [])
          .filter(
            (element) =>
              element !== button && element.classList.contains("institute-filter-button"),
          )
          .forEach((sibling) => {
            sibling.classList.remove("active");
            trigger(sibling);
          });
        filterClicked = true;
      } else {
        button.classList.toggle("active", !checkbox.checked);
        trigger(button);
      }
    });
  });
}
