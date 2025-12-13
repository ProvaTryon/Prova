import { recommendationCache } from "@/utils/cache.util";
import Product from "@/models/product.model";
import Order from "@/models/order.model";
import Review from "@/models/review.model";
import { BodyMeasurements } from "@/models/body.measurements.model";

// Helper: Map body measurements to clothing sizes
const mapMeasurementsToSize = (measurements: any): string => {
  if (!measurements) return 'M'; // Default to medium

  const chest = measurements.chest_circumference || measurements.chest_width || 0;
  const waist = measurements.waist || measurements.waist_width || 0;

  // Average chest and waist for size determination (in inches)
  const avgMeasurement = (chest + waist) / 2;

  if (avgMeasurement < 34) return 'S';
  if (avgMeasurement < 38) return 'M';
  if (avgMeasurement < 42) return 'L';
  if (avgMeasurement < 46) return 'XL';
  return 'XXL';
};

// Get personalized recommendations (hybrid approach)
export const getPersonalizedRecommendationsService = async (userId: string) => {
  try {
    // Check cache first
    const cached = recommendationCache.getUserRecommendations(userId);
    if (cached) {
      console.log(`Cache HIT: user:${userId}:recommendations`);
      return cached;
    }

    console.log(`Cache MISS: user:${userId}:recommendations`);

    // Check if user has any orders (cold-start detection)
    const orderCount = await Order.countDocuments({ user: userId });

    if (orderCount === 0) {
      // Cold-start: return popular products
      return await getPopularProductsService();
    }

    // Get user's order history
    const userOrders = await Order.find({ user: userId })
      .populate('products')
      .lean();

    // Extract user preferences
    const userProducts = userOrders.flatMap(order => order.products) as any[];

    // Handle edge case: empty products array
    if (userProducts.length === 0) {
      return await getPopularProductsService();
    }

    const userCategories = [...new Set(userProducts.map((p: any) => p.category))];
    const userBrands = [...new Set(userProducts.map((p: any) => p.brand).filter(Boolean))];
    const avgPrice = userProducts.reduce((sum: number, p: any) => sum + p.price, 0) / userProducts.length;

    // Collaborative filtering component (60% weight)
    const collaborativeRecs = await getCollaborativeRecommendationsService(userId);

    // Content-based filtering component (40% weight)
    const contentBasedRecs = await Product.find({
      _id: { $nin: userProducts.map((p: any) => p._id) }, // Exclude already purchased
      $or: [
        { category: { $in: userCategories } },
        { brand: { $in: userBrands } },
        { price: { $gte: avgPrice * 0.8, $lte: avgPrice * 1.2 } }
      ]
    }).limit(20).lean();

    // Combine recommendations (collaborative 60% + content-based 40%)
    const combinedRecs = [
      ...collaborativeRecs.slice(0, 12),
      ...contentBasedRecs.slice(0, 8)
    ];

    // Apply size filtering based on body measurements
    const userMeasurements = await BodyMeasurements.findOne({ userId }).lean();
    const userSize = mapMeasurementsToSize(userMeasurements);

    const sizeFilteredRecs = combinedRecs.filter((product: any) =>
      !product.sizes || product.sizes.length === 0 || product.sizes.includes(userSize)
    );

    const finalRecs = sizeFilteredRecs.slice(0, 20);

    // Cache the results (30 min TTL)
    recommendationCache.setUserRecommendations(userId, finalRecs);

    return finalRecs;
  } catch (err: any) {
    throw new Error(`Failed to get personalized recommendations: ${err.message}`);
  }
};

// Collaborative filtering recommendations
export const getCollaborativeRecommendationsService = async (userId: string) => {
  try {
    // Find products the user has ordered
    const userOrders = await Order.find({ user: userId }).lean();
    const userProductIds = userOrders.flatMap(order => order.products);

    if (userProductIds.length === 0) {
      return [];
    }

    // Find other users who ordered the same products
    const similarUsersOrders = await Order.find({
      products: { $in: userProductIds },
      user: { $ne: userId }
    }).populate('products').lean();

    // Get products ordered by similar users
    const recommendedProducts = similarUsersOrders
      .flatMap(order => order.products as any[])
      .filter((product: any) =>
        !userProductIds.some(id => id.toString() === product._id.toString())
      );

    // Count frequency and deduplicate
    const productFrequency = new Map();
    recommendedProducts.forEach((product: any) => {
      const id = product._id.toString();
      productFrequency.set(id, (productFrequency.get(id) || 0) + 1);
    });

    // Sort by frequency and get unique products
    const uniqueProducts = Array.from(new Set(recommendedProducts.map((p: any) => JSON.stringify(p))))
      .map(str => JSON.parse(str))
      .sort((a: any, b: any) => {
        const freqA = productFrequency.get(a._id.toString()) || 0;
        const freqB = productFrequency.get(b._id.toString()) || 0;
        return freqB - freqA;
      });

    return uniqueProducts.slice(0, 20);
  } catch (err: any) {
    throw new Error(`Failed to get collaborative recommendations: ${err.message}`);
  }
};

