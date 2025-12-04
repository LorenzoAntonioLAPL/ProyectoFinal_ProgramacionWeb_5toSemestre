import { Router } from "express";
import { getDatos } from "../controllers/datosGrafica.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router.get('/datosGrafica', verifyToken, isAdmin, getDatos);

module.exports = router;