document.addEventListener("DOMContentLoaded", function () {

    const btnNuevo = document.getElementById("btnNuevo");
    const btnAgregar = document.getElementById("btnAgregar");
    const btnCerrar = document.getElementById("btnCerrar");
    const modal = document.getElementById("modal");
    const contenedor = document.getElementById("contenedorTarjetas");

    // Abrir el modal
    btnNuevo.addEventListener("click", function () {
        modal.style.display = "block";
    });

    // Cerrar el modal
    btnCerrar.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Agregar tarjeta
    btnAgregar.addEventListener("click", function () {

        const tipo = document.getElementById("tipoProducto").value;
        const nombre = document.getElementById("nombreProducto").value;
        const precio = document.getElementById("precioProducto").value;

        if (nombre === "" || precio === "") {
            alert("Completa todos los campos");
            return;
        }

        // Seleccionar imagen según tipo
        let imagen = "";
        if (tipo === "dona") imagen = "./imagenes/donas.jpg";
        if (tipo === "bebida") imagen = "./imagenes/bebida.jpg";

        // Crear tarjeta
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("card");

        tarjeta.innerHTML = `
            <img src="${imagen}">
            <h3>${nombre}</h3>
            <p>Precio: $${precio}</p>
            <button class="btnEliminar" type="button" class="a-product-button" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
        `;

        tarjeta.querySelector(".btnEliminar").addEventListener("click", function () {
            tarjeta.remove();
        });

        contenedor.appendChild(tarjeta);

        // Limpiar inputs
        document.getElementById("nombreProducto").value = "";
        document.getElementById("precioProducto").value = "";

        // Cerrar modal
        modal.style.display = "none";
    });
});