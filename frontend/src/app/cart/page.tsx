'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart, loading, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemove = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-light py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : !cart || cart.items.length === 0 ? (
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some products to get started!</p>
              <Link
                href="/products"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Clear Cart Button */}
                <div className="flex justify-end mb-2">
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-danger hover:text-danger/80 transition"
                  >
                    Clear Cart
                  </button>
                </div>

                {cart.items.map((item) => {
                  // Skip items with missing products
                  if (!item.product || !item.product.images || item.product.images.length === 0) {
                    return null;
                  }

                  const primaryImage = item.product.images.find((img) => img.isPrimary) || item.product.images[0];

                  return (
                    <div key={item.product._id} className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link href={`/products/${item.product._id}`} className="flex-shrink-0">
                          <div className="w-24 h-24 relative bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={primaryImage.url}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product._id}`}
                            className="font-semibold text-gray-900 hover:text-primary transition line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            Rs. {item.product.price.toFixed(2)} per {item.product.unit}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>
                              <span className="font-semibold w-12 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.quantity}
                                className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemove(item.product._id)}
                              className="text-danger hover:text-danger/80 transition flex items-center gap-1 text-sm"
                            >
                              <TrashIcon className="w-4 h-4" />
                              Remove
                            </button>
                          </div>

                          {/* Stock Warning */}
                          {item.quantity >= item.product.quantity && (
                            <p className="text-xs text-accent mt-2">
                              Maximum quantity available: {item.product.quantity}
                            </p>
                          )}
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">
                            Rs. {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">Rs. 0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">Rs. 0.00</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          Rs. {subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    href="/products"
                    className="block text-center text-primary hover:text-primary-dark font-medium transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
