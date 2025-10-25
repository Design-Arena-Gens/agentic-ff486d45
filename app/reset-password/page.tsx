'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen py-16">
        <div className="max-w-md mx-auto px-4">
          <div className="card p-8">
            <h1 className="text-3xl font-bold text-center mb-6">Reset Password</h1>

            {submitted ? (
              <div>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4" aria-hidden="true">✉️</div>
                  <p className="text-gray-600 font-secondary">
                    If an account exists with that email, we've sent password reset instructions.
                  </p>
                </div>
                <Link href="/login" className="btn btn-primary w-full">
                  Return to Login
                </Link>
              </div>
            ) : (
              <>
                <p className="text-center text-gray-600 mb-8 font-secondary">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full mb-4" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Instructions'}
                  </button>
                </form>

                <div className="text-center">
                  <Link href="/login" className="text-primary hover:underline">
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
