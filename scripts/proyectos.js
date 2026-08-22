'use strict';

/**
 * AAH — proyectos.js
 * Exclusivo de proyectos.html.
 *
 * Inicializa CUALQUIER cantidad de galerías con class="project-slider"
 * en la página — así que cuando se sumen más proyectos (cada uno con
 * su propio [data-slider]), no hace falta tocar este archivo.
 *
 * Cada foto lleva su texto en el atributo alt de la <img>; ese mismo
 * texto es el que se muestra como caption debajo de la galería.
 */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-slider]').forEach(initProjectSlider);
});

function initProjectSlider(root) {
  const slides = Array.from(root.querySelectorAll('.project-slide'));
  const dots = Array.from(root.querySelectorAll('[data-slider-dots] .project-dot'));
  const captionEl = root.querySelector('[data-slider-caption]');
  if (slides.length < 2) return;

  let current = 0;
  const AUTOPLAY_MS = 4500;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    if (dots[current]) {
      dots[current].classList.remove('is-active');
      dots[current].setAttribute('aria-selected', 'false');
    }

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('is-active');
    if (dots[current]) {
      dots[current].classList.add('is-active');
      dots[current].setAttribute('aria-selected', 'true');
    }
    if (captionEl) {
      const img = slides[current].querySelector('img');
      captionEl.textContent = img ? img.alt : '';
    }
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      resetAutoplay();
    });
  });

  let timer;
  function startAutoplay() {
    if (prefersReducedMotion) return;
    timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
  }
  function resetAutoplay() {
    clearInterval(timer);
    startAutoplay();
  }

  startAutoplay();
}