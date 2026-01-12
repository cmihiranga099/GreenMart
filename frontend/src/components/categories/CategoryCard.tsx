import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  category: {
    _id: string;
    name: string;
    slug: string;
    image?: {
      url: string;
      publicId: string;
    };
    productCount?: number;
  };
}

// Category icon mapping with colors
const categoryIcons: { [key: string]: { icon: string; color: string } } = {
  'Fruits': { icon: '🍎', color: 'bg-red-500' },
  'Vegetables': { icon: '🥕', color: 'bg-orange-500' },
  'Dairy': { icon: '🥛', color: 'bg-blue-500' },
  'Bakery': { icon: '🥖', color: 'bg-amber-500' },
  'Beverages': { icon: '🥤', color: 'bg-purple-500' },
  'Snacks': { icon: '🍪', color: 'bg-yellow-500' },
  'Meat & Poultry': { icon: '🍗', color: 'bg-red-600' },
  'Seafood': { icon: '🐟', color: 'bg-cyan-500' },
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const categoryInfo = categoryIcons[category.name] || { icon: '🛒', color: 'bg-gray-500' };

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group"
    >
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-primary hover:shadow-lg transition-all duration-300 text-center h-full flex flex-col items-center justify-center">
        {/* Icon Circle */}
        <div className={`w-16 h-16 ${categoryInfo.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-3xl">{categoryInfo.icon}</span>
        </div>

        {/* Category Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
          {category.name}
        </h3>

        {/* Product Count */}
        <p className="text-sm text-gray-500">
          {category.productCount || 0} items
        </p>
      </div>
    </Link>
  );
}
