export const esUsuario = async (req, res) => { 
  try { 
    res.status(200).json({
        message: "El usuario tiene una sesion iniciada"
    });
  } catch (error) { 
    console.error('Error: error al comprobar usuario', error); 
    res.status(500).json({ mensaje: 'Error al comprobar usuario' }); 
  } 
}; 