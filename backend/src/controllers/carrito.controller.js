const ProductoModel = require('../models/productos.model.js'); 
const UserModel = require('../models/user.model.js'); 
const CarritoModel = require('../models/carrito.model.js'); 

const añadirCarrito = async (req, res) => { 
  try { 
    const { user } = req.user.id;
    const { idProducto } = req.params;
    const { cantidad } = req.body;

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
const eliminarCarrito = async (req, res) => { 
  try { 
    const { user } = req.user.id;
    const { idProducto } = req.params;
    const { cantidad } = req.body;

    const usuario = await CarritoModel.findUserById(user); 
    if (!usuario) 
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const carrito = usuario.product_ids.split(",");
    if(carrito[carrito.length - 1] === "") carrito.pop();
    const listaCantidad = usuario.product_num.split(",");
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

//Devolver la lista
const obtenerCarrito = async (req, res) => { 
  try { 
    const { user } = req.user.id;

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

module.exports = {
  añadirCarrito,
  eliminarCarrito,
  obtenerCarrito
};