import { Request, Response, NextFunction } from "express";

export const hasRole = (roles: string[]) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ msg: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Forbidden: Access denied" });
    }

    next();
  };
};
