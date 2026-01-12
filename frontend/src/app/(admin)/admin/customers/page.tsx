'use client';

import React from 'react';

export default function AdminCustomersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage customer accounts</p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">
            Customer management interface is under development. You can view customer information
            in the orders section for now.
          </p>
        </div>
      </div>
    </div>
  );
}
