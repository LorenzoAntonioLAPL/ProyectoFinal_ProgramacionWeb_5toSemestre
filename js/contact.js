const formContact = document.getElementById("formContact");

formContact.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apPat = document.getElementById("apPaterno").value;
    const apMat = document.getElementById("apMaterno").value;
    const email = document.getElementById("email").value;
    const asunto = document.getElementById("asunto").value;
    const mensaje = document.getElementById("mensaje").value;

    let nombreCompleto = nombre;

    if(apPat){
        nombreCompleto += " " + apPat;
    }

    if(apMat){
        nombreCompleto += " " + apMat;
    }
    
    try {
        const res = await fetch("http://localhost:3000/api/mensaje", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombreCompleto,
                correo: email,
                asunto: asunto,
                mensaje: mensaje
            })
        });

        if (res.ok) {
            swal("Mensaje enviado con éxito","Responderemos, eventualmente.","success");
        } else {
            const data = await res.json();
            let messageError = data?.error ?? `Error al cerrar sesión`;

            swal("Error", messageError, "error");
        }
    } catch (err) {
        console.error("Error al conectar con el servidor:", err);
        swal("Error", "Error de conexión con el servidor.", "error");
    } finally {
        const nombreInput = document.getElementById("nombre");
        const apPatInput = document.getElementById("apPaterno");
        const apMatInput = document.getElementById("apMaterno");
        const emailInput = document.getElementById("email");
        const asuntoInput = document.getElementById("asunto");
        const mensajeInput = document.getElementById("mensaje");

        if(nombreInput) nombreInput.value = "";
        if(apPatInput) apPatInput.value = "";
        if(apMatInput) apMatInput.value = "";
        if(emailInput) emailInput.value = "";
        if(asuntoInput) asuntoInput.value = "";
        if(mensajeInput) mensajeInput.value = "";
    }
});