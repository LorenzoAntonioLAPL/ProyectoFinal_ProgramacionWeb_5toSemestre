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
            <img src"../assets/LogoDona.png">
            <h2>Gracias por suscribirse a</h2><br>
            <h1>Papa's Donutería</h1>
            <h3 style="font-style:italic">Donut Worry, Be Happy</h3><br>
            <p>Sea bienvenido/a/e</p>`;

        console.log(correo, htmlMensaje);

        if(sendEmail(correo,"Confirmación de Subscripción",htmlMensaje)){
            console.log("Correo Enviado");
            res.status(200).json({ mensaje: 'Correo enviado correctamente' });
        } else {
            res.status(500).json({ mensaje: 'Error al enviar correo' });
        }
    } catch (error) {
        console.log('Error al enviar correo:', error);
        res.status(500).json({ mensaje: 'Error al enviar correo' });
    }
}