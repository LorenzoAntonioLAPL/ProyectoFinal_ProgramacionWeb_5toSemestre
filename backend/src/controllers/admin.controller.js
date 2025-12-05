import * as ProductoModel from "../models/productos.model.js"

export const reporteVentas = async (req, res) => { 
  try { 
    const productos = await ProductoModel.getAllProducts(); 
    
    if (!productos || productos.length === 0) {
      throw new Error('Error al obtener los productos');
    }

    //id, nombre, precio, descripcion, existencia, categoria, imagen, ventas
    const productosVentas = productos.map(({id, nombre, precio, categoria, ventas}) => ({
        id, nombre, precio, categoria, ventas
    }));

    res.status(200).json({
        message: "Datos Listos",
        ventas: productosVentas
    });
  } catch (error) { 
    console.error('Error: error al obtener el reporte de ventas', error); 
    res.status(500).json({ mensaje: 'Error al obtener el reporte de ventas' }); 
  } 
}; 

//inventario por categoria
export const inventarioCategoria = async (req, res) => { 
  try { 
    const productos = await ProductoModel.getAllProducts(); 
    
    if (!productos || productos.length === 0) {
      throw new Error('Error al obtener los productos');
    }

    //id, nombre, precio, descripcion, existencia, categoria, imagen, ventas
    const productosExistencia = productos.map(({id, nombre, existencia, categoria}) => ({
        id, nombre, existencia, categoria
    }));

    res.status(200).json({
        message: "Datos Listos",
        ventas: productosExistencia
    });
  } catch (error) { 
    console.error('Error: error al obtener el inventario', error); 
    res.status(500).json({ mensaje: 'Error al obtener el inventario' }); 
  } 
}; 

export const esAdmin = async (req, res) => { 
  try { 
    res.status(200).json({
        message: "El usuario es un Administrador"
    });
  } catch (error) { 
    console.error('Error: error al comprobar administrador', error); 
    res.status(500).json({ mensaje: 'Error al comprobar administrador' }); 
  } 
}; 