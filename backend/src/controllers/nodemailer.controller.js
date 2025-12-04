const nodemailer = require('nodemailer'); 

//Transportador para direccionar los correos al destinatario
const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: "lacomunidaddeltropiezoxd@gmail.com",
        pass: "SindicatoHG2025",
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
});

const sendMail = async (req, res) => {

  const {nombre, correo, asunto, mensaje} = req.params;

  try {
    const email = await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to: correo,
      subject: asunto,
      text: mensaje
    });

    console.log("Correo enviado: ", email)
    res.status(200).json({ mensaje: 'Correo enviado con exito!'});
  } catch (error) {
    console.error('Error al enviar el mensaje: ', error); 
    res.status(500).json({ mensaje: 'Error al obtener penviar el correo'}); 
  }
}

module.exports = transporter;