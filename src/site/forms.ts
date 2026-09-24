type ValueField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function valueField(element: HTMLElement | null): ValueField | null {
  return element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
    ? element
    : null;
}

export function initFieldFocus(
  doc: Document = document,
  selector = ".field",
  wrapperSelector = ".field-wrapper",
): void {
  doc.querySelectorAll(selector).forEach((field) => {
    field.addEventListener("focus", () => field.closest(wrapperSelector)?.classList.add("focused"));
    field.addEventListener("blur", () =>
      field.closest(wrapperSelector)?.classList.remove("focused"),
    );
  });
}

export function initCategoryForms(
  options: { speakAsSpeaker?: boolean } = {},
  doc: Document = document,
): void {
  const companyFields = Array.from(doc.querySelectorAll<HTMLSelectElement>("select.company-size"));
  const categories = Array.from(doc.querySelectorAll<HTMLElement>(".form-category-link"));
  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  companyFields.forEach((select) => {
    const last = select.options[select.options.length - 1];
    if (last) last.hidden = true;
  });

  categories.forEach((category) => {
    category.addEventListener("click", (event) => {
      event.preventDefault();
      if (resetTimer !== undefined) clearTimeout(resetTimer);
      resetTimer = undefined;
      categories.forEach((item) => item.classList.toggle("active", item === category));
      const label = category.querySelector(".form-category-label")?.textContent ?? "";
      const fieldCategory = valueField(doc.getElementById("field-category"));
      if (fieldCategory)
        fieldCategory.value = options.speakAsSpeaker && label === "Speak" ? "Speaker" : label;

      const address = valueField(doc.getElementById(`field-${label.toLowerCase()}-address`))?.value;
      const recipient = valueField(doc.getElementById("field-recipient"));
      if (address && recipient) recipient.value = address;
      const hiddenClass = `hide-${label.toLowerCase()}`;
      doc.querySelectorAll(".field-wrapper").forEach((wrapper) => {
        // classList.contains rejects whitespace; comparing tokens preserves
        // labels with spaces without constructing an unsafe CSS selector.
        wrapper.classList.toggle(
          "hidden-field",
          Array.from(wrapper.classList).includes(hiddenClass),
        );
      });

      const reset = (last: boolean) =>
        companyFields.forEach((select) => {
          const option = select.options[last ? select.options.length - 1 : 0];
          if (option) select.value = option.value;
        });
      if (label === "Attend") reset(false);
      else {
        // A newer category choice must not be overwritten by an older timer.
        resetTimer = setTimeout(() => {
          reset(true);
          resetTimer = undefined;
        }, 200);
      }
    });
  });
  initFieldFocus(doc);
}

export function populateUpcomingInstitutes(doc: Document = document): void {
  const select = doc.querySelector<HTMLSelectElement>("#field-institute");
  if (!select) return;
  doc.querySelectorAll("#upcoming-institutes .upcoming-institute").forEach((item) => {
    const name = item.querySelector(".upcoming-institute-name")?.textContent ?? "";
    const date = item.querySelector(".upcoming-institute-date")?.textContent ?? "";
    const label = `${name} - ${date}`;
    const option = doc.createElement("option");
    option.value = label;
    option.textContent = label;
    select.append(option);
  });
}

export function decorateActiveCampaignFields(doc: Document = document): void {
  const form = doc.getElementById("activecampaign-form");
  if (!form) return;
  const addIcon = (field: Element, glyph: string) => {
    const wrapper = field.closest("._field-wrapper");
    if (!wrapper || field.nextElementSibling?.classList.contains("field-icon")) return;
    const icon = doc.createElement("div");
    icon.className = "field-icon circle accent-gradient";
    const text = doc.createElement("div");
    text.className = "fa-regular fa-xl";
    text.textContent = glyph;
    icon.append(text);
    wrapper.append(icon);
  };
  form
    .querySelectorAll('._form_element input[type="text"], ._form_element textarea')
    .forEach((field) => addIcon(field, ""));
  form.querySelectorAll("._form_element select").forEach((field) => addIcon(field, ""));
  for (const [id, glyph] of [
    ["firstname", ""],
    ["lastname", ""],
    ["jobtitle", ""],
    ["customer_account", ""],
    ["email", ""],
    ["phone", ""],
    ["date", ""],
    ["time", ""],
  ] as const) {
    const sibling = form.querySelector(`#${id}`)?.nextElementSibling;
    const icon = sibling?.classList.contains("field-icon")
      ? sibling.querySelector(".fa-regular")
      : null;
    if (icon) icon.textContent = glyph;
  }
}
