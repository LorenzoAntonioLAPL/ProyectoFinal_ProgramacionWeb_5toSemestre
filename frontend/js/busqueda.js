const idBusqueda = document.getElementById("formSearch");
const searchedItem = document.getElementById("searched-items");

idBusqueda.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("Entra funcion");

    const searchCateg = document.getElementById("searchCateg").value || 0;
    const searchRange_low = document.getElementById("searchRange-low").value || 0;
    const searchRange_high = document.getElementById("searchRange-high").value || null;
    const searchOffer = document.getElementById("searchOffer").checked || false;

    let prodTotal = [];
    let prodFiltro = [];

    while (searchedItem.firstChild) {
        searchedItem.removeChild(searchedItem.lastChild);
    }

    // Obtener todos los articulos
    try {
        const resp = await fetch(`${API_BASE_URL}/api/products/obtenerProductos`);
        const data = await resp.json();

        prodTotal = data;
    } catch (error) {
        console.error(error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
    
    if(searchCateg != 0){
        try {
            prodTotal.forEach(prod => {
                if(prod.categoria == searchCateg){
                    prodFiltro.push(prod);
                }
            });
        } catch (error) {
            console.error(error);
            swal("Error", "Error al buscar por categoría", "error");
        }
    }

    prodTotal = [...prodFiltro];

    if((searchRange_low !== 0) || (searchRange_high !== null)){
        prodFiltro = [];
        try {
            if(searchRange_high == null){
                prodTotal.forEach(prod => {
                    if(prod.precio >= searchRange_low){
                        prodFiltro.push(prod);
                    }
                });
            } else {
                prodTotal.forEach(prod => {
                    if(prod.precio >= searchRange_low && prod.precio <= searchRange_high){
                        prodFiltro.push(prod);
                    }
                });
            }
        } catch (error) {
            console.error(error);
            swal("Error", "Error al filtrar por rango", "error");
        }
    }

    prodTotal = [...prodFiltro];

    if(searchOffer){
        console.log("Entrar funcion oferta");
        prodFiltro = [];
        try {
            const resp = await fetch(`${API_BASE_URL}/api/extras/obtenerOfertas`);
            const data = await resp.json();

            if(resp){
                prodTotal.forEach(prod => {
                    if(data.find(i => i.id === prod.id)){
                        prodFiltro.push(prod);
                    }
                });
            }
        } catch (error) {
            console.error(error);
            swal("Error", "No se pudo conectar con el servidor", "error");
        }
    }

    prodTotal = [...prodFiltro];

    // Obtener imagenes
    
    const response = await fetch(`${API_BASE_URL}/api/imagenes/obtenerImagenes`);
    const imagen = await response.json();

    if (!response) {
        swal("Error", data.msg || "Hubo un error al cargar las imagenes", "error");
    }

    prodTotal.forEach(prod => {
        const card = crearTarjeta(prod,imagen.vectorImg.find(i => i.nombre === prod.imagen).data);

        searchedItem.appendChild(card);
    });

    activarBotones();
});

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