import connection from "../database/db.js";

export const findUserById = async (id) => {
  const [rows] = await connection.query(
    "SELECT * FROM carrito WHERE user_id = ?",
    [id]
  );
  return rows[0];
};

export async function createCarrito(user_id, product_ids, product_num) {
    const [result] = await connection.query(
        //............................................................
        'INSERT INTO carrito (user_id, product_ids, product_num) VALUES (?, ?, ?)',
        [user_id, product_ids, product_num]
    );
    return result;
}

export async function updateCarrito(user_id, product_ids, product_num) {
    const [result] = await connection.query(
        //............................................................
        'UPDATE carrito SET product_ids = ?, product_num = ? WHERE user_id = ?',
        [product_ids, product_num, user_id]
    );
    return result.affectedRows;
}

export async function cleanCarrito(user_id) {
    //............................................................
    const [result] = await connection.query('DELETE FROM carrito WHERE user_id = ?', [user_id]);
    return result.affectedRows;
}