(function () {
  const defaultSize = 100; // 100%
  let userEmail = null;

  // Obtener usuario logueado
  const usuarioGuardado = localStorage.getItem("usuario");
  if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    userEmail = usuario.email || null;
  }

  // Obtener tamaño inicial según usuario o default
  function getInitialFontSize() {
    if (!userEmail) {
      // Sin sesión → NO usar localStorage
      return defaultSize;
    }

    const saved = localStorage.getItem(`fontSize_${userEmail}`);

    if (saved) return parseInt(saved);

    // Si nunca guardó → guardar el default para ese usuario
    localStorage.setItem(`fontSize_${userEmail}`, defaultSize);
    return defaultSize;
  }

  let currentSize = getInitialFontSize();

  // Aplicar tamaño inicial
  document.documentElement.style.fontSize = currentSize + "%";

  // Botones
  const increaseBtn = document.getElementById("font-increase");
  const decreaseBtn = document.getElementById("font-decrease");
  const resetBtn = document.getElementById("font-reset");

  if (increaseBtn)
    increaseBtn.addEventListener("click", () => {
      currentSize += 10;
      applyFontSize();
    });

  if (decreaseBtn)
    decreaseBtn.addEventListener("click", () => {
      if (currentSize > 50) {
        currentSize -= 10;
        applyFontSize();
      }
    });

  if (resetBtn)
    resetBtn.addEventListener("click", () => {
      currentSize = defaultSize;
      applyFontSize();
    });

  // Aplicar y guardar tamaño
  function applyFontSize() {
    document.documentElement.style.fontSize = currentSize + "%";

    // Solo guardar si hay usuario logueado
    if (userEmail) {
      localStorage.setItem(`fontSize_${userEmail}`, currentSize);
    }
  }

  // Reset cuando cierra sesión (NO borrar preferencia)
  window.resetFontSizeOnLogout = function () {
    // Solo volver al default visualmente
    document.documentElement.style.fontSize = defaultSize + "%";
  };
})();
