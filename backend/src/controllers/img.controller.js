import fs from 'fs';
import path from 'path';
const RUTA_IMGS = "../imagenes/";
import * as ProductoModel from '../models/productos.model.js'; 

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
      const imagePath = path.join(__dirname, RUTA_IMGS, imagen);
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

const convertirImagen = async (rutaImagen) => {
  try{
    if(!fs.existsSync(rutaImagen)){
      throw new Error('No se encontró el archivo');
    }
    const fileBuffer = fs.readFileSync(rutaImagen);
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

    const filePath = path.join(__dirname, RUTA_IMGS, nombre);
    fs.writeFileSync(filePath, buffer);

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