'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.address || formData.address.length < 5) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city || formData.city.length < 2) {
      newErrors.city = 'City is required';
    }
    if (!formData.state || formData.state.length < 2) {
      newErrors.state = 'State is required';
    }
    if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code';
    }
    if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Invalid card number';
    }
    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    }
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create payment intent
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const checkoutData = await checkoutResponse.json();

      if (!checkoutResponse.ok) {
        throw new Error('Payment failed');
      }

      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingAddress: {
            fullName: formData.fullName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone,
          },
          paymentIntentId: checkoutData.paymentIntentId,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error('Order creation failed');
      }

      clearCart();
      router.push(`/order-confirmation/${orderData.order.id}`);
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (!mounted || !user || items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex justify-center items-center">
          <div className="spinner" aria-label="Loading checkout"></div>
        </main>
        <Footer />
      </>
    );
  }

  const total = getTotal();

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <section className="card p-6" aria-labelledby="shipping-heading">
                <h2 id="shipping-heading" className="text-2xl font-bold mb-4">
                  Shipping Address
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`input ${errors.fullName ? 'input-error' : ''}`}
                      required
                    />
                    {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`input ${errors.address ? 'input-error' : ''}`}
                      required
                    />
                    {errors.address && <p className="error-message">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`input ${errors.city ? 'input-error' : ''}`}
                        required
                      />
                      {errors.city && <p className="error-message">{errors.city}</p>}
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`input ${errors.state ? 'input-error' : ''}`}
                        required
                      />
                      {errors.state && <p className="error-message">{errors.state}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`input ${errors.zipCode ? 'input-error' : ''}`}
                        placeholder="12345"
                        required
                      />
                      {errors.zipCode && <p className="error-message">{errors.zipCode}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`input ${errors.phone ? 'input-error' : ''}`}
                        placeholder="(555) 123-4567"
                        required
                      />
                      {errors.phone && <p className="error-message">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Information */}
              <section className="card p-6" aria-labelledby="payment-heading">
                <h2 id="payment-heading" className="text-2xl font-bold mb-4">
                  Payment Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className={`input ${errors.cardNumber ? 'input-error' : ''}`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                    {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className={`input ${errors.expiryDate ? 'input-error' : ''}`}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                      {errors.expiryDate && <p className="error-message">{errors.expiryDate}</p>}
                    </div>

                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        className={`input ${errors.cvv ? 'input-error' : ''}`}
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                      {errors.cvv && <p className="error-message">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Order Summary */}
            <div>
              <div className="card p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm font-secondary">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2 mb-6 font-secondary">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${(total * 1.08).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
