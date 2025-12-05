import NodeCache from 'node-cache';

class RecommendationCache {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 3600,           // 1 hour default TTL
      checkperiod: 600,        // Check for expired keys every 10 min
      maxKeys: 10000,          // Max 10K cache entries
      useClones: false,        // Better performance, don't clone objects
      deleteOnExpire: true
    });

    // Event listeners for monitoring
    this.cache.on('expired', (key, _value) => {
      console.log(`Cache expired: ${key}`);
    });

    this.cache.on('set', (key, _value) => {
      console.log(`Cache set: ${key}`);
    });
  }

  // Personalized recommendations (30 min TTL)
  setUserRecommendations(userId: string, products: any[]): void {
    this.cache.set(`user:${userId}:recommendations`, products, 1800);
  }

  getUserRecommendations(userId: string): any[] | undefined {
    return this.cache.get<any[]>(`user:${userId}:recommendations`);
  }

  // Trending products (1 hour TTL)
  setTrendingProducts(products: any[]): void {
    this.cache.set('trending:products', products, 3600);
  }

  getTrendingProducts(): any[] | undefined {
    return this.cache.get<any[]>('trending:products');
  }

  // Similar products (4 hours TTL)
  setSimilarProducts(productId: string, products: any[]): void {
    this.cache.set(`similar:${productId}`, products, 14400);
  }

  getSimilarProducts(productId: string): any[] | undefined {
    return this.cache.get<any[]>(`similar:${productId}`);
  }

  // Popular products (24 hours TTL)
  setPopularProducts(products: any[]): void {
    this.cache.set('popular:products', products, 86400);
  }

  getPopularProducts(): any[] | undefined {
    return this.cache.get<any[]>('popular:products');
  }

  // Invalidate specific user cache
  invalidateUser(userId: string): void {
    this.cache.del(`user:${userId}:recommendations`);
  }

  // Invalidate all trending
  invalidateTrending(): void {
    this.cache.del('trending:products');
  }

  // Invalidate specific product similarities
  invalidateProduct(productId: string): void {
    this.cache.del(`similar:${productId}`);
  }

  // Get cache statistics
  getStats() {
    const stats = this.cache.getStats();
    return {
      keys: this.cache.keys().length,
      hits: stats.hits,
      misses: stats.misses,
      hitRate: stats.hits > 0 ? stats.hits / (stats.hits + stats.misses) : 0
    };
  }

  // Clear all cache (admin function)
  clearAll(): void {
    this.cache.flushAll();
  }
}

export const recommendationCache = new RecommendationCache();
