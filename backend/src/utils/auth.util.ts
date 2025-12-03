import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const createToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};
