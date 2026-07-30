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
    { file: 'foto-01.jpg', caption: 'Planta Experimental de Hidrógeno de Pico Truncado, Santa Cruz, Argentina' },
    { file: 'foto-02.jpg', caption: 'Concepto Mirai en el Salón del Automóvil de Buenos Aires' },
    { file: 'foto-03.jpg', caption: 'Ford Escape Hybrid (1/4) — Salón del Automóvil 2005, Buenos Aires' },
    { file: 'foto-04.jpg', caption: 'Ford Escape Hybrid (2/4) — Salón del Automóvil 2005, Buenos Aires' },
    { file: 'foto-05.jpg', caption: 'Ford Escape Hybrid (3/4) — Salón del Automóvil 2005, Buenos Aires' },
    { file: 'foto-06.jpg', caption: 'Ford Escape Hybrid (4/4) — Salón del Automóvil 2005, Buenos Aires' },
    { file: 'foto-07.jpg', caption: 'Motor a Hidrógeno de Ford — Salón del Automóvil 2005' },
    { file: 'foto-08.jpg', caption: 'Toyota Prius Hybrid (1/5)' },
    { file: 'foto-09.jpg', caption: 'Toyota Prius Hybrid (2/5)' },
    { file: 'foto-10.jpg', caption: 'Toyota Prius Hybrid (3/5)' },
    { file: 'foto-11.jpg', caption: 'Toyota Prius Hybrid (4/5)' },
    { file: 'foto-12.jpg', caption: 'Toyota Prius Hybrid (5/5)' },
    { file: 'foto-13.jpg', caption: 'Cilindro de GH (hidrógeno gaseoso)' },
    { file: 'foto-14.jpg', caption: 'Motor de Hidrógeno del cohete ARIANE' },
    { file: 'foto-15.jpg', caption: 'Renault 9 convertido a GH en 1998 por la AAH' },
    { file: 'foto-16.jpg', caption: 'Cilindro de almacenaje de hidrógeno' },
    { file: 'foto-17.jpg', caption: 'Celda de combustible a H desarrollada por PSA Peugeot Citroën' },
    { file: 'foto-18.jpg', caption: 'Generador de H2 Axane' },
    { file: 'foto-19.jpg', caption: 'Cilindro de H con liner de aluminio y refuerzo externo de carbono' },
    { file: 'foto-20.jpg', caption: 'Cilindros de H en material composite' },
    { file: 'foto-21.jpg', caption: 'Minibús de hidrógeno en Lyon, Francia' },
    { file: 'foto-22.jpg', caption: 'Tanque de hidrógeno líquido' },
    { file: 'foto-23.jpg', caption: 'Moto Debi a H2' },
    { file: 'foto-24.jpg', caption: 'Peugeot Partner a H2' },
    { file: 'foto-25.jpg', caption: 'Toyota Mirai frente al Hotel Llao Llao, Bariloche — Foro Global del Hidrógeno Verde 2023' },
];

const PHOTOS_PATH = 'assets/img/galeria/';

document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    initLightbox();
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