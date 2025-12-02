const ProductoModel = require('../models/productos.model.js'); 

const getProductos = async (req, res) => { 
  try { 
    const productos = await ProductoModel.getAllProducts(); 
    res.json(productos); 
  } catch (error) { 
    console.error('Error al obtener productos:', error); 
    res.status(500).json({ mensaje: 'Error al obtener productos' }); 
  } 
}; 

const getProductById = async (req, res) => { 
  try { 
    const { id } = req.params; 
    const producto = await ProductoModel.getProductById(id); 
 
    if (!producto) 
      return res.status(404).json({ mensaje: 'Producto no encontrado' }); 
 
    res.json(producto); 
  } catch (error) { 
    console.error('Error al obtener producto:', error); 
    res.status(500).json({ mensaje: 'Error al obtener producto' }); 
  } 
};

const createProduct = async (req, res) => { 
  try { 
    console.log(req.body); 

    //---------------------------------------------------------------
<<<<<<< HEAD
    const { nombre, precio, descripcion, existencia, categoria, imagen, ventas } = req.body; 
    if (!nombre || !precio || !categoria || !imagen || !descripcion ) 
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' }); 

    precio = parseFloat(precio) || 0;
    existencia = parseInt(existencia, 10) || 0;
    categoria = parseInt(categoria, 10) || 0;
    ventas = parseFloat(ventas) || 0;
 
    console.log("1"); 
    //----------------------------------------------------------------
    const id_insertado = await ProductoModel.createProduct(nombre, precio, descripcion, existencia, categoria, imagen, ventas); 
=======
    const { nombre, precio, existencia, categoria, imagen, ventas } = req.body; 
    if (!nombre || !precio || !categoria || !imagen) 
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' }); 
 
    console.log("1"); 
    //----------------------------------------------------------------
    const id_insertado = await ProductoModel.createProduct(nombre, precio, existencia, categoria, imagen, ventas); 
>>>>>>> 8e190a4 (Añadidas funciones de los productos, graficas e imagenes)
    res.status(201).json({ mensaje: 'Producto agregado', id_insertado }); 
    console.log("2"); 
  } catch (error) { 
    console.error('Error al agregar producto:', error); 
    res.status(500).json({ mensaje: 'Error al agregar producto' }); 
  } 
}; 

const updateProduct = async (req, res) => { 
  try { 
    const { id } = req.params; 
    //---------------------------------------------
<<<<<<< HEAD
    const { nombre, precio, descripcion, existencia, categoria, imagen, ventas } = req.body; 

    precio = parseFloat(precio) || 0;
    existencia = parseInt(existencia, 10) || 0;
    categoria = parseInt(categoria, 10) || 0;
    ventas = parseFloat(ventas) || 0;
 
    //-----------------------------------------------------------
    const filas = await ProductoModel.updateProduct(id, nombre, precio, descripcion, existencia, categoria, imagen, ventas); 
=======
    const { nombre, precio, existencia, categoria, imagen, ventas } = req.body; 
 
    //-----------------------------------------------------------
    const filas = await ProductoModel.updateProduct(id, nombre, precio, existencia, categoria, imagen, ventas); 
>>>>>>> 8e190a4 (Añadidas funciones de los productos, graficas e imagenes)
    if (filas === 0) 
      return res.status(404).json({ mensaje: 'Producto no encontrado' }); 
 
    res.json({ mensaje: 'Producto actualizado correctamente' }); 
  } catch (error) { 
    console.error('Error al actualizar producto:', error); 
    res.status(500).json({ mensaje: 'Error al actualizar producto' }); 
  } 
}; 

<<<<<<< HEAD
const updateVentas = async (req, res) => { 
  try { 
    const { id } = req.params; 
    const { ventas } = req.body; 

    const producto = await ProductoModel.getProductById(id); 
 
    if (!producto) 
      return res.status(404).json({ mensaje: 'Producto no encontrado' }); 

    ventas = parseFloat(ventas) || 0;
 
    const filas = await ProductoModel.updateVentas(id, producto.ventas+ventas); 
    if (filas === 0) 
      return res.status(404).json({ mensaje: 'Producto no encontrado' }); 
 
    res.json({ mensaje: 'Ventas actualizadas correctamente' }); 
  } catch (error) { 
    console.error('Error al actualizar ventas:', error); 
    res.status(500).json({ mensaje: 'Error al actualizar ventas' }); 
  } 
}; 

=======
>>>>>>> 8e190a4 (Añadidas funciones de los productos, graficas e imagenes)
const deleteProduct = async (req, res) => { 
  try { 
    const { id } = req.params; 
    const filas = await ProductoModel.deleteProduct(id); 
 
    if (filas === 0) 
      return res.status(404).json({ mensaje: 'Producto no encontrado' }); 
 
    res.json({ mensaje: 'Producto eliminado correctamente' }); 
  } catch (error) { 
    console.error('Error al eliminar producto:', error); 
    res.status(500).json({ mensaje: 'Error al eliminar producto' }); 
  } 
}; 
<<<<<<< HEAD

const getProductByCategoria = async (req, res) => { 
  try { 
    const { categoria } = req.params; 
    const productos = await ProductoModel.getProductByCategoria(categoria); 
 
    if (!productos) 
      return res.status(404).json({ mensaje: 'Producto no encontrado' }); 
 
    res.json(productos); 
  } catch (error) { 
    console.error('Error al obtener producto:', error); 
    res.status(500).json({ mensaje: 'Error al obtener producto' }); 
  } 
};
=======
>>>>>>> 8e190a4 (Añadidas funciones de los productos, graficas e imagenes)
 
module.exports = { 
  getProductos, 
  getProductById, 
  createProduct, 
  updateProduct, 
<<<<<<< HEAD
  deleteProduct,
  updateVentas,
  getProductByCategoria
=======
  deleteProduct 
>>>>>>> 8e190a4 (Añadidas funciones de los productos, graficas e imagenes)
}; 