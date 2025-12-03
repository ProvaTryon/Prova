import { Request, Response, NextFunction } from "express";

export const validate = (schema: any) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (err: any) {
    return res.status(400).json({
      msg: "Validation error",
      errors: err.errors,
    });
  }
};
