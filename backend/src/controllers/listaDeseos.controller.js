import * as ListaModel from '../models/listaDeseos.model.js'; 

export const agregarLista = async (req, res) => { 
  try { 
    const { id } = req.user;
    const user = id;
    const { idProducto } = req.params;

    const usuario = await ListaModel.findUserById(user); 
    if (!usuario){
      const producto = String(idProducto)+",";
      const resultado = await ListaModel.createLista(user, producto);
      if (!resultado) 
        return res.status(500).json({ mensaje: 'Hubo un problema con la lista de deseos' });

      res.json({ mensaje: 'Lista de deseos actualizada correctamente' }); 
    }

    const listaDeseos = usuario.product_ids.split(",");
    if(listaDeseos[listaDeseos.length - 1] === "") listaDeseos.pop();

    //buscar en la lista de usuarios
    if(listaDeseos.includes(String(idProducto))){
      return res.status(404).json({ mensaje: 'El producto ya esta en la lista de deseos' });
    }

    listaDeseos.push(String(idProducto));

    let lista;
    if(listaDeseos.length === 0){
      lista = "";
    }else{
      lista = listaDeseos.join(",") + ",";
    }

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
export const eliminarLista = async (req, res) => { 
  try { 
    const { id } = req.user;
    const user = id;
    const { idProducto } = req.params;

    const usuario = await ListaModel.findUserById(user); 
    if (!usuario) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    let listaDeseos = usuario.product_ids.split(",");
    if(listaDeseos[listaDeseos.length - 1] === "") listaDeseos.pop();

    //buscar en la lista de usuarios
    if(listaDeseos.includes(String(idProducto))){
      listaDeseos = listaDeseos.filter(id => id !== String(idProducto));
    }
    else{
      return res.status(404).json({ mensaje: 'El producto no esta en la lista de deseos' });
    }
    
    let lista;

    if(listaDeseos.length === 0){
      lista = "";
    }else{
      lista = listaDeseos.join(",") + ",";
    }

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
export const obtenerLista = async (req, res) => { 
  try { 
    const { id } = req.user;
    const user = id;

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
