
const idBusqueda = document.getElementById("formSearch")

idBusqueda.addEventListener("submit", () => {
    const searchedItems = document.getElementById("searched-items");
    

    TituloSouvenirs.stye

    cargarProductos();
});

// Mapeo de categorías NUMÉRICAS → TEXTO
const categoriasMap = {
    1: "dona",
    2: "bebida",
    3: "souvenir"
};

async function cargarProductosPorCategoria(cat) {
    try {
        const resp = await fetch(`${API_BASE_URL}/api/products/obtenerProductos`);
        const productos = await resp.json();

        if (!resp.ok) {
            swal("Error", "No se pudieron cargar los productos", "error");
            return;
        }

        
        // Contenedores del HTML
        const contCat = document.getElementById(cat);

        const response = await fetch(`${API_BASE_URL}/api/imagenes/obtenerImagenes`);
        const data = await response.json();
        
        if (!response.ok) {
            swal("Error", data.msg || "Hubo un error al cargar las imagenes", "error");
        }

        productos.forEach(prod => {
            const categoria = categoriasMap[prod.categoria];
            const card = crearTarjeta(prod, data.vectorImg.find(i => i.nombre === prod.imagen).data);

            if (categoria === "dona") contCat.appendChild(card);
            else if (categoria === "bebida") contCat.appendChild(card);
            else if (categoria === "souvenir") contCat.appendChild(card);
        });

    //Activamos los botones DESPUÉS de cargar las tarjetas
        activarBotones();

    } catch (error) {
        console.error(error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
}

function crearTarjeta(prod, imagen) {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
        <img src="${imagen}" alt="${prod.imagen}">
        <h3>${prod.nombre}</h3>
        <p>Precio: $${prod.precio}</p>
        <p>Existencia: ${prod.existencia}</p>

        <div class="card-icons">
            <i class="fa-regular fa-heart btn-deseo" 
               data-producto='${JSON.stringify(prod)}' 
               title="Añadir a deseos">
            </i>

            <i class="fa-solid fa-cart-plus btn-carrito" 
               data-producto='${JSON.stringify(prod)}' 
               title="Añadir al carrito">
            </i>
            <input type="number" id='nombre${prod.nombre}' min="1">
        </div>
    `;

    return card;
}