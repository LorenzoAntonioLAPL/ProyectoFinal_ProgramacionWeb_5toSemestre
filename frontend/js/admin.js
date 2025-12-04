const API_BASE_URL = 'https://proyectofinal-programacionweb-5tosemestre.onrender.com';

// Obtener los productos para mostrar
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/obtenerProductos`);
        const data = await response.json();
        
        if (response.ok) {
            var prodCont = document.getElementById("prod-container");
            
            // for(int i=0; i<;i++){
            //     prodCont.innerHTML =
            //     `<div class="a-product-card btn">
            //         <img src="imagenes/donas.jpg" alt="">
            //         <div class="a-product-desc">
            //             <h2>${Nombre}</h2>
            //             <h3>ID: ${id}</h3>
            //             <h3>Categoria: ${categ} | Precio: ${precio} | Existencias: ${existencia}</h3>
            //             <p>${desc}</p>
            //         </div>
            //         <button type="button" class="a-product-button btn-eliminar" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
            //         <button type="button" class="collapsible a-product-button btn-modificar" title="Modificar"><i class="fa-solid fa-gear"></i></button>
            //         <div class="a-product-modify collapse-content">
                            
            //         </div>
            //     </div>
            //     `;
            // }

            console.log(data);
        } else {
            swal("Error", data.msg || "Hubo un error al cargar los productos", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
});

function showModificar(){
    // Obtener el producto activo
    var activeObj = document.getElementByClass("active");
    var activeModify = activeObj.getElementsByClassName("a-product-modify");

    // Obtiene todos los modify de las tarjetas
    var allModify = document.getElementsByClassName("a-product-modify");

    // Borrar el contenido del espacio de modify de todos los que no son active
    for (var i = 0; i < allModify.length; i++) {
        allModify[i].innerHTML = "";
    }

    activeModify.innerHTML = 
    `<hr>
    <form action="formModProduct">
        <label for="prodNom">Nombre:</label>
        <input type="text" id="prodNom" class="a-product-input" placeholder="${nombreProd}">

        <label for="prodDesc">Descripción:</label>
        <textarea type="text" id="prodDesc" class="a-product-input input-resize" placeholder="${nombreProd}"></textarea>

        <label for="prodPrecio">Precio:</label>
        <input type="number" id="prodPrecio" class="a-product-input" min="0" step="any" placeholder="${nombreProd}">

        <label for="prodExist">Existencias:</label>
        <input type="number" id="prodExist" class="a-product-input" name="quantity" min="0" placeholder="${nombreProd}">

        <label for="prodCateg">Existencias:</label>
        <select id="cars" name="cars">
            <option value="1">Dona</option>
            <option value="2">Bebida</option>
            <option value="3">Souvenir</option>
        </select>
                            
        <label for="prodImagen">Imagen:</label>
        <input type="file" id="prodImagen" accept="image/png, image/gif, image/jpeg" name="prodImagen">

        <br><br>
                            
        <input type="submit" class="btn-modify" value="Modificar">
        <input type="reset" class="btn-modify" value="Reset">
    </form>
    `;
}

async function modificarProd(){

}

async function eliminarProd() {
    
}

async function buscarProd() {
    
}
