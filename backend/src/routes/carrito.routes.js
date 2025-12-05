import { Router } from "express";
import { agregarCarrito,
    eliminarCarrito,
    obtenerCarrito } from "../controllers/carrito.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.put('/añadirProducto/:idProducto', verifyToken, agregarCarrito);
router.put('/eliminarProducto/:idProducto', verifyToken, eliminarCarrito);
router.get("/obtenerCarrito", verifyToken, obtenerCarrito);

export default router;