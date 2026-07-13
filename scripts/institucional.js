'use strict';

/**
 * AAH — institucional.js
 * Exclusivo de institucional.html.
 */

document.addEventListener('DOMContentLoaded', () => {
  initFounderPhotoFallback();
});

/* -----------------------------------------------------------
   Fallback de foto de fundador
   -----------------------------------------------------------
   Si la foto real (assets/img/bolcich.jpg, assets/img/aprea.jpg)
   todavía no está subida, mostramos las iniciales en vez de un
   ícono de imagen rota. Apenas se suba el archivo con el nombre
   correcto, esta función deja de intervenir.
----------------------------------------------------------- */
function initFounderPhotoFallback() {
  document.querySelectorAll('.founder-photo img').forEach((img) => {
    img.addEventListener('error', () => {
      img.closest('.founder-photo').classList.add('img-missing');
    });
  });
}