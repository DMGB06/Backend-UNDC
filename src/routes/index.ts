import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import personajeRoutes from "./personaje";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/personajes", personajeRoutes);

export { router };
