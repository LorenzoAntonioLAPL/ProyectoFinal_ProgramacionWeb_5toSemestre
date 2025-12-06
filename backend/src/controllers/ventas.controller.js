import * as productos from "../models/productos.model.js";
import * as CarritoModel from "../models/carrito.model.js";
import * as PaisModel from "../models/pais.model.js";
import * as OfertasModel from "../models/ofertas.model.js"

export const completarVenta = async (req,res) => {
    try {
        console.log("hola");
            const { id } = req.user;
            const user = id;
        
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

            const ofertas = await OfertasModel.getAllProducts(); 
            
            //Crea un arreglo de productos basado en el carrito
            let listaProd = [];

            listaProd = await Promise.all(
                carrito.map(id => productos.getProductById(parseInt(id)))
            );
            //verificar las modificaciones de campo ventas segun la cantidad vendida
            //Verifica que haya suficientes existencias y las cambia
            let prodOf;
            let sumaVentas = [];
            for (let index = 0; index < listaProd.length; index++) {
                listaProd[index].existencia -= parseInt(listaCantidad[index]);
                prodOf = ofertas.find(p => p.producto_id === listaProd[index].id)
                if(!prodOf)
                sumaVentas.push(parseFloat(listaCantidad[index]) * parseFloat(parseFloat(listaProd[index].precio).toFixed(2)));
                else
                    sumaVentas.push(parseFloat(listaCantidad[index]) * (parseFloat(parseFloat(listaProd[index].precio).toFixed(2)) * parseFloat(prodOf.descuento)));
            }
            
            //Actualiza los datos en la base de datos
            let j = 0;
            listaProd.forEach(elemento => {
                let producto_estado = productos.updateProduct(elemento.id, elemento.nombre, elemento.precio, elemento.descripcion, elemento.existencia, elemento.categoria, elemento.imagen, elemento.ventas + sumaVentas[j]);
                if(!producto_estado){
                    console.log("Ocurrio un error al actualizar el producto: " + elemento.id);
                }
                let pruebaprod = productos.updateVentas(elemento.id, elemento.ventas + parseFloat(sumaVentas[j].toFixed(2)));
                j++;
            });
            
            //Limpiar el carrito
            const carrito_estado = await CarritoModel.cleanCarrito(user);
            if(!carrito_estado){
                return res.status(400).json({mensaje: "Ocurrio un error al actualizar el carrito"});
            }
            res.status(200).json({mensaje: "Venta completada con exito "})
    } catch (error) {
        console.error('Error al completar la venta:', error); 
        res.status(500).json({ mensaje: 'Error al completar la venta' });
    }
}

export const obtenerPaises = async (req, res) => {
    try { 
        const paises = await PaisModel.getAllPaises(); 
        res.json(paises); 
      } catch (error) { 
        console.error('Error al obtener paises:', error); 
        res.status(500).json({ mensaje: 'Error al obtener paises' }); 
      } 
}

export const calcularPrecio = async (req, res) => {
    try { 
        const { id } = req.user;
        const user = id;
        const { idPais } = req.body;

        const usuario = await CarritoModel.findUserById(user); 
        if (!usuario) 
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        const pais = await PaisModel.findPaisById(idPais); 
        if (!pais) 
            return res.status(404).json({ mensaje: 'Pais no encontrado' });
        
        const carrito = usuario.product_ids.split(",");
        if(carrito[carrito.length - 1] === "") carrito.pop();
        const listaCantidad = usuario.product_num.split(",");
        if(listaCantidad[listaCantidad.length - 1] === "") listaCantidad.pop();

        if(carrito.length <= 0){
            return res.status(400).json({mensaje: "No hay productos en el carrito"})
        }
          
        //Crea un arreglo de productos basado en el carrito
        let listaProd = [];
        let listaOferta = [];
        let precioTotal = 0;
        let precioSubTotal = 0;

        listaProd = await Promise.all(
            carrito.map(id => productos.getProductById(parseInt(id)))
        );
        
        listaOferta = await OfertasModel.getAllProducts();
        let prodOferta;

        for(let i = 0; i<listaProd.length; i++){
            prodOferta = listaOferta.find(p => p.producto_id === listaProd[i].id);
            if(!prodOferta){
                precioSubTotal += listaProd[i].precio * parseInt(listaCantidad[i]);
            }
            else{
                precioSubTotal += (listaProd[i].precio * (1 - prodOferta.descuento)) * parseInt(listaCantidad[i]);
            }
        }

        let envio = parseInt(100) * (1+parseFloat(pais.impuesto));
        precioTotal = precioSubTotal*(1+parseFloat(pais.impuesto));
        precioTotal += envio;
        

        res.status(200).json({
            message: "Datos Listos",
            subtotal: precioSubTotal,
            impuestos: pais.impuesto,
            gastosEnvio: envio,
            total: precioTotal
        });
    } catch (error) {
        console.error('Error al calcular el precio:', error); 
        res.status(500).json({ mensaje: 'Error al calcular el precio' });
    }
}

