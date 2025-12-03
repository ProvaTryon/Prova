import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "@/controller/user.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { hasRole } from "@/middleware/role.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", hasRole(["admin"]), getAllUsers);
router.delete("/:id", hasRole(["admin"]), deleteUser);

router.get("/:id", getUserById);
router.put("/:id", updateUser);

export default router;