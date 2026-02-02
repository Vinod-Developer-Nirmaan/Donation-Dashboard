import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { verifyAuth } from '@/lib/auth-middleware';

// GET single user
export async function GET(request, { params }) {
  try {
    const authResult = await verifyAuth(request, ['super_admin', 'admin']);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    const { id } = await params;

    const [users] = await pool.execute(
      `SELECT UserId, FullName, Email, Role, IsActive, CreatedAt, LastLogin 
       FROM users WHERE UserId = ?`,
      [id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT update user (super_admin only)
export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAuth(request, ['super_admin']);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { fullName, email, password, role, isActive } = body;

    // Check if user exists
    const [existing] = await pool.execute(
      'SELECT UserId FROM users WHERE UserId = ?',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is taken by another user
    if (email) {
      const [emailCheck] = await pool.execute(
        'SELECT UserId FROM users WHERE Email = ? AND UserId != ?',
        [email, id]
      );
      if (emailCheck.length > 0) {
        return NextResponse.json(
          { success: false, message: 'Email already taken by another user' },
          { status: 400 }
        );
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (fullName) {
      updates.push('FullName = ?');
      values.push(fullName);
    }
    if (email) {
      updates.push('Email = ?');
      values.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('Password = ?');
      values.push(hashedPassword);
    }
    if (role) {
      const validRoles = ['super_admin', 'admin', 'viewer'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { success: false, message: 'Invalid role' },
          { status: 400 }
        );
      }
      updates.push('Role = ?');
      values.push(role);
    }
    if (typeof isActive === 'boolean') {
      updates.push('IsActive = ?');
      values.push(isActive);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(id);

    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE UserId = ?`,
      values
    );

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE user (super_admin only)
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAuth(request, ['super_admin']);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    const { id } = await params;

    // Prevent deleting yourself
    if (authResult.user && authResult.user.userId === parseInt(id)) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existing] = await pool.execute(
      'SELECT UserId FROM users WHERE UserId = ?',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    await pool.execute('DELETE FROM users WHERE UserId = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
