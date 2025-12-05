import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_APP, // mi correo
        pass: process.env.EMAIL_PASS // app password
      }
    });

    const options = {
      from: `"Soporte - Papa's Donuteria" <${process.env.EMAIL_APP}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(options);
    console.log("Correo enviado a:", to);

  } catch (error) {
    console.log("ERROR enviando email", error);
  }
};
