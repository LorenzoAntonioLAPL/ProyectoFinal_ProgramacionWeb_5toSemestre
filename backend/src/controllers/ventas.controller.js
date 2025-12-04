import * as productos from "../models/productos.model.js";
//import * as carrito from "../controllers/carrito.controller.js";


export async function completarVenta() {
    try {
        const cart = carrito.obtenerCarrito();
        
    } catch (error) {
        console.error('Error al completar la venta:', error); 
        res.status(500).json({ mensaje: 'Error al completar la venta' }); 
    }
}