'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleRemove = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-light py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : !wishlist || wishlist.products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="mb-6">
                <svg
                  className="w-24 h-24 mx-auto text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">Save your favorite items here!</p>
              <Link
                href="/products"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.products.map((item) => {
                const primaryImage = item.product.images.find((img) => img.isPrimary) || item.product.images[0];
                const hasDiscount = item.product.compareAtPrice && item.product.compareAtPrice > item.product.price;
                const discountPercent = hasDiscount
                  ? Math.round(((item.product.compareAtPrice! - item.product.price) / item.product.compareAtPrice!) * 100)
                  : 0;

                return (
                  <div key={item.product._id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                    {/* Image */}
                    <Link href={`/products/${item.product._id}`}>
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <Image
                          src={primaryImage.url}
                          alt={item.product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        {hasDiscount && (
                          <div className="absolute top-2 right-2 bg-danger text-white px-2 py-1 rounded-full text-xs font-bold">
                            -{discountPercent}%
                          </div>
                        )}
                        {item.product.quantity === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link href={`/products/${item.product._id}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition">
                          {item.product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-primary">
                          Rs. {item.product.price.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-400 line-through">
                            Rs. {item.product.compareAtPrice?.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item.product._id)}
                          disabled={item.product.quantity === 0}
                          className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                        >
                          <ShoppingCartIcon className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleRemove(item.product._id)}
                          className="p-2 border-2 border-gray-300 rounded-lg hover:border-danger hover:bg-danger/5 transition"
                        >
                          <TrashIcon className="w-5 h-5 text-danger" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
