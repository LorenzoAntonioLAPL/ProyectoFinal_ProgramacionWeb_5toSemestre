import path from "path";
import dotenv from "dotenv";

// Cargar variables de entorno desde /backend/.env
dotenv.config({
  path: path.resolve(process.cwd(), ".env")
});

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/productos.routes.js";
import imgRoutes from "./routes/img.routes.js";
<<<<<<< HEAD
<<<<<<< HEAD
import listaRoutes from "./routes/listaDeseos.routes.js";
import carritoRoutes from "./routes/carrito.routes.js";
<<<<<<< HEAD
=======
>>>>>>> 8e190a4 (Añadidas funciones de los productos, graficas e imagenes)
=======
import listaRoutes from "./routes/listaDeseos.routes.js";
>>>>>>> ac88a46 (Arreglo de errores y funciones de lista de deseos)
=======
>>>>>>> 9184ba9 (Arreglo de errores y añadidas funciones del carrito de compra)
import extraRoutes from "./routes/extras.routes.js";
import connection from "./database/db.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { isAdmin } from "./middleware/isAdmin.js";


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);
app.use("/api/imagenes", imgRoutes);
app.use("/api/extras", extraRoutes);
<<<<<<< HEAD
<<<<<<< HEAD
app.use("/api/listaDeseos", listaRoutes);
app.use("/api/carritoCompra", carritoRoutes);
<<<<<<< HEAD
=======
>>>>>>> 8e190a4 (Añadidas funciones de los productos, graficas e imagenes)
=======
app.use("/api/listaDeseos", listaRoutes);
>>>>>>> ac88a46 (Arreglo de errores y funciones de lista de deseos)
=======
>>>>>>> 9184ba9 (Arreglo de errores y añadidas funciones del carrito de compra)

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
