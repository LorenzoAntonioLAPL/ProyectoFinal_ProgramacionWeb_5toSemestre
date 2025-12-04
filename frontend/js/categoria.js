const API_BASE_URL = 'https://proyectofinal-programacionweb-5tosemestre.onrender.com';

document.addEventListener("DOMContentLoaded", cargarProductos);

// Mapeo de categorías NUMÉRICAS → TEXTO
const categoriasMap = {
    1: "dona",
    2: "bebida",
    3: "souvenir"
};

async function cargarProductos() {
    try {
        const resp = await fetch(`${API_BASE_URL}/api/productos`);
        const productos = await resp.json();

        if (!resp.ok) {
            swal("Error", "No se pudieron cargar los productos", "error");
            return;
        }

        // Contenedores del HTML
        const contDona = document.getElementById("contenedor-donas");
        const contBebida = document.getElementById("contenedor-bebidas");
        const contSouvenir = document.getElementById("contenedor-souvenirs");

        productos.forEach(prod => {
            const categoria = categoriasMap[prod.categoria]; // convertimos 1-2-3 a texto
            const card = crearTarjeta(prod);

            if (categoria === "dona") contDona.appendChild(card);
            else if (categoria === "bebida") contBebida.appendChild(card);
            else if (categoria === "souvenir") contSouvenir.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
}

function crearTarjeta(prod) {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <h3>${prod.nombre}</h3>
        <p>Precio: $${prod.precio}</p>
        <p>Existencia: ${prod.existencia}</p>

        <div class="card-icons">
            <i class="fa-regular fa-heart" title="Añadir a deseos"></i>
            <i class="fa-solid fa-cart-plus" title="Añadir al carrito"></i>
        </div>
    `;

    return card;
}