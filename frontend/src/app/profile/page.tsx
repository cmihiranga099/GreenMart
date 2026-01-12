'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    phone: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    try {
      const response = await api.put('/auth/me', formData);

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        setEditing(false);
        // Refresh user data
        window.location.reload();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your personal information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark p-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </span>
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-primary-light">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Account Information */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Account Information
                      </h3>
                      {!editing ? (
                        <button
                          type="button"
                          onClick={() => setEditing(true)}
                          className="text-primary hover:text-primary-dark font-medium"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <div className="space-x-2">
                          <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm"
                          >
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(false);
                              setFormData({
                                firstName: user.firstName,
                                lastName: user.lastName,
                                phone: user.phone || '',
                              });
                            }}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900">{user.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900">{user.lastName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <p className="text-gray-900">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        {editing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Status
                        </label>
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Member Since
                        </label>
                        <p className="text-gray-900">
                          {format(new Date(user.createdAt), 'MMMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Type
                        </label>
                        <p className="text-gray-900 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/orders')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition text-left"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Order History</h3>
              <p className="text-sm text-gray-600">View your past orders and track shipments</p>
            </button>
            <button
              onClick={() => router.push('/wishlist')}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition text-left"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Wishlist</h3>
              <p className="text-sm text-gray-600">Manage your saved products</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
