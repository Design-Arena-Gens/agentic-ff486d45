import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import db, { initializeDatabase } from '@/lib/db';

initializeDatabase();

export async function GET() {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json({ user: null });
    }

    const user = db.users.find((u) => u.id === authUser.userId);
    
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ user: null });
  }
}
