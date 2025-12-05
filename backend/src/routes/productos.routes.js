import { Router } from "express"
import {
  getProductos,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateVentas,
  getProductByCategoria
} from "../controllers/productos.controller.js"

import { verifyToken } from "../middleware/verifyToken.js"
import { isAdmin } from "../middleware/isAdmin.js"

const router = Router()

router.get("/obtenerProductos", getProductos)
router.get("/obtenerProducto/:id", getProductById)
router.post("/registrarProducto", verifyToken, isAdmin, createProduct)
router.put("/actualizarProducto/:id", verifyToken, isAdmin, updateProduct)
router.put("/actualizarVentas/:id", verifyToken, updateVentas)
router.delete("/borrarProducto/:id", verifyToken, isAdmin, deleteProduct)
router.get("/obtenerProductoCategoria/:categoria", getProductByCategoria)

export default router;
