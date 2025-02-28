import { Router } from "express";
import {
  createPersonaje,
  getMyPersonajes,
  updatePersonaje,
  deletePersonaje
} from "../controller/personaje.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createPersonaje);
router.get("/", authMiddleware, getMyPersonajes);
router.put("/:id", authMiddleware, updatePersonaje);
router.delete("/:id", authMiddleware, deletePersonaje);

export default router;
