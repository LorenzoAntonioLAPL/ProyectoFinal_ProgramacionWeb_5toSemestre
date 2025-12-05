import connection from "../database/db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await connection.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  );
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await connection.query(
    "SELECT * FROM usuarios WHERE id = ?",
    [id]
  );
  return rows[0];
};

export const findUserByName = async (user) => {
  const [rows] = await connection.query(
    "SELECT * FROM usuarios WHERE nombre = ?",
    [user]
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

export const saveResetToken = async (id, resetToken, expires) => {
  const [result] = await connection.query(
    "UPDATE usuarios SET reset_token = ?, reset_expires = ? WHERE id = ?",
    [resetToken, expires, id]
  );
  return result.affectedRows; // Retorna cuántas filas fueron modificadas
};

// user.model.js

export const resetPasswordByToken = async (token, hashedPassword, userId) => {
  // Primero: Buscar usuario por token válido (no expirado)
  const [rows] = await connection.query(
    "SELECT * FROM usuarios WHERE reset_token = ? AND reset_expires > NOW()",
    [token]
  );
  
  if (rows.length === 0) {
    return null; // Token inválido o expirado
  }

  const user = rows[0];
  
  // Segundo: Actualizar la contraseña y limpiar los campos de token
  const [result] = await connection.query(
    "UPDATE usuarios SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
    [hashedPassword, user.id]
  );
  
  return result.affectedRows > 0 ? user : null; // Retorna el usuario si la actualización fue exitosa
};

// literalmente es sacar los datos de la base de datos en railway pero lo de railway
// lo tengo todo en el .env y en db.js ya lo uso