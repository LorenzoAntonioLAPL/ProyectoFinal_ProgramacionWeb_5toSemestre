import { sendEmail,receiveEmail } from "../utils/sendEmail.js";

export const enviarContact = async (req, res) => {
    console.log("Enviar Contacto");
    try {
        const { nombre, correo, asunto, mensaje } = req.body;

        const htmlMensaje = 
            `${mensaje}<br>
            — ${nombre}`;

        receiveEmail(nombre,correo,asunto,htmlMensaje);
    } catch (error) {
        console.log('Error al enviar correo:', error);
        res.status(500).json({ mensaje: 'Error al enviar correo' });
    }
}

export const subscribir = async (req, res) => {
    try {
        const { correo } = req.body;

        const htmlMensaje =
        `<div style="text-align: center">
            <img src"../assets/LogoDona.png"><br>
            <h2>Gracias por suscribirse aa</h2><br><br>
            <h1>Papa's Donuterí</h1><br>
            <h3>Donut Worry Be Happy</h3><br><br>
            <p>Sea bienvenido/a/e</p>`;

        sendEmail(correo,"Confirmación de Subscripción",htmlMensaje);
    } catch (error) {
        console.log('Error al enviar correo:', error);
        res.status(500).json({ mensaje: 'Error al enviar correo' });
    }
}