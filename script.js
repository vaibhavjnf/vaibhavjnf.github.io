/* Spotlight glow + scroll-spy nav. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* Spotlight: one radial glow that follows the cursor (desktop only). */
  if (!reduceMotion && finePointer) {
    var ticking = false;
    document.addEventListener("mousemove", function (e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        document.documentElement.style.setProperty("--mx", e.clientX + "px");
        document.documentElement.style.setProperty("--my", e.clientY + "px");
        ticking = false;
      });
    });
  } else {
    var spot = document.getElementById("spotlight");
    if (spot) spot.style.display = "none";
  }

  /* Scroll-spy: mark the nav link for the section currently in view. */
  var links = Array.prototype.slice.call(document.querySelectorAll(".spy-nav a[href^='#']"));
  if (!("IntersectionObserver" in window) || links.length === 0) return;

  var byId = {};
  links.forEach(function (link) {
    byId[link.getAttribute("href").slice(1)] = link;
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove("active"); });
        var link = byId[entry.target.id];
        if (link) link.classList.add("active");
      });
    },
    { rootMargin: "-35% 0px -60% 0px", threshold: 0 }
  );

  Object.keys(byId).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) observer.observe(section);
  });
})();
