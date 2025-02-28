import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
} from "../controller/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/role.middleware";

const router = Router();

// Solo ADMIN
router.get("/", authMiddleware, adminOnly, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, adminOnly, updateUser);
router.delete("/:id", authMiddleware, adminOnly, softDeleteUser);

export default router;
