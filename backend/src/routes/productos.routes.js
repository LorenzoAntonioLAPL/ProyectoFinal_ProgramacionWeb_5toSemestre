import { Router } from "express";
import { getProductos, 
  getProductById, 
  createProduct, 
  updateProduct, 
<<<<<<< HEAD
<<<<<<< HEAD
  deleteProduct, 
  updateVentas, 
  getProductByCategoria} from "../controllers/productos.controller.js";
=======
  deleteProduct } from "../controllers/productos.controller.js";
>>>>>>> 8e190a4 (Añadidas funciones de los productos, graficas e imagenes)
=======
  deleteProduct, 
  updateVentas, 
  getProductByCategoria} from "../controllers/productos.controller.js";
>>>>>>> ac88a46 (Arreglo de errores y funciones de lista de deseos)
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router.get("/obtenerProductos", getProductos);
router.get('/obtenerProducto/:id', getProductById);
router.post('/registrarProducto', verifyToken, isAdmin, createProduct);
router.put('/actualizarProducto/:id', verifyToken, isAdmin, updateProduct);
<<<<<<< HEAD
<<<<<<< HEAD
router.put('/actualizarVentas/:id', verifyToken, updateVentas);
router.delete('/borrarProducto/:id', verifyToken, isAdmin, deleteProduct);
router.get('/obtenerProductoCategoria/:categoria', getProductByCategoria);
=======
router.delete('/borrarProducto/:id', verifyToken, isAdmin, deleteProduct);
>>>>>>> 8e190a4 (Añadidas funciones de los productos, graficas e imagenes)
=======
router.put('/actualizarVentas/:id', verifyToken, updateVentas);
router.delete('/borrarProducto/:id', verifyToken, isAdmin, deleteProduct);
router.get('/obtenerProductoCategoria/:categoria', getProductByCategoria);
>>>>>>> ac88a46 (Arreglo de errores y funciones de lista de deseos)

module.exports = router;