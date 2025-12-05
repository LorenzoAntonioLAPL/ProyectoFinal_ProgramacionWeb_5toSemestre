import * as productos from "../models/productos.model.js";
import * as CarritoModel from "../models/carrito.model.js";

export const completarVenta = async (req,res) => {
    try {
        const { user } = req.user.id;
        
            const usuario = await CarritoModel.findUserById(user); 
            if (!usuario) 
              return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        
            const carrito = usuario.product_ids.split(",");
            if(carrito[carrito.length - 1] === "") carrito.pop();
            const listaCantidad = usuario.product_num.split(",");
            if(listaCantidad[listaCantidad.length - 1] === "") listaCantidad.pop();

            if(carrito.length <= 0){
                return res.status(400).json({mensaje: "No hay productos en el carrito"})
            }
            
            //Crea un arreglo de productos basado en el carrito
            const listaProd = [];

            carrito.forEach(async index => {
                listaProd.push(await productos.getProductById(parseInt(index)));
            });

            //Verifica que haya suficientes existencias y las cambia
            for (let index = 0; index < listaProd.length; index++) {
                if(listaProd[index].existencia - parseInt(listaCantidad[index]) < 0){
                    return res.status(400).json({mensaje:
                        "id: " + listaProd[index].nombre +
                        ": No hay suficientes existencias en este producto"})
                }
                listaProd[index].existencia -= parseInt(listaCantidad[index]);
            }

            //Actualiza los datos en la base de datos
            listaProd.forEach(index => {
                const producto_estado = productos.updateProduct(listaProd[index].id, listaProd[index].nombre, listaProd[index].precio, listaProd[index].descripcion, listaProd[index].existencia, listaProd[index].categoria, listaProd[index].imagen, listaProd[index].ventas);
            });
            
            //Limpiar el carrito
            const carrito_estado = await CarritoModel.cleanCarrito(user);

            res.status(201).json({mensaje: "Venta completada con exito"})

    } catch (error) {
        console.error('Error al completar la venta:', error); 
        res.status(500).json({ mensaje: 'Error al completar la venta' });
    }
}