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
  initPdfDownloads();
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

/* -----------------------------------------------------------
   Descarga de PDFs (Biblioteca, Normativa, etc.)
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