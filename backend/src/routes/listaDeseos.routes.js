import { Router } from "express";
import { añadirLista,
    eliminarLista,
    obtenerLista } from "../controllers/listaDeseos.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.put('/añadirProducto/:idProducto', verifyToken, añadirLista);
router.put('/eliminarProducto/:idProducto', verifyToken, eliminarLista);
router.get("/obtenerLista", verifyToken, obtenerLista);

module.exports = router;