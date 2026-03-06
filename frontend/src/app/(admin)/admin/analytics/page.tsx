'use client';

import React, { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { User } from '@/types/user';
import {
  ArrowTrendingUpIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';

interface AdminOrderItem {
  name: string;
  quantity: number;
}

interface AdminOrder {
  _id: string;
  total: number;
  status: OrderStatus;
  items: AdminOrderItem[];
  createdAt: string;
}

interface OrdersResponse {
  total: number;
  pages: number;
  data: AdminOrder[];
}

interface AnalyticsData {
  orders: AdminOrder[];
  products: Product[];
  customers: User[];
}

const currency = (value: number) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
  }).format(value);

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-rose-100 text-rose-800',
};

async function fetchAllOrders(): Promise<AdminOrder[]> {
  const limit = 100;
  const first = await api.get<{
    success: boolean;
    total: number;
    pages: number;
    data: AdminOrder[];
  }>(`/orders/all/list?page=1&limit=${limit}`);

  const firstData: OrdersResponse = {
    total: first.data.total || 0,
    pages: first.data.pages || 1,
    data: first.data.data || [],
  };

  if (firstData.pages <= 1) return firstData.data;

  const remainingPageCalls = Array.from({ length: firstData.pages - 1 }, (_, i) =>
    api.get<{ data: AdminOrder[] }>(`/orders/all/list?page=${i + 2}&limit=${limit}`)
  );

  const rest = await Promise.all(remainingPageCalls);
  const remainingOrders = rest.flatMap((res) => res.data.data || []);

  return [...firstData.data, ...remainingOrders];
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    orders: [],
    products: [],
    customers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [orders, productsRes, customersRes] = await Promise.all([
          fetchAllOrders(),
          api.get<{ data: Product[] }>('/products?limit=100'),
          api.get<{ data: User[] }>('/users?limit=100'),
        ]);

        setAnalytics({
          orders,
          products: productsRes.data.data || [],
          customers: customersRes.data.data || [],
        });
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const {
    totalRevenue,
    avgOrderValue,
    completedRate,
    monthlyRevenue,
    statusCounts,
    topProducts,
    lowStockProducts,
  } = useMemo(() => {
    const orders = analytics.orders;
    const totalRevenueValue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrder = orders.length > 0 ? totalRevenueValue / orders.length : 0;

    const deliveredCount = orders.filter((order) => order.status === 'delivered').length;
    const completedRateValue = orders.length > 0 ? (deliveredCount / orders.length) * 100 : 0;

    const statusCountMap: Record<OrderStatus, number> = {
      pending: 0,
      confirmed: 0,
      processing: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((order) => {
      statusCountMap[order.status] += 1;
    });

    const monthMap = new Map<string, number>();
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const label = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      monthMap.set(label, (monthMap.get(label) || 0) + order.total);
    });

    const revenueByMonth = Array.from(monthMap.entries())
      .map(([month, revenue]) => ({ month, revenue }))
      .slice(-6);

    const productSalesMap = new Map<string, number>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        productSalesMap.set(item.name, (productSalesMap.get(item.name) || 0) + item.quantity);
      });
    });

    const topSellingProducts = Array.from(productSalesMap.entries())
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    const lowStock = analytics.products
      .filter((product) => product.quantity <= 10)
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 6);

    return {
      totalRevenue: totalRevenueValue,
      avgOrderValue: avgOrder,
      completedRate: completedRateValue,
      monthlyRevenue: revenueByMonth,
      statusCounts: statusCountMap,
      topProducts: topSellingProducts,
      lowStockProducts: lowStock,
    };
  }, [analytics.orders, analytics.products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  const maxMonthlyRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Live sales, customer, and inventory performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{currency(totalRevenue)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Orders</p>
            <ShoppingCartIcon className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.orders.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Customers</p>
            <UsersIcon className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.customers.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Avg Order Value</p>
            <CubeIcon className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{currency(avgOrderValue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend (Last 6 Months)</h2>
          {monthlyRevenue.length === 0 ? (
            <p className="text-gray-500">No order data available yet.</p>
          ) : (
            <div className="space-y-4">
              {monthlyRevenue.map((entry) => {
                const barWidth = (entry.revenue / maxMonthlyRevenue) * 100;
                return (
                  <div key={entry.month}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{entry.month}</span>
                      <span className="font-medium text-gray-900">{currency(entry.revenue)}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.max(barWidth, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
          <div className="space-y-3">
            {(Object.keys(statusCounts) as OrderStatus[]).map((status) => (
              <div key={status} className="flex items-center justify-between">
                <span className="capitalize text-gray-600">{status}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[status]}`}>
                  {statusCounts[status]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <p className="text-sm text-gray-500">Delivered Order Rate</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{completedRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          {topProducts.length === 0 ? (
            <p className="text-gray-500">No sales data available.</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <p className="font-medium text-gray-900">{product.name}</p>
                  </div>
                  <p className="text-sm text-gray-600">{product.units} sold</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-gray-500">All products are well stocked.</p>
          ) : (
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      product.quantity === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {product.quantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
