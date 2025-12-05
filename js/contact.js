const btnContact = document.getElementById("submitCorreoBtn");

btnContact.addEventListener("click", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const asunto = document.getElementById("asunto").value;
    const mensaje = document.getElementById("mensaje").value;
    
    try {
        const res = await fetch("http://localhost:3000/api/mensaje", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
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
        console.log(`correo enviado: nombre: ${nombre}, \n correo: ${email}, \n asunto: ${asunto}, \n mensaje: ${mensaje} `);
    }
});