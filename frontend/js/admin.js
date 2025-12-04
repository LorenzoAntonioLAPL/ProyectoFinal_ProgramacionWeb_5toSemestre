const API_BASE_URL = 'http://localhost:3000/api/prueba';

async function generarGrafica() {
    try {
        const response = await fetch(`${API_BASE_URL}/datos`);
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
            alert("ERROR 1");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("ERROR 2");
    }
}