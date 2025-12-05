import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import {
  validateTrackView,
  validateTrackClick
} from "@/middleware/validate.recommendation.middleware";
import {
  getPersonalizedRecommendations,
  getSimilarProducts,
  getCollaborativeRecommendations,
  getPopularProducts,
  getTrendingProducts,
  trackProductView,
  trackProductClick
} from "@/controller/recommendation.controller";

const router = Router();

// Authenticated routes
router.get("/personalized", authMiddleware, getPersonalizedRecommendations);
router.get("/collaborative", authMiddleware, getCollaborativeRecommendations);
router.post("/track-view", authMiddleware, validateTrackView, trackProductView);
router.post("/track-click", authMiddleware, validateTrackClick, trackProductClick);

// Public routes
router.get("/popular", getPopularProducts);
router.get("/trending", getTrendingProducts);
router.get("/similar/:productId", getSimilarProducts);

export default router;
