'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
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
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${resolvedParams.id}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex justify-center items-center">
          <div className="spinner" aria-label="Loading order"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
            <Link href="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4" aria-hidden="true">✅</div>
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-xl text-gray-600 font-secondary">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
          </div>

          <div className="card p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="space-y-2 mb-4 font-secondary">
              <p>
                <span className="font-semibold">Order ID:</span> {order.id}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{' '}
                <span className="capitalize">{order.status}</span>
              </p>
              <p>
                <span className="font-semibold">Order Date:</span>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <h3 className="text-xl font-bold mb-3">Items Ordered</h3>
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

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
            <address className="not-italic font-secondary">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
            </address>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
            <Link href="/profile" className="btn btn-outline">
              View Orders
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
