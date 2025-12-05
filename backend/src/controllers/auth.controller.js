import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { 
  saveResetToken,
  resetPasswordByToken,
  findUserByEmail, 
  createUser, 
  updateAttempts 
} from "../models/user.model.js";

const validarCaptcha = async (token) => {
    const secret = process.env.RECAPTCHA_SECRET;
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secret}&response=${token}`
    });

    const data = await response.json();
    return data.success;
};

// REGISTRO
export const register = async (req, res) => {
  try {

    const { nombre, email, password, captchaToken } = req.body;

    if (!captchaToken) {
      return res.status(400).json({ msg: "Captcha requerido" });
    }

    let captchaValido = await validarCaptcha(captchaToken);

    if (!captchaValido) {
      return res.status(400).json({ msg: "Debes completar el captcha correctamente" });
    }

    if (!nombre || !email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ msg: "Solo se permiten correos Gmail" })
    }
    
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ msg: "Este correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser(nombre, email, hashedPassword);

    res.status(201).json({ msg: "Usuario registrado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar usuario" });
  }

};

// LOGIN
export const login = async (req, res) => {
  const { email, password, captchaToken } = req.body;

  try {
    const user = await findUserByEmail(email)

    if (!captchaToken) {
      return res.status(400).json({ msg: "Captcha requerido" });
    }

    const captchaValido = await validarCaptcha(captchaToken);

    if (!captchaValido) {
      return res.status(400).json({ msg: "Debes completar el captcha correctamente" });
    }

    if (!user) {
      return res.status(400).json({ msg: "Credenciales incorrectas" })
    }

    // Verificar bloqueo
    if (user.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date()) {
      return res.status(403).json({
        msg: "Cuenta bloqueada. Intenta más tarde"
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      const newAttempts = user.intentos_fallidos + 1;

      let bloqueo = null;

      if (newAttempts >= 5) {
        bloqueo = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      }

      await updateAttempts(user.id, newAttempts, bloqueo);

      return res.status(401).json({
        msg: "Contraseña incorrecta",
        intentos: newAttempts
      });
    }

    // Reset intentos
    await updateAttempts(user.id, 0, null);

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      msg: "Login exitoso",
      token,
      usuario: {
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en login" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ msg: "Este correo no existe" });
    }

    // Crear token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await saveResetToken(user.id, resetToken, expires);

    const resetLink = `https://lorenzoantioniolapl.github.io/ProyectoFinal_ProgramacionWeb_5toSemestre/reset-password.html?token=${resetToken}`;

    const html = `
      <h2>Recuperar contraseña</h2>
      <p>Haz clic en el enlace para cambiar tu contraseña:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este enlace expira en 15 minutos.</p>
    `;

    await sendEmail(email, "Recuperación de Contraseña", html);

    res.json({ msg: "Correo enviado. Revisa tu bandeja" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al enviar correo" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ msg: "Datos incompletos" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await resetPasswordByToken(token, hashedPassword);

    if (!user) {
      return res.status(400).json({ msg: "Token inválido o expirado" });
    }

    res.json({ msg: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al cambiar contraseña" });
  }
};
