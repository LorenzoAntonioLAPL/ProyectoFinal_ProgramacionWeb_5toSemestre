
(function(){
  const html = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');

  // Determina tema inicial:
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      html.setAttribute('data-theme', 'dark');
      if (icon) icon.classList.replace('fa-moon', 'fa-sun');
  } else {
      html.setAttribute('data-theme', 'light');
      if (icon) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
      }
  }

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);

      // Cambia icono si existe
      if (icon) {
          if (next === 'dark') {
              icon.classList.replace('fa-moon', 'fa-sun');
          } else {
              icon.classList.replace('fa-sun', 'fa-moon');
          }
      }
  });

  // Mantener sincronizado si el usuario cambia la preferencia del sistema
  if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          const savedLocal = localStorage.getItem('theme');
          // solo cambiar si no hay preferencia guardada
          if (!savedLocal) {
              const newTheme = e.matches ? 'dark' : 'light';
              html.setAttribute('data-theme', newTheme);
              if (icon) {
                  if (newTheme === 'dark') icon.classList.replace('fa-moon', 'fa-sun');
                  else icon.classList.replace('fa-sun','fa-moon');
              }
          }
      });
  }
})();
