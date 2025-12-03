import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_SECRET
} from "@/config/base";

export const generateTokens = (userId: string) => {
const accessToken = jwt.sign(
  { userId },
  JWT_SECRET as string,
  { expiresIn: JWT_EXPIRES_IN as string } as jwt.SignOptions
);

const refreshToken = jwt.sign(
  { userId },
  REFRESH_TOKEN_SECRET as string,
  { expiresIn: "30d" } as jwt.SignOptions
);

return { accessToken, refreshToken };
};
