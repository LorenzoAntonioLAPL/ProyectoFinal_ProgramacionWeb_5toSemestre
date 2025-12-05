import { Router } from "express";
import { agregarLista,
    eliminarLista,
    obtenerLista } from "../controllers/listaDeseos.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.put('/agregarProducto/:idProducto', verifyToken, agregarLista);
router.put('/eliminarProducto/:idProducto', verifyToken, eliminarLista);
router.get("/obtenerLista", verifyToken, obtenerLista);

export default router;