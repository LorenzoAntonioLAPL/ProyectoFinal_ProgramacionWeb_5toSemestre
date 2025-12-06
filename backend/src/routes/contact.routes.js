import { Router } from "express";
import { enviarContact, subscribir } from "../controllers/contact.controller.js";

const router = Router();

router.post('/enviarContacto',enviarContact);
router.get('/enviarContacto',function(req, res){res.send("Contacto funcionando...");})

router.post('/suscribir', subscribir);

export default router;