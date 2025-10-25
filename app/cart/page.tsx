'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore, useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex justify-center items-center">
          <div className="spinner" aria-label="Loading cart"></div>
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
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600 mb-6 font-secondary">
                Your cart is empty
              </p>
              <Link href="/products" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-4" role="list" aria-label="Cart items">
                  {items.map((item) => (
                    <article key={item.productId} className="card p-4" role="listitem">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <Link
                            href={`/products/${item.productId}`}
                            className="text-xl font-semibold hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-primary font-bold mt-2">
                            ${item.price.toFixed(2)} each
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <label htmlFor={`quantity-${item.productId}`} className="sr-only">
                              Quantity for {item.name}
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="btn btn-outline py-1 px-3"
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="btn btn-outline py-1 px-3"
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-red-500 hover:text-red-700 font-medium"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <div className="card p-6 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6 font-secondary">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${(total * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>${(total * 1.08).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="btn btn-primary w-full mb-3"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <Link href="/products" className="btn btn-outline w-full">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
