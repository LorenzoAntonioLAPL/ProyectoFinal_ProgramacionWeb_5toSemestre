import { Router } from "express";
import { añadirCarrito,
    eliminarCarrito,
    obtenerCarrito,
    obtenerTotalCarrito } from "../controllers/carrito.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.put('/añadirProducto/:idProducto', verifyToken, añadirCarrito);
router.put('/eliminarProducto/:idProducto', verifyToken, eliminarCarrito);
router.get("/obtenerCarrito", verifyToken, obtenerCarrito);
router.get("/obtenerTotalCarrito", verifyToken, obtenerTotalCarrito);

export default router;