// In-memory database for demo purposes
// In production, this would connect to a real database (PostgreSQL, MongoDB, etc.)

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentIntentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

// In-memory storage
const db = {
  users: [] as User[],
  products: [] as Product[],
  reviews: [] as Review[],
  orders: [] as Order[],
};

// Initialize with sample data
export function initializeDatabase() {
  if (db.products.length === 0) {
    db.products = [
      {
        id: '1',
        name: 'Chocolate Dream Cake',
        description: 'Rich, moist chocolate cake with layers of dark chocolate ganache and chocolate buttercream. Perfect for chocolate lovers!',
        price: 45.99,
        category: 'Chocolate',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
          'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80',
        ],
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Vanilla Berry Delight',
        description: 'Light and fluffy vanilla sponge cake layered with fresh berries and cream cheese frosting.',
        price: 42.99,
        category: 'Fruit',
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
        ],
        stock: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'Red Velvet Romance',
        description: 'Classic red velvet cake with tangy cream cheese frosting. A timeless favorite!',
        price: 48.99,
        category: 'Classic',
        image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&q=80',
        ],
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        name: 'Lemon Sunshine Cake',
        description: 'Zesty lemon cake with lemon curd filling and light lemon buttercream. Refreshing and delicious!',
        price: 41.99,
        category: 'Fruit',
        image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=800&q=80',
        ],
        stock: 18,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        name: 'Caramel Heaven',
        description: 'Decadent caramel cake with salted caramel drizzle and caramel buttercream frosting.',
        price: 49.99,
        category: 'Caramel',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        ],
        stock: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6',
        name: 'Strawberry Shortcake',
        description: 'Classic strawberry shortcake with fresh strawberries and whipped cream.',
        price: 39.99,
        category: 'Fruit',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
        ],
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '7',
        name: 'Coffee Tiramisu Cake',
        description: 'Italian-inspired tiramisu cake with espresso-soaked layers and mascarpone frosting.',
        price: 52.99,
        category: 'Coffee',
        image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&q=80',
        ],
        stock: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '8',
        name: 'Funfetti Celebration',
        description: 'Colorful vanilla cake with rainbow sprinkles and vanilla buttercream. Perfect for celebrations!',
        price: 38.99,
        category: 'Classic',
        image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80',
        ],
        stock: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '9',
        name: 'Black Forest Cake',
        description: 'Traditional German chocolate cake with cherry filling and whipped cream.',
        price: 46.99,
        category: 'Chocolate',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
        ],
        stock: 11,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '10',
        name: 'Coconut Paradise',
        description: 'Tropical coconut cake with coconut cream filling and toasted coconut flakes.',
        price: 44.99,
        category: 'Tropical',
        image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80',
        ],
        stock: 14,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Add sample reviews
    db.reviews = [
      {
        id: '1',
        productId: '1',
        userId: 'sample',
        userName: 'Sarah Johnson',
        rating: 5,
        comment: 'Absolutely delicious! The chocolate is rich and not too sweet.',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        productId: '1',
        userId: 'sample2',
        userName: 'Mike Chen',
        rating: 4,
        comment: 'Great cake, but a bit pricey. Worth it for special occasions!',
        createdAt: new Date('2024-02-01'),
      },
      {
        id: '3',
        productId: '2',
        userId: 'sample3',
        userName: 'Emily Davis',
        rating: 5,
        comment: 'The berries were so fresh and the frosting was perfect!',
        createdAt: new Date('2024-01-20'),
      },
    ];

    // Add admin user
    db.users.push({
      id: 'admin-1',
      email: 'admin@cakeshop.com',
      password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // password: admin123
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export default db;
