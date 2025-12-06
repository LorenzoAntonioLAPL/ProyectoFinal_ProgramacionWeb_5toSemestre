const formEnviar = document.getElementById("formContact");

formEnviar.addEventListener("submit", async (e) => {
    e.preventDefault()

    const nombre = document.getElementById("nombreContact").value;
    const email = document.getElementById("email").value;
    const asunto = document.getElementById("asunto").value;
    const mensaje = document.getElementById("mensaje").value;
    
    try {
        const res = await fetch(`${API_BASE_URL}/api/contacto/enviarContacto`, {
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
        const data = await res.json();

        if (res.ok) {
            swal("Mensaje enviado con éxito","Responderemos, eventualmente.","success");
        } else {
            let messageError = data?.error ?? `Error al cerrar sesión`;
            swal("Error", messageError, "error");
        }
    } catch (err) {
        console.error("Error al conectar con el servidor:", err);
        swal("Error", "Error de conexión con el servidor.", "error");
    } finally {
        document.getElementById("nombreContact").value = "";
        document.getElementById("email").value = "";
        document.getElementById("asunto").value = "";
        document.getElementById("mensaje").value = "";
    }
});