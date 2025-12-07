const searchForm = document.getElementById("searchProduct");
const searchIdInput = document.getElementById("aSearch");

// Form modificar (como se añade de forma dinámica solo se establece como var)
const modForm = document.getElementById("formModProduct");
const modNombre = document.getElementById("modNom");
const modDesc = document.getElementById("modDesc");
const modPrecio = document.getElementById("modPrecio");
const modVentas = document.getElementById("modVentas");
const modExist = document.getElementById("modExist");
const modCateg = document.getElementById("modCateg");
const modImag = document.getElementById("modImagen");
const modImagLiga = document.getElementById("modImagenLiga");
const btnElim = document.getElementById("btn-elim");

// Form agregar
const addForm = document.getElementById("formAddProduct");
const addNombre = document.getElementById("addNom");
const addDesc = document.getElementById("addDesc");
const addPrecio = document.getElementById("addPrecio");
const addExist = document.getElementById("addExist");
const addCateg = document.getElementById("addCateg");
const addImag = document.getElementById("addImagen");

// Tablas
const tableAll = document.getElementById("table-all");
const tableCateg = document.getElementById("table-categ");

// Mostrar productos al cargar la página
document.addEventListener('DOMContentLoaded', async () =>{
    // Revisar si es administrador
    try {
        const res = await fetch(`${API_BASE_URL}/api/admin/esAdmin`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        });

        let data;
        try {
            data = await res.json();
        } catch (parseErr) {
            console.warn("Respuesta no JSON del servidor", parseErr);
        }

        if (!res.ok) {
            location.href = "index.html";
        } 
    } catch (err) {
        console.error("Error al conectar con el servidor:", err);
        swal("Error", "Error de conexión con el servidor, reenviando a inicio.", "error", {
            buttons: false,
            timer: 3500,
            closeOnClickOutside: false,
            closeOnEsc: false,
        });
        setTimeout(function(){location.href = "index.html"},3000)
    }
    
    mostrarTodosProductos();
    mostrarTablasReporte();
});

// Funcion para mostrarproductos (es llamada por varias funciones)
async function mostrarTodosProductos() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/obtenerProductos`);
        const data = await response.json();
        let img;
        
        if (response.ok) {
            // Obtener imagenes
            try{
                const response = await fetch(`${API_BASE_URL}/api/imagenes/obtenerImagenes`);
                img = await response.json();

                if(!response.ok){
                    swal("Error", data.msg || "Hubo un error al cargar los productos", "error");
                }
            } catch {
                console.error('Error: No se pudo conectar con el servidor', error);
                swal("Error", "No se pudo conectar con el servidor", "error");
            }

            var prodCont = document.getElementById("prod-container");
            // Limpiar el contenedor de los productos
            prodCont.innerHTML= "";
            
            // Agregar todos los productos obtenidos por data
            for(var i=0; i<data.length;i++){
                prodCont.innerHTML +=
                `<div class="a-product-card">
                    <img src="${img.vectorImg.find(j => j.nombre === data[i].imagen).data}" alt="">
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

