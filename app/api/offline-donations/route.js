import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Fetch offline donations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const [rows] = await pool.query(
      `SELECT * FROM offline_donations ORDER BY CreatedOn DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM offline_donations`
    );

    return NextResponse.json({
      data: rows,
      total: countResult[0].total,
      limit,
      offset
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch offline donations' }, { status: 500 });
  }
}

// POST - Add a new offline donation
export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['FullName', 'Email', 'Amount', 'Cause'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Validate amount
    if (isNaN(parseInt(data.Amount)) || parseInt(data.Amount) <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Amount must be a positive number'
      }, { status: 400 });
    }

    // Insert into database
    const [result] = await pool.query(
      `INSERT INTO offline_donations (
        FullName, Email, Amount, Currency, Spoc, Cause, Anonymous, Reference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.FullName || '',
        data.Email || '',
        parseInt(data.Amount) || 0,
        data.Currency || 'INR',
        data.Spoc || '',
        data.Cause || '',
        data.Anonymous || 0,
        data.Reference || ''
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Offline donation added successfully',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error adding offline donation:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to add offline donation'
    }, { status: 500 });
  }
}
