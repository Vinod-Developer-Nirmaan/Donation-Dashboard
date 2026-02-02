import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// GET single payment by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const [rows] = await pool.query(
      'SELECT * FROM payments WHERE PaymentId = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment details' },
      { status: 500 }
    );
  }
}

// DELETE payment by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    const [result] = await pool.query(
      'DELETE FROM payments WHERE PaymentId = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    );
  }
}
