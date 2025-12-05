import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,        // ESTE ES EL IMPORTANTE
    secure: false,     // false para 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  await transporter.sendMail({
    from: `"Soporte" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });

};


