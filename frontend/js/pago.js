const prodSect = document.getElementById("pago-product");

// Metodos de pago
const metSect = document.getElementById("pago-metodo");

// Envio
const envSect = document.getElementById("pago-envio");
const envNomInput = document.getElementById("envNom");
const envDirInput = document.getElementById("envDir");
const envCityInput = document.getElementById("envCity");
const envPostInput = document.getElementById("envPost");
const envTelInput = document.getElementById("envTel");

// Pais y pago
const btnSect = document.getElementById("pago-btns");

document.addEventListener('DOMContentLoaded', async () =>{
    // Obtener carrito
    try {
        const response = await fetch(`${API_BASE_URL}/api/carritoCompra/obtenerCarrito`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        });
        const data = await response.json();
        
        if (response.ok) {
            let prodCont = document.createElement("div");
            
            // Agregar todos los productos obtenidos por data
            for(var i=0; i<data.length;i++){
                prodCont.innerHTML +=
                `<div class="a-product-card">
                    <img src="imagenes/donas.jpg" alt="">
                    <div class="a-product-desc">
                        <h2>${data[i].nombre}</h2>
                    </div>
                    <h3>$${data[i].precio}</h3>
                </div>
                `;
            }

            prodSect.append(prodCont);
        } else {
            swal("Error", data.msg || "Hubo un error al cargar los productos", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }

    // Obtener paises
});