
/*import nodemailer from "nodemailer"; 

//Transportador para direccionar los correos al destinatario
export const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: process.env.Email_User,
        pass: process.env.Email_Password,
    }
});

export const sendMail = async (req, res) => {

  const {nombre, correo, asunto, mensaje} = req.params;

  try {
    const email = await transporter.sendMail({
      from: process.env.Email_User,
      to: process.env.Email_Password,
      subject: "ejemplo",
      text: "ejemplo"
    });
    
    console.log("Correo enviado: ", email)
    res.status(200).json({ mensaje: 'Correo enviado con exito!'});
  } catch (error) {
    console.error('Error al enviar el mensaje: ', error); 
    res.status(500).json({ mensaje: 'Error al obtener enviar el correo'}); 
  }
}*/

// Import the Nodemailer library
import nodemailer from "nodemailer";

export const sendMail = async (req, res) => {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use false for STARTTLS; true for SSL on port 465
    auth: {
      user: process.env.Email_User,
      pass: process.env.Email_Password,
    }
  });

  // Configure the mailoptions object
  const mailOptions = {
    from: process.env.Email_User,
    to: process.env.Email_User,
    subject: "Ejemplo",
    text: 'That was easy!'
  };

  // Send the email
 transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.error('Error al enviar el mensaje: ', error); 
      res.status(500).json({ mensaje: 'Error al obtener enviar el correo'});
    } else {
      console.log("Correo enviado: ", email)
      res.status(200).json({ mensaje: 'Correo enviado con exito!'});
    }
  });
}

