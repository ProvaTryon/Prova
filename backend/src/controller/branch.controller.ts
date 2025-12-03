import { Request, Response } from "express";
import {
  addBranchService,
  getBranchesService
} from "@/services/branch.service";

export const addBranch = async (req: Request, res: Response) => {
  try {
    const branch = await addBranchService(req.body);
    return res.status(201).json(branch);
  } catch (err: any) {
    return res.status(400).json({ msg: err.message });
  }
};

export const getBranches = async (_req: Request, res: Response) => {
  try {
    const branches = await getBranchesService();
    return res.json(branches);
  } catch (err: any) {
    return res.status(400).json({ msg: err.message });
  }
};
