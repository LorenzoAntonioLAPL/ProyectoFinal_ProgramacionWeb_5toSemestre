import * as ProductoModel from "../models/productos.model.js"

export const getDatos = async (req, res) => { 
  try { 
    const productos = await ProductoModel.getAllProducts(); 
    
    if (!productos || productos.length === 0) {
      throw new Error('Error al obtener los productos');
    }
    const VENTAS = [ 0, 0, 0 ];
    const TITULOS = [ "Dona", "Bebida", "Souvenirs" ];

    for(const producto of productos){
      VENTAS[producto.categoria - 1] += producto.ventas;
    }

    res.status(200).json({
        message: "Datos Listos",
        datosTitulos: TITULOS,
        datosVentas: VENTAS
    });
  } catch (error) { 
    console.error('Error: error al obtener los datos de los productos', error); 
    res.status(500).json({ mensaje: 'Error al obtener los datos de los productos' }); 
  } 
}; 