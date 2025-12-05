import { Router } from "express";
<<<<<<< HEAD
import { completarVenta } from "../controllers/ventas.controller.js";
=======
import { completarVenta, 
    obtenerPaises, 
    calcularPrecio, 
    confirmarPedido,
    pagoTarjeta,
    pagoTransferencia,
    pagoOxxo,
    calcularSubTotal } from "../controllers/ventas.controller.js";
>>>>>>> Oziel
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

<<<<<<< HEAD
router.put("/CompletarVenta", verifyToken, completarVenta);
=======
router.get("/CompletarVenta", verifyToken, completarVenta);
router.get("/obtenerPaises", verifyToken, obtenerPaises);
router.post("/obtenerPrecio", verifyToken, calcularPrecio);
router.get("/confirmarPedido", verifyToken, confirmarPedido);
router.post("/pagoTarjeta", verifyToken, pagoTarjeta);
router.post("/pagoTransferencia", verifyToken, pagoTransferencia);
router.post("/pagoOxxo", verifyToken, pagoOxxo);
router.get("/obtenerSubTotal", verifyToken, calcularSubTotal);
>>>>>>> Oziel

export default router;