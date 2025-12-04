const API_BASE_URL = 'https://proyectofinal-programacionweb-5tosemestre.onrender.com';

async function cargarImagenes() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/imagenes/obtenerImagenes`);
        const data = await response.json();
        
        if (response.ok) {
            const divCont = document.getElementById("contenido");
            data.vector.forEach(imagen => {
                const img = document.createElement("img");
                img.src = imagen.data;
                img.style.maxWidth = "200px";
                img.style.height="auto";
                divCont.appendChild(img);
            });
        } else {
            swal("Error", data.msg || "Hubo un error al cargar las imagenes", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
}