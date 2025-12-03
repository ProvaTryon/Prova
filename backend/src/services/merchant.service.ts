import Merchant from "@/models/merchant.model";
import Product from "@/models/product.model";
import { hashPassword } from "@/utils/hash.util";

export const registerMerchantService = async (data: any) => {
  const { email, phone, password } = data;

  const exists = await Merchant.findOne({ $or: [{ email }, { phone }] });
  if (exists) throw new Error("Merchant already exists");

  const hashed = await hashPassword(password);

  const merchant = await Merchant.create({
    ...data,
    password: hashed,
  });

  const { password: _, ...safeMerchant } = merchant.toObject();
  return safeMerchant;
};

export const getMerchantDashboardService = async (merchantId: string) => {
  const merchant = await Merchant.findById(merchantId)
    .select("-password")
    .populate("products")
    .lean();

  if (!merchant) throw new Error("Merchant not found");

  const productCount = await Product.countDocuments({ merchant: merchantId });

  return {
    merchant,
    stats: {
      totalProducts: productCount,
    },
  };
};
