'use strict';

/**
 * AAH — global.js
 * Compartido por TODAS las páginas. No poner acá nada que
 * dependa de elementos exclusivos de una sola página
 * (eso va en home.js, institucional.js, etc.)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
});

/* -----------------------------------------------------------
   Header con sombra al hacer scroll
----------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* -----------------------------------------------------------
   Menú móvil (hamburguesa)
----------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
}

/* -----------------------------------------------------------
   Scroll reveal genérico (IntersectionObserver)
   -----------------------------------------------------------
   Cualquier elemento con class="reveal-target" en cualquier
   página se anima solo. No hace falta tocar este archivo
   cuando se agregan páginas nuevas.
----------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-target');
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}