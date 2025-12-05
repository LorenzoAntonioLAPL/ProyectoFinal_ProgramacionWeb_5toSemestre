export const isAdmin = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({ msg: "No autenticado" });
  }

  if (req.user.rol !== "admin") {
    return res.status(403).json({ msg: "Acceso solo para administradores" });
  }
  
  next();
};

//pensaba en usar esto en las rutas de cosas de productos para que clientes no lo usen users con rol "usuario"
//  y asi cubrir lo de rutas protegidas pero en fin ahi esta
