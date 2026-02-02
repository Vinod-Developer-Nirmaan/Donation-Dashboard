import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth-middleware';

// PUT - Mark notification as read
export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    
    // Handle "mark all as read"
    if (id === 'read-all') {
      await pool.execute(
        `UPDATE notifications SET IsRead = TRUE 
         WHERE (UserId IS NULL OR UserId = ?) AND IsRead = FALSE`,
        [authResult.user.id]
      );

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });
    }

    // Mark single notification as read
    await pool.execute(
      `UPDATE notifications SET IsRead = TRUE 
       WHERE NotificationId = ? AND (UserId IS NULL OR UserId = ?)`,
      [id, authResult.user.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a notification
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    const { id } = await params;

    await pool.execute(
      `DELETE FROM notifications 
       WHERE NotificationId = ? AND (UserId IS NULL OR UserId = ?)`,
      [id, authResult.user.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
