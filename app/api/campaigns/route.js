import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cause = searchParams.get('cause');
    
    // Build WHERE clause
    let whereClause = 'WHERE Reference IS NOT NULL AND Reference != \'\''
    const queryParams = [];
    
    if (cause && cause !== 'All') {
      whereClause += ' AND Cause = ?';
      queryParams.push(cause);
    }
    
    // Get all unique references (campaigns) with their stats
    const [rows] = await pool.query(`
      SELECT 
        Reference as name,
        COUNT(*) as donationCount,
        COUNT(DISTINCT Email) as donorCount,
        SUM(CASE WHEN Currency = 'INR' AND PaymentStatus = 'completed' THEN Amount ELSE 0 END) as totalINR,
        SUM(CASE WHEN Currency = 'USD' AND PaymentStatus = 'completed' THEN Amount ELSE 0 END) as totalUSD
      FROM payments 
      ${whereClause}
      GROUP BY Reference
      ORDER BY donationCount DESC
    `, queryParams);

    const campaigns = rows.map(row => ({
      name: row.name,
      donationCount: parseInt(row.donationCount || 0),
      donorCount: parseInt(row.donorCount || 0),
      totalINR: parseFloat(row.totalINR || 0),
      totalUSD: parseFloat(row.totalUSD || 0)
    }));

    return NextResponse.json({ campaigns }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}
