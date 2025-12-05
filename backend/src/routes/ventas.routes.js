import { Router } from "express";
import { completarVenta } from "../controllers/ventas.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.put("/CompletarVenta", verifyToken, completarVenta);

export default router;