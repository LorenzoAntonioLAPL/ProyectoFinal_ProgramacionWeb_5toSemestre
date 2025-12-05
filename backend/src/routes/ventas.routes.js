import { Router } from "express";
import { completarVenta, 
    obtenerPaises, 
    calcularPrecio, 
    confirmarPedido,
    pagoTarjeta,
    pagoTransferencia,
    pagoOxxo  } from "../controllers/ventas.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/CompletarVenta", verifyToken, completarVenta);
router.get("/obtenerPaises", verifyToken, obtenerPaises);
router.post("/obtenerPrecio", verifyToken, calcularPrecio);
router.get("/confirmarPedido", verifyToken, confirmarPedido);
router.post("/pagoTarjeta", verifyToken, pagoTarjeta);
router.post("/pagoTransferencia", verifyToken, pagoTransferencia);
router.post("/pagoOxxo", verifyToken, pagoOxxo);

export default router;