export const confirmarPedido = async (req, res) => {
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

            if(carrito.length <= 0){
                return res.status(400).json({mensaje: "No hay productos en el carrito"})
            }
            
            //Crea un arreglo de productos basado en el carrito
            let listaProd = [];

            listaProd = await Promise.all(
                carrito.map(id => productos.getProductById(parseInt(id)))
            );

            //Verifica que haya suficientes existencias y las cambia
            for (let index = 0; index < listaProd.length; index++) {
                if(listaProd[index].existencia - parseInt(listaCantidad[index]) < 0){
                    return res.status(400).json({mensaje:
                        "Nombre: " + listaProd[index].nombre +
                        " No hay suficientes existencias en este producto"})
                }
            }

            res.status(200).json({mensaje: "La venta puede proseguir"})
    } catch (error) {
        console.error('Error al calcular las existencias:', error); 
        res.status(500).json({ mensaje: 'Error al calcular las existencias' });
    }
}

export const pagoTarjeta = async (req, res) => {
    try { 
        const { id } = req.user;
        const user = id;
        const { precio } = req.body;

        const usuario = await CarritoModel.findUserById(user); 
        if (!usuario) 
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        
        if(!precio){
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' }); 
        }

        res.status(200).json({mensaje: "La venta puede proseguir"})
    } catch (error) {
        console.error('Error al realizar el pago por tarjeta:', error); 
        res.status(500).json({ mensaje: 'Error al realizar el pago por tarjeta' });
    }
}

export const pagoTransferencia = async (req, res) => {
    try { 
        const { id } = req.user;
        const user = id;
        const { precio } = req.body;

        const usuario = await CarritoModel.findUserById(user); 
        if (!usuario) 
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        
        if(!precio){
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' }); 
        }

        res.status(200).json({mensaje: "La venta por transferencia puede proseguir"})
    } catch (error) {
        console.error('Error al realizar el pago por transferencia:', error); 
        res.status(500).json({ mensaje: 'Error al realizar el pago por transferencia' });
    }
}

export const pagoOxxo = async (req, res) => {
    try { 
        const { id } = req.user;
        const user = id;
        const { precio } = req.body;

        const usuario = await CarritoModel.findUserById(user); 
        if (!usuario) 
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        
        if(!precio){
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' }); 
        }

        res.status(200).json({
            message: "La venta por tarjeta puede proseguir",
            codigo: "0123-4567-8900"
        });
    } catch (error) {
        console.error('Error al realizar el pago por oxxo:', error); 
        res.status(500).json({ mensaje: 'Error al realizar el pago por oxxo' });
    }
}

export const calcularSubTotal = async (req, res) => {
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

        if(carrito.length <= 0){
            return res.status(400).json({mensaje: "No hay productos en el carrito"})
        }
          
        //Crea un arreglo de productos basado en el carrito
        let listaProd = [];
        let listaOferta = [];
        let precioSubTotal = 0;

        listaProd = await Promise.all(
            carrito.map(id => productos.getProductById(parseInt(id)))
        );
        listaOferta = await OfertasModel.getAllProducts();

        let prodOferta;

        for(let i = 0; i<listaCantidad.length; i++){
            prodOferta = listaOferta.find(p => p.producto_id === listaProd[i].id);
            if(!prodOferta){
                precioSubTotal += listaProd[i].precio * parseInt(listaCantidad[i]);
            }
            else{
                precioSubTotal += (listaProd[i].precio * (1 - prodOferta.descuento)) * parseInt(listaCantidad[i]);
            }
        }
        

        res.status(200).json({
            message: "Datos Listos",
            subtotal: precioSubTotal
        });
    } catch (error) {
        console.error('Error al calcular el precio:', error); 
        res.status(500).json({ mensaje: 'Error al calcular el precio' });
    }
}
