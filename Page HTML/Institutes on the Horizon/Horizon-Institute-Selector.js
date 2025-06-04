// Stores accent color on a data attribute and sets initial transparent outline
function setOutlineColors(cardWrappers) {
  cardWrappers.forEach((wrapper) => {
    // Set initial outline color to transparent for all cards
    wrapper.style.outlineColor = "transparent";

    const selectorButton = wrapper.querySelector(".horizon-selector-button");
    if (selectorButton) {
      // Use getComputedStyle to get the actual rendered background color of the button
      const accentColor =
        window.getComputedStyle(selectorButton).backgroundColor;
      // Ensure the fetched color is not transparent or empty before setting
      if (
        accentColor &&
        accentColor !== "rgba(0, 0, 0, 0)" &&
        accentColor !== "transparent"
      ) {
        wrapper.dataset.accentColor = accentColor;
      }
    }
  });
}

// Handles card selection with radio button behavior
function handleCardSelection(cardWrappers) {
  cardWrappers.forEach((wrapper) => {
    wrapper.addEventListener("click", function () {
      // Deselect all other cards and reset their outline color
      cardWrappers.forEach((card) => {
        card.classList.remove("selected");
        card.style.outlineColor = "transparent";
      });

      // Select the clicked card and set its outline color
      this.classList.add("selected");
      const accentColor = this.dataset.accentColor; // Read from data attribute
      if (accentColor) {
        this.style.outlineColor = accentColor;
      }

      // Update the select dropdown to match the clicked card
      const selectedEventInfo = this.querySelector(".event-info");
      if (selectedEventInfo) {
        const selectedSlug = selectedEventInfo.getAttribute("data-slug");
        const upcomingInstitutesSelect =
          document.getElementById("field-institute");

        if (upcomingInstitutesSelect && selectedSlug) {
          for (let i = 0; i < upcomingInstitutesSelect.options.length; i++) {
            const option = upcomingInstitutesSelect.options[i];
            if (option.getAttribute("data-slug") === selectedSlug) {
              option.selected = true;
              break; // Exit loop once the option is found and selected
            }
          }
        }
      }
    });
  });
}

// Auto-fills Upcoming Institutes dropdown from card data
function autoFillUpcomingInstitutes(cardWrappers) {
  const upcomingInstitutesSelect = document.getElementById("field-institute");

  if (upcomingInstitutesSelect && cardWrappers.length > 0) {
    cardWrappers.forEach((cardWrapper) => {
      const eventInfo = cardWrapper.querySelector(".event-info");
      if (eventInfo) {
        const slug = eventInfo.getAttribute("data-slug");
        const label = eventInfo.getAttribute("data-label");

        if (slug && label) {
          const newOption = new Option(label, label); // Set text and value to label
          newOption.setAttribute("data-slug", slug);
          upcomingInstitutesSelect.add(newOption);
        }
      }
    });
  }
}

// Hides the last (hidden) option in Company Size dropdowns
function setupCompanySizeField() {
  const companySizeSelects = document.querySelectorAll("select.company-size");
  companySizeSelects.forEach((select) => {
    const lastOption = select.querySelector("option:last-child");
    if (lastOption) {
      lastOption.hidden = true;
    }
  });
}

// Adds focus and blur event listeners to .field elements
function addFieldFocusBlurListeners() {
  const fields = document.querySelectorAll(".field");
  fields.forEach((field) => {
    field.addEventListener("focus", function () {
      const fieldWrapper = this.closest(".field-wrapper");
      if (fieldWrapper) {
        fieldWrapper.classList.add("focused");
      }
    });

    field.addEventListener("blur", function () {
      const fieldWrapper = this.closest(".field-wrapper");
      if (fieldWrapper) {
        fieldWrapper.classList.remove("focused");
      }
    });
  });
}

// Sets up the change event listener for the institute select dropdown
function setupInstituteSelectListener(upcomingInstitutesSelect, cardWrappers) {
  if (upcomingInstitutesSelect) {
    upcomingInstitutesSelect.addEventListener("change", function () {
      const selectedOption = this.options[this.selectedIndex];
      if (selectedOption) {
        const slugToSelect = selectedOption.getAttribute("data-slug");

        if (slugToSelect && cardWrappers.length > 0) {
          cardWrappers.forEach((card) => {
            card.classList.remove("selected");
            card.style.outlineColor = "transparent"; // Reset outline for all cards
            const eventInfo = card.querySelector(".event-info");
            if (
              eventInfo &&
              eventInfo.getAttribute("data-slug") === slugToSelect
            ) {
              card.classList.add("selected");
              const accentColor = card.dataset.accentColor; // Read from data attribute
              if (accentColor) {
                card.style.outlineColor = accentColor; // Set outline for the matching card
              }
            }
          });
        } else if (!slugToSelect && cardWrappers.length > 0) {
          // If the selected option has no slug (e.g. a placeholder), deselect all cards
          cardWrappers.forEach((card) => {
            card.classList.remove("selected");
            card.style.outlineColor = "transparent";
          });
        }
      }
    });
  }
}

// Auto-selects card based on URL parameter 'i'
function autoSelectFromURLParameter(cardWrappers) {
  const urlParams = new URLSearchParams(window.location.search);
  const instituteSlug = urlParams.get("i");

  if (instituteSlug && cardWrappers.length > 0) {
    cardWrappers.forEach((card) => {
      const eventInfo = card.querySelector(".event-info");
      if (eventInfo && eventInfo.getAttribute("data-slug") === instituteSlug) {
        // Deselect all other cards first
        cardWrappers.forEach((otherCard) => {
          otherCard.classList.remove("selected");
          otherCard.style.outlineColor = "transparent";
        });

        // Select the matching card
        card.classList.add("selected");
        const accentColor = card.dataset.accentColor;
        if (accentColor) {
          card.style.outlineColor = accentColor;
        }

        // Update the select dropdown to match
        const upcomingInstitutesSelect =
          document.getElementById("field-institute");
        if (upcomingInstitutesSelect) {
          for (let i = 0; i < upcomingInstitutesSelect.options.length; i++) {
            const option = upcomingInstitutesSelect.options[i];
            if (option.getAttribute("data-slug") === instituteSlug) {
              option.selected = true;
              break;
            }
          }
        }
      }
    });
  }
}

// Initializes all functionalities
document.addEventListener("DOMContentLoaded", function () {
  // Get all horizon card wrapper elements
  const cardWrappers = document.querySelectorAll(".horizon-card-inner-wrap");
  const upcomingInstitutesSelect = document.getElementById("field-institute");

  // Initialize all functionalities
  if (cardWrappers.length > 0) {
    setOutlineColors(cardWrappers);
    handleCardSelection(cardWrappers);
    autoFillUpcomingInstitutes(cardWrappers);
    // Auto-select card based on URL parameter after other setup is complete
    autoSelectFromURLParameter(cardWrappers);
  }
  setupCompanySizeField();
  addFieldFocusBlurListeners();
  setupInstituteSelectListener(upcomingInstitutesSelect, cardWrappers);
});
