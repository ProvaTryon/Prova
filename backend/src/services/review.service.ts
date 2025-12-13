import Review from "@/models/review.model";
import { invalidatePopularCache } from "@/services/recommendation.service";

export const addReviewService = async (data: any) => {
  const review = await Review.create(data);

  // Invalidate popular products cache since ratings affect popularity
  invalidatePopularCache();

  return review.toObject();
};

export const getProductReviewsService = async (productId: string) => {
  return await Review.find({ product: productId })
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .lean();
};

export const deleteReviewService = async (reviewId: string) => {
  const review = await Review.findByIdAndDelete(reviewId).lean();
  if (!review) throw new Error("Review not found");

  // Invalidate popular products cache since ratings affect popularity
  invalidatePopularCache();

  return review;
};
