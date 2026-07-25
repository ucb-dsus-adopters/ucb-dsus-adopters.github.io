/* Click-to-load YouTube facade. Keeps the YouTube player iframe out of the
   DOM until the user activates the preview button, so accessibility scanners
   don't inherit YouTube's known aria-prohibited-attr / button-name failures. */
(function () {
  "use strict";

  var ALLOW =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

  function activate(button) {
    var id = button.getAttribute("data-youtube-id");
    if (!id) return;

    var title =
      button.getAttribute("data-title") ||
      (button.querySelector(".lite-youtube__label") || {}).textContent ||
      "YouTube video";

    var iframe = document.createElement("iframe");
    iframe.src =
      "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(id) +
      "?autoplay=1&rel=0";
    iframe.title = title.trim();
    iframe.allow = ALLOW;
    iframe.allowFullscreen = true;
    iframe.setAttribute("loading", "lazy");

    button.replaceWith(iframe);
    iframe.focus();
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest(".lite-youtube");
    if (!button || !button.closest(".video-wrapper")) return;
    activate(button);
  });
})();
