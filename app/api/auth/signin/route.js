import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth-middleware';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const [users] = await pool.query(
      'SELECT * FROM users WHERE Email = ? AND IsActive = 1',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Compare password
    // For development: support both bcrypt hash and plain text comparison
    let isValidPassword = false;
    
    if (user.Password.startsWith('$2')) {
      // Bcrypt hashed password
      isValidPassword = await bcrypt.compare(password, user.Password);
    } else {
      // Plain text comparison (for initial testing only)
      isValidPassword = password === user.Password;
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    await pool.query(
      'UPDATE users SET LastLogin = NOW() WHERE UserId = ?',
      [user.UserId]
    );

    // Generate JWT token
    const token = generateToken(user);

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.UserId,
        name: user.FullName,
        email: user.Email,
        role: user.Role
      },
      token
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during sign in' },
      { status: 500 }
    );
  }
}
