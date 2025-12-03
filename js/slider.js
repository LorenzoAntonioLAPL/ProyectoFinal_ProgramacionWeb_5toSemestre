const grid = document.querySelector('.servicios-grid');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');

// función para obtener el ancho de cada card
function cardWidth() {
  const card = document.querySelector('.servicio-card');
  return card.offsetWidth + 30; // ancho + gap
}

// Botón siguiente
btnNext.addEventListener('click', () => {
  grid.scrollLeft += cardWidth();
});

// Botón anterior
btnPrev.addEventListener('click', () => {
  grid.scrollLeft -= cardWidth();
});