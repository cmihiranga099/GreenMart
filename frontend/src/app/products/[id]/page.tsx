'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '../../../lib/api';
import { Product } from '../../../types/product';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';
import { useCart } from '../../../context/CartContext';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${params.id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product._id, quantity);
  };

  const handleAddToWishlist = () => {
    // Wishlist functionality will be implemented later
    toast.success('Added to wishlist!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-light py-8">
        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <span className="hover:text-primary cursor-pointer" onClick={() => router.push('/')}>
              Home
            </span>
            {' / '}
            <span className="hover:text-primary cursor-pointer" onClick={() => router.push('/products')}>
              Products
            </span>
            {' / '}
            <span>{product.name}</span>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Image Gallery */}
              <div>
                {/* Main Image */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={product.images[selectedImage].url}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-primary' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={`${product.name} ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                {/* Category */}
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  {product.category.name}
                </p>

                {/* Product Name */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-primary">
                    Rs. {product.price.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        Rs. {product.compareAtPrice?.toFixed(2)}
                      </span>
                      <span className="bg-danger text-white px-3 py-1 rounded-full text-sm font-bold">
                        Save {discountPercent}%
                      </span>
                    </>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-6">per {product.unit}</p>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.quantity > 0 ? (
                    <p className="text-success flex items-center gap-2">
                      <span className="w-2 h-2 bg-success rounded-full"></span>
                      In Stock ({product.quantity} available)
                    </p>
                  ) : (
                    <p className="text-danger flex items-center gap-2">
                      <span className="w-2 h-2 bg-danger rounded-full"></span>
                      Out of Stock
                    </p>
                  )}
                </div>

                {/* Quantity Selector */}
                {product.quantity > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-primary transition"
                      >
                        -
                      </button>
                      <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-primary transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0 || cartLoading}
                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    {cartLoading ? 'Adding...' : 'Add to Cart'}
                  </button>

                  <button
                    onClick={handleAddToWishlist}
                    className="p-3 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition"
                  >
                    <HeartIcon className="w-6 h-6 text-gray-700" />
                  </button>
                </div>

                {/* Product Details */}
                <div className="mt-8 border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium">{product.sku}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Unit:</span>
                      <span className="font-medium">{product.unit}</span>
                    </li>
                    {product.tags.length > 0 && (
                      <li className="flex justify-between">
                        <span className="text-gray-600">Tags:</span>
                        <span className="font-medium">{product.tags.join(', ')}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
