const API_BASE_URL = 'https://proyectofinal-programacionweb-5tosemestre.onrender.com';

async function generarGrafica() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/extras/datosGrafica`);
        const data = await response.json();
        
        if (response.ok) {
            const ctx = document.getElementById("grafica").getContext("2d");
            const titulos = data.datosTitulos;
            const valores = data.datosVentas;

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: titulos,
                    datasets: [{
                        label: 'Ventas',
                        data: valores,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales:{
                        y: { beginAtZero: true }
                    }
                }
            })
        } else {
            swal("Error", data.msg || "Hubo un error al generar la grafica", "error");
        }
    } catch (error) {
        console.error('Error: No se pudo conectar con el servidor', error);
        swal("Error", "No se pudo conectar con el servidor", "error");
    }
}