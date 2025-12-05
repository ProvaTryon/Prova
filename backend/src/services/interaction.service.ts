import UserInteraction from "@/models/user.interaction.model";
import Product from "@/models/product.model";

export const trackProductViewService = async (userId: string, productId: string) => {
  try {
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
    throw new Error(`Failed to track view: ${err.message}`);
  }
};

export const trackProductClickService = async (userId: string, productId: string) => {
  try {
    // Create interaction record
    await UserInteraction.create({
      user: userId,
      product: productId,
      interactionType: 'click'
    });

    return { success: true };
  } catch (err: any) {
    throw new Error(`Failed to track click: ${err.message}`);
  }
};
