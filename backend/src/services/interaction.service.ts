import UserInteraction from "@/models/user.interaction.model";
import Product from "@/models/product.model";

export const trackProductViewService = async (userId: string, productId: string): Promise<{ success: boolean }> => {
  try {
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Create interaction record
    await UserInteraction.create({
      user: userId,
      product: productId,
      interactionType: 'view'
    });

    // Atomically increment view count
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    return { success: true };
  } catch (err: any) {
    throw new Error(`Failed to track product view: ${err.message}`);
  }
};

export const trackProductClickService = async (userId: string, productId: string): Promise<{ success: boolean }> => {
  try {
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Create interaction record
    await UserInteraction.create({
      user: userId,
      product: productId,
      interactionType: 'click'
    });

    return { success: true };
  } catch (err: any) {
    throw new Error(`Failed to track product click: ${err.message}`);
  }
};
