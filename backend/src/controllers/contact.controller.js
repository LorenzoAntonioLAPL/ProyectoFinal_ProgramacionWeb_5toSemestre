import { receiveEmail } from "../utils/sendEmail.js";

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