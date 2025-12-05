document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

// Mapeo de categorías NUMÉRICAS → TEXTO
const categoriasMap = {
    1: "dona",
    2: "bebida",
    3: "souvenir"
};

async function cargarProductos() {
    try {
        const resp = await fetch(`${API_BASE_URL}/api/products/obtenerProductos`);
        const productos = await resp.json();

        if (!resp.ok) {
            swal("Error", "No se pudieron cargar los productos", "error");
            return;
        }

        // Contenedores del HTML
        const contDona = document.getElementById("contenedor-donas");
        const contBebida = document.getElementById("contenedor-bebidas");
        const contSouvenir = document.getElementById("contenedor-souvenirs");

        const response = await fetch(`${API_BASE_URL}/api/imagenes/obtenerImagenes`);
        const data = await response.json();
        
        if (!response.ok) {
            swal("Error", data.msg || "Hubo un error al cargar las imagenes", "error");
        }

        productos.forEach(prod => {
            const categoria = categoriasMap[prod.categoria];
            const card = crearTarjeta(prod, data.vectorImg.find(i => i.nombre === prod.imagen).data);

            if (categoria === "dona") contDona.appendChild(card);
            else if (categoria === "bebida") contBebida.appendChild(card);
            else if (categoria === "souvenir") contSouvenir.appendChild(card);
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

//Función para activar los botones (ir DESPUÉS de cargar)
function activarBotones() {
    // Botones de deseos
    document.querySelectorAll(".btn-deseo").forEach(btn => {
        const primerClicDeseo = async () => {
            const prod = JSON.parse(btn.getAttribute("data-producto"));
            //enviarA("deseos", prod);
            const response = await fetch(`${API_BASE_URL}/api/listaDeseos/agregarProducto/${prod.id}`, {
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
                swal("Error", data.mensaje || "Hubo un error al agregar el producto a la lista de deseos", "error");
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
                swal("Error", data.mensaje || "Hubo un error al agregar el producto al carrito", "error");
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

//Guardar en localStorage y redirigir
/*function enviarA(tipo, producto) {
    let lista = JSON.parse(localStorage.getItem(tipo)) || [];

    // Si el producto ya existe, aumentar cantidad
    const index = lista.findIndex(p => p.id === producto.id);

    if (index >= 0) {
        lista[index].cantidad += 1;
    } else {
        producto.cantidad = 1;
        lista.push(producto);
    }

    localStorage.setItem(tipo, JSON.stringify(lista));
}*/
