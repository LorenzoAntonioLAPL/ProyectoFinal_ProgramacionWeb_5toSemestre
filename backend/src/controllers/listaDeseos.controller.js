const ProductoModel = require('../models/productos.model.js'); 
const UserModel = require('../models/user.model.js'); 
const ListaModel = require('../models/listaDeseos.model.js'); 

const añadirLista = async (req, res) => { 
  try { 
    const { user } = req.user.id;
    const { idProducto } = req.params;

    const usuario = await ListaModel.findUserById(user); 
<<<<<<< HEAD
    if (!usuario){
      const producto = String(idProducto)+",";
      const resultado = await ListaModel.createLista(user, producto);
      if (!resultado) 
        return res.status(500).json({ mensaje: 'Hubo un problema con la lista de deseos' });

      res.json({ mensaje: 'Lista de deseos actualizada correctamente' }); 
    }
=======
    if (!usuario) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
>>>>>>> ac88a46 (Arreglo de errores y funciones de lista de deseos)

    const listaDeseos = usuario.product_ids.split(",");
    if(listaDeseos[listaDeseos.length - 1] === "") listaDeseos.pop();

    //buscar en la lista de usuarios
    if(listaDeseos.includes(String(idProducto))){
      return res.status(404).json({ mensaje: 'El producto ya esta en la lista de deseos' });
    }

    listaDeseos.push(String(idProducto));

    const lista = listaDeseos.join(",") + ",";
    /*let lista="";
    for(const idProd of listaDeseos){
      lista = lista + idProd + ",";
    }*/

    const filas = await ListaModel.updateLista(user, lista); 
    if (filas === 0) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' }); 
    
    res.json({ mensaje: 'Lista de deseos actualizada correctamente' }); 
  } catch (error) { 
    console.error('Error al actualizar la lista de deseos:', error); 
    res.status(500).json({ mensaje: 'Error al actualizar la lista de deseos' }); 
  } 
}; 

//Quitar de la lista
const eliminarLista = async (req, res) => { 
  try { 
    const { user } = req.user.id;
    const { idProducto } = req.params;

    const usuario = await ListaModel.findUserById(user); 
    if (!usuario) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const listaDeseos = usuario.product_ids.split(",");
    if(listaDeseos[listaDeseos.length - 1] === "") listaDeseos.pop();

    //buscar en la lista de usuarios
    if(listaDeseos.includes(String(idProducto))){
      listaDeseos = listaDeseos.filter(id => id !== String(idProducto));
    }
    else{
      return res.status(404).json({ mensaje: 'El producto no esta en la lista de deseos' });
    }

    const lista = listaDeseos.join(",") + ",";
    /*let lista="";
    for(const idProd of listaDeseos){
      lista = lista + idProd + ",";
    }*/

    const filas = await ListaModel.updateLista(user, lista); 
    if (filas === 0) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' }); 
    
    res.json({ mensaje: 'Lista de deseos actualizada correctamente' }); 
  } catch (error) { 
    console.error('Error al actualizar la lista de deseos:', error); 
    res.status(500).json({ mensaje: 'Error al actualizar la lista de deseos' }); 
  } 
}; 

//Devolver la lista
const obtenerLista = async (req, res) => { 
  try { 
    const { user } = req.user.id;

    const usuario = await ListaModel.findUserById(user); 
    if (!usuario) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const listaDeseos = usuario.product_ids.split(",");
    if(listaDeseos[listaDeseos.length - 1] === "") listaDeseos.pop();

    res.json(listaDeseos); 
  } catch (error) { 
    console.error('Error al obtener la lista de deseos:', error); 
    res.status(500).json({ mensaje: 'Error al obtener la lista de deseos' }); 
  } 
}; 

module.exports = {
  añadirLista,
  eliminarLista,
  obtenerLista
};