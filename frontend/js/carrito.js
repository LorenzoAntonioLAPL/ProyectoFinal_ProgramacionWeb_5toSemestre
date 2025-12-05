document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
});

function mostrarCarrito() {
    const contenedor = document.getElementById("contenedor-carrito");
    const totalCarrito = document.getElementById("total-carrito");

    let lista = JSON.parse(localStorage.getItem("carrito")) || [];

    contenedor.innerHTML = "";

    // Mostrar total de productos (sumando cantidades)
    const totalProductos = lista.reduce((sum, p) => sum + p.cantidad, 0);

    // Calcular total a pagar
    const totalPagar = lista.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

    // MOSTRAR TOTAL
    totalCarrito.innerHTML = `
        Productos agregados: <strong>${totalProductos}</strong><br>
        Total a pagar: <strong>$${totalPagar.toFixed(2)}</strong>
    `;

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

            <div class="cantidad-control">
                <button class="btn-restar">-</button>
                <span class="cantidad">${prod.cantidad}</span>
                <button class="btn-sumar">+</button>
            </div>

            <div class="card-icons">
                <i class="fa-solid fa-trash btn-eliminar"></i>
            </div>
        `;

        // SUMAR 1
        card.querySelector(".btn-sumar").addEventListener("click", () => {
            modificarCantidad(prod.id, +1);
        });

        // RESTAR 1
        card.querySelector(".btn-restar").addEventListener("click", () => {
            modificarCantidad(prod.id, -1);
        });

        // ELIMINAR COMPLETO
        card.querySelector(".btn-eliminar").addEventListener("click", () => {
            eliminarProducto(prod.id);
        });

        contenedor.appendChild(card);
    });
}

function modificarCantidad(id, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    let item = carrito.find(p => p.id === id);
    if (!item) return;

    item.cantidad += cambio;

    // Si llegó a 0 → eliminar
    if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.id !== id);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito(); // actualizar vista
}

function eliminarProducto(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter(p => p.id !== id);

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}