// Content-based filtering recommendations
export const getContentBasedRecommendationsService = async (userId: string) => {
  try {
    // Get user's order history
    const userOrders = await Order.find({ user: userId })
      .populate('products')
      .lean();

    if (userOrders.length === 0) {
      return [];
    }

    // Extract user preferences
    const userProducts = userOrders.flatMap(order => order.products) as any[];

    // Handle edge case: empty products array
    if (userProducts.length === 0) {
      return [];
    }

    const userCategories = [...new Set(userProducts.map((p: any) => p.category))];
    const userTags = [...new Set(userProducts.flatMap((p: any) => p.tags || []))];
    const userBrands = [...new Set(userProducts.map((p: any) => p.brand).filter(Boolean))];
    const userColors = [...new Set(userProducts.flatMap((p: any) => p.colors || []))];
    const avgPrice = userProducts.reduce((sum: number, p: any) => sum + p.price, 0) / userProducts.length;

    // Find similar products with weighted scoring
    const recommendations = await Product.find({
      _id: { $nin: userProducts.map((p: any) => p._id) },
      $or: [
        { category: { $in: userCategories } },
        { tags: { $in: userTags } },
        { brand: { $in: userBrands } },
        { colors: { $in: userColors } },
        { price: { $gte: avgPrice * 0.8, $lte: avgPrice * 1.2 } }
      ]
    }).limit(20).lean();

    return recommendations;
  } catch (err: any) {
    throw new Error(`Failed to get content-based recommendations: ${err.message}`);
  }
};

// Get similar products to a specific product
export const getSimilarProductsService = async (productId: string) => {
  try {
    // Check cache first
    const cached = recommendationCache.getSimilarProducts(productId);
    if (cached) {
      console.log(`Cache HIT: similar:${productId}`);
      return cached;
    }

    console.log(`Cache MISS: similar:${productId}`);

    // Get the product
    const product = await Product.findById(productId).lean();
    if (!product) {
      throw new Error("Product not found");
    }

    // Find similar products
    const similarProducts = await Product.find({
      _id: { $ne: productId },
      $or: [
        { category: product.category },
        { tags: { $in: product.tags || [] } },
        { brand: product.brand },
        {
          price: {
            $gte: product.price * 0.8,
            $lte: product.price * 1.2
          }
        }
      ]
    }).limit(10).lean();

    // Cache the results (4 hour TTL)
    recommendationCache.setSimilarProducts(productId, similarProducts);

    return similarProducts;
  } catch (err: any) {
    throw new Error(`Failed to get similar products: ${err.message}`);
  }
};

// Get trending products (last 7 days)
export const getTrendingProductsService = async () => {
  try {
    // Check cache first
    const cached = recommendationCache.getTrendingProducts();
    if (cached) {
      console.log('Cache HIT: trending:products');
      return cached;
    }

    console.log('Cache MISS: trending:products');

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Aggregate orders from last 7 days
    const trending = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $unwind: '$products' },
      { $group: { _id: '$products', orderCount: { $sum: 1 } } },
      { $sort: { orderCount: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      { $replaceRoot: { newRoot: '$product' } }
    ]);

    // Fallback to popular if no trending products
    if (trending.length === 0) {
      console.log('No trending products found, returning popular products');
      return await getPopularProductsService();
    }

    // Cache the results (1 hour TTL)
    recommendationCache.setTrendingProducts(trending);

    return trending;
  } catch (err: any) {
    throw new Error(`Failed to get trending products: ${err.message}`);
  }
};

// Get popular products (all-time)
export const getPopularProductsService = async () => {
  try {
    // Check cache first
    const cached = recommendationCache.getPopularProducts();
    if (cached) {
      console.log('Cache HIT: popular:products');
      return cached;
    }

    console.log('Cache MISS: popular:products');

    // Aggregate order counts
    const orderCounts = await Order.aggregate([
      { $unwind: '$products' },
      { $group: { _id: '$products', orderCount: { $sum: 1 } } },
      { $sort: { orderCount: -1 } },
      { $limit: 50 }
    ]);

    // If no orders exist, return all products sorted by viewCount
    if (orderCounts.length === 0) {
      console.log('No orders found, returning products by view count');
      const products = await Product.find().sort({ viewCount: -1 }).limit(20).lean();
      recommendationCache.setPopularProducts(products);
      return products;
    }

    const productIds = orderCounts.map(item => item._id);

    // Get average ratings from reviews
    const ratings = await Review.aggregate([
      { $match: { product: { $in: productIds } } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' } } }
    ]);

    const ratingMap = new Map(ratings.map(r => [r._id.toString(), r.avgRating]));

    // Combine metrics: orderCount (60%) + avgRating (40%)
    const scoredProducts = orderCounts.map(item => ({
      productId: item._id,
      orderCount: item.orderCount,
      avgRating: ratingMap.get(item._id.toString()) || 0,
      score: (item.orderCount * 0.6) + ((ratingMap.get(item._id.toString()) || 0) * 0.4)
    }));

    // Sort by combined score
    scoredProducts.sort((a, b) => b.score - a.score);

    // Get full product details
    const topProductIds = scoredProducts.slice(0, 20).map(p => p.productId);
    const popularProducts = await Product.find({ _id: { $in: topProductIds } }).lean();

    // Sort products according to score order
    const sortedProducts = topProductIds
      .map(id => popularProducts.find(p => p._id.toString() === id.toString()))
      .filter(Boolean);

    // Cache the results (24 hour TTL)
    recommendationCache.setPopularProducts(sortedProducts);

    return sortedProducts;
  } catch (err: any) {
    throw new Error(`Failed to get popular products: ${err.message}`);
  }
};

// Cache invalidation helpers
export const invalidateUserCache = (userId: string) => {
  recommendationCache.invalidateUser(userId);
};

export const invalidateTrendingCache = () => {
  recommendationCache.invalidateTrending();
};

export const invalidatePopularCache = () => {
  recommendationCache.del('popular:products');
};

export const invalidateProductCache = (productId: string) => {
  recommendationCache.invalidateProduct(productId);
};

// Warm cache on startup
export const warmRecommendationCache = async () => {
  try {
    console.log('Warming recommendation cache...');

    // Pre-load popular products
    await getPopularProductsService();

    // Pre-load trending products
    await getTrendingProductsService();

    console.log('Cache warming complete');
  } catch (err: any) {
    console.error('Cache warming failed:', err.message);
  }
};
