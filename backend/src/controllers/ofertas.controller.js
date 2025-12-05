import * as OfertasModel from "../models/ofertas.model.js"

export const getOfertas = async (req, res) => { 
  try { 
    const productosOfertas = await OfertasModel.getAllProducts(); 
    res.json(productosOfertas); 
  } catch (error) { 
    console.error('Error al obtener productos:', error); 
    res.status(500).json({ mensaje: 'Error al obtener productos' }); 
  } 
};