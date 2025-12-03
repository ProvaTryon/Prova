import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@/config/base";
import User from "@/models/user.model";

export const authMiddleware = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload | string | undefined;

    if (typeof decoded === "string" || !decoded || typeof decoded !== "object" || !("userId" in decoded)) {
      return res.status(401).json({ msg: "Invalid or expired token" });
    }

    const userId = String((decoded as any).userId);
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(401).json({ msg: "User no longer exists" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};
