import connection from "../database/db.js";

async function getAllProducts() {
    const [rows] = await connection.query('SELECT * FROM productos');
    return rows;
}

async function getProductById(id) {
    const [rows] = await connection.query('SELECT * FROM productos WHERE id = ?', [id]);
    return rows[0];
}

async function createProduct(nombre, precio, descripcion, existencia, categoria, imagen, ventas) {
    const [result] = await connection.query(
        //............................................................
        'INSERT INTO productos (nombre, precio, descripcion, existencia, categoria, imagen, ventas) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, precio, descripcion, existencia, categoria, imagen, ventas]
    );
    return result.insertId;
}

async function updateProduct(id, nombre, precio, descripcion, existencia, categoria, imagen, ventas) {
    const [result] = await connection.query(
        //............................................................
        'UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, existencia = ?, categoria = ?, imagen = ?, ventas = ? WHERE id = ?',
        [nombre, precio, descripcion, existencia, categoria, imagen, ventas, id]
    );
    return result.affectedRows;
}

async function updateVentas(id, ventas) {
    const [result] = await connection.query(
        //............................................................
        'UPDATE productos SET ventas = ? WHERE id = ?',
        [ventas, id]
    );
    return result.affectedRows;
}

async function deleteProduct(id) {
    const [result] = await connection.query('DELETE FROM productos WHERE id = ?', [id]);
    return result.affectedRows;
}

async function getProductByCategoria(categoria) {
    const [rows] = await connection.query('SELECT * FROM productos WHERE categoria = ?', [categoria]);
    return rows;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateVentas,
    getProductByCategoria
};