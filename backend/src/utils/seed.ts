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
      url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500',
      publicId: 'sample_fruits',
    },
  },
  {
    name: 'Vegetables',
    description: 'Farm-fresh vegetables for healthy meals',
    image: {
      url: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500',
      publicId: 'sample_vegetables',
    },
  },
  {
    name: 'Dairy',
    description: 'Fresh milk, cheese, and dairy products',
    image: {
      url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500',
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
      url: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500',
      publicId: 'sample_beverages',
    },
  },
  {
    name: 'Snacks',
    description: 'Tasty snacks for any occasion',
    image: {
      url: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500',
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
        url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500',
        publicId: 'sample_red_onions',
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

  // Additional Fruits
  {
    name: 'Fresh Mangoes',
    description: 'Sweet and juicy mangoes. Rich in vitamins and perfect for smoothies.',
    price: 420,
    sku: 'FRT-006',
    quantity: 35,
    category: categoryIds['Fruits'],
    unit: 'kg',
    tags: ['fresh', 'tropical', 'seasonal'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=500',
        publicId: 'sample_mangoes',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Watermelon',
    description: 'Fresh and juicy watermelon. Perfect for hot days and hydration.',
    price: 150,
    sku: 'FRT-007',
    quantity: 45,
    category: categoryIds['Fruits'],
    unit: 'kg',
    tags: ['fresh', 'summer', 'refreshing'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=500',
        publicId: 'sample_watermelon',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Fresh Pineapple',
    description: 'Sweet and tangy pineapple. Great for desserts and tropical dishes.',
    price: 280,
    sku: 'FRT-008',
    quantity: 40,
    category: categoryIds['Fruits'],
    unit: 'piece',
    tags: ['fresh', 'tropical'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500',
        publicId: 'sample_pineapple',
        isPrimary: true,
      },
    ],
  },

  // Additional Vegetables
  {
    name: 'Potatoes',
    description: 'Fresh potatoes perfect for frying, baking, or mashing. Versatile kitchen staple.',
    price: 75,
    sku: 'VEG-006',
    quantity: 100,
    category: categoryIds['Vegetables'],
    unit: 'kg',
    tags: ['fresh', 'staple', 'versatile'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596561404352-a8e4d6e72e8e?w=500',
        publicId: 'sample_potatoes',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Bell Peppers',
    description: 'Colorful bell peppers. Rich in vitamins and perfect for stir-fries.',
    price: 320,
    sku: 'VEG-007',
    quantity: 55,
    category: categoryIds['Vegetables'],
    unit: 'kg',
    tags: ['fresh', 'colorful', 'vitamin-c'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500',
        publicId: 'sample_peppers',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Fresh Cucumbers',
    description: 'Crisp and refreshing cucumbers. Perfect for salads and sandwiches.',
    price: 90,
    sku: 'VEG-008',
    quantity: 70,
    category: categoryIds['Vegetables'],
    unit: 'kg',
    tags: ['fresh', 'salad', 'refreshing'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500',
        publicId: 'sample_cucumbers',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Spinach',
    description: 'Fresh green spinach. Packed with iron and nutrients.',
    price: 180,
    sku: 'VEG-009',
    quantity: 50,
    category: categoryIds['Vegetables'],
    unit: 'kg',
    tags: ['fresh', 'leafy', 'superfood'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500',
        publicId: 'sample_spinach',
        isPrimary: true,
      },
    ],
  },

  // Additional Dairy
  {
    name: 'Farm Fresh Eggs',
    description: 'Fresh farm eggs. High in protein and perfect for breakfast.',
    price: 480,
    sku: 'DRY-005',
    quantity: 75,
    category: categoryIds['Dairy'],
    unit: 'dozen',
    tags: ['dairy', 'protein', 'fresh'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500',
        publicId: 'sample_eggs',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Heavy Cream',
    description: 'Rich heavy cream. Perfect for cooking, baking, and desserts.',
    price: 580,
    sku: 'DRY-006',
    quantity: 40,
    category: categoryIds['Dairy'],
    unit: 'pack',
    tags: ['dairy', 'cream', 'cooking'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500',
        publicId: 'sample_cream',
        isPrimary: true,
      },
    ],
  },

  // Additional Bakery
  {
    name: 'Blueberry Muffins',
    description: 'Freshly baked blueberry muffins. Perfect for breakfast or snack.',
    price: 380,
    sku: 'BAK-003',
    quantity: 40,
    category: categoryIds['Bakery'],
    unit: 'pack',
    tags: ['bakery', 'muffin', 'sweet'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500',
        publicId: 'sample_muffins',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Bagels',
    description: 'Fresh bagels. Great for breakfast sandwiches.',
    price: 320,
    sku: 'BAK-004',
    quantity: 45,
    category: categoryIds['Bakery'],
    unit: 'pack',
    tags: ['bakery', 'bagel', 'breakfast'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1612894332155-10f271ab4b37?w=500',
        publicId: 'sample_bagels',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Chocolate Cake',
    description: 'Rich and moist chocolate cake. Perfect for celebrations.',
    price: 1200,
    compareAtPrice: 1500,
    sku: 'BAK-005',
    quantity: 20,
    category: categoryIds['Bakery'],
    unit: 'piece',
    tags: ['bakery', 'cake', 'dessert', 'celebration'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
        publicId: 'sample_cake',
        isPrimary: true,
      },
    ],
  },

  // Additional Beverages
  {
    name: 'Mineral Water',
    description: 'Pure mineral water. Naturally sourced and refreshing.',
    price: 120,
    sku: 'BEV-003',
    quantity: 150,
    category: categoryIds['Beverages'],
    unit: 'liter',
    tags: ['beverage', 'water', 'healthy'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500',
        publicId: 'sample_water',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Premium Coffee Beans',
    description: 'Arabica coffee beans. Rich aroma and perfect for brewing.',
    price: 1400,
    compareAtPrice: 1800,
    sku: 'BEV-004',
    quantity: 30,
    category: categoryIds['Beverages'],
    unit: 'pack',
    tags: ['beverage', 'coffee', 'premium'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
        publicId: 'sample_coffee',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Coconut Water',
    description: 'Natural coconut water. Hydrating and packed with electrolytes.',
    price: 280,
    sku: 'BEV-005',
    quantity: 60,
    category: categoryIds['Beverages'],
    unit: 'pack',
    tags: ['beverage', 'natural', 'hydrating'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585977414941-8b7f5c0e8b93?w=500',
        publicId: 'sample_coconut_water',
        isPrimary: true,
      },
    ],
  },

  // Additional Snacks
  {
    name: 'Chocolate Chip Cookies',
    description: 'Crispy chocolate chip cookies. Perfect with milk or tea.',
    price: 320,
    sku: 'SNK-003',
    quantity: 60,
    category: categoryIds['Snacks'],
    unit: 'pack',
    tags: ['snack', 'cookies', 'sweet'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500',
        publicId: 'sample_cookies',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Dark Chocolate Bar',
    description: 'Premium dark chocolate. Rich flavor with 70% cocoa.',
    price: 450,
    sku: 'SNK-004',
    quantity: 50,
    category: categoryIds['Snacks'],
    unit: 'pack',
    tags: ['snack', 'chocolate', 'premium'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500',
        publicId: 'sample_chocolate',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Popcorn',
    description: 'Butter flavored popcorn. Perfect movie snack.',
    price: 180,
    sku: 'SNK-005',
    quantity: 70,
    category: categoryIds['Snacks'],
    unit: 'pack',
    tags: ['snack', 'popcorn', 'movie'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=500',
        publicId: 'sample_popcorn',
        isPrimary: true,
      },
    ],
  },

  // More Fruits (need 2 more to reach 10)
  {
    name: 'Fresh Kiwi',
    description: 'Sweet and tangy kiwi fruits. Rich in vitamin C and fiber.',
    price: 580,
    sku: 'FRT-009',
    quantity: 30,
    category: categoryIds['Fruits'],
    unit: 'kg',
    tags: ['fresh', 'imported', 'vitamin-c'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=500',
        publicId: 'sample_kiwi',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Dragon Fruit',
    description: 'Exotic dragon fruit. Beautiful pink color and unique taste.',
    price: 850,
    compareAtPrice: 1100,
    sku: 'FRT-010',
    quantity: 25,
    category: categoryIds['Fruits'],
    unit: 'kg',
    tags: ['fresh', 'exotic', 'premium'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=500',
        publicId: 'sample_dragonfruit',
        isPrimary: true,
      },
    ],
  },

  // More Vegetables (need 1 more to reach 10)
  {
    name: 'Fresh Lettuce',
    description: 'Crisp iceberg lettuce. Perfect for salads and wraps.',
    price: 140,
    sku: 'VEG-010',
    quantity: 65,
    category: categoryIds['Vegetables'],
    unit: 'kg',
    tags: ['fresh', 'salad', 'leafy'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=500',
        publicId: 'sample_lettuce',
        isPrimary: true,
      },
    ],
  },

  // More Dairy (need 4 more to reach 10)
  {
    name: 'Mozzarella Cheese',
    description: 'Fresh mozzarella cheese. Perfect for pizza and pasta.',
    price: 750,
    sku: 'DRY-007',
    quantity: 40,
    category: categoryIds['Dairy'],
    unit: 'pack',
    tags: ['dairy', 'cheese', 'italian'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=500',
        publicId: 'sample_mozzarella',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Cream Cheese',
    description: 'Smooth cream cheese. Great for bagels and cheesecakes.',
    price: 520,
    sku: 'DRY-008',
    quantity: 45,
    category: categoryIds['Dairy'],
    unit: 'pack',
    tags: ['dairy', 'cheese', 'spread'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610440042657-74888a165069?w=500',
        publicId: 'sample_cream_cheese',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Low Fat Yogurt',
    description: 'Healthy low fat yogurt. Various fruit flavors available.',
    price: 320,
    sku: 'DRY-009',
    quantity: 60,
    category: categoryIds['Dairy'],
    unit: 'pack',
    tags: ['dairy', 'yogurt', 'healthy', 'low-fat'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500',
        publicId: 'sample_lowfat_yogurt',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Whipping Cream',
    description: 'Fresh whipping cream. Perfect for desserts and coffee.',
    price: 490,
    sku: 'DRY-010',
    quantity: 35,
    category: categoryIds['Dairy'],
    unit: 'pack',
    tags: ['dairy', 'cream', 'dessert'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1627483262769-f637dcc49d21?w=500',
        publicId: 'sample_whipping_cream',
        isPrimary: true,
      },
    ],
  },

  // More Bakery (need 5 more to reach 10)
  {
    name: 'Baguette',
    description: 'Classic French baguette. Crispy outside, soft inside.',
    price: 220,
    sku: 'BAK-006',
    quantity: 50,
    category: categoryIds['Bakery'],
    unit: 'piece',
    tags: ['bakery', 'bread', 'french'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500',
        publicId: 'sample_baguette',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Cinnamon Rolls',
    description: 'Sweet cinnamon rolls with cream cheese icing.',
    price: 480,
    sku: 'BAK-007',
    quantity: 35,
    category: categoryIds['Bakery'],
    unit: 'pack',
    tags: ['bakery', 'sweet', 'pastry'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590841609987-4ac211afddf1?w=500',
        publicId: 'sample_cinnamon_rolls',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Whole Wheat Bread',
    description: 'Healthy whole wheat bread. High in fiber.',
    price: 210,
    sku: 'BAK-008',
    quantity: 55,
    category: categoryIds['Bakery'],
    unit: 'piece',
    tags: ['bakery', 'bread', 'healthy', 'whole-wheat'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
        publicId: 'sample_wheat_bread',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Donuts Assorted',
    description: 'Fresh glazed donuts. Mix of chocolate, vanilla, and strawberry.',
    price: 450,
    sku: 'BAK-009',
    quantity: 40,
    category: categoryIds['Bakery'],
    unit: 'pack',
    tags: ['bakery', 'donut', 'sweet', 'dessert'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1533910534207-90f31029a78e?w=500',
        publicId: 'sample_donuts',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Cupcakes',
    description: 'Freshly baked cupcakes with buttercream frosting.',
    price: 580,
    sku: 'BAK-010',
    quantity: 30,
    category: categoryIds['Bakery'],
    unit: 'pack',
    tags: ['bakery', 'cupcake', 'dessert', 'celebration'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500',
        publicId: 'sample_cupcakes',
        isPrimary: true,
      },
    ],
  },

  // More Beverages (need 5 more to reach 10)
  {
    name: 'Apple Juice',
    description: '100% pure apple juice. No added sugar or preservatives.',
    price: 340,
    sku: 'BEV-006',
    quantity: 70,
    category: categoryIds['Beverages'],
    unit: 'liter',
    tags: ['beverage', 'juice', 'natural'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1568661323688-c93930c3d9cf?w=500',
        publicId: 'sample_apple_juice',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Energy Drink',
    description: 'Refreshing energy drink. Boosts energy and focus.',
    price: 280,
    sku: 'BEV-007',
    quantity: 80,
    category: categoryIds['Beverages'],
    unit: 'pack',
    tags: ['beverage', 'energy', 'sports'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1604480133435-25b1eb7c7e43?w=500',
        publicId: 'sample_energy_drink',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Iced Tea Lemon',
    description: 'Refreshing lemon iced tea. Perfect for hot days.',
    price: 220,
    sku: 'BEV-008',
    quantity: 90,
    category: categoryIds['Beverages'],
    unit: 'liter',
    tags: ['beverage', 'tea', 'iced', 'refreshing'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500',
        publicId: 'sample_iced_tea',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Fresh Milk Shake',
    description: 'Creamy chocolate milk shake. Made with real milk and cocoa.',
    price: 380,
    sku: 'BEV-009',
    quantity: 40,
    category: categoryIds['Beverages'],
    unit: 'pack',
    tags: ['beverage', 'milkshake', 'chocolate'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500',
        publicId: 'sample_milkshake',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Sparkling Water',
    description: 'Carbonated mineral water. Refreshing and calorie-free.',
    price: 180,
    sku: 'BEV-010',
    quantity: 100,
    category: categoryIds['Beverages'],
    unit: 'liter',
    tags: ['beverage', 'water', 'sparkling', 'zero-calorie'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500',
        publicId: 'sample_sparkling_water',
        isPrimary: true,
      },
    ],
  },

  // More Snacks (need 5 more to reach 10)
  {
    name: 'Granola Bars',
    description: 'Healthy granola bars with oats and honey. Perfect for on-the-go.',
    price: 380,
    sku: 'SNK-006',
    quantity: 65,
    category: categoryIds['Snacks'],
    unit: 'pack',
    tags: ['snack', 'granola', 'healthy', 'energy'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1560963689-b5682b6440f8?w=500',
        publicId: 'sample_granola_bars',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Pretzels',
    description: 'Crunchy salted pretzels. Classic snacking favorite.',
    price: 280,
    sku: 'SNK-007',
    quantity: 70,
    category: categoryIds['Snacks'],
    unit: 'pack',
    tags: ['snack', 'pretzel', 'salted', 'crunchy'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500',
        publicId: 'sample_pretzels',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Trail Mix',
    description: 'Nutritious trail mix with nuts, dried fruits, and chocolate.',
    price: 680,
    sku: 'SNK-008',
    quantity: 45,
    category: categoryIds['Snacks'],
    unit: 'pack',
    tags: ['snack', 'trail-mix', 'healthy', 'nuts'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500',
        publicId: 'sample_trail_mix',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Cheese Crackers',
    description: 'Crispy cheese-flavored crackers. Great with dips.',
    price: 240,
    sku: 'SNK-009',
    quantity: 75,
    category: categoryIds['Snacks'],
    unit: 'pack',
    tags: ['snack', 'crackers', 'cheese', 'crispy'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1613771404721-1f92d799e49f?w=500',
        publicId: 'sample_crackers',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Dried Fruit Mix',
    description: 'Naturally sweet dried fruits. Apricots, raisins, and cranberries.',
    price: 590,
    sku: 'SNK-010',
    quantity: 50,
    category: categoryIds['Snacks'],
    unit: 'pack',
    tags: ['snack', 'dried-fruit', 'healthy', 'natural'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500',
        publicId: 'sample_dried_fruit',
        isPrimary: true,
      },
    ],
  },

  // Additional 2 Fruits (to reach 12)
  {
    name: 'Fresh Papaya',
    description: 'Sweet tropical papaya. Rich in vitamins and enzymes for digestion.',
    price: 320,
    sku: 'FRT-011',
    quantity: 40,
    category: categoryIds['Fruits'],
    unit: 'kg',
    tags: ['fresh', 'tropical', 'digestive'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=500',
        publicId: 'sample_papaya',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Avocado',
    description: 'Fresh avocados. Creamy texture and packed with healthy fats.',
    price: 780,
    compareAtPrice: 950,
    sku: 'FRT-012',
    quantity: 30,
    category: categoryIds['Fruits'],
    unit: 'kg',
    tags: ['fresh', 'superfood', 'healthy-fats'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500',
        publicId: 'sample_avocado',
        isPrimary: true,
      },
    ],
  },

  // Additional 2 Vegetables (to reach 12)
  {
    name: 'Sweet Corn',
    description: 'Fresh sweet corn kernels. Sweet and tender, perfect for salads and sides.',
    price: 220,
    sku: 'VEG-011',
    quantity: 60,
    category: categoryIds['Vegetables'],
    unit: 'kg',
    tags: ['fresh', 'sweet', 'corn'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500',
        publicId: 'sample_corn',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Mushrooms',
    description: 'Fresh button mushrooms. Perfect for pasta, pizza, and stir-fries.',
    price: 450,
    sku: 'VEG-012',
    quantity: 45,
    category: categoryIds['Vegetables'],
    unit: 'kg',
    tags: ['fresh', 'mushroom', 'gourmet'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=500',
        publicId: 'sample_mushrooms',
        isPrimary: true,
      },
    ],
  },

  // Additional 2 Dairy (to reach 12)
  {
    name: 'Parmesan Cheese',
    description: 'Aged Parmesan cheese. Rich flavor perfect for pasta and risotto.',
    price: 1200,
    compareAtPrice: 1500,
    sku: 'DRY-011',
    quantity: 25,
    category: categoryIds['Dairy'],
    unit: 'pack',
    tags: ['dairy', 'cheese', 'premium', 'aged'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1589881133595-c7ce28e46c81?w=500',
        publicId: 'sample_parmesan',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Sour Cream',
    description: 'Creamy sour cream. Perfect for dips, tacos, and baked potatoes.',
    price: 420,
    sku: 'DRY-012',
    quantity: 45,
    category: categoryIds['Dairy'],
    unit: 'pack',
    tags: ['dairy', 'cream', 'tangy'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600788907416-456578634209?w=500',
        publicId: 'sample_sour_cream',
        isPrimary: true,
      },
    ],
  },

  // Additional 2 Bakery (to reach 12)
  {
    name: 'Apple Pie',
    description: 'Homemade-style apple pie. Flaky crust with sweet cinnamon apple filling.',
    price: 850,
    sku: 'BAK-011',
    quantity: 25,
    category: categoryIds['Bakery'],
    unit: 'piece',
    tags: ['bakery', 'pie', 'dessert', 'apple'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=500',
        publicId: 'sample_apple_pie',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Sandwich Bread',
    description: 'Soft white sandwich bread. Perfect for everyday sandwiches.',
    price: 160,
    sku: 'BAK-012',
    quantity: 65,
    category: categoryIds['Bakery'],
    unit: 'piece',
    tags: ['bakery', 'bread', 'sandwich', 'daily'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500',
        publicId: 'sample_sandwich_bread',
        isPrimary: true,
      },
    ],
  },

  // Additional 2 Beverages (to reach 12)
  {
    name: 'Mango Juice',
    description: '100% pure mango juice. Naturally sweet and refreshing.',
    price: 420,
    sku: 'BEV-011',
    quantity: 55,
    category: categoryIds['Beverages'],
    unit: 'liter',
    tags: ['beverage', 'juice', 'mango', 'tropical'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500',
        publicId: 'sample_mango_juice',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Hot Chocolate Mix',
    description: 'Premium hot chocolate powder. Rich and creamy, perfect for cold days.',
    price: 680,
    sku: 'BEV-012',
    quantity: 40,
    category: categoryIds['Beverages'],
    unit: 'pack',
    tags: ['beverage', 'chocolate', 'hot-drink', 'winter'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542990253-a781e04c0082?w=500',
        publicId: 'sample_hot_chocolate',
        isPrimary: true,
      },
    ],
  },

  // Additional 2 Snacks (to reach 12)
  {
    name: 'Rice Crackers',
    description: 'Crispy rice crackers. Light and crunchy Japanese-style snack.',
    price: 320,
    sku: 'SNK-011',
    quantity: 60,
    category: categoryIds['Snacks'],
    unit: 'pack',
    tags: ['snack', 'rice', 'crackers', 'asian'],
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=500',
        publicId: 'sample_rice_crackers',
        isPrimary: true,
      },
    ],
  },
  {
    name: 'Protein Bars',
    description: 'High-protein energy bars. Perfect post-workout snack with 20g protein.',
    price: 850,
    compareAtPrice: 1100,
    sku: 'SNK-012',
    quantity: 40,
    category: categoryIds['Snacks'],
    unit: 'pack',
    tags: ['snack', 'protein', 'fitness', 'energy'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1560963689-b5682b6440f8?w=500',
        publicId: 'sample_protein_bars',
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
