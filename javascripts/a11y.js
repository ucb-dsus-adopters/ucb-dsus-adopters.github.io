/* Small a11y fixes for Material theme elements we can't restyle alone. */
(function () {
  "use strict";

  function labelSearchDialog() {
    var search = document.querySelector(".md-search[role='dialog']");
    if (search && !search.getAttribute("aria-label")) {
      search.setAttribute("aria-label", "Search");
    }
  }

  function decorateTeamSocialIcons() {
    document.querySelectorAll(".team-member a.team-social").forEach(function (link) {
      link.querySelectorAll("svg").forEach(function (svg) {
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
      });
    });

    // Footer social icon (Material only sets title=; some scanners want more).
    document.querySelectorAll("a.md-social__link").forEach(function (link) {
      if (!link.getAttribute("aria-label")) {
        var title = link.getAttribute("title") || "Social link";
        link.setAttribute("aria-label", title);
      }
      link.querySelectorAll("svg").forEach(function (svg) {
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
      });
    });
  }

  function run() {
    labelSearchDialog();
    decorateTeamSocialIcons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
