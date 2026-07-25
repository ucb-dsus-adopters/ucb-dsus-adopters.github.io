/* Small a11y fixes for Material theme elements we can't restyle alone. */
(function () {
  "use strict";

  function labelSearchDialog() {
    var search = document.querySelector(".md-search[role='dialog']");
    if (search && !search.getAttribute("aria-label")) {
      search.setAttribute("aria-label", "Search");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", labelSearchDialog);
  } else {
    labelSearchDialog();
  }
})();
