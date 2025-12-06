import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try{
    let sentMail = await transporter.sendMail({
      from: `"Soporte" <${process.env.SMTP_USER}>`,
      to: `${to}`,
      subject: `${subject}`,
      html: `${html}`
    });
    console.log('Correo enviado', sentMail);
  } catch (err) {
    console.error('Error enviando correo: ',err);
  }
};

export const receiveEmail = async (from, subject, html) => {

  console.log(to, subject, html);


  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "465",
    secure: true,
    auth: {
      user: "papasdonuteria517@gmail.com",
      pass: "appgjrwdjqjillsk"
    }
  });

  try{
    let sentMail = await transporter.sendMail({
      from: `${from}>`,
      to: `${process.env.SMTP_USER}`,
      subject: `${subject}`,
      html: `${html}`
    });
    console.log('Correo enviado', sentMail);
  } catch (err) {
    console.error('Error enviando correo: ',err);
  }
};
