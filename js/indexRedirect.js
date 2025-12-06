const sendDona = document.getElementById("goDonas");
const sendBebi = document.getElementById("goBebida");
const sendSouv = document.getElementById("goSouvenir");

const formSub = document.getElementById("formSub");

document.addEventListener("DOMContentLoaded", () => {
    sendDona.addEventListener("click", () => {
        location.href = "categoria.html#formSearch";
    });

    sendBebi.addEventListener("click", () => {
        location.href = "categoria.html#TituloDonas";
    });

    sendSouv.addEventListener("click", () => {
        location.href = "categoria.html#TituloBebidas";
    });
});

formSub.addEventListener("submit", async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/contacto/suscribir`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: email
            })
        });
        const data = await res.json();

        if (res.ok) {
            swal("Suscripción realizada","Revise su correo electrónico","success");
        } else {
            let messageError = data?.error ?? `Error al intentar suscribirse`;
            swal("Error", messageError, "error");
        }
    } catch (err) {
        console.error("Error al conectar con el servidor:", err);
        swal("Error", "Error de conexión con el servidor.", "error");
    } finally {
        document.getElementById("subEmail").value = "";
    }
});