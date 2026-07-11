'use strict';

/**
 * AAH — script.js
 * Sin dependencias externas. Organizado por feature para que cada
 * bloque se pueda tocar de forma aislada.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initPdfDownloads();
  initContactForm();
  initScrollReveal();
});

/* -----------------------------------------------------------
   1) Header con sombra al hacer scroll
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
   2) Menú móvil (hamburguesa)
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

  // Cerrar al elegir un link (útil en mobile)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
}

/* -----------------------------------------------------------
   3) Descarga de PDFs (Revista / Normativa)
   -----------------------------------------------------------
   Los botones con [data-pdf] apuntan a un archivo dentro de /assets/pdf/.
   Si el archivo todavía no existe (placeholder), avisamos al usuario
   en vez de romper la navegación con un 404 silencioso.
   Cuando el cliente entregue los PDFs reales, alcanza con colocarlos
   en /assets/pdf/ con el mismo nombre — no hace falta tocar el HTML.
----------------------------------------------------------- */
function initPdfDownloads() {
  const PDF_BASE_PATH = 'assets/pdf/';

  document.querySelectorAll('[data-pdf]').forEach((button) => {
    button.addEventListener('click', async () => {
      const fileName = button.getAttribute('data-pdf');
      const url = PDF_BASE_PATH + fileName;
      const originalLabel = button.innerHTML;

      button.disabled = true;
      button.textContent = 'Verificando…';

      const exists = await fileExists(url);

      if (exists) {
        triggerDownload(url, fileName);
        button.innerHTML = originalLabel;
      } else {
        button.textContent = 'PDF disponible próximamente';
        setTimeout(() => {
          button.innerHTML = originalLabel;
        }, 2600);
      }

      button.disabled = false;
    });
  });
}

async function fileExists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

function triggerDownload(url, fileName) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/* -----------------------------------------------------------
   4) Formulario de contacto
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

/* -----------------------------------------------------------
   5) Scroll reveal liviano (IntersectionObserver)
----------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.feature-card, .obj-card, .destacado-card, .memoriam-card, .historia-stat'
  );
  if (!targets.length) return;

  targets.forEach((el) => el.classList.add('reveal'));

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