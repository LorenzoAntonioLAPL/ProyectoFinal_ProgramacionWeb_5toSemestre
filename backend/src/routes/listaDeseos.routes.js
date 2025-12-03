import { Router } from "express";
import { añadirLista,
    eliminarLista,
    obtenerLista } from "../controllers/listaDeseos.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

<<<<<<< HEAD
<<<<<<< HEAD
=======
idProducto

>>>>>>> ac88a46 (Arreglo de errores y funciones de lista de deseos)
=======
>>>>>>> 9184ba9 (Arreglo de errores y añadidas funciones del carrito de compra)
const router = Router();

router.put('/añadirProducto/:idProducto', verifyToken, añadirLista);
router.put('/eliminarProducto/:idProducto', verifyToken, eliminarLista);
router.get("/obtenerLista", verifyToken, obtenerLista);

module.exports = router;