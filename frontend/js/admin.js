const searchForm = document.getElementById("searchProduct");
const searchIdInput = document.getElementById("aSearch");

// Form modificar (como se añade de forma dinámica solo se establece como var)
var modForm, modNombre, modDesc, modPrecio, modVentas, modExist, modCateg, modImag, btnElim;

// Nota de Eli: Tengo problemas al querer agregar los botones de Eliminar y modificaar, estoy trabajando en eso

// // Agregar evento de modificar producto
// modForm.addEventListener("submit", modificarProd(e));

// // Busca el botón de eliminar producto en la página
// var btnElim = document.getElementById("btn-elim");

// // Le agrega la función de Eliminar
// btnElim.addEventListener("click", eliminarProd());

// Form agregar
const addForm = document.getElementById("formAddProduct");
const addNombre = document.getElementById("addNom");
const addDesc = document.getElementById("addDesc");
const addPrecio = document.getElementById("addPrecio");
const addExist = document.getElementById("addExist");
const addCateg = document.getElementById("addCateg");
const addImag = document.getElementById("addImagen");

// Mostrar productos al cargar la página
document.addEventListener('DOMContentLoaded', mostrarTodosProductos());

// Funcion para mostrarproductos (es llamada por varias funciones)
async function mostrarTodosProductos() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/obtenerProductos`);
        const data = await response.json();
        
        if (response.ok) {
            var prodCont = document.getElementById("prod-container");
            // Limpiar el contenedor de los productos
            prodCont.innerHTML= "";
            
            // Agregar todos los productos obtenidos por data
            for(var i=0; i<data.length;i++){
                prodCont.innerHTML +=
                `<div class="a-product-card">
                    <img src="imagenes/donas.jpg" alt="">
                    <div class="a-product-desc">
                        <h2>${data[i].nombre}</h2>
                        <h3>ID: ${data[i].id}</h3>
                        <h4>Categoria: ${data[i].categoria} | Precio: ${data[i].precio} | Existencias: ${data[i].existencia} | Ventas: ${data[i].ventas}</h4>
                        <hr>
                        <p>${data[i].descripcion}</p>
                    </div>
                </div>
                `;
            }
        } else {
            swal("Error", data.msg || "Hubo un error al cargar los productos", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
};

// Buscar y mostrar el producto encontrado
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const idSearch = searchIdInput.value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/products/obtenerProducto/${idSearch}`);
        const data = await response.json();

        console.log(data);
        
        if (response.ok) {
            var searchCont = document.getElementById("search-container");
            
            // Agrega el objeto encontrado al HTML
            searchCont.innerHTML =
                `<div class="a-product-card">
                    <img src="imagenes/donas.jpg" alt="">
                    <div class="a-product-desc">
                        <h2>${data.nombre}</h2>
                        <h3>ID: ${data.id}</h3>
                        <h4>Categoria: ${data.categoria} | Precio: ${data.precio} | Existencias: ${data.existencia} | Ventas: ${data.ventas}</h4>
                        <hr>
                        <p>${data.descripcion}</p>
                    </div>
                    <button id="btn-elim" type="button" class="a-product-button btn-eliminar" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                    <div class="a-product-modify">
                        <hr>
                        <form id="formModProduct">
                            <label for="modNom">Nombre:</label>
                            <input type="text" id="modNom" class="a-product-input" placeholder="${data.nombre}">

                            <label for="modDesc">Descripción:</label>
                            <textarea type="text" id="modDesc" class="a-product-input input-resize" placeholder="${data.descripcion}"></textarea>

                            <label for="modPrecio">Precio:</label>
                            <input type="number" id="modPrecio" class="a-product-input" min="0" step="any" placeholder="${data.precio}">

                            <label for="modVentas">Precio:</label>
                            <input type="number" id="modVentas" class="a-product-input" min="0" step="any" placeholder="${data.ventas}">

                            <label for="modExist">Existencias:</label>
                            <input type="number" id="modExist" class="a-product-input" name="quantity" min="0" placeholder="${data.existencia}">

                            <label for="modCateg">Categ:</label>
                            <input type="number" id="modCateg" class="a-product-input" name="quantity" min="1" max="3" step="1" placeholder="${data.categoria}">
                                                
                            <label for="modImagen">Imagen:</label>
                            <input type="file" id="modImagen" accept="image/png, image/gif, image/jpeg" name="prodImagen">

                            <br><br>
                                                
                            <input type="submit" class="btn-modify" value="Modificar">
                            <input type="reset" class="btn-modify" value="Reset">
                        </form>
                    </div>
                </div>
                `;

            // Configura el form
            modForm = document.getElementById("formModProduct");
            modNombre = document.getElementById("modNom");
            modDesc = document.getElementById("modDesc");
            modPrecio = document.getElementById("modPrecio");
            modVentas = document.getElementById("modVentas");
            modExist = document.getElementById("modExist");
            modCateg = document.getElementById("modCateg");
            modImag = document.getElementById("modImagen");

            console.log(searchCont);
        } else {
            swal("Error", data.msg || "Hubo un error al cargar los productos", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
});

// Modificar un producto en específico
async function modificarProd(e){
    e.preventDefault();

    // Obtiene el ID del elemento a
    const searchCont = document.getElementById("search-container");
    let idSearch = searchCont.getElementsByTagName("h3")[0].innerText.substring(4);

    const nomProd = modNombre.value || modNombre.getAttribute("placeholder");
    const precioProd = modPrecio.value || modPrecio.getAttribute("placeholder");
    const descProd = modDesc.value || modDesc.getAttribute("placeholder");
    const existProd = modExist.value || modExist.getAttribute("placeholder");
    const categProd = modCateg.value || modCateg.getAttribute("placeholder");
    const imgProd = modImag.files;
    const ventasProd = modVentas.value || modVentas.getAttribute("placeholder");

    try {
        const response = await fetch(`${API_BASE_URL}/api/products/actualizarProducto/${idSearch}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre,
                precio,
                descripcion,
                existencia,
                categoria,
                imagen,
                ventas
            })
        });
        const data = await response.json();

        if(response.ok){
            swal("Éxito", data.msg || "Se modificó el producto correctamente", "success");
            mostrarTodosProductos();
        } else {
            swal("Error", data.msg || "Hubo un error al modificar el producto", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
}

// Eliminar un producto en específico
async function eliminarProd() {
    const searchCont = document.getElementById("search-container");
    let idElim = searchCont.getElementsByTagName("h3")[0].innerText.substring(4);

    try {
        const res = await fetch(`${API_BASE_URL}/api/products/borrarProducto/${idElim}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        })

        const data = await res.json()

        if(res.ok) {
            swal("Éxito", data.msg || "Se eliminó el producto correctamente", "success");
            mostrarTodosProductos();
        } else {
            swal("Error", data.msg || "Hubo un error al eliminar el producto", "error");
        }
    } catch (error) {
        console.error(error)
        swal("Error", "No se pudo conectar al servidor", "error")
    }
}

// Agregar un nuevo producto a la base de datos
async function agregarProd(e) {
    e.preventDefault();

    const nomProd = addNombre.value;
    const precioProd = addPrecio.value;
    const descProd = addDesc.value;
    const existProd = addExist.value;
    const categProd = addCateg.value;
    const imgProd = addImag.files;

    try {
        const response = await fetch(`${API_BASE_URL}/api/products/actualizarProducto/${idSearch}`, {
            method: "POST",
                headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nomProd,
                precio: precioProd,
                descripcion: descProd,
                existencia: existProd,
                categoria: categProd,
                imagen: imgProd
            })
        });
        const data = await response.json();

        if(response.ok){
            swal("Éxito", data.msg || "Se agregó el producto correctamente", "success");
            mostrarTodosProductos();
        } else {
            swal("Error", data.msg || "Hubo un error al agregar el producto", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
}
