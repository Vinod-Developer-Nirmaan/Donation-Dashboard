import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth-middleware';

// GET all notifications for the user
export async function GET(request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const unreadOnly = searchParams.get('unread') === 'true';

    let query = `
      SELECT NotificationId, Type, Title, Message, IsRead, CreatedAt, RelatedId, RelatedType
      FROM notifications 
      WHERE UserId IS NULL OR UserId = ?
    `;
    
    if (unreadOnly) {
      query += ' AND IsRead = FALSE';
    }
    
    query += ' ORDER BY CreatedAt DESC LIMIT ?';

    const [notifications] = await pool.execute(query, [authResult.user.id, limit]);

    // Get unread count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as count FROM notifications 
       WHERE (UserId IS NULL OR UserId = ?) AND IsRead = FALSE`,
      [authResult.user.id]
    );

    return NextResponse.json({
      success: true,
      notifications: notifications,
      unreadCount: countResult[0].count
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST - Create a new notification (for internal use)
export async function POST(request) {
  try {
    const authResult = await verifyAuth(request, ['super_admin', 'admin']);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    const { type, title, message, userId, relatedId, relatedType } = await request.json();

    if (!type || !title || !message) {
      return NextResponse.json(
        { success: false, message: 'Type, title, and message are required' },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      `INSERT INTO notifications (UserId, Type, Title, Message, RelatedId, RelatedType) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId || null, type, title, message, relatedId || null, relatedType || null]
    );

    return NextResponse.json({
      success: true,
      message: 'Notification created',
      notificationId: result.insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
