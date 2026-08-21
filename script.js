/* ============================================================
   Nilay Kushawaha — personal site
   Theme toggle, mobile nav, scroll reveal, back-to-top
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Theme (dark by default, persisted) ---------- */
  var root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.textContent = theme === 'light' ? '🌙' : '☀️';
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      btn.title = btn.getAttribute('aria-label');
    }
  }

  function storedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(root.getAttribute('data-theme') || storedTheme() || 'dark');

    var toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next);
        try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
      });
    }

    /* ---------- Mobile nav ---------- */
    var navToggle = document.querySelector('.nav-toggle');
    var navbar = document.querySelector('.navbar');
    if (navToggle && navbar) {
      navToggle.addEventListener('click', function () {
        var open = navbar.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.textContent = open ? '✕' : '☰';
      });
      navbar.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          navbar.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.textContent = '☰';
        }
      });
    }

    /* ---------- Highlight the current page in the nav ---------- */
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === here || (here === 'index.html' && href === './')) a.classList.add('active');
    });

    /* ---------- Header shadow on scroll + back-to-top ---------- */
    var header = document.querySelector('.site-header');
    var toTop = document.getElementById('toTop');

    function onScroll() {
      var y = window.scrollY;
      if (header) header.classList.toggle('scrolled', y > 8);
      if (toTop) toTop.classList.toggle('show', y > 480);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ---------- Reveal on scroll ---------- */
    var targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('show'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i, 6) * 60 + 'ms';
      io.observe(el);
    });

    /* Failsafe: never leave content invisible if the observer misbehaves
       (bfcache restores, print, screenshot tools, odd viewports). */
    setTimeout(function () {
      targets.forEach(function (el) { el.classList.add('show'); });
    }, 2500);
  });
})();
