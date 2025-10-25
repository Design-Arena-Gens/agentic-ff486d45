'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [page, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '8',
      });
      
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const categories = ['All', 'Chocolate', 'Fruit', 'Classic', 'Coffee', 'Caramel', 'Tropical'];

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Our Delicious Cakes</h1>

          {/* Search and Filter */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search cakes
              </label>
              <div className="flex gap-2">
                <input
                  type="search"
                  id="search"
                  placeholder="Search cakes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input flex-1"
                  aria-label="Search for cakes"
                />
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </div>
            </form>

            <div>
              <label htmlFor="category-filter" className="sr-only">
                Filter by category
              </label>
              <select
                id="category-filter"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="input"
                aria-label="Filter cakes by category"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat === 'All' ? '' : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20" role="status">
              <div className="spinner" aria-label="Loading products"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 font-secondary">No cakes found</p>
            </div>
          ) : (
            <>
              <div className="product-grid" role="list">
                {products.map((product) => (
                  <article key={product.id} className="card" role="listitem">
                    <Link href={`/products/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                        loading="lazy"
                      />
                    </Link>
                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                          {product.name}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mb-4 font-secondary line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.stock > 0 ? (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="btn btn-accent"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <span className="text-red-500 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="pagination" aria-label="Product pagination">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="pagination-button"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`pagination-button ${page === i + 1 ? 'active' : ''}`}
                      aria-label={`Page ${i + 1}`}
                      aria-current={page === i + 1 ? 'page' : undefined}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="pagination-button"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main className="min-h-screen flex justify-center items-center">
          <div className="spinner" aria-label="Loading products"></div>
        </main>
        <Footer />
      </>
    }>
      <ProductsContent />
    </Suspense>
  );
}
