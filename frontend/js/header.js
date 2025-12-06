const adminBtn = document.getElementById("adminBtn");
const deseosBtn = document.getElementById("deseosBtn");
const carritoBtn = document.getElementById("carritoBtn");

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/admin`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        });

        let data;
        try{
            data = await res.json();
        } catch (e) {

        }

        if (res.ok) {
            adminBtn.addEventListener("click", () => {
                location.href = "admin.html";
            })

            adminBtn.removeAttribute("disabled");
            adminBtn.style.display = "inline-block";
        }
    } catch (err) {
        console.error("Error al conectar con el servidor:", err);
        swal("Error", "Error de conexión con el servidor.", "error");
    }
});

deseosBtn.addEventListener("click", () => {
    location.href="lista-de-deseos.html";
});

carritoBtn.addEventListener("click", () => {
    location.href="carrito.html";
});