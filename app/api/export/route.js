import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
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
      params.push(startDate + ' 00:00:00');
    }
    if (endDate) {
      conditions.push('PaymentDate <= ?');
      params.push(endDate + ' 23:59:59');
    }
    if (cause && cause !== 'All') {
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

    const [rows] = await pool.query(
      `SELECT * FROM payments ${whereClause} ORDER BY PaymentDate DESC`,
      params
    );
    
    // Create CSV header
    const headers = Object.keys(rows[0] || {});
    let csv = headers.join(',') + '\n';
    
    // Add rows
    rows.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csv += values.join(',') + '\n';
    });

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="payments_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}