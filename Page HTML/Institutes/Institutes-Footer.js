document.addEventListener("DOMContentLoaded", function () {
  // Institute Filters
  let filterClicked = false;

  const filterButton = document.getElementById("filter-button");
  const filterButtons = document.getElementById("filter-buttons");
  const filterCheckboxes = document.querySelectorAll(".institute-filter-checkbox");
  const filterOptionButtons = document.querySelectorAll(".institute-filter-button");

  const triggerFilterCheckbox = function (button) {
    const checkboxTrigger =
      button.querySelector(".institute-filter-checkbox") ||
      button.querySelector('input[type="checkbox"]');

    if (checkboxTrigger) checkboxTrigger.click();
  };

  if (filterButton && filterButtons) {
    filterButton.addEventListener("click", function () {
      filterButton.classList.toggle("active");
      filterButtons.classList.toggle("active");
    });
  }

  filterCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  });

  filterOptionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const checkbox = button.querySelector('input[type="checkbox"]');
      if (!checkbox) return;

      if (!filterClicked) {
        const siblingButtons = Array.from(button.parentElement?.children || []).filter(
          function (el) {
            return el !== button && el.classList.contains("institute-filter-button");
          },
        );

        siblingButtons.forEach(function (siblingButton) {
          siblingButton.classList.remove("active");
          triggerFilterCheckbox(siblingButton);
        });

        filterClicked = true;
      } else if (checkbox.checked) {
        button.classList.remove("active");
        triggerFilterCheckbox(button);
      } else {
        button.classList.add("active");
        triggerFilterCheckbox(button);
      }
    });
  });
});
