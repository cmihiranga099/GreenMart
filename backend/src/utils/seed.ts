import dotenv from 'dotenv';
import mongoose from 'mongoose';
import slugify from 'slugify';
import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';

// Load environment variables
dotenv.config();

// Sample data
const categories = [
  {
    name: 'Fruits',
    description: 'Fresh seasonal fruits delivered daily',
    image: {
      url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500',
      publicId: 'sample_fruits',
    },
  },
  {
    name: 'Vegetables',
    description: 'Farm-fresh vegetables for healthy meals',
    image: {
      url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
      publicId: 'sample_vegetables',
    },
  },
  {
    name: 'Dairy',
    description: 'Fresh milk, cheese, and dairy products',
    image: {
      url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500',
      publicId: 'sample_dairy',
    },
  },
  {
    name: 'Bakery',
    description: 'Freshly baked bread and pastries',
    image: {
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
      publicId: 'sample_bakery',
    },
  },
  {
    name: 'Beverages',
    description: 'Refreshing drinks and beverages',
    image: {
      url: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=500',
      publicId: 'sample_beverages',
    },
  },
  {
    name: 'Snacks',
    description: 'Tasty snacks for any occasion',
    image: {
      url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500',
      publicId: 'sample_snacks',
    },
  },
];

const getProducts = (categoryIds: any) => [
  // Fruits
  {
    name: 'Fresh Red Apples',
    description: 'Crisp and juicy red apples, perfect for snacking or baking. Rich in fiber and vitamins.',
    price: 450,
    compareAtPrice: 550,
    sku: 'FRT-001',
    quantity: 50,
    category: categoryIds['Fruits'],
    unit: 'kg',
    tags: ['fresh', 'organic', 'seasonal'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500',
        publicId: 'sample_apples',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Cavendish Bananas',
    description: 'Sweet and ripe Cavendish bananas. Great source of potassium and energy.',
    price: 180,
    sku: 'FRT-002',
    quantity: 100,
    category: categoryIds['Fruits'],
    unit: 'kg',
    tags: ['fresh', 'tropical'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500',
        publicId: 'sample_bananas',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Sweet Oranges',
    description: 'Juicy and sweet oranges packed with Vitamin C. Perfect for fresh juice.',
    price: 350,
    sku: 'FRT-003',
    quantity: 75,
    category: categoryIds['Fruits'],
    unit: 'kg',
    tags: ['fresh', 'citrus', 'vitamin-c'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500',
        publicId: 'sample_oranges',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Fresh Strawberries',
    description: 'Sweet and succulent strawberries. Perfect for desserts and smoothies.',
    price: 890,
    compareAtPrice: 1200,
    sku: 'FRT-004',
    quantity: 30,
    category: categoryIds['Fruits'],
    unit: 'pack',
    tags: ['fresh', 'berries', 'premium'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500',
        publicId: 'sample_strawberries',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Green Grapes',
    description: 'Seedless green grapes, crisp and refreshing. Great for snacking.',
    price: 650,
    sku: 'FRT-005',
    quantity: 40,
    category: categoryIds['Fruits'],
    unit: 'kg',
    tags: ['fresh', 'seedless'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=500',
        publicId: 'sample_grapes',
        isPrimary: true,
      },
    ],
  },

  // Vegetables
  {
    name: 'Fresh Tomatoes',
    description: 'Ripe and juicy tomatoes. Essential for salads, cooking, and sauces.',
    price: 120,
    sku: 'VEG-001',
    quantity: 80,
    category: categoryIds['Vegetables'],
    unit: 'kg',
    tags: ['fresh', 'organic'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500',
        publicId: 'sample_tomatoes',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Green Cabbage',
    description: 'Fresh green cabbage, perfect for salads, stir-fries, and coleslaw.',
    price: 80,
    sku: 'VEG-002',
    quantity: 60,
    category: categoryIds['Vegetables'],
    unit: 'kg',
    tags: ['fresh', 'leafy'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500',
        publicId: 'sample_cabbage',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Carrots',
    description: 'Crunchy and sweet carrots. Rich in beta-carotene and perfect for snacking.',
    price: 95,
    sku: 'VEG-003',
    quantity: 70,
    category: categoryIds['Vegetables'],
    unit: 'kg',
    tags: ['fresh', 'root-vegetable'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500',
        publicId: 'sample_carrots',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Fresh Broccoli',
    description: 'Green and fresh broccoli florets. Packed with nutrients and vitamins.',
    price: 280,
    compareAtPrice: 350,
    sku: 'VEG-004',
    quantity: 45,
    category: categoryIds['Vegetables'],
    unit: 'kg',
    tags: ['fresh', 'superfood', 'organic'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500',
        publicId: 'sample_broccoli',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Red Onions',
    description: 'Fresh red onions with a mild, sweet flavor. Essential kitchen ingredient.',
    price: 110,
    sku: 'VEG-005',
    quantity: 90,
    category: categoryIds['Vegetables'],
    unit: 'kg',
    tags: ['fresh', 'staple'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587049352846-4a222e784573?w=500',
        publicId: 'sample_onions',
        isPrimary: true,
      },
    ],
  },

  // Dairy
  {
    name: 'Fresh Milk',
    description: 'Full cream fresh milk. Rich in calcium and protein. Perfect for daily consumption.',
    price: 320,
    sku: 'DRY-001',
    quantity: 100,
    category: categoryIds['Dairy'],
    unit: 'liter',
    tags: ['dairy', 'fresh', 'calcium'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500',
        publicId: 'sample_milk',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Cheddar Cheese',
    description: 'Premium cheddar cheese. Perfect for sandwiches, burgers, and cooking.',
    price: 890,
    compareAtPrice: 1100,
    sku: 'DRY-002',
    quantity: 35,
    category: categoryIds['Dairy'],
    unit: 'pack',
    tags: ['dairy', 'cheese', 'premium'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=500',
        publicId: 'sample_cheese',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Greek Yogurt',
    description: 'Thick and creamy Greek yogurt. High in protein and probiotics.',
    price: 450,
    sku: 'DRY-003',
    quantity: 50,
    category: categoryIds['Dairy'],
    unit: 'pack',
    tags: ['dairy', 'healthy', 'protein'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500',
        publicId: 'sample_yogurt',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Fresh Butter',
    description: 'Creamy fresh butter. Made from quality cream for rich taste.',
    price: 650,
    sku: 'DRY-004',
    quantity: 40,
    category: categoryIds['Dairy'],
    unit: 'pack',
    tags: ['dairy', 'butter'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500',
        publicId: 'sample_butter',
        isPrimary: true,
      },
    ],
  },

  // Bakery
  {
    name: 'White Bread Loaf',
    description: 'Soft and fluffy white bread. Perfect for sandwiches and toast.',
    price: 180,
    sku: 'BAK-001',
    quantity: 55,
    category: categoryIds['Bakery'],
    unit: 'piece',
    tags: ['bakery', 'bread', 'fresh'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500',
        publicId: 'sample_bread',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Croissants',
    description: 'Buttery and flaky croissants. Perfect for breakfast.',
    price: 420,
    sku: 'BAK-002',
    quantity: 30,
    category: categoryIds['Bakery'],
    unit: 'pack',
    tags: ['bakery', 'pastry', 'french'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500',
        publicId: 'sample_croissant',
        isPrimary: true,
      },
    ],
  },

  // Beverages
  {
    name: 'Orange Juice',
    description: '100% pure orange juice. No added sugar. Rich in Vitamin C.',
    price: 380,
    sku: 'BEV-001',
    quantity: 60,
    category: categoryIds['Beverages'],
    unit: 'liter',
    tags: ['beverage', 'juice', 'healthy'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500',
        publicId: 'sample_juice',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Green Tea',
    description: 'Premium green tea bags. Rich in antioxidants for better health.',
    price: 650,
    compareAtPrice: 850,
    sku: 'BEV-002',
    quantity: 45,
    category: categoryIds['Beverages'],
    unit: 'pack',
    tags: ['beverage', 'tea', 'healthy'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
        publicId: 'sample_tea',
        isPrimary: true,
      },
    ],
  },

  // Snacks
  {
    name: 'Potato Chips',
    description: 'Crispy and crunchy potato chips. Perfect snack for any time.',
    price: 250,
    sku: 'SNK-001',
    quantity: 80,
    category: categoryIds['Snacks'],
    unit: 'pack',
    tags: ['snack', 'chips', 'crispy'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500',
        publicId: 'sample_chips',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Mixed Nuts',
    description: 'Premium mixed nuts including almonds, cashews, and walnuts. Healthy snacking.',
    price: 1200,
    compareAtPrice: 1500,
    sku: 'SNK-002',
    quantity: 25,
    category: categoryIds['Snacks'],
    unit: 'pack',
    tags: ['snack', 'nuts', 'healthy', 'premium'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500',
        publicId: 'sample_nuts',
        isPrimary: true,
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@greenmart.com' });
    if (!adminExists) {
      await User.create({
        email: 'admin@greenmart.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+94771234567',
        role: 'admin',
      });
      console.log('👤 Admin user created (admin@greenmart.com / admin123)');
    }

    // Create categories (manually add slugs since pre-save doesn't run with insertMany)
    console.log('📁 Creating categories...');
    const categoriesWithSlugs = categories.map(cat => ({
      ...cat,
      slug: slugify(cat.name, { lower: true, strict: true })
    }));
    const createdCategories = await Category.insertMany(categoriesWithSlugs);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Map category names to IDs
    const categoryIds: any = {};
    createdCategories.forEach((category) => {
      categoryIds[category.name] = category._id;
    });

    // Create products (manually add slugs since pre-save doesn't run with insertMany)
    console.log('🛍️  Creating products...');
    const products = getProducts(categoryIds);
    const productsWithSlugs = products.map(prod => ({
      ...prod,
      slug: slugify(prod.name, { lower: true, strict: true })
    }));
    const createdProducts = await Product.insertMany(productsWithSlugs);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Admin: admin@greenmart.com / admin123`);
    console.log('\n🚀 You can now browse products at http://localhost:3000/products');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
