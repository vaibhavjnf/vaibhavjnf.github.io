/* Vaibhav Sharma — vaibhavjnf.github.io
   v3: preloader, arctic canvas scene, spotlight, scroll-spy, reveals,
   custom cursor, magnetic links, thumbnail tilt. Vanilla JS, no dependencies.
   Every enhancement is gated: reduced motion / touch / no-IO all fall back
   to the fully visible static page. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- preloader: count fast, lift the curtain, free the hero ---- */
  (function preloader() {
    var pre = document.getElementById("preloader");
    if (!pre) { document.body.classList.add("loaded"); return; }
    if (reduceMotion) {
      pre.classList.add("gone");
      document.body.classList.add("loaded");
      return;
    }
    var countEl = pre.querySelector(".pre-count");
    var barEl = document.getElementById("pre-bar-fill");
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      if (countEl) countEl.textContent = "100%";
      if (barEl) barEl.style.width = "100%";
      pre.classList.add("done");
      document.body.classList.add("loaded");
      setTimeout(function () { pre.classList.add("gone"); }, 950);
    }
    pre.addEventListener("click", finish);
    var start = null, DUR = 950;
    function tick(now) {
      if (done) return;
      if (start === null) start = now;
      var p = Math.min(1, (now - start) / DUR);
      var eased = 1 - Math.pow(1 - p, 3);
      if (countEl) countEl.textContent = Math.round(eased * 100) + "%";
      if (barEl) barEl.style.width = eased * 100 + "%";
      if (p < 1) requestAnimationFrame(tick); else finish();
    }
    requestAnimationFrame(tick);
    setTimeout(finish, 1600); /* hard cap: curtain never overstays */
  })();

  /* ---------- arctic canvas scene -------------------------------------- */
  (function scene() {
    var canvas = document.getElementById("bg-canvas");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* soft round sprite, pre-rendered once — particles are drawImage calls */
    var sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    var sctx = sprite.getContext("2d");
    var sg = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sg.addColorStop(0, "rgba(255,255,255,.85)");
    sg.addColorStop(0.35, "rgba(230,241,255,.30)");
    sg.addColorStop(1, "rgba(230,241,255,0)");
    sctx.fillStyle = sg;
    sctx.fillRect(0, 0, 64, 64);

    var W = 0, H = 0, parts = [], raf = null;
    var mx = 0, my = 0, px = 0, py = 0; /* mouse target + lerped parallax */
    var GLOWS = [
      { fx: 0.22, fy: 0.18, r: 0.55, c: "95,211,188",  a: 0.13, ph: 0.0, sp: 0.00011, depth: 14 },
      { fx: 0.82, fy: 0.30, r: 0.62, c: "110,170,255", a: 0.12, ph: 2.1, sp: 0.00009, depth: 22 },
      { fx: 0.55, fy: 0.88, r: 0.70, c: "45,90,160",   a: 0.15, ph: 4.2, sp: 0.00007, depth: 30 }
    ];

    function build() {
      var mobile = W < 640;
      var count = Math.round((W * H) / (mobile ? 55000 : 21000));
      count = Math.max(18, Math.min(mobile ? 42 : 110, count));
      parts = [];
      for (var i = 0; i < count; i++) {
        var z = 0.25 + Math.random() * 0.75; /* depth: .25 far → 1 near */
        parts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z: z,
          r: 0.7 + z * 2.0,
          vy: 0.10 + z * 0.38,
          sway: 0.5 + Math.random() * 1.4,
          ph: Math.random() * Math.PI * 2,
          a: 0.07 + z * 0.30
        });
      }
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduceMotion) draw(0); /* one static frame, no loop */
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var i, g, gx, gy, gr;
      for (i = 0; i < GLOWS.length; i++) {
        g = GLOWS[i];
        gx = g.fx * W + Math.sin(t * g.sp + g.ph) * 34 + px * g.depth;
        gy = g.fy * H + Math.cos(t * g.sp * 1.3 + g.ph) * 26 + py * g.depth;
        gr = g.r * Math.max(W, H);
        var rad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        rad.addColorStop(0, "rgba(" + g.c + "," + g.a + ")");
        rad.addColorStop(1, "rgba(" + g.c + ",0)");
        ctx.fillStyle = rad;
        ctx.fillRect(gx - gr, gy - gr, gr * 2, gr * 2);
      }
      for (i = 0; i < parts.length; i++) {
        var p = parts[i];
        var ox = Math.sin(t / 2400 + p.ph) * p.sway * 6 + px * 26 * p.z;
        var oy = py * 18 * p.z;
        ctx.globalAlpha = p.a;
        var s = p.r * 3.2;
        ctx.drawImage(sprite, p.x + ox - s / 2, p.y + oy - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    }

    function frame(t) {
      px += (mx - px) * 0.045;
      py += (my - py) * 0.045;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y += p.vy;
        p.x += Math.sin(t / 2600 + p.ph) * 0.08;
        if (p.y > H + 8) { p.y = -8; p.x = Math.random() * W; }
        if (p.x > W + 8) p.x = -8; else if (p.x < -8) p.x = W + 8;
      }
      draw(t);
      raf = requestAnimationFrame(frame);
    }

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 180);
    });

    resize();
    if (reduceMotion) return;

    if (finePointer) {
      document.addEventListener("mousemove", function (e) {
        mx = e.clientX / W - 0.5;
        my = e.clientY / H - 0.5;
      });
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
      } else if (!raf) {
        raf = requestAnimationFrame(frame);
      }
    });
    raf = requestAnimationFrame(frame);
  })();

  /* ---------- spotlight glow (v2 behaviour, desktop only) --------------- */
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

  /* ---------- scroll reveals -------------------------------------------- */
  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-motion");
    var revealItems = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    revealItems.forEach(function (el) {
      var parent = el.parentElement;
      if (parent && (parent.classList.contains("rows") || parent.classList.contains("method"))) {
        var idx = Array.prototype.indexOf.call(parent.children, el);
        el.style.transitionDelay = Math.min(idx, 5) * 80 + "ms";
      }
    });
    var revealer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          revealer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    revealItems.forEach(function (el) { revealer.observe(el); });
  }

  /* ---------- scroll-spy nav (v2 behaviour) ------------------------------ */
  var links = Array.prototype.slice.call(document.querySelectorAll(".spy-nav a[href^='#']"));
  if ("IntersectionObserver" in window && links.length > 0) {
    var byId = {};
    links.forEach(function (link) {
      byId[link.getAttribute("href").slice(1)] = link;
    });
    var spy = new IntersectionObserver(
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
      if (section) spy.observe(section);
    });
  }

  /* ---------- custom cursor + magnetic links + tile tilt ----------------- */
  if (!reduceMotion && finePointer) {
    document.body.classList.add("has-cursor");
    var dot = document.querySelector(".cursor-dot");
    var ring = document.querySelector(".cursor-ring");
    var cx = -100, cy = -100, rx = -100, ry = -100, cursorShown = false;
    document.addEventListener("mousemove", function (e) {
      cx = e.clientX; cy = e.clientY;
      if (!cursorShown) { /* stay invisible until the mouse really moves */
        cursorShown = true;
        rx = cx; ry = cy;
        document.body.classList.add("cursor-on");
      }
      if (dot) dot.style.transform = "translate(" + (cx - 3) + "px," + (cy - 3) + "px)";
    });
    (function cursorLoop() {
      rx += (cx - rx) * 0.16;
      ry += (cy - ry) * 0.16;
      if (ring) {
        var half = ring.classList.contains("is-active") ? 29 : 18;
        ring.style.transform = "translate(" + (rx - half) + "px," + (ry - half) + "px)";
      }
      requestAnimationFrame(cursorLoop);
    })();
    document.addEventListener("mouseover", function (e) {
      if (!ring) return;
      var hit = e.target && e.target.closest ? e.target.closest("a, button, .entry, .pub") : null;
      ring.classList.toggle("is-active", !!hit);
    });

    /* magnetic pull on identity/contact links */
    var magnetics = document.querySelectorAll(".socials a, .spy-nav a, .contact-links a");
    Array.prototype.forEach.call(magnetics, function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + x * 0.25 + "px," + y * 0.25 + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });

    /* subtle 3D tilt on project thumbnail tiles only */
    var thumbs = document.querySelectorAll(".entry.project .thumb");
    Array.prototype.forEach.call(thumbs, function (tile) {
      tile.addEventListener("mousemove", function (e) {
        var r = tile.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        tile.style.transform = "rotateY(" + dx * 10 + "deg) rotateX(" + -dy * 10 + "deg)";
      });
      tile.addEventListener("mouseleave", function () { tile.style.transform = ""; });
    });
  }
})();
