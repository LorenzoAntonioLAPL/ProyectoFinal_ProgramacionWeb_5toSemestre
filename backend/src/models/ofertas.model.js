import connection from "../database/db.js";

export async function getAllProducts() {
    const [rows] = await connection.query('SELECT * FROM ofertas');
    return rows;
}

export async function getProductById(id) {
    const [rows] = await connection.query('SELECT * FROM ofertas WHERE id = ?', [id]);
    return rows[0];
}