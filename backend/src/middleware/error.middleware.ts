import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("ERROR:", err);

  return res.status(err.status || 500).json({
    msg: err.message || "Internal Server Error",
    details: err.details || null,
  });
};
