import { Router } from "express";
import { getImagenes, guardarImagenes } from "../controllers/img.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router.get("/obtenerImagenes", getImagenes);
router.post('/guardarImagen', verifyToken, isAdmin, guardarImagenes);

module.exports = router;