import connection from "../database/db.js";

async function getAllProducts() {
    const [rows] = await connection.query('SELECT * FROM productos');
    return rows;
}

async function getProductById(id) {
    const [rows] = await connection.query('SELECT * FROM productos WHERE id = ?', [id]);
    return rows[0];
}

async function createProduct(nombre, precio, existencia, categoria, imagen, ventas) {
    const [result] = await connection.query(
        //............................................................
        'INSERT INTO productos (nombre, precio, existencia, categoria, imagen, ventas) VALUES (?, ?)',
        [nombre, precio, existencia, categoria, imagen, ventas]
    );
    return result.insertId;
}

async function updateProduct(id, nombre, precio, existencia, categoria, imagen, ventas) {
    const [result] = await connection.query(
        //............................................................
        'UPDATE productos SET nombre = ?, precio = ?, existencia = ?, categoria = ?, imagen = ?, ventas = ? WHERE id = ?',
        [nombre, precio, existencia, categoria, imagen, ventas]
    );
    return result.affectedRows;
}

async function deleteProduct(id) {
    const [result] = await connection.query('DELETE FROM productos WHERE id = ?', [id]);
    return result.affectedRows;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};