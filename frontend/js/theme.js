(function () {
  const html = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");

  // Obtener correo del usuario si está logueado
  let userEmail = null;
  const usuarioGuardado = localStorage.getItem("usuario");

  if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    userEmail = usuario.email || null; // usamos correo como clave
  }

  // Obtener tema inicial
  function getInitialTheme() {
    // Si NO hay sesión → usar preferencia del sistema (no guardar nada)
    if (!userEmail) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // Si hay sesión → cargar tema usando correo
    const saved = localStorage.getItem(`theme_${userEmail}`);

    if (saved) return saved;

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    localStorage.setItem(`theme_${userEmail}`, systemTheme);
    return systemTheme;
  }

  // Aplicar el tema inicial
  const initialTheme = getInitialTheme();
  html.setAttribute("data-theme", initialTheme);
  icon.className =
    initialTheme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";

  // 🖱 Evento para cambiar tema
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const newTheme =
        html.getAttribute("data-theme") === "dark" ? "light" : "dark";

      html.setAttribute("data-theme", newTheme);
      icon.className =
        newTheme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";

      // Guardar preferencia SOLO si hay usuario logueado
      if (userEmail) {
        localStorage.setItem(`theme_${userEmail}`, newTheme);
      }
    });
  }

  window.resetThemeOnLogout = function () {
    // NO borrar localStorage del tema
    // Solo cambiar temporalmente al tema del sistema
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    html.setAttribute("data-theme", systemTheme);
    icon.className =
      systemTheme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  };
})();

// VALOR BASE
const defaultSize = 100; // 100% tamaño normal
let currentSize = localStorage.getItem("fontSize")
    ? parseInt(localStorage.getItem("fontSize"))
    : defaultSize;

// Aplicar tamaño guardado al cargar
document.documentElement.style.fontSize = currentSize + "%";

document.getElementById("font-increase").addEventListener("click", () => {
    if (currentSize < 200){
        currentSize += 10; 
        applyFontSize();
    }
});

document.getElementById("font-decrease").addEventListener("click", () => {
    if (currentSize > 50) {        
        currentSize -= 10;
        applyFontSize();
    }
});

document.getElementById("font-reset").addEventListener("click", () => {
    currentSize = defaultSize;
    applyFontSize();
});

// Función para aplicar y guardar
function applyFontSize() {
    document.documentElement.style.fontSize = currentSize + "%";
    localStorage.setItem("fontSize", currentSize);
}
