import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordSchema } from '@/lib/validation';
import { generateResetToken } from '@/lib/auth';
import db, { initializeDatabase } from '@/lib/db';

initializeDatabase();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Find user
    const user = db.users.find((u) => u.email === email);
    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({
        message: 'If the email exists, a reset link has been sent',
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // In production, send email with reset link
    console.log(`Reset token for ${email}: ${resetToken}`);

    return NextResponse.json({
      message: 'If the email exists, a reset link has been sent',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Password reset failed' },
      { status: 500 }
    );
  }
}
