const API_BASE_URL = 'http://localhost:3000/api/prueba';

async function cargarImagenes() {
    try {
        const response = await fetch(`${API_BASE_URL}/imagenes`);
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
            alert("ERROR 3");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("ERROR 4");
    }
}