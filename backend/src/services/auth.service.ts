import User from "@/models/user.model";
import { hashPassword, comparePassword } from "@/utils/hash.util";
import { generateTokens } from "@/utils/token.util";

export const signUpService = async (data: any) => {
  const { name, email, password } = data;

  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already exists");

  const hashed = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashed,
    isActive: true
  });

  const { password: _, ...safeUser } = user.toObject();
  return safeUser;
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("User not found");

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Invalid password");

  const tokens = generateTokens(user._id.toString());

  // Return clean user object without password
  const userObj = user.toObject();
  const { password: _, ...safeUser } = userObj;

  return { tokens, user: safeUser };
};
