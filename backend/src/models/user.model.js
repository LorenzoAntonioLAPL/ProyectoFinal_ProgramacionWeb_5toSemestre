import connection from "../database/db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await connection.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  );
  return rows[0];
};

export const createUser = async (nombre, email, password) => {
  const [result] = await connection.query(
    "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
    [nombre, email, password]
  );

  return result.insertId;
};

export const updateAttempts = async (id, intentos, bloqueo) => {
  const [result] = await connection.query(
    "UPDATE usuarios SET intentos_fallidos = ?, bloqueado_hasta = ? WHERE id = ?",
    [intentos, bloqueo, id]
  );
  return result;
};

// literalmente es sacar los datos de la base de datos en railway pero lo de railway
// lo tengo todo en el .env y en db.js ya lo uso