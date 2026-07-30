'use strict';

/**
 * AAH — galeria.js
 * Exclusivo de galeria.html.
 *
 * Para agregar, sacar o reordenar fotos: solo hay que editar el
 * array PHOTOS de abajo. El grid y el lightbox se arman solos.
 * Las imágenes van en assets/img/galeria/ con el nombre indicado.
 */

const PHOTOS = [
  { file: 'foto-01.avif', caption: 'Planta Experimental de Hidrógeno de Pico Truncado, Santa Cruz, Argentina' },
  { file: 'foto-02.avif', caption: 'Concepto Mirai en el Salón del Automóvil de Buenos Aires' },
  { file: 'foto-03.avif', caption: 'Ford Escape Hybrid (1/4) — Salón del Automóvil 2005, Buenos Aires' },
  { file: 'foto-04.avif', caption: 'Ford Escape Hybrid (2/4) — Salón del Automóvil 2005, Buenos Aires' },
  { file: 'foto-05.avif', caption: 'Ford Escape Hybrid (3/4) — Salón del Automóvil 2005, Buenos Aires' },
  { file: 'foto-06.avif', caption: 'Ford Escape Hybrid (4/4) — Salón del Automóvil 2005, Buenos Aires' },
  { file: 'foto-07.avif', caption: 'Motor a Hidrógeno de Ford — Salón del Automóvil 2005' },
  { file: 'foto-08.avif', caption: 'Toyota Prius Hybrid (1/5)' },
  { file: 'foto-09.avif', caption: 'Toyota Prius Hybrid (2/5)' },
  { file: 'foto-10.avif', caption: 'Toyota Prius Hybrid (3/5)' },
  { file: 'foto-11.avif', caption: 'Toyota Prius Hybrid (4/5)' },
  { file: 'foto-12.avif', caption: 'Toyota Prius Hybrid (5/5)' },
  { file: 'foto-13.avif', caption: 'Cilindro de GH (hidrógeno gaseoso)' },
  { file: 'foto-14.avif', caption: 'Motor de Hidrógeno del cohete ARIANE' },
  { file: 'foto-15.avif', caption: 'Renault 9 convertido a GH en 1998 por la AAH' },
  { file: 'foto-16.avif', caption: 'Cilindro de almacenaje de hidrógeno' },
  { file: 'foto-17.avif', caption: 'Celda de combustible a H desarrollada por PSA Peugeot Citroën' },
  { file: 'foto-18.avif', caption: 'Generador de H2 Axane' },
  { file: 'foto-19.avif', caption: 'Cilindro de H con liner de aluminio y refuerzo externo de carbono' },
  { file: 'foto-20.avif', caption: 'Cilindros de H en material composite' },
  { file: 'foto-21.avif', caption: 'Minibús de hidrógeno en Lyon, Francia' },
  { file: 'foto-22.avif', caption: 'Tanque de hidrógeno líquido' },
  { file: 'foto-23.avif', caption: 'Moto Debi a H2' },
  { file: 'foto-24.avif', caption: 'Peugeot Partner a H2' },
  { file: 'foto-25.avif', caption: 'Toyota Mirai frente al Hotel Llao Llao, Bariloche — Foro Global del Hidrógeno Verde 2023' },
];

const PHOTOS_PATH = 'assets/img/galeria/';

document.addEventListener('DOMContentLoaded', () => {
  renderGallery();
  initLightbox();
  // initScrollReveal ya corrió una vez desde global.js, pero en ese momento
  // la galería todavía estaba vacía (este script la llena un instante después).
  // Lo volvemos a llamar para que detecte y anime las 25 fotos recién creadas.
  initScrollReveal();
});

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = PHOTOS.map((photo, i) => `
    <figure class="gallery-item reveal-target" data-index="${i}">
      <button type="button" class="gallery-trigger" aria-label="Ampliar: ${escapeHtml(photo.caption)}">
        <img src="${PHOTOS_PATH}${photo.file}" alt="${escapeHtml(photo.caption)}" loading="lazy">
      </button>
    </figure>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* -----------------------------------------------------------
   Lightbox
----------------------------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const counterEl = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const grid = document.getElementById('gallery-grid');
  if (!lightbox || !grid) return;

  let currentIndex = 0;
  let lastFocusedTrigger = null;

  function open(index) {
    currentIndex = index;
    const photo = PHOTOS[currentIndex];
    imgEl.src = PHOTOS_PATH + photo.file;
    imgEl.alt = photo.caption;
    captionEl.textContent = photo.caption;
    counterEl.textContent = `${currentIndex + 1} / ${PHOTOS.length}`;

    lastFocusedTrigger = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedTrigger) lastFocusedTrigger.focus();
  }

  function show(delta) {
    currentIndex = (currentIndex + delta + PHOTOS.length) % PHOTOS.length;
    open(currentIndex);
  }

  grid.addEventListener('click', (e) => {
    const trigger = e.target.closest('.gallery-trigger');
    if (!trigger) return;
    const figure = trigger.closest('.gallery-item');
    open(Number(figure.dataset.index));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(-1));
  nextBtn.addEventListener('click', () => show(1));

  // Cerrar al clickear el fondo (fuera de la imagen)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(1);
    if (e.key === 'ArrowLeft') show(-1);
  });
}