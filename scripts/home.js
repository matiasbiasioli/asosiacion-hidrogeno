'use strict';

/**
 * AAH — home.js
 * Exclusivo de index.html: slider del hero + formulario de contacto.
 * La descarga de PDFs vive en global.js (la usan varias páginas).
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initContactForm();
});

/* -----------------------------------------------------------
   Slider de imágenes del hero
   -----------------------------------------------------------
   Crossfade automático cada 6s + navegación manual por los
   puntos. Las imágenes son PLACEHOLDERS generados — reemplazar
   los archivos en assets/img/hero-1.jpg, hero-2.jpg y hero-3.jpg
   por las fotos reales del cliente (mismo nombre, sin tocar
   este archivo ni el HTML).
----------------------------------------------------------- */
function initHeroSlider() {
  const slider = document.getElementById('hero-slider');
  const dotsWrap = document.getElementById('hero-dots');
  if (!slider || !dotsWrap) return;

  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  const dots = Array.from(dotsWrap.querySelectorAll('.hero-dot'));
  if (slides.length < 2) return;

  let current = 0;
  const AUTOPLAY_MS = 6000;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      resetAutoplay();
    });
  });

  let timer;
  function startAutoplay() {
    if (prefersReducedMotion) return; // no autoplay si el usuario prefiere menos movimiento
    timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
  }
  function resetAutoplay() {
    clearInterval(timer);
    startAutoplay();
  }

  startAutoplay();
}

/* -----------------------------------------------------------
   Formulario de contacto
   -----------------------------------------------------------
   Validación en cliente. El envío real (fetch a un endpoint PHP,
   FormSubmit, etc.) se conecta acá mismo, en submitContactForm(),
   una vez que definan con el cliente cómo procesan el mail.
----------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields = {
      name: form.querySelector('#name'),
      email: form.querySelector('#email'),
      message: form.querySelector('#message'),
    };

    let isValid = true;
    Object.values(fields).forEach((field) => {
      const row = field.closest('.form-row');
      const fieldValid = field.checkValidity();
      row.classList.toggle('has-error', !fieldValid);
      if (!fieldValid) isValid = false;
    });

    if (!isValid) {
      setStatus(status, 'Revisá los campos marcados antes de enviar.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    setStatus(status, 'Enviando…', '');

    try {
      await submitContactForm(fields);
      setStatus(status, '¡Gracias! Te vamos a responder a la brevedad.', 'success');
      form.reset();
    } catch (err) {
      setStatus(status, 'No pudimos enviar el mensaje. Escribinos a aahidrogeno@gmail.com', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function setStatus(el, message, type) {
  el.textContent = message;
  el.className = 'form-status' + (type ? ' ' + type : '');
}

/**
 * Placeholder de envío. Reemplazar por el endpoint real
 * (mismo patrón PHP que usaron en savinistudio.com, o un servicio
 * externo tipo FormSubmit/Formspree si prefieren no tocar cPanel).
 */
function submitContactForm(fields) {
  return new Promise((resolve) => {
    setTimeout(resolve, 700); // simula latencia de red
  });
}