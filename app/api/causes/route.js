import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT Cause FROM payments WHERE Cause IS NOT NULL AND TRIM(Cause) != "" ORDER BY Cause'
    );
    
    // Return raw causes (trimmed) - the frontend will handle comparison
    const seen = new Set();
    const causes = [];
    
    for (const row of rows) {
      const cause = (row.Cause || '').trim();
      // Create a key for deduplication by removing non-alphanumeric chars
      const key = cause.toLowerCase().replace(/[^a-z0-9]/gi, '');
      if (cause.length > 0 && !seen.has(key)) {
        seen.add(key);
        causes.push(cause);
      }
    }
    
    causes.sort();
    
    return NextResponse.json({ causes });
  } catch (error) {
    console.error('Error fetching causes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch causes', causes: [] },
      { status: 500 }
    );
  }
}
