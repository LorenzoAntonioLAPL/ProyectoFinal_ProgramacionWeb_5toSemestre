import connection from "../database/db.js";

export async function getAllProducts() {
    const [rows] = await connection.query('SELECT * FROM productos');
    return rows;
}

export async function getProductById(id) {
    const [rows] = await connection.query('SELECT * FROM productos WHERE id = ?', [id]);
    return rows[0];
}

export async function createProduct(nombre, precio, descripcion, existencia, categoria, imagen, ventas) {
    const [result] = await connection.query(
        //............................................................
        'INSERT INTO productos (nombre, precio, descripcion, existencia, categoria, imagen, ventas) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, precio, descripcion, existencia, categoria, imagen, ventas]
    );
    return result.insertId;
}

export async function updateProduct(id, nombre, precio, descripcion, existencia, categoria, imagen, ventas) {
    const [result] = await connection.query(
        //............................................................
        'UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, existencia = ?, categoria = ?, imagen = ?, ventas = ? WHERE id = ?',
        [nombre, precio, descripcion, existencia, categoria, imagen, ventas, id]
    );
    return result.affectedRows;
}

export async function updateVentas(id, ventas) {
    const [result] = await connection.query(
        //............................................................
        'UPDATE productos SET ventas = ? WHERE id = ?',
        [ventas, id]
    );
    return result.affectedRows;
}

export async function deleteProduct(id) {
    const [result] = await connection.query('DELETE FROM productos WHERE id = ?', [id]);
    return result.affectedRows;
}

export async function getProductByCategoria(categoria) {
    const [rows] = await connection.query('SELECT * FROM productos WHERE categoria = ?', [categoria]);
    return rows;
}
