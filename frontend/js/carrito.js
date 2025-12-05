const API_BASE_URL = 'https://proyectofinal-programacionweb-5tosemestre.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
});

async function mostrarCarrito() {
    try {
        const resp = await fetch(`${API_BASE_URL}/api/products/obtenerProductos`);
        const productos = await resp.json();

        if (!resp.ok) {
            swal("Error", "No se pudieron cargar los productos", "error");
            return;
        }

        const respuesta = await fetch(`${API_BASE_URL}/api/carritoCompra/obtenerCarrito`);
        const productosCarrito = await resp.json();

        if (!respuesta.ok) {
            swal("Error", "No se pudieron cargar los productos", "error");
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/imagenes/obtenerImagenes`);
        const data = await response.json();
        
        if (!response.ok) {
            swal("Error", data.msg || "Hubo un error al cargar las imagenes", "error");
        }

        productosCarrito.forEach(prod => {
            const card = crearTarjeta(productos.find(p => p.id === prod), data.vector.find(i => i.nombre === prod.nombre).data);
            const contenedor = document.getElementById("contenedor-carrito");
            contenedor.appendChild(card);
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

function activarBotones() {
    // Botones de deseos
    document.querySelectorAll(".btn-deseo").forEach(btn => {
        const primerClicDeseo = async () => {
            const prod = JSON.parse(btn.getAttribute("data-producto"));
            //enviarA("deseos", prod);
            const response = await fetch(`${API_BASE_URL}/api/listaDeseos/añadirProducto/${prod.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();

            if(response.ok){
                swal("Éxito", data.mensaje || "Se añadio el producto a la lista de deseos", "success");
                btn.removeEventListener("click", primerClicDeseo);
                btn.addEventListener("click", segundoClicDeseo);
            } else {
                swal("Error", data.mensaje || "Hubo un error al añadir el producto a la lista de deseos", "error");
            }
        };

        const segundoClicDeseo = async () => {
            const prod = JSON.parse(btn.getAttribute("data-producto"));
            //enviarA("deseos", prod);
            const response = await fetch(`${API_BASE_URL}/api/listaDeseos/eliminarProducto/${prod.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();

            if(response.ok){
                swal("Éxito", data.mensaje || "Se elimino el producto a la lista de deseos", "success");
                btn.removeEventListener("click", segundoClicDeseo);
                btn.addEventListener("click", primerClicDeseo);
            } else {
                swal("Error", data.mensaje || "Hubo un error al eliminar el producto a la lista de deseos", "error");
            }
        };

        btn.addEventListener("click", primerClicDeseo);
    });

    // Botones del carrito
    document.querySelectorAll(".btn-carrito").forEach(btn => {
        const primerClicCarrito = async () => {
            const prod = JSON.parse(btn.getAttribute("data-producto"));
            //enviarA("carrito", prod);
            const input = document.getElementById(`nombre${prod.nombre}`);
            const total = Number(input.value);

            const response = await fetch(`${API_BASE_URL}/api/carritoCompra/añadirProducto/${prod.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cantidad: total
                })
            });
            const data = await response.json();

            if(response.ok){
                swal("Éxito", data.mensaje || "Se añadio el producto al carrito", "success");
                btn.removeEventListener("click", primerClicCarrito);
                btn.addEventListener("click", segundoClicCarrito);
            } else {
                swal("Error", data.mensaje || "Hubo un error al añadir el producto al carrito", "error");
            }
        };

        const segundoClicCarrito = async () => {
            const prod = JSON.parse(btn.getAttribute("data-producto"));
            //enviarA("carrito", prod);
            const input = document.getElementById(`nombre${prod.nombre}`);
            const total = Number(input.value);

            const response = await fetch(`${API_BASE_URL}/api/carritoCompra/eliminarProducto/${prod.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cantidad: total
                })
            });
            const data = await response.json();

            if(response.ok){
                swal("Éxito", data.mensaje || "Se quito el producto del carrito", "success");
                btn.removeEventListener("click", segundoClicCarrito);
                btn.addEventListener("click", primerClicCarrito);
            } else {
                swal("Error", data.mensaje || "Hubo un error al quitar el producto del carrito", "error");
            }
        };

        btn.addEventListener("click", primerClicCarrito);
    });
}