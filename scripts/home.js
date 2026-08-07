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
    if (prefersReducedMotion) return; 
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
   Validación en cliente + envío real vía fetch a contacto.php.
   
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
 * Envía el formulario a contacto.php vía fetch, sin recargar la página.
 * Requiere un hosting con PHP real (no funciona con Live Server / file://).
 */
function submitContactForm(fields) {
  const form = document.getElementById('contact-form');
  const formData = new FormData(form);

  return fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  }).then(async (res) => {
    let data = {};
    try {
      data = await res.json();
    } catch {
      // Si el hosting no tiene PHP corriendo, la respuesta no es JSON:
      // lo tratamos como error en vez de romper con una excepción rara.
    }
    if (!res.ok || !data.ok) {
      throw new Error(data.error || 'Error al enviar');
    }
    return data;
  });
}