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
