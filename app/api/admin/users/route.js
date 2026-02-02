import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { verifyAuth } from '@/lib/auth-middleware';

// GET all users (super_admin and admin only)
export async function GET(request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request, ['super_admin', 'admin']);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    const [users] = await pool.execute(
      `SELECT UserId, FullName, Email, Role, IsActive, CreatedAt, LastLogin 
       FROM users 
       ORDER BY CreatedAt DESC`
    );

    return NextResponse.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST create new user (super_admin only)
export async function POST(request) {
  try {
    // Verify authentication - only super_admin can create users
    const authResult = await verifyAuth(request, ['super_admin']);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { fullName, email, password, role } = body;

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['super_admin', 'admin', 'viewer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existing] = await pool.execute(
      'SELECT UserId FROM users WHERE Email = ?',
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.execute(
      `INSERT INTO users (FullName, Email, Password, Role, IsActive, CreatedAt) 
       VALUES (?, ?, ?, ?, true, NOW())`,
      [fullName, email, hashedPassword, role]
    );

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      userId: result.insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    );
  }
}
