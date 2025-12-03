import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getAllOrders,
  changeOrderStatus,
  deleteOrder,
} from "@/controller/order.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { hasRole } from "@/middleware/role.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createOrder);
router.get("/:id", getOrderById);
router.get("/", hasRole(["admin", "merchant"]), getAllOrders);
router.put("/:id/status", hasRole(["admin", "merchant"]), changeOrderStatus);
router.delete("/:id", hasRole(["admin"]), deleteOrder);

export default router;