import { Router } from "express";
import {
  addBranch,
  getBranches
} from "@/controller/branch.controller";

const router = Router();

router.post("/", addBranch);    // Add a new branch
router.get("/", getBranches);   // Get all branches

export default router;
