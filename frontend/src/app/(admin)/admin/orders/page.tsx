'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { EyeIcon, TruckIcon } from '@heroicons/react/24/outline';

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  total: number;
  status: string;
  paymentInfo: {
    method: string;
    status: string;
  };
  createdAt: string;
  items: any[];
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  // Tracking modal state
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState({
    status: '',
    location: '',
    description: '',
    estimatedDelivery: '',
  });
  const [submittingTracking, setSubmittingTracking] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/all/list?page=${page}&limit=20`);
      if (response.data.success) {
        setOrders(response.data.data);
        setTotalPages(response.data.pages);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      if (response.data.success) {
        toast.success('Order status updated');
        fetchOrders();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update order status';
      toast.error(message);
    }
  };

  const handleOpenTrackingModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowTrackingModal(true);
    setTrackingData({
      status: '',
      location: '',
      description: '',
      estimatedDelivery: '',
    });
  };

  const handleCloseTrackingModal = () => {
    setShowTrackingModal(false);
    setSelectedOrderId(null);
    setTrackingData({
      status: '',
      location: '',
      description: '',
      estimatedDelivery: '',
    });
  };

  const handleSubmitTracking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingData.status || !trackingData.location || !trackingData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmittingTracking(true);
      const response = await api.post(`/orders/${selectedOrderId}/tracking`, trackingData);

      if (response.data.success) {
        toast.success('Tracking update added successfully');
        handleCloseTrackingModal();
        fetchOrders();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add tracking update';
      toast.error(message);
    } finally {
      setSubmittingTracking(false);
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

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-1">View and manage customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {['pending', 'confirmed', 'processing', 'delivered', 'cancelled'].map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <div
              key={status}
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
              onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
            >
              <p className="text-sm text-gray-600 capitalize">{status}</p>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {statusFilter && (
            <button
              onClick={() => setStatusFilter('')}
              className="text-sm text-primary hover:text-primary-dark"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                      <div className="text-xs text-gray-500">{order.items.length} items</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user.firstName} {order.user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(order.createdAt), 'hh:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rs. {order.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.paymentInfo.method === 'stripe' ? 'Card' : 'COD'}
                      </div>
                      <div
                        className={`text-xs ${
                          order.paymentInfo.status === 'completed'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {order.paymentInfo.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-semibold border-none cursor-pointer ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => router.push(`/orders/${order._id}`)}
                        className="text-primary hover:text-primary-dark"
                      >
                        <EyeIcon className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center space-x-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
