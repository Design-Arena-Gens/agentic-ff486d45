'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore, useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  stock: number;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [resolvedParams.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${resolvedParams.id}`);
      const data = await response.json();

      if (response.ok) {
        setProduct(data.product);
        setReviews(data.reviews);
      } else {
        router.push('/products');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
      }
      router.push('/cart');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/products/${resolvedParams.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });

      if (response.ok) {
        setReviewForm({ rating: 5, comment: '' });
        setShowReviewForm(false);
        fetchProduct();
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex justify-center items-center">
          <div className="spinner" aria-label="Loading product"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return null;
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-primary hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/products" className="text-primary hover:underline">
                  Products
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div>
              <div className="card overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage] || product.image}
                  alt={`${product.name} - View ${selectedImage + 1}`}
                  className="w-full h-96 object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`card overflow-hidden ${
                        selectedImage === idx ? 'ring-4 ring-primary' : ''
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center" aria-label={`${averageRating.toFixed(1)} star rating`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl ${
                        star <= averageRating ? 'text-accent' : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600 font-secondary">
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              <p className="text-3xl font-bold text-primary mb-6">
                ${product.price.toFixed(2)}
              </p>

              <p className="text-gray-700 font-secondary mb-6 text-lg leading-relaxed">
                {product.description}
              </p>

              <div className="mb-6">
                <span className="inline-block bg-secondary text-text px-4 py-2 rounded-full font-medium">
                  {product.category}
                </span>
              </div>

              {product.stock > 0 ? (
                <>
                  <div className="mb-6">
                    <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="input w-32"
                      aria-label="Product quantity"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      {product.stock} available in stock
                    </p>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="btn btn-primary w-full text-lg py-4"
                  >
                    Add to Cart
                  </button>
                </>
              ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  Out of Stock
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <section aria-labelledby="reviews-heading">
            <div className="border-t border-gray-200 pt-8">
              <h2 id="reviews-heading" className="text-3xl font-bold mb-6">
                Customer Reviews
              </h2>

              {user && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="btn btn-secondary mb-6"
                >
                  Write a Review
                </button>
              )}

              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="card p-6 mb-8">
                  <h3 className="text-xl font-semibold mb-4">Write Your Review</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className={`text-4xl ${
                            star <= reviewForm.rating ? 'text-accent' : 'text-gray-300'
                          }`}
                          aria-label={`Rate ${star} stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="review-comment" className="block text-sm font-medium mb-2">
                      Comment
                    </label>
                    <textarea
                      id="review-comment"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="input"
                      rows={4}
                      required
                      minLength={10}
                      maxLength={500}
                      aria-describedby="comment-help"
                    />
                    <p id="comment-help" className="text-sm text-gray-600 mt-1">
                      Minimum 10 characters, maximum 500 characters
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {reviews.length === 0 ? (
                <p className="text-gray-600 font-secondary">
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <article key={review.id} className="card p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{review.userName}</h3>
                        <time className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </time>
                      </div>
                      <div className="flex items-center mb-3" aria-label={`${review.rating} star rating`}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-xl ${
                              star <= review.rating ? 'text-accent' : 'text-gray-300'
                            }`}
                            aria-hidden="true"
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-700 font-secondary">{review.comment}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
