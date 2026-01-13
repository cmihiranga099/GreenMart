'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';

interface TrackingUpdate {
  status: string;
  location: string;
  description: string;
  timestamp: string;
}

interface OrderDetail {
  _id: string;
  orderNumber: string;
  items: any[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    method: string;
    status: string;
    paidAt?: string;
  };
  trackingUpdates?: TrackingUpdate[];
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { isAuthenticated } = useAuth();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (orderId) {
      fetchOrder();
    }
  }, [isAuthenticated, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching order:', error);
      toast.error('Failed to fetch order details');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancelling(true);
      const response = await api.patch(`/orders/${orderId}/cancel`);
      if (response.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrder(); // Refresh order data
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to cancel order';
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancelOrder = (status: string) => {
    return status !== 'delivered' && status !== 'cancelled';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Order not found</h1>
            <button
              onClick={() => router.push('/orders')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/orders"
            className="text-primary hover:text-primary-dark font-medium inline-flex items-center"
          >
            ← Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
                <p className="text-gray-600 mt-1">
                  Placed on {format(new Date(order.createdAt), 'MMMM dd, yyyy - hh:mm a')}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                {canCancelOrder(order.status) && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 py-4 border-b last:border-0">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Rs. {item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Rs. {item.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Tracking */}
            {order.trackingUpdates && order.trackingUpdates.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Tracking</h2>
                {order.estimatedDelivery && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Estimated Delivery:</span>{' '}
                      {format(new Date(order.estimatedDelivery), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                )}
                <div className="relative">
                  {order.trackingUpdates
                    .slice()
                    .reverse()
                    .map((update, index) => (
                      <div key={index} className="flex mb-6 last:mb-0">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          {index !== order.trackingUpdates!.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-900">{update.status}</h3>
                              <span className="text-xs text-gray-500">
                                {format(new Date(update.timestamp), 'MMM dd, yyyy - hh:mm a')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{update.description}</p>
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Location:</span> {update.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="text-gray-700 space-y-1">
                <p className="font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">
                    {order.paymentInfo.method === 'stripe'
                      ? 'Credit/Debit Card'
                      : 'Cash on Delivery'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span
                    className={`font-medium ${
                      order.paymentInfo.status === 'completed'
                        ? 'text-green-600'
                        : order.paymentInfo.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {order.paymentInfo.status.charAt(0).toUpperCase() +
                      order.paymentInfo.status.slice(1)}
                  </span>
                </div>
                {order.paymentInfo.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid At:</span>
                    <span className="font-medium">
                      {format(new Date(order.paymentInfo.paidAt), 'MMM dd, yyyy - hh:mm a')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span>Rs. {order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax:</span>
                  <span>Rs. {order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping:</span>
                  <span>
                    {order.shippingCost === 0 ? 'Free' : `Rs. ${order.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>Rs. {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Contact our customer support for any questions about your order.
                </p>
                <a
                  href="mailto:support@greenmart.com"
                  className="text-primary hover:text-primary-dark text-sm font-medium"
                >
                  support@greenmart.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
