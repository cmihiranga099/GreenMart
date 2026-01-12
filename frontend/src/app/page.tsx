'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../lib/api';
import { Product } from '../types/product';
import ProductCard from '../components/products/ProductCard';
import CategoryCard from '../components/categories/CategoryCard';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
    publicId: string;
  };
  productCount?: number;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products/featured');
      if (response.data.success) {
        setFeaturedProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Fresh Groceries Delivered
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Shop from thousands of fresh products and get them delivered to your doorstep.
                Quality guaranteed, prices that won't break bank.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center bg-green-600 text-white hover:bg-green-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Start Shopping
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 transition duration-200"
                >
                  View Offers
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1543168256-418811576931?w=800&h=600&fit=crop"
                  alt="Fresh Groceries Display"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              </div>
              {/* Optional overlay badge */}
              <div className="absolute -bottom-6 -left-6 bg-green-600 text-white p-6 rounded-xl shadow-lg hidden lg:block">
                <p className="text-3xl font-bold">100+</p>
                <p className="text-sm">Fresh Products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Shop by Category
              </h2>
              <p className="text-gray-600">
                Find what you need quickly
              </p>
            </div>
            <Link
              href="/products"
              className="text-primary hover:text-primary-dark font-semibold flex items-center gap-2"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No categories available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">
              Check out our best-selling and popular items
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                No featured products available at the moment
              </p>
              <Link
                href="/products"
                className="text-primary hover:text-primary-dark font-semibold"
              >
                Browse all products →
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/products"
                  className="inline-block bg-primary text-white hover:bg-primary-dark font-semibold py-3 px-8 rounded-lg transition duration-200"
                >
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Get your groceries delivered to your doorstep quickly and safely
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fresh Quality
              </h3>
              <p className="text-gray-600">
                We ensure all products are fresh and of the highest quality
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Best Prices
              </h3>
              <p className="text-gray-600">
                Competitive prices and great deals on all your favorite products
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
