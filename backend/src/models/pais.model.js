import connection from "../database/db.js";

export async function getAllPaises() {
    const [rows] = await connection.query('SELECT * FROM paises');
    return rows;
}

export const findPaisById = async (id) => {
  const [rows] = await connection.query(
    "SELECT * FROM paises WHERE id = ?",
    [id]
  );
  return rows[0];
};

export async function createPais(nombre, impuesto) {
    const [result] = await connection.query(
        //............................................................
        'INSERT INTO paises (nombre, impuesto) VALUES (?, ?)',
        [nombre, impuesto]
    );
    return result;
}

export async function updatePais(id, nombre, impuesto) {
    const [result] = await connection.query(
        //............................................................
        'UPDATE paises SET nombre = ?, impuesto = ? WHERE id = ?',
        [nombre, impuesto, id]
    );
    return result.affectedRows;
}