document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
});

function mostrarCarrito() {
    const contenedor = document.getElementById("contenedor-carrito");
    const lista = JSON.parse(localStorage.getItem("carrito")) || [];

    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    lista.forEach(prod => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <h3>${prod.nombre}</h3>
            <p>Precio: $${prod.precio}</p>
            <p>Existencia: ${prod.existencia}</p>

            <div class="card-icons">
                <i class="fa-solid fa-trash btn-eliminar"></i>
            </div>
        `;

        // Botón eliminar
        card.querySelector(".btn-eliminar").addEventListener("click", () => {
            eliminarProducto("carrito", prod.id, mostrarCarrito);
        });

        contenedor.appendChild(card);
    });
}

function eliminarProducto(tipo, id, refrescar) {
    let lista = JSON.parse(localStorage.getItem(tipo)) || [];
    lista = lista.filter(p => p.id !== id);
    localStorage.setItem(tipo, JSON.stringify(lista));

    refrescar();
}