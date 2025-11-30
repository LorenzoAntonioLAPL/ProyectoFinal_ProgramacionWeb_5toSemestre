import path from "path";
import dotenv from "dotenv";

// Cargar variables de entorno desde /backend/.env
dotenv.config({
  path: path.resolve(process.cwd(), ".env")
});

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import connection from "./database/db.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { isAdmin } from "./middleware/isAdmin.js";


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Ruta normal para usuarios con login
app.get("/api/perfil", verifyToken, (req, res) => {
  res.json({
    msg: "Acceso autorizado",
    usuario: req.user
  });
});

// Ruta protegida solo ADMIN
app.get("/api/admin", verifyToken, isAdmin, (req, res) => {
  res.json({
    msg: "Bienvenido administrador",
    usuario: req.user
  });
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando...");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Comprobar conexión
try {
  const conn = await connection.getConnection();
  console.log("✅ Conectado a Railway MySQL");
  conn.release();
} catch (error) {
  console.error("❌ Error en la BD:", error.message);
}
