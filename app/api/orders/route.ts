import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDatabase, Order } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { shippingAddressSchema } from '@/lib/validation';
import { z } from 'zod';

initializeDatabase();

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      productImage: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ),
  shippingAddress: shippingAddressSchema,
  paymentIntentId: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get orders for the user (or all orders if admin)
    let orders: Order[];
    if (authUser.role === 'admin') {
      orders = db.orders;
    } else {
      orders = db.orders.filter((o) => o.userId === authUser.userId);
    }

    // Sort by newest first
    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const result = createOrderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const { items, shippingAddress, paymentIntentId } = result.data;

    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: authUser.userId,
      items,
      total,
      status: 'pending',
      shippingAddress,
      paymentIntentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.orders.push(order);

    // Update product stock
    items.forEach((item) => {
      const product = db.products.find((p) => p.id === item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
