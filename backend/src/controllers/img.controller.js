// 1. IMPORTACIONES CORREGIDAS
// Usamos fs/promises para que el await funcione correctamente (asincronía no bloqueante)
import * as fs from "fs/promises" 
import * as path from "path"
import { fileURLToPath } from 'url'; // NECESARIO para obtener rutas en módulos ES

import * as ProductoModel from "../models/productos.model.js"

// 2. DEFINICIÓN DE __dirname y __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3. DEFINICIÓN DE RUTA ABSOLUTA
const RUTA_IMGS = path.join(__dirname, '..', 'assets'); 


export const getImagenes = async (req, res) => { 
  try { 
     const productos = await ProductoModel.getAllProducts(); 
 
      if (!productos || productos.length === 0) {
      throw new Error('Error al obtener los productos');
    }

    const NOM_IMAGENES = [];
    for(const producto of productos){
      NOM_IMAGENES.push(producto.imagen);
    }

    if (NOM_IMAGENES.length === 0) {
      throw new Error('Error al obtener las imagenes');
   }
    
    const imagenes = [];

    for(const imagen of NOM_IMAGENES){
      // Usamos la RUTA_IMGS absoluta para un acceso correcto al archivo
      const imagePath = path.join(RUTA_IMGS, imagen); 
      const imagenBase64 = await convertirImagen(imagePath);

      if(!imagenBase64) continue;

      const extension = path.extname(imagePath).substring(1);

      imagenes.push({
        nombre: path.basename(imagePath),
        tipo: `image/${extension}`,
        base64: imagenBase64,
        data: `data:image/${extension};base64,${imagenBase64}`
      });
    }

    res.status(200).json({ 
        nombres: NOM_IMAGENES,
        vectorImg: imagenes 
    });
  } catch (error) { 
    console.error('Error: ocurrio un error al obtener las imagenes', error); 
    res.status(500).json({ mensaje: 'Error: ocurrio un error al obtener las imagenes' }); 
  } 
};

// Función auxiliar, ahora verdaderamente asíncrona
const convertirImagen = async (rutaImagen) => {
  try{
    // Usamos fs.readFile de fs/promises
    const fileBuffer = await fs.readFile(rutaImagen); 
    return fileBuffer.toString('base64');
  }
  catch(error){
    console.error('Error: error al convertir la imagen', error); 
    return null;
  }
}


export const guardarImagenes = async (req, res) => {
  try{
    const { imagenBase64, nombre } = req.body;

    if(!imagenBase64 || !nombre){
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' }); 
    }

    const buffer = Buffer.from(imagenBase64, 'base64');

    // Usamos la ruta absoluta y la versión asíncrona
    const filePath = path.join(RUTA_IMGS, nombre);
    await fs.writeFile(filePath, buffer); // fs.writeFile de fs/promises

    res.status(200).json({ 
        mensaje: 'Imagen guardada correctamente',
        ruta: filePath
    });
  }
  catch(error){
    console.error('Error:', error); 
    res.status(500).json({ mensaje: 'Error' }); 
  }
}