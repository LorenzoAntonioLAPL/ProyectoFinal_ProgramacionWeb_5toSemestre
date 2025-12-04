import nodemailer from "nodemailer"; 

//Transportador para direccionar los correos al destinatario
export const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: "lacomunidaddeltropiezoxd@gmail.com",
        pass: "SindicatoHG2025",
    }
});

export const sendMail = async (req, res) => {

  const {nombre, correo, asunto, mensaje} = req.params;

  try {
    const email = await transporter.sendMail({
      from: "lacomunidaddeltropiezoxd@gmail.com",
      to: "fernandodava203@gmail.com",
      subject: "ejemplo",
      text: "ejemplo"
    });

    console.log("Correo enviado: ", email)
    res.status(200).json({ mensaje: 'Correo enviado con exito!'});
  } catch (error) {
    console.error('Error al enviar el mensaje: ', error); 
    res.status(500).json({ mensaje: 'Error al obtener penviar el correo'}); 
  }
}