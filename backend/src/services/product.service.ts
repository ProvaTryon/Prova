import Product from "@/models/product.model";
import { IProduct } from "@/models/product.model";
import { invalidateProductCache, invalidatePopularCache } from "@/services/recommendation.service";

export const createProductService = async (data: IProduct) => {
  const product = await Product.create(data);
  return product.toObject();
};

export const getAllProductsService = async () => {
  return await Product.find().populate("merchant", "name email").lean();
};

export const getProductByIdService = async (id: string) => {
  const product = await Product.findById(id).populate("merchant", "name email").lean();
  if (!product) throw new Error("Product not found");
  return product;
};

export const updateProductService = async (id: string, data: Partial<IProduct>) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
  }).populate("merchant", "name email").lean();

  if (!product) throw new Error("Product not found");

  // Invalidate caches affected by product updates
  invalidateProductCache(id);

  return product;
};

export const deleteProductService = async (id: string) => {
  const product = await Product.findByIdAndDelete(id).lean();
  if (!product) throw new Error("Product not found");

  // Invalidate caches when product is deleted
  invalidateProductCache(id);
  invalidatePopularCache();

  return product;
};
