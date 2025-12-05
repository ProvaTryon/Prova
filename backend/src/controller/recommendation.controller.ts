import { Request, Response } from "express";
import {
  getPersonalizedRecommendationsService,
  getCollaborativeRecommendationsService,
  getSimilarProductsService,
  getPopularProductsService,
  getTrendingProductsService
} from "@/services/recommendation.service";
import {
  trackProductViewService,
  trackProductClickService
} from "@/services/interaction.service";

export const getPersonalizedRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id.toString();
    const startTime = Date.now();

    const recommendations = await getPersonalizedRecommendationsService(userId);

    const duration = Date.now() - startTime;
    console.log(`Personalized recommendations for ${userId}: ${duration}ms`);

    res.json(recommendations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSimilarProducts = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const startTime = Date.now();

    const similarProducts = await getSimilarProductsService(productId);

    const duration = Date.now() - startTime;
    console.log(`Similar products for ${productId}: ${duration}ms`);

    res.json(similarProducts);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const getCollaborativeRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id.toString();
    const startTime = Date.now();

    const recommendations = await getCollaborativeRecommendationsService(userId);

    const duration = Date.now() - startTime;
    console.log(`Collaborative recommendations for ${userId}: ${duration}ms`);

    res.json(recommendations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPopularProducts = async (_req: Request, res: Response) => {
  try {
    const startTime = Date.now();

    const popularProducts = await getPopularProductsService();

    const duration = Date.now() - startTime;
    console.log(`Popular products: ${duration}ms`);

    res.json(popularProducts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTrendingProducts = async (_req: Request, res: Response) => {
  try {
    const startTime = Date.now();

    const trendingProducts = await getTrendingProductsService();

    const duration = Date.now() - startTime;
    console.log(`Trending products: ${duration}ms`);

    res.json(trendingProducts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const trackProductView = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id.toString();
    const { productId } = req.body;

    await trackProductViewService(userId, productId);

    res.json({ message: 'View tracked successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const trackProductClick = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id.toString();
    const { productId } = req.body;

    await trackProductClickService(userId, productId);

    res.json({ message: 'Click tracked successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
