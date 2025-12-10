import { Router } from "express";
import { signUp, login } from "@/controller/auth.controller";

const router = Router();

router.post("/signUp", signUp);
router.post("/login", login);

export default router;