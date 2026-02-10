import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100;
    const offset = parseInt(searchParams.get('offset')) || 0;
    
    // Filter parameters
    const cause = searchParams.get('cause');
    const status = searchParams.get('status');
    const currency = searchParams.get('currency');
    const paymentType = searchParams.get('paymentType');
    const reference = searchParams.get('reference');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build dynamic WHERE clause
    const conditions = [];
    const params = [];

    if (startDate) {
      conditions.push('PaymentDate >= ?');
      params.push(startDate + ' 00:00:00');  // Start of day
    }
    if (endDate) {
      conditions.push('PaymentDate <= ?');
      params.push(endDate + ' 23:59:59');    // End of day
    }

    if (cause && cause !== 'All') {
      // Match cause exactly (case-insensitive) - handles the exact cause name from dropdown
      conditions.push('TRIM(Cause) = TRIM(?)');
      params.push(cause);
    }

    if (status && status !== 'All') {
      conditions.push('PaymentStatus = ?');
      params.push(status);
    }

    if (currency && currency !== 'All') {
      conditions.push('Currency = ?');
      params.push(currency);
    }

    if (paymentType && paymentType !== 'All') {
      conditions.push('PaymentType = ?');
      params.push(paymentType);
    }

    if (reference && reference !== 'All') {
      conditions.push('TRIM(Reference) = TRIM(?)');
      params.push(reference);
    }

    if (search) {
      conditions.push('(FullName LIKE ? OR Email LIKE ? OR ReceiptId LIKE ?)');
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Optimized query: only select needed fields and use LIMIT
    const [rows] = await pool.query(
      `SELECT 
        PaymentId, ReceiptId, FullName, Email, Amount, 
        Currency, TransactionFee, PaymentDate, PaymentStatus, 
        PaymentType, Cause, Reference, SubscriptionId
      FROM payments 
      ${whereClause}
      ORDER BY PaymentDate DESC 
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    // Get total count for pagination (with same filters)
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM payments ${whereClause}`,
      params
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
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

// Generate unique Receipt ID
function generateReceiptId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RCP-${timestamp}-${random}`;
}

// POST - Add a single donation
export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['FullName', 'Email', 'Amount', 'Currency', 'PaymentDate'];
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
    if (isNaN(parseFloat(data.Amount)) || parseFloat(data.Amount) <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Amount must be a positive number'
      }, { status: 400 });
    }

    // Validate currency
    if (!['USD', 'INR'].includes(data.Currency.toUpperCase())) {
      return NextResponse.json({
        success: false,
        error: 'Currency must be USD or INR'
      }, { status: 400 });
    }

    // Generate Receipt ID
    const receiptId = generateReceiptId();

    // Insert into database
    const [result] = await pool.query(
      `INSERT INTO payments (
        ReceiptId, FullName, FirstName, LastName, Email, Mobile, 
        PaymentType, TransactionId, Currency, Amount, TransactionFee, 
        Cause, Country, Address, ZIP, PAN, PaymentStatus, PaymentDate, Reference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        receiptId,
        data.FullName || '',
        data.FirstName || '',
        data.LastName || '',
        data.Email || '',
        data.Mobile || '',
        data.PaymentType || 'one_time',
        data.TransactionId || '',
        (data.Currency || 'INR').toUpperCase(),
        parseFloat(data.Amount) || 0,
        parseFloat(data.TransactionFee) || 0,
        data.Cause || 'General Fund',
        data.Country || '',
        data.Address || '',
        data.ZIP || '',
        data.PAN || '',
        data.PaymentStatus || 'completed',
        data.PaymentDate ? new Date(data.PaymentDate) : new Date(),
        data.Reference || ''
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Donation added successfully',
      receiptId: receiptId,
      paymentId: result.insertId
    });

  } catch (error) {
    console.error('Error adding donation:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to add donation'
    }, { status: 500 });
  }
}