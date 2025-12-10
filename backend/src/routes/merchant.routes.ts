import { Router } from "express";
import {
  registerMerchant,
  getMerchantDashboard
} from "@/controller/merchant.controller";

const router = Router();

router.post("/register", registerMerchant);
router.get("/dashboard/:id", getMerchantDashboard);

export default router;
