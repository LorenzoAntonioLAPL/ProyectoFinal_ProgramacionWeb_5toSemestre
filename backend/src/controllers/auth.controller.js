import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { 
  findUserByEmail, 
  createUser, 
  updateAttempts 
} from "../models/user.model.js";


// REGISTRO
export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

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
  const { email, password } = req.body

  try {
    const user = await findUserByEmail(email)

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
