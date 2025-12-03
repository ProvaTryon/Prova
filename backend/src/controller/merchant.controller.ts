import { Request, Response } from "express";

import {
  getMerchantDashboardService,
  registerMerchantService
} from "@/services/merchant.service";

export const registerMerchant = async (req: Request, res: Response) => {
  try {
    const merchant = await registerMerchantService(req.body);
    res.status(201).json(merchant);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getMerchantDashboard = async (req: Request, res: Response) => {
  try {
    const merchantId = req.params.id!;
    const dashboard = await getMerchantDashboardService(merchantId);
    res.status(200).json(dashboard);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
