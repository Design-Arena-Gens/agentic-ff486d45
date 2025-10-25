'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    images: '',
    stock: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const response = await fetch('/api/products?limit=100');
        const data = await response.json();
        setProducts(data.products);
      } else {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category: productForm.category,
      image: productForm.image,
      images: productForm.images.split(',').map((s) => s.trim()),
      stock: parseInt(productForm.stock),
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({
          name: '',
          description: '',
          price: '',
          category: '',
          image: '',
          images: '',
          stock: '',
        });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: '',
      price: product.price.toString(),
      category: product.category,
      image: '',
      images: '',
      stock: product.stock.toString(),
    });
    setShowProductForm(true);
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
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
      <main id="main-content" className="min-h-screen py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          <div className="mb-6">
            <nav className="flex gap-4" role="tablist" aria-label="Admin navigation">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                  activeTab === 'products'
                    ? 'bg-primary text-text'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                role="tab"
                aria-selected={activeTab === 'products'}
              >
                Products
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
              >
                Orders
              </button>
            </nav>
          </div>

          {activeTab === 'products' && (
            <div role="tabpanel">
              <div className="mb-6">
                <button
                  onClick={() => {
                    setShowProductForm(true);
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      description: '',
                      price: '',
                      category: '',
                      image: '',
                      images: '',
                      stock: '',
                    });
                  }}
                  className="btn btn-primary"
                >
                  Add New Product
                </button>
              </div>

              {showProductForm && (
                <div className="card p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="product-name" className="block text-sm font-medium mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="product-name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="product-description" className="block text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        id="product-description"
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm({ ...productForm, description: e.target.value })
                        }
                        className="input"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="product-price" className="block text-sm font-medium mb-2">
                          Price
                        </label>
                        <input
                          type="number"
                          id="product-price"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className="input"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="product-stock" className="block text-sm font-medium mb-2">
                          Stock
                        </label>
                        <input
                          type="number"
                          id="product-stock"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          className="input"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="product-category" className="block text-sm font-medium mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        id="product-category"
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="product-image" className="block text-sm font-medium mb-2">
                        Main Image URL
                      </label>
                      <input
                        type="url"
                        id="product-image"
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="product-images" className="block text-sm font-medium mb-2">
                        Additional Images (comma-separated URLs)
                      </label>
                      <input
                        type="text"
                        id="product-images"
                        value={productForm.images}
                        onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                        className="input"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                        }}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="spinner"></div>
                          </div>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-600">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="border-t border-gray-200">
                          <td className="px-6 py-4">{product.name}</td>
                          <td className="px-6 py-4">{product.category}</td>
                          <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                          <td className="px-6 py-4">{product.stock}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-primary hover:underline mr-4"
                              aria-label={`Edit ${product.name}`}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-500 hover:underline"
                              aria-label={`Delete ${product.name}`}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div role="tabpanel">
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="spinner"></div>
                          </div>
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-600">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="border-t border-gray-200">
                          <td className="px-6 py-4">{order.id}</td>
                          <td className="px-6 py-4">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                              className="input py-1 px-2 text-sm"
                              aria-label={`Update status for order ${order.id}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
