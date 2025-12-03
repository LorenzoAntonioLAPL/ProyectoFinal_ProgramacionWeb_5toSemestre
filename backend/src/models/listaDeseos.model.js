import connection from "../database/db.js";

export const findUserById = async (id) => {
  const [rows] = await connection.query(
    "SELECT * FROM listdeseos WHERE user_id = ?",
    [id]
  );
  return rows[0];
};

export async function createLista(user_id, product_ids) {
    const [result] = await connection.query(
        //............................................................
        'INSERT INTO listdeseos (user_id, product_ids) VALUES (?, ?)',
        [user_id, product_ids]
    );
<<<<<<< HEAD
    return result;
=======
    return result.insertId;
>>>>>>> ac88a46 (Arreglo de errores y funciones de lista de deseos)
}

export async function updateLista(user_id, product_ids) {
    const [result] = await connection.query(
        //............................................................
        'UPDATE listdeseos SET product_ids = ? WHERE user_id = ?',
        [product_ids, user_id]
    );
    return result.affectedRows;
}