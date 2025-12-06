const prodSect = document.getElementById("pago-product");
const showSubtotal = document.getElementById("p-subtotal");
const showEnvio = document.getElementById("p-envio");
const showImpuesto = document.getElementById("p-impuesto");
const showTotal = document.getElementById("p-total");

// Metodos de pago
const metSect = document.getElementById("pago-metodo");
const radTarjeta = document.getElementById("radio-tarjeta");
const radTrans = document.getElementById("radio-trans");
const radOxxo = document.getElementById("radio-oxxo");

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
const btnComprar = document.getElementById("btn-comprar");

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
            let paisCont = document.createElement("form");
            paisCont.setAttribute("id","opt-pais");

            paisCont.innerHTML = "<label>Escoja su país</label><br><br>"

            // Agregar todos los productos obtenidos por data
            for(var i=0; i<data.length;i++){
                paisCont.innerHTML +=
                `<input type="radio" id="pais${data[i].id}" name="pais-compra" value="${data[i].nombre}">
                <label for="pais${data[i].id}">${data[i].nombre}</label><br>
                `;
            }

            btnSect.append(paisCont);

            const radioPais = document.getElementById("opt-pais").getElementsByTagName("input");

            for(var i=0; i<radioPais.length;i++){
                radioPais[i].addEventListener("click", async () => {
                    mostrarTotal();
                });
            }

            // mostrarSubtotal()
            mostrarTotal();
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
        formTar.setAttribute("id","formTarjeta");

        formTar.innerHTML =
            `<label for="tarNom">Nombre de propietario:</label>
            <input type="text" id="tarNom" class="a-product-input" placeholder="Nombre de Destinatario" required>
            
            <label for="tarNum">Número de tarjeta:</label>
            <input type="number" id="tarNum" class="a-product-input" pattern="[0-9]{16}" placeholder="0000000000000000" required>
            
            <label for="tarCVC">CVC:</label>
            <input type="number" id="tarCVC" class="a-product-input" pattern="[0-9]{3-4}" placeholder="000" required>
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

btnComprar.addEventListener("click", () =>{
    let tarNom, tarNum, tarCVC;

    const checkEnv = envSect.getElementsByTagName("input");
    let flagEnv = false;

    for(var i=0;i<checkEnv.length;i++){
        if(!(checkEnv[i].value === "")){
            flagEnv = true;
        } else {
            flagEnv = false;
        }
    }

    const checkMet = metSect.getElementsByTagName("input");
    let flagMet = false;

    for(var i=0;i<checkMet.length;i++){
        if(checkMet[i].checked){
            flagMet = true;
            break;
        } else {
            flagMet = false;
        }
    }

    if(!flagEnv || !flagMet){
        swal("Error", "Complete el formulario y asegure de haber seleccionado un método de pago", "error");
        return;
    }

    const envNom = envNomInput.value;
    const envDir = envDirInput.value;
    const envCity = envCityInput.value;
    const envPost = envPostInput.value;
    const envTel = envTelInput.value;

    const precioTotal = showTotal.innerText.substring(8);

    // Si tarjeta de crédito fue seleccionado
    if(radTarjeta.checked) {
        tarNom = document.getElementById("tarNom").value;
        tarNum = document.getElementById("tarNum").value;
        tarCVC = document.getElementById("tarCVC").value;

        const tarCont = document.getElementById("formTarjeta").getElementsByTagName("input");
        let flagTar = false;

        for(var i=0;i<tarCont.length;i++){
            if(!(tarCont[i].value === "")){
                flagTar = true;
            } else {
                flagTar = false;
            }
        }

        if(!flagTar){
            swal("Error", "Complete el formulario de la tarjeta de crédito", "error");
            return;
        }
    }

    console.log("Elementos: ",envNom,envDir,envCity,envPost,envTel,precioTotal);
});

async function mostrarTotal() {
    let idPais = null;

    const contPais = document.getElementById("opt-pais");
    let btnPais = contPais.getElementsByTagName("input") || null;

    for(var i=0;i<btnPais.length;i++){
        if(btnPais[i].checked){
            idPais = btnPais[i].getAttribute("id").substring(4);
        }
    }

    if(idPais == null){
        idPais = 1;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/ventas/obtenerPrecio`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idPais: idPais,
            })
        });
        const data = await response.json();
        
        if (response.ok) {
            // Cambia el subtotal
            showSubtotal.removeChild(showSubtotal.lastChild);
            showSubtotal.append(`Subtotal: $${data.subtotal}`);
            // Cambiar gastos de envio
            showEnvio.removeChild(showEnvio.lastChild);
            showEnvio.append(`Envio: $${data.gastosEnvio}`);
            // Cambiar impuestos
            showImpuesto.removeChild(showImpuesto.lastChild);
            showImpuesto.append(`IVA: ${data.impuestos}`);
            // Cambia el total
            showTotal.removeChild(showTotal.lastChild);
            showTotal.append(`Total: $${data.total}`);
        } else {
            swal("Error", data.msg || "Hubo un error al cargar los productos", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
}