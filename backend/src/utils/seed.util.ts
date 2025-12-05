import mongoose from 'mongoose';
import Product from '@/models/product.model';
import User from '@/models/user.model';
import Order from '@/models/order.model';
import Review from '@/models/review.model';
import UserInteraction from '@/models/user.interaction.model';
import { BodyMeasurements } from '@/models/body.measurements.model';
import { hashPassword } from '@/utils/hash.util';

export const seedRecommendationData = async () => {
  try {
    console.log('Starting recommendation data seeding...');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await UserInteraction.deleteMany({});
    await BodyMeasurements.deleteMany({});

    console.log('Existing data cleared');

    // Create test users
    const hashedPassword = await hashPassword('password123');
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: true
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: true
      },
      {
        name: 'Alice Brown',
        email: 'alice@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: true
      },
      {
        name: 'Store Merchant',
        email: 'merchant@example.com',
        password: hashedPassword,
        role: 'merchant',
        isActive: true
      }
    ]);

    console.log(`Created ${users.length} users`);

    // Create body measurements for users
    await BodyMeasurements.create([
      {
        userId: users[0]._id,
        height: 175,
        weight: 70,
        chest_circumference: 38,
        waist: 32,
        hip_circumference: 38
      },
      {
        userId: users[1]._id,
        height: 165,
        weight: 60,
        chest_circumference: 34,
        waist: 28,
        hip_circumference: 36
      },
      {
        userId: users[2]._id,
        height: 180,
        weight: 80,
        chest_circumference: 42,
        waist: 36,
        hip_circumference: 40
      }
    ]);

    console.log('Created body measurements');

    // Create products with full metadata
    const merchantId = users[4]._id;
    const products = await Product.create([
      {
        name: 'Classic Cotton T-Shirt',
        description: 'Comfortable everyday t-shirt',
        price: 29.99,
        stock: 100,
        merchant: merchantId,
        category: 'T-Shirts',
        tags: ['casual', 'summer', 'cotton'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['white', 'black', 'blue'],
        gender: 'unisex',
        material: 'cotton',
        brand: 'ComfortWear',
        viewCount: 150
      },
      {
        name: 'Denim Jeans',
        description: 'Classic blue jeans',
        price: 79.99,
        stock: 50,
        merchant: merchantId,
        category: 'Jeans',
        tags: ['casual', 'denim', 'classic'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['blue', 'black'],
        gender: 'unisex',
        material: 'denim',
        brand: 'DenimCo',
        viewCount: 200
      },
      {
        name: 'Summer Dress',
        description: 'Floral summer dress',
        price: 59.99,
        stock: 30,
        merchant: merchantId,
        category: 'Dresses',
        tags: ['summer', 'floral', 'casual'],
        sizes: ['S', 'M', 'L'],
        colors: ['pink', 'yellow', 'white'],
        gender: 'female',
        material: 'polyester',
        brand: 'SummerStyle',
        viewCount: 120
      },
      {
        name: 'Formal Shirt',
        description: 'Business formal shirt',
        price: 49.99,
        stock: 75,
        merchant: merchantId,
        category: 'Shirts',
        tags: ['formal', 'business', 'office'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['white', 'blue', 'gray'],
        gender: 'male',
        material: 'cotton',
        brand: 'ExecutiveWear',
        viewCount: 180
      },
      {
        name: 'Sports Hoodie',
        description: 'Athletic hoodie with moisture-wicking',
        price: 69.99,
        stock: 60,
        merchant: merchantId,
        category: 'Hoodies',
        tags: ['sports', 'athletic', 'winter'],
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['black', 'gray', 'navy'],
        gender: 'unisex',
        material: 'polyester',
        brand: 'ActiveWear',
        viewCount: 95
      },
      {
        name: 'Leather Jacket',
        description: 'Premium leather jacket',
        price: 199.99,
        stock: 20,
        merchant: merchantId,
        category: 'Jackets',
        tags: ['winter', 'premium', 'leather'],
        sizes: ['M', 'L', 'XL'],
        colors: ['black', 'brown'],
        gender: 'unisex',
        material: 'leather',
        brand: 'PremiumStyle',
        viewCount: 250
      },
      {
        name: 'Cargo Shorts',
        description: 'Comfortable cargo shorts',
        price: 39.99,
        stock: 80,
        merchant: merchantId,
        category: 'Shorts',
        tags: ['casual', 'summer', 'outdoor'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['khaki', 'olive', 'black'],
        gender: 'male',
        material: 'cotton',
        brand: 'OutdoorGear',
        viewCount: 110
      },
      {
        name: 'Yoga Pants',
        description: 'Stretchy yoga pants',
        price: 44.99,
        stock: 70,
        merchant: merchantId,
        category: 'Pants',
        tags: ['sports', 'yoga', 'fitness'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['black', 'purple', 'pink'],
        gender: 'female',
        material: 'spandex',
        brand: 'FitLife',
        viewCount: 140
      },
      {
        name: 'Sweater',
        description: 'Cozy winter sweater',
        price: 54.99,
        stock: 45,
        merchant: merchantId,
        category: 'Sweaters',
        tags: ['winter', 'cozy', 'warm'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['red', 'green', 'gray'],
        gender: 'unisex',
        material: 'wool',
        brand: 'WarmWear',
        viewCount: 85
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight running shoes',
        price: 89.99,
        stock: 55,
        merchant: merchantId,
        category: 'Shoes',
        tags: ['sports', 'running', 'athletic'],
        sizes: ['7', '8', '9', '10', '11'],
        colors: ['white', 'black', 'blue'],
        gender: 'unisex',
        material: 'synthetic',
        brand: 'RunFast',
        viewCount: 175
      }
    ]);

    console.log(`Created ${products.length} products`);

    // Create orders
    const orders = await Order.create([
      {
        user: users[0]._id,
        products: [products[0]._id, products[1]._id],
        total: 109.98,
        status: 'delivered',
        address: '123 Main St',
        paymentMethod: 'credit_card'
      },
      {
        user: users[0]._id,
        products: [products[3]._id],
        total: 49.99,
        status: 'delivered',
        address: '123 Main St',
        paymentMethod: 'credit_card'
      },
      {
        user: users[1]._id,
        products: [products[2]._id, products[7]._id],
        total: 104.98,
        status: 'delivered',
        address: '456 Oak Ave',
        paymentMethod: 'paypal'
      },
      {
        user: users[1]._id,
        products: [products[0]._id],
        total: 29.99,
        status: 'pending',
        address: '456 Oak Ave',
        paymentMethod: 'credit_card'
      },
      {
        user: users[2]._id,
        products: [products[4]._id, products[9]._id],
        total: 159.98,
        status: 'delivered',
        address: '789 Pine Rd',
        paymentMethod: 'credit_card'
      },
      {
        user: users[2]._id,
        products: [products[1]._id, products[6]._id],
        total: 119.98,
        status: 'shipped',
        address: '789 Pine Rd',
        paymentMethod: 'debit_card'
      },
      {
        user: users[3]._id,
        products: [products[5]._id],
        total: 199.99,
        status: 'delivered',
        address: '321 Elm St',
        paymentMethod: 'credit_card'
      }
    ]);

    console.log(`Created ${orders.length} orders`);

    // Create reviews
    const reviews = await Review.create([
      {
        user: users[0]._id,
        product: products[0]._id,
        rating: 5,
        comment: 'Great quality t-shirt!'
      },
      {
        user: users[0]._id,
        product: products[1]._id,
        rating: 4,
        comment: 'Good fit, comfortable'
      },
      {
        user: users[0]._id,
        product: products[3]._id,
        rating: 5,
        comment: 'Perfect for office wear'
      },
      {
        user: users[1]._id,
        product: products[2]._id,
        rating: 5,
        comment: 'Beautiful dress, love it!'
      },
      {
        user: users[1]._id,
        product: products[7]._id,
        rating: 4,
        comment: 'Very comfortable for yoga'
      },
      {
        user: users[2]._id,
        product: products[4]._id,
        rating: 5,
        comment: 'Best hoodie ever!'
      },
      {
        user: users[2]._id,
        product: products[9]._id,
        rating: 5,
        comment: 'Amazing running shoes'
      },
      {
        user: users[2]._id,
        product: products[1]._id,
        rating: 4,
        comment: 'Nice jeans, good quality'
      },
      {
        user: users[3]._id,
        product: products[5]._id,
        rating: 5,
        comment: 'Premium quality jacket'
      }
    ]);

    console.log(`Created ${reviews.length} reviews`);

    // Create user interactions
    const interactions = await UserInteraction.create([
      {
        user: users[0]._id,
        product: products[0]._id,
        interactionType: 'view'
      },
      {
        user: users[0]._id,
        product: products[1]._id,
        interactionType: 'view'
      },
      {
        user: users[0]._id,
        product: products[3]._id,
        interactionType: 'click'
      },
      {
        user: users[1]._id,
        product: products[2]._id,
        interactionType: 'view'
      },
      {
        user: users[1]._id,
        product: products[7]._id,
        interactionType: 'view'
      },
      {
        user: users[1]._id,
        product: products[0]._id,
        interactionType: 'click'
      },
      {
        user: users[2]._id,
        product: products[4]._id,
        interactionType: 'view'
      },
      {
        user: users[2]._id,
        product: products[9]._id,
        interactionType: 'view'
      },
      {
        user: users[2]._id,
        product: products[1]._id,
        interactionType: 'click'
      },
      {
        user: users[2]._id,
        product: products[6]._id,
        interactionType: 'view'
      },
      {
        user: users[3]._id,
        product: products[5]._id,
        interactionType: 'view'
      },
      {
        user: users[3]._id,
        product: products[5]._id,
        interactionType: 'click'
      }
    ]);

    console.log(`Created ${interactions.length} user interactions`);

    console.log('✅ Recommendation data seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`- ${users.length} users created`);
    console.log(`- ${products.length} products created`);
    console.log(`- ${orders.length} orders created`);
    console.log(`- ${reviews.length} reviews created`);
    console.log(`- ${interactions.length} interactions created`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};
