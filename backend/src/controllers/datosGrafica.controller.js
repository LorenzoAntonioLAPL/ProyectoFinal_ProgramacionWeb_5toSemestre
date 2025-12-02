<<<<<<< HEAD
const ProductoModel = require('../models/productos.model.js'); 

=======
>>>>>>> 8e190a4 (Añadidas funciones de los productos, graficas e imagenes)
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
<<<<<<< HEAD
    console.error('Error: error al obtener los datos de los productos', error); 
    res.status(500).json({ mensaje: 'Error al obtener los datos de los productos' }); 
=======
    console.error('Error:', error); 
    res.status(500).json({ mensaje: 'Error' }); 
>>>>>>> 8e190a4 (Añadidas funciones de los productos, graficas e imagenes)
  } 
}; 