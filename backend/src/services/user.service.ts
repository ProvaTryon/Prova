import User from "@/models/user.model";

export const getAllUsersService = async () => {
  return await User.find().select("-password").lean();
};

export const getUserByIdService = async (id: string) => {
  const user = await User.findById(id).select("-password").lean();
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserService = async (id: string, data: any) => {
  const user = await User.findByIdAndUpdate(id, data, { new: true }).select("-password").lean();
  if (!user) throw new Error("User not found");
  return user;
};

export const deleteUserService = async (id: string) => {
  const user = await User.findByIdAndDelete(id).lean();
  if (!user) throw new Error("User not found");
  return user;
};
