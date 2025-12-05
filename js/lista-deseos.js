document.addEventListener("DOMContentLoaded", () => {
    mostrarDeseos();
});

function mostrarDeseos() {
    const contenedor = document.getElementById("contenedor-deseos");
    const lista = JSON.parse(localStorage.getItem("deseos")) || [];

    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No hay productos en la lista de deseos.</p>";
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
            eliminarProducto("deseos", prod.id, mostrarDeseos);
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