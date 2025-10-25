'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });

    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Update failed');
      }

      setUser(data.user);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex justify-center items-center">
          <div className="spinner" aria-label="Loading profile"></div>
        </main>
        <Footer />
      </>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">My Account</h1>

          <div className="mb-6">
            <nav className="flex gap-4" role="tablist" aria-label="Profile navigation">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary text-text'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                role="tab"
                aria-selected={activeTab === 'profile'}
                aria-controls="profile-panel"
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-primary text-text'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                role="tab"
                aria-selected={activeTab === 'orders'}
                aria-controls="orders-panel"
              >
                Order History
              </button>
            </nav>
          </div>

          {activeTab === 'profile' && (
            <div id="profile-panel" role="tabpanel" aria-labelledby="profile-tab">
              <div className="max-w-2xl card p-8">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

                {message && (
                  <div
                    className={`px-4 py-3 rounded mb-4 ${
                      message.includes('success')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                    role="alert"
                    aria-live="polite"
                  >
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`input ${errors.firstName ? 'input-error' : ''}`}
                        required
                      />
                      {errors.firstName && (
                        <p className="error-message">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`input ${errors.lastName ? 'input-error' : ''}`}
                        required
                      />
                      {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input ${errors.email ? 'input-error' : ''}`}
                      required
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div id="orders-panel" role="tabpanel" aria-labelledby="orders-tab">
              <div className="card p-8">
                <h2 className="text-2xl font-bold mb-6">Order History</h2>

                {orders.length === 0 ? (
                  <p className="text-gray-600 font-secondary">No orders yet.</p>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <article key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600 font-secondary">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              statusColors[order.status]
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between font-secondary">
                              <span>
                                {item.productName} × {item.quantity}
                              </span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                          <span className="font-bold text-lg">Total: ${order.total.toFixed(2)}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
