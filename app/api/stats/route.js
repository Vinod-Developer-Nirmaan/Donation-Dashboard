import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    
    // Optimized: Combine all stats into a single query to reduce round trips
    const [stats] = await pool.query(`
      SELECT 
        SUM(CASE WHEN Currency = 'INR' AND PaymentStatus = 'completed' THEN Amount ELSE 0 END) as inr_total,
        SUM(CASE WHEN Currency = 'INR' AND PaymentStatus = 'completed' THEN TransactionFee ELSE 0 END) as inr_fee,
        SUM(CASE WHEN Currency = 'INR' AND PaymentStatus = 'completed' THEN Amount - TransactionFee ELSE 0 END) as inr_received,
        SUM(CASE WHEN Currency = 'USD' AND PaymentStatus = 'completed' THEN Amount ELSE 0 END) as usd_total,
        SUM(CASE WHEN Currency = 'USD' AND PaymentStatus = 'completed' THEN TransactionFee ELSE 0 END) as usd_fee,
        SUM(CASE WHEN Currency = 'USD' AND PaymentStatus = 'completed' THEN Amount - TransactionFee ELSE 0 END) as usd_received,
        COUNT(CASE WHEN PaymentStatus = 'completed' THEN 1 END) as payment_count,
        COUNT(DISTINCT CASE WHEN SubscriptionId != '' AND PaymentStatus = 'completed' THEN SubscriptionId END) as subscription_count,
        COUNT(DISTINCT CASE WHEN PaymentStatus = 'completed' THEN Email END) as donor_count
      FROM payments
      ${whereClause}
    `, params);
    
    const result = stats[0];

    return NextResponse.json({
      inr: {
        total: parseFloat(result.inr_total || 0),
        fee: parseFloat(result.inr_fee || 0),
        received: parseFloat(result.inr_received || 0)
      },
      usd: {
        total: parseFloat(result.usd_total || 0),
        fee: parseFloat(result.usd_fee || 0),
        received: parseFloat(result.usd_received || 0)
      },
      paymentCount: parseInt(result.payment_count || 0),
      subscriptionCount: parseInt(result.subscription_count || 0),
      donorCount: parseInt(result.donor_count || 0)
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}