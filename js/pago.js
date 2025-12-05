const prodSect = document.getElementById("pago-product");

// Metodos de pago
const metSect = document.getElementById("pago-metodo");
const radTarjeta = document.getElementById("radio-tarjeta");
const radTrans = document.getElementById("radio-trans");
const radOxxo = document.getElementById("radio-Oxxo");

let contTarjeta = document.getElementById("cont-tarjeta");

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
    try {
        const response = await fetch(`${API_BASE_URL}/api/ventas/obtenerPaises`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        });
        const data = await response.json();
        
        if (response.ok) {
            let paisCont = document.createElement("fdrm");
            paisCont.setAttribute("id","opt-pais");

            // Agregar todos los productos obtenidos por data
            for(var i=0; i<data.length;i++){
                paisCont.innerHTML +=
                `<input type="radio" id="pais${data[i].id}" name="pais-compra" value="${data[i].nombre}">
                <label for="pais${data[i].id}">${data[i].nombre}</label><br>
                `;
            }

            btnSect.append(prodCont);

            Promise.prototype.then(mostrarSubtotal());
            Promise.prototype.then(mostrarTotal());
        } else {
            swal("Error", data.msg || "Hubo un error al cargar los paises", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
});

// Mostrar formulario tarjeta
radTarjeta.addEventListener("change", () => {
    if (radTarjeta.checked) {
        let formTar = document.createElement("form");

        formTar.innerHTML =
            `<label for="tarNom">Nombre de propietario:</label>
            <input type="text" id="tarNom" class="a-product-input" placeholder="Nombre de Destinatario">
            
            <label for="tarNum">Número de tarjeta:</label>
            <input type="number" id="tarNum" class="a-product-input" pattern="[0-9]{16}" placeholder="0000000000000000">
            
            <label for="tarCVC">CVC:</label>
            <input type="number" id="tarCVC" class="a-product-input" pattern="[0-9]{3-4}" placeholder="000">
            `;
        
        contTarjeta.append(formTar);
        contTarjeta.classList.add("a-product-card");
    }
});

radTrans.addEventListener("change", () => {
    if (!radTarjeta.checked){
        contTarjeta.innerHTML = "";
        contTarjeta.classList.remove("a-product-card");
    }
});

radOxxo.addEventListener("change", () => {
    if (!radTarjeta.checked){
        contTarjeta.innerHTML = "";
        contTarjeta.classList.remove("a-product-card");
    }
});

async function mostrarSubtotal() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/ventas/obtenerSubTotal`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        });
        const data = await response.json();
        
        if (response.ok) {
            let showSubtotal = document.getElementById("p-subtotal");

            showSubtotal.innerHTML = `Subtotal: $${data.subtotal}`;
        } else {
            swal("Error", data.msg || "Hubo un error al cargar los productos", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
}

async function mostrarTotal() {
    let idPais = null;

    const contPais = document.getElementById("opt-pais");
    let btnPais = contPais.getElementsByTagName("input") || null;

    console.log("Botones Radio:",btnPais);

    btnPais.forEach(radio => {
        if(radio.checked){
            idPais = radio.getAttribute("id");
        }
    });

    if(idPais == null){
        idPais = 1;
    }

    console.log("ID Pais: ",idPais);

    // try {
    //     const response = await fetch(`${API_BASE_URL}/api/ventas/obtenerPrecio`, {
    //         method: "POST",
    //         headers: {
    //             "Authorization": `Bearer ${localStorage.getItem('token')}`,
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             idPais: idPais,
    //         })
    //     });
    //     const data = await response.json();
        
    //     if (response.ok) {
    //         let prodCont = document.createElement("div");
            
    //         // Agregar todos los productos obtenidos por data
    //         for(var i=0; i<data.length;i++){
    //             prodCont.innerHTML +=
    //             `<div class="a-product-card">
    //                 <img src="imagenes/donas.jpg" alt="">
    //                 <div class="a-product-desc">
    //                     <h2>${data[i].nombre}</h2>
    //                 </div>
    //                 <h3>$${data[i].precio}</h3>
    //             </div>
    //             `;
    //         }

    //         prodSect.append(prodCont);
    //     } else {
    //         swal("Error", data.msg || "Hubo un error al cargar los productos", "error");
    //     }
    // } catch (error) {
    //     console.error('Error: No se pudo conectar con el servidor', error);
    //     swal("Error", "No se pudo conectar con el servidor", "error");
    // }
}