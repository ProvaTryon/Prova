import { Router } from "express";
import {
  addReview,
  getProductReviews,
  deleteReview
} from "@/controller/review.controller";

const router = Router();

router.post("/", addReview);                  // Add review
router.get("/:productId", getProductReviews); // Get reviews for a product
router.delete("/:reviewId", deleteReview);    // Delete review

export default router;