async function mostrarTablasReporte() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/reporteVentas`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        });
        const data = await response.json();

        if(response.ok){
            // Donas
            let tablaTotal = document.createElement("table");

            tablaTotal.innerHTML =
                `<caption>Todos los productos</caption>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoria</th>
                        <th>Precio</th>
                        <th>Ventas</th>
                    </tr>`;

            data.ventas.forEach(prod => {
                tablaTotal.innerHTML +=
                    `<tr>
                        <td>${prod.id}</td>
                        <td>${prod.nombre}</td>
                        <td>${prod.categoria}</td>
                        <td>${prod.precio}</td>
                        <td>${prod.ventas}</td>
                    </tr>
                    `;
            });

            tableAll.append(tablaTotal);

            mostrarTablasCategoria();
        } else {
            swal("Error", data.msg || "Hubo un error al cargar los productos", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
};

async function mostrarTablasCategoria() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/inventario`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        });
        const data = await response.json();

        if(response.ok){
            // Donas
            let tablaDonas = document.createElement("table");

            tablaDonas.innerHTML =
                `<caption>Categoría: Donas</caption>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Existencia</th>
                    </tr>`;

            data.ventas.forEach(prod => {
                if(prod.categoria === 1){
                    tablaDonas.innerHTML +=
                        `<tr>
                            <td>${prod.id}</td>
                            <td>${prod.nombre}</td>
                            <td>${prod.existencia}</td>
                        </tr>
                        `;
                }
            });

            // Bebidas
            let tablaDrink = document.createElement("table");

            tablaDrink.innerHTML =
                `<caption>Categoría: Bebidas</caption>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Existencia</th>
                    </tr>`;

            data.ventas.forEach(prod => {
                if(prod.categoria === 2){
                    tablaDrink.innerHTML +=
                        `<tr>
                            <td>${prod.id}</td>
                            <td>${prod.nombre}</td>
                            <td>${prod.existencia}</td>
                        </tr>
                        `;
                }
            });

            // Souvenir
            let tablaSouv = document.createElement("table");

            tablaSouv.innerHTML =
                `<caption>Categoría: Souvenirs</caption>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Existencia</th>
                    </tr>`;

            data.ventas.forEach(prod => {
                if(prod.categoria === 3){
                    tablaSouv.innerHTML +=
                        `<tr>
                            <td>${prod.id}</td>
                            <td>${prod.nombre}</td>
                            <td>${prod.existencia}</td>
                        </tr>
                        `;
                }
            });

            tableCateg.append(tablaDonas);
            tableCateg.append(tablaDrink);
            tableCateg.append(tablaSouv);
        } else {
            swal("Error", data.msg || "Hubo un error al cargar los productos", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
}

// Buscar y mostrar el producto encontrado
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const idSearch = searchIdInput.value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/products/obtenerProducto/${idSearch}`);
        const data = await response.json();
        let img;

        // Obtener imagenes
        try{
            const response = await fetch(`${API_BASE_URL}/api/imagenes/obtenerImagenes`);
            img = await response.json();

            if(!response.ok){
                swal("Error", data.msg || "Hubo un error al cargar los productos", "error");
            }
        } catch {
            console.error('Error: No se pudo conectar con el servidor', error);
            swal("Error", "No se pudo conectar con el servidor", "error");
        }
        
        if (response.ok) {
            const searchCont = document.getElementById("search-container");

            // Configura el form
            var setImg = searchCont.getElementsByTagName("img")[0];
            var setName = searchCont.getElementsByTagName("h2")[0];
            var setId = searchCont.getElementsByTagName("h3")[0];
            var setInfo = searchCont.getElementsByTagName("h4")[0];
            var setDesc = searchCont.getElementsByTagName("p")[0];

            setImg.innerHTML = `${img.vectorImg.find(i => i.nombre === data.imagen).data}`;
            setName.innerHTML = `${data.nombre}`;
            setId.innerHTML = `ID: ${data.id}`;
            setInfo.innerHTML = `Categoria: ${data.categoria} | Precio: ${data.precio} | Existencias: ${data.existencia} | Ventas: ${data.ventas}`;
            setDesc.innerHTML = `${data.descripcion}`;

            // Inputs
            modNombre.setAttribute("placeholder",`${data.nombre}`);
            modDesc.setAttribute("placeholder",`${data.descripcion}`);
            modPrecio.setAttribute("placeholder",`${data.precio}`);
            modVentas.setAttribute("placeholder",`${data.ventas}`);
            modExist.setAttribute("placeholder",`${data.existencia}`);
            modCateg.setAttribute("placeholder",`${data.categoria}`);
            modImagLiga.value = `${img.vectorImg.find(j => j.nombre === data[idSearch].imagen).data}`;
            
            // Activar botones
            btnElim.removeAttribute("disabled");
            const btnModify = document.getElementById("btn-modify");
            btnModify.removeAttribute("disabled");
            const btnReset = document.getElementById("btn-modify");
            btnReset.removeAttribute("disabled");
        } else {
            swal("Error", data.msg || "Hubo un error al cargar los productos", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
});

// Modificar un producto en específico
modForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtiene el ID del elemento a
    const searchCont = document.getElementById("search-container");
    let idSearch = searchCont.getElementsByTagName("h3")[0].innerText.substring(4);

    const nomProd = modNombre.value || modNombre.getAttribute("placeholder");
    const precioProd = modPrecio.value || modPrecio.getAttribute("placeholder");
    const descProd = modDesc.value || modDesc.getAttribute("placeholder");
    const existProd = modExist.value || modExist.getAttribute("placeholder");
    const categProd = modCateg.value || modCateg.getAttribute("placeholder");
    const ventasProd = modVentas.value || modVentas.getAttribute("placeholder");
    const imgName = modImag.value.split(/(\\|\/)/g).pop() || modImagLiga.value;

    if(!(imgName === modImagLiga.value)){
        // Guardar imagen en backend
        const imgProd = modImag.files[0];

        let base64String = "";
        const reader = new FileReader();

        reader.onload = async () => {
            base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        
            try {
                const response = await fetch(`${API_BASE_URL}/api/imagenes/guardarImagen`, {
                    method: "POST",
                        headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        imagenBase64: base64String,
                        nombre: imgName
                    })
                });
                const data = await response.json();

                if(!response.ok){
                    swal("Error", data.msg || "Hubo un error al agregar la imagen", "error");
                }
            } catch (error) {
                console.error('Error: No se pudo conectar con el servidor', error);
                swal("Error", "No se pudo conectar con el servidor", "error");
            }
        }
        reader.readAsDataURL(imgProd);
    }
    // else {
    //     try{
    //         const response = await fetch(`${API_BASE_URL}/api/products/obtenerProductos`);
    //         const data = await response.json();
    //         let img;
    //         // Obtener imagenes
    //         try{
    //             const response = await fetch(`${API_BASE_URL}/api/imagenes/obtenerImagenes`);
    //             img = await response.json();

    //             if(!response.ok){
    //                 swal("Error", data.msg || "Hubo un error al cargar los productos", "error");
    //             } else {
    //                 imgName = img.vectorImg.find(j => j.nombre === data[idSearch].imagen).data;
    //             }
    //         } catch {
    //             console.error('Error: No se pudo conectar con el servidor', error);
    //             swal("Error", "No se pudo conectar con el servidor", "error");
    //         }
    //     } catch (error) {
    //         console.error('Error: No se pudo conectar con el servidor', error);
    //         swal("Error", "No se pudo conectar con el servidor", "error");
    //     }
    // }

    try {
        const response = await fetch(`${API_BASE_URL}/api/products/actualizarProducto/${idSearch}`, {
            method: "PUT",
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
                imagen: imgName,
                ventas: ventasProd
            })
        });
        const data = await response.json();

        if(response.ok){
            swal("Éxito", data.msg || "Se modificó el producto correctamente", "success");
            mostrarTodosProductos();
            mostrarTablasReporte();
        } else {
            swal("Error", data.msg || "Hubo un error al modificar el producto", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    } finally {
        // Restablecer el form
        var setName = searchCont.getElementsByTagName("h2")[0];
        var setId = searchCont.getElementsByTagName("h3")[0];
        var setInfo = searchCont.getElementsByTagName("h4")[0];
        var setDesc = searchCont.getElementsByTagName("p")[0];

        setName.innerHTML = `Nombre`;
        setId.innerHTML = `ID: ???`;
        setInfo.innerHTML = `Categoria: ??? | Precio: ??? | Existencias: ??? | Ventas: ???`;
        setDesc.innerHTML = `Descripción`;

        // Inputs
        modNombre.setAttribute("placeholder",`Nombre`);
        modDesc.setAttribute("placeholder",`Descripción`);
        modPrecio.setAttribute("placeholder",`00.00`);
        modVentas.setAttribute("placeholder",`00.00`);
        modExist.setAttribute("placeholder",`00.00`);
        modCateg.setAttribute("placeholder",`1`);
            
        // Desactivar botones
        btnElim.setAttribute("disabled");
        const btnModify = document.getElementById("btn-modify");
        btnModify.setAttribute("disabled");
        const btnReset = document.getElementById("btn-modify");
        btnReset.setAttribute("disabled");
    }
});

// Eliminar un producto en específico
btnElim.addEventListener("click", async () => {
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
            mostrarTablasReporte();
        } else {
            swal("Error", data.msg || "Hubo un error al eliminar el producto", "error");
        }
    } catch (error) {
        console.error(error)
        swal("Error", "No se pudo conectar al servidor", "error")
    } finally {
        // Restablecer el form
        var setName = searchCont.getElementsByTagName("h2")[0];
        var setId = searchCont.getElementsByTagName("h3")[0];
        var setInfo = searchCont.getElementsByTagName("h4")[0];
        var setDesc = searchCont.getElementsByTagName("p")[0];

        setName.innerHTML = `Nombre`;
        setId.innerHTML = `ID: ???`;
        setInfo.innerHTML = `Categoria: ??? | Precio: ??? | Existencias: ??? | Ventas: ???`;
        setDesc.innerHTML = `Descripción`;

        // Inputs
        modNombre.setAttribute("placeholder",`Nombre`);
        modDesc.setAttribute("placeholder",`Descripción`);
        modPrecio.setAttribute("placeholder",`00.00`);
        modVentas.setAttribute("placeholder",`00.00`);
        modExist.setAttribute("placeholder",`00.00`);
        modCateg.setAttribute("placeholder",`1`);
            
        // Desactivar botones
        btnElim.setAttribute("disabled");
        const btnModify = document.getElementById("btn-modify");
        btnModify.setAttribute("disabled");
        const btnReset = document.getElementById("btn-modify");
        btnReset.setAttribute("disabled");
    }
});

// Agregar un nuevo producto a la base de datos
addForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    alert("click Agregar");

    const nomProd = addNombre.value;
    const precioProd = addPrecio.value;
    const descProd = addDesc.value;
    const existProd = addExist.value;
    const categProd = addCateg.value;
    const imgName = addImag.value.split(/(\\|\/)/g).pop();

    // Guardar imagen en backend
    const imgProd = addImag.files[0];

    let base64String = "";
    const reader = new FileReader();

    reader.onload = async () => {
        base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
    
        try {
            const response = await fetch(`${API_BASE_URL}/api/imagenes/guardarImagen`, {
                method: "POST",
                    headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    imagenBase64: base64String,
                    nombre: imgName
                })
            });
            const data = await response.json();

            if(!response.ok){
                swal("Error", data.msg || "Hubo un error al agregar la imagen", "error");
            }
        } catch (error) {
            console.error('Error: No se pudo conectar con el servidor', error);
            swal("Error", "No se pudo conectar con el servidor", "error");
        }
    }
    reader.readAsDataURL(imgProd);

    // Guardar nuevo producto
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/registrarProducto`, {
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
                imagen: imgName
            })
        });
        const data = await response.json();

        if(response.ok){
            swal("Éxito", data.msg || "Se agregó el producto correctamente", "success");
            mostrarTodosProductos();
            mostrarTablasReporte();
        } else {
            swal("Error", data.msg || "Hubo un error al agregar el producto", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
});
