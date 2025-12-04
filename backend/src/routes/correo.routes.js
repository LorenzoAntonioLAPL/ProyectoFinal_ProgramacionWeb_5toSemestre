import { Router } from "express";
import { sendMail } from "../controllers/nodemailer.controller.js";

const router = Router();

router.post("/correo", sendMail);

export default router;