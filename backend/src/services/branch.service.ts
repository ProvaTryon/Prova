import { Branch } from "@/models/branch.model";

export const addBranchService = async (data: any) => {
  const branch = await Branch.create(data);
  return branch.toObject();
};

export const getBranchesService = async () => {
  return await Branch.find().lean();
};
