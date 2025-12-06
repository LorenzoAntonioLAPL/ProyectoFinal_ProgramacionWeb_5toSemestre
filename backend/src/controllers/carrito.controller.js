import * as CarritoModel from '../models/carrito.model.js'; 

export const agregarCarrito = async (req, res) => { 
  try { 
    const { id } = req.user;
    const user = id;
    const { idProducto } = req.params;
    let { cantidad } = req.body;

    const usuario = await CarritoModel.findUserById(user); 
    if (!usuario){
      const producto = String(idProducto)+",";
      const unidades = String(cantidad)+",";
      const resultado = await CarritoModel.createCarrito(user, producto, unidades);
      if (!resultado) 
        return res.status(500).json({ mensaje: 'Hubo un problema con el carrito' });

      res.json({ mensaje: 'Carrito actualizado correctamente' }); 
    }

    const carrito = usuario.product_ids.split(",");
    if(carrito[carrito.length - 1] === "") carrito.pop();
    const listaCantidad = usuario.product_num.split(",");
    if(listaCantidad[listaCantidad.length - 1] === "") listaCantidad.pop();

    //buscar en la lista de usuarios
    if(carrito.includes(String(idProducto))){
        const indice = carrito.indexOf(String(idProducto));
        if(!Number.isInteger(cantidad))
            cantidad = parseInt(cantidad);
        let total = parseInt(listaCantidad[indice]) + cantidad;
        listaCantidad[indice] = String(total);
    }
    else{
        carrito.push(String(idProducto));
        listaCantidad.push(String(cantidad));
    }

    const carritoCompra = carrito.join(",") + ",";
    const lista = listaCantidad.join(",") + ",";

    const filas = await CarritoModel.updateCarrito(user, carritoCompra, lista); 
    if (filas === 0) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' }); 
    
    res.json({ mensaje: 'Carrito actualizado correctamente' }); 
  } catch (error) { 
    console.error('Error al actualizar el carrito:', error); 
    res.status(500).json({ mensaje: 'Error al actualizar el carrito' }); 
  } 
}; 

//Quitar de la lista
export const eliminarCarrito = async (req, res) => { 
  try { 
    const { id } = req.user;
    const user = id;
    const { idProducto } = req.params;
    let { cantidad } = req.body;

    const usuario = await CarritoModel.findUserById(user); 
    if (!usuario) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    let carrito = usuario.product_ids.split(",");
    if(carrito[carrito.length - 1] === "") carrito.pop();
    let listaCantidad = usuario.product_num.split(",");
    if(listaCantidad[listaCantidad.length - 1] === "") listaCantidad.pop();

    if(!carrito.includes(String(idProducto))){
        return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
    }

    const indice = carrito.indexOf(String(idProducto));
    if(!Number.isInteger(cantidad))
        cantidad = parseInt(cantidad);
    let total = parseInt(listaCantidad[indice]) - cantidad;
    if(total <= 0){
        carrito.splice(indice, 1);
        listaCantidad.splice(indice, 1);
    }
    else
        listaCantidad[indice] = String(total);

    let carritoCompra;
    let lista

    if(carrito.length === 0){
        carritoCompra = [""];
        lista = [""];
    }
    else{
        carritoCompra = carrito.join(",") + ",";
        lista = listaCantidad.join(",") + ",";
    }
    

    const filas = await CarritoModel.updateCarrito(user, carritoCompra, lista);
    if (filas === 0) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' }); 
    
    res.json({ mensaje: 'Carrito actualizado correctamente' }); 
  } catch (error) { 
    console.error('Error al actualizar el carrito:', error); 
    res.status(500).json({ mensaje: 'Error al actualizar el carrito' }); 
  } 
}; 

//Devolver la lista
export const obtenerCarrito = async (req, res) => { 
  try { 
    const { id } = req.user;
    const user = id;

    const usuario = await CarritoModel.findUserById(user); 
    if (!usuario) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const carrito = usuario.product_ids.split(",");
    if(carrito[carrito.length - 1] === "") carrito.pop();
    const listaCantidad = usuario.product_num.split(",");
    if(listaCantidad[listaCantidad.length - 1] === "") listaCantidad.pop();

    res.status(200).json({
        message: "Datos Listos",
        idProductos: carrito,
        cantidades: listaCantidad
    });
  } catch (error) { 
    console.error('Error al obtener el carrito de compra:', error); 
    res.status(500).json({ mensaje: 'Error al obtener el carrito de compra' }); 
  } 
}; 

export const obtenerTotalCarrito = async (req, res) => { 
  try { 
    const { id } = req.user;
    const user = id;

    const usuario = await CarritoModel.findUserById(user); 
    if (!usuario) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const listaCantidad = usuario.product_num.split(",");
    if(listaCantidad[listaCantidad.length - 1] === "") listaCantidad.pop();

    let totalObjetos = 0;
    listaCantidad.forEach(prod => {
      totalObjetos += parseInt(prod);
    });

    res.status(200).json({
        message: "Datos Listos",
        totalProductos: totalObjetos
    });
  } catch (error) { 
    console.error('Error al obtener el carrito de compra:', error); 
    res.status(500).json({ mensaje: 'Error al obtener el carrito de compra' }); 
  } 
}; 
