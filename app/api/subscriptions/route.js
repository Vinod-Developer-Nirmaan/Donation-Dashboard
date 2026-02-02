import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100;
    
    // Get subscription stats
    const [statsResult] = await pool.query(`
      SELECT 
        COUNT(DISTINCT SubscriptionId) as active_subscriptions,
        COUNT(DISTINCT Email) as total_subscribers,
        SUM(CASE WHEN Currency = 'USD' THEN Amount ELSE 0 END) as monthly_usd,
        SUM(CASE WHEN Currency = 'INR' THEN Amount ELSE 0 END) as monthly_inr
      FROM payments 
      WHERE SubscriptionId IS NOT NULL 
        AND SubscriptionId != '' 
        AND PaymentStatus = 'completed'
        AND PaymentType = 'recurring'
    `);

    // Get unique subscriptions with their latest payment info
    const [subscriptions] = await pool.query(`
      SELECT 
        p.SubscriptionId,
        p.FullName,
        p.Email,
        p.Amount,
        p.Currency,
        p.Cause,
        p.PaymentStatus,
        p.PaymentDate,
        COUNT(*) as payment_count,
        SUM(p.Amount) as total_donated
      FROM payments p
      INNER JOIN (
        SELECT SubscriptionId, MAX(PaymentDate) as MaxDate
        FROM payments
        WHERE SubscriptionId IS NOT NULL AND SubscriptionId != ''
        GROUP BY SubscriptionId
      ) latest ON p.SubscriptionId = latest.SubscriptionId AND p.PaymentDate = latest.MaxDate
      WHERE p.SubscriptionId IS NOT NULL AND p.SubscriptionId != ''
      GROUP BY p.SubscriptionId, p.FullName, p.Email, p.Amount, p.Currency, p.Cause, p.PaymentStatus, p.PaymentDate
      ORDER BY p.PaymentDate DESC
      LIMIT ?
    `, [limit]);

    const stats = statsResult[0];

    return NextResponse.json({
      stats: {
        activeSubscriptions: parseInt(stats.active_subscriptions || 0),
        totalSubscribers: parseInt(stats.total_subscribers || 0),
        monthlyUSD: parseFloat(stats.monthly_usd || 0),
        monthlyINR: parseFloat(stats.monthly_inr || 0)
      },
      subscriptions: subscriptions || []
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}
