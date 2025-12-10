import { Request, Response } from "express";
import {
  addReviewService,
  getProductReviewsService,
  deleteReviewService
} from "@/services/review.service";

export const addReview = async (req: Request, res: Response) => {
  try {
    const review = await addReviewService(req.body);
    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId!;
    const reviews = await getProductReviewsService(productId);
    res.json(reviews);
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId!;
    const deleted = await deleteReviewService(reviewId);
    res.json({ msg: "Review deleted", deleted });
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};
