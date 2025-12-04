import { Router } from "express";
import { reporteVentas, inventarioCategoria, esAdmin } from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router.get("/reporteVentas", verifyToken, isAdmin, reporteVentas);
router.get("/inventario", verifyToken, isAdmin, inventarioCategoria);
router.get("/esAdmin", verifyToken, isAdmin, esAdmin);

export default router;