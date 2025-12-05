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

        const respuesta = await fetch(`${API_BASE_URL}/api/carritoCompra/obtenerCarrito`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });
        const productosCarrito = await respuesta.json();

        if (!respuesta.ok) {
            swal("Error", "No se pudieron cargar los productos", "error");
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/imagenes/obtenerImagenes`);
        const data = await response.json();
        
        if (!response.ok) {
            swal("Error", data.msg || "Hubo un error al cargar las imagenes", "error");
        }

        const respuestaOf = await fetch(`${API_BASE_URL}/api/extras/obtenerOfertas`);
        const dataOf = await respuestaOf.json();

        let j=0;
        productosCarrito.idProductos.forEach(prod => {
            const card = crearTarjeta(productos.find(p => p.id === parseInt(prod)), data.vectorImg.find(i => i.nombre === prod.imagen).data, productosCarrito.cantidades[j], dataOf.find(p => p.producto_id === prod.id));
            const contenedor = document.getElementById("contenedor-carrito");
            contenedor.appendChild(card);
            if(productos.find(p => p.id === parseInt(prod)).existencia){
                document.getElementById(`imagen${productos.find(p => p.id === parseInt(prod)).nombre}`).style.filter = "grayscale(1)";
            }
            j++;
        });

    //Activamos los botones DESPUÉS de cargar las tarjetas
        if(productosCarrito.length > 0)
        activarBotones();

        const response1 = await fetch(`${API_BASE_URL}/api/ventas/obtenerSubTotal`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data1 = await response1.json();

        const response2 = await fetch(`${API_BASE_URL}/api/carritoCompra/obtenerTotalCarrito`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data2 = await response2.json();

        //Productos agregados: 0 <br> Total a pagar: $0.00
        if(!response1 || !response2){
            swal("Error", data.msg || "Hubo un error al obtener datos del carrito", "error");
        }
        else{
            let divDatosTotales = document.getElementById("total-wrapper");
            divDatosTotales.innerHTML=`Productos agregados: ${data2.totalProductos} <br> Total a pagar: $${data1.subtotal}`;
        }
    } catch (error) {
        console.error(error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
}

function crearTarjeta(prod, imagen, cantidadTotal, oferta) {
    const card = document.createElement("div");
    card.classList.add("product-card");
    let nomCard;
    if(prod.existencia > 0){
        nomCard = prod.nombre;
    }
    else{
        nomCard = "No hay existencias";
    }

    let precioNuevo;
    if(oferta){
        precioNuevo = prod.precio * oferta.descuento;
    }
    else{
        precioNuevo = prod.precio;
    }

    card.innerHTML = `
        <img src="${imagen}" alt="${prod.imagen}" id="imagen${prod.nombre}">
        <div class="divPreEx">
            <h3>${nomCard}</h3>
            <p>Cantidad: ${cantidadTotal}</p>
        </div>
        <div class="divPreEx">
            <p>Precio: $${precioNuevo} </p>
            <p>Existencia: ${prod.existencia}</p>
        </div>
        <p>${prod.descripcion}</p>
        <br>

        <div class="card-icons">
            <i class="fa-regular fa-heart btn-deseo" 
               data-producto='${JSON.stringify(prod)}' 
               title="Añadir a deseos" id="icono${prod.nombre}">
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
            const response = await fetch(`${API_BASE_URL}/api/listaDeseos/agregarProducto/${prod.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();

            if(response.ok){
                swal("Éxito", data.mensaje || "Se añadio el producto a la lista de deseos", "success");
                let varIcono = document.getElementById(`icono${prod.nombre}`);
                varIcono.classList.remove("fa-regular");
                varIcono.classList.add("fa-solid");
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
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();

            if(response.ok){
                swal("Éxito", data.mensaje || "Se elimino el producto a la lista de deseos", "success");
                let varIcono = document.getElementById(`icono${prod.nombre}`);
                varIcono.classList.remove("fa-solid");
                varIcono.classList.add("fa-regular");
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

            const response = await fetch(`${API_BASE_URL}/api/carritoCompra/agregarProducto/${prod.id}`, {
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

        btn.addEventListener("click", segundoClicCarrito);
    });
}