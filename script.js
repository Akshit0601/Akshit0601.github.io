(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- 1. Scroll reveal (staggered per parent) ---------- */
  var revealTargets = [
    ['.hero-media, .hero .role, .hero h1, .hero .summary, .hero-actions', ''],
    ['.sheet-id, section h2, .tj-hint', ''],
    ['.about-grid p, .specs', ''],
    ['.stack-group h3', ''],
    ['#stack .chip', 'pop'],
    ['.sheet', ''],
    ['.trivia-card', ''],
    ['.contact-grid .photo-frame, .tb-cell', ''],
    ['.quote-text, .quote-sub', ''],
    ['.case-head, .case-summary, .case-links, .case-body > *, .media-frame', '']
  ];
  var seen = new Map();
  revealTargets.forEach(function (t) {
    $$(t[0]).forEach(function (el) {
      if (el.classList.contains('rv')) return;
      var n = seen.get(el.parentNode) || 0;
      seen.set(el.parentNode, n + 1);
      el.classList.add('rv');
      if (t[1]) el.classList.add(t[1]);
      el.style.setProperty('--d', Math.min(n, 8) * 70 + 'ms');
    });
  });
  var rvs = $$('.rv');
  if (reduce || !('IntersectionObserver' in window)) {
    rvs.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rvs.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 2. Nav: progress bar + active link ---------- */
  var nav = $('header.nav');
  var bar = null;
  if (nav) { bar = document.createElement('div'); bar.className = 'nav-progress'; nav.appendChild(bar); }
  var links = $$('.nav-links a[href^="#"]');
  var spy = links.map(function (a) { return { a: a, s: $(a.getAttribute('href')) }; })
                 .filter(function (x) { return x.s; });

  /* ---------- 3. Trajectory rail ---------- */
  var tl = $('#traj');
  var items = tl ? $$('.tj-item', tl) : [];
  if (tl) {
    items.forEach(function (it) {
      var head = $('.tj-head', it);
      head.addEventListener('click', function () {
        var open = it.classList.toggle('open');
        head.setAttribute('aria-expanded', open);
        setTimeout(frame, 320);
      });
    });
  }

  /* ---------- 4. Parallax + closing lift ---------- */
  var graphics = $$('.bg-graphic');
  var closing = $('#closing');
  var sunburst = $('.sunburst');
  var leap = $('.leap-wrap');

  function clamp(v) { return Math.min(1, Math.max(0, v)); }

  function frame() {
    var vh = window.innerHeight, y = window.scrollY;
    var max = document.documentElement.scrollHeight - vh;

    if (bar) bar.style.setProperty('--sp', max > 0 ? clamp(y / max).toFixed(4) : 0);

    if (spy.length) {
      var cur = null;
      spy.forEach(function (x) { if (x.s.getBoundingClientRect().top < vh * 0.4) cur = x; });
      spy.forEach(function (x) { x.a.classList.toggle('active', x === cur); });
    }

    if (tl) {
      var anchor = vh * 0.5, r = tl.getBoundingClientRect();
      tl.style.setProperty('--p', clamp((anchor - r.top) / r.height).toFixed(4));
      items.forEach(function (it) {
        var b = it.getBoundingClientRect();
        it.classList.toggle('reached', b.top < vh * 0.8);
        it.classList.toggle('active', b.top < anchor && b.bottom > anchor);
      });
    }

    if (reduce) return;

    graphics.forEach(function (g) {
      var sec = g.parentNode.getBoundingClientRect();
      var offset = (sec.top + sec.height / 2 - vh / 2) * -0.08;
      g.style.setProperty('--py', offset.toFixed(1) + 'px');
    });

    if (closing && leap) {
      var c = closing.getBoundingClientRect();
      var t = clamp(1 - c.top / vh); // 0 as section enters, 1 when it fills the view
      leap.style.setProperty('--lift', (60 * (1 - t) - 20 * t).toFixed(1) + 'px');
      leap.style.setProperty('--shadow', (1 - 0.45 * t).toFixed(2));
      if (sunburst) sunburst.style.setProperty('--sb', (0.85 + 0.2 * t).toFixed(3));
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; frame(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', frame);
  frame();
})();