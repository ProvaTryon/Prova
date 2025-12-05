import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const trackViewSchema = z.object({
  productId: z.string().min(1, "Product ID required")
});

const trackClickSchema = z.object({
  productId: z.string().min(1, "Product ID required")
});

export const validateTrackView = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    trackViewSchema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.errors
    });
  }
};

export const validateTrackClick = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    trackClickSchema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.errors
    });
  }
};
