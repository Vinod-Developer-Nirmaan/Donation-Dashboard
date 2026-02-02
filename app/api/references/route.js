import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT Reference FROM payments WHERE Reference IS NOT NULL AND TRIM(Reference) != "" ORDER BY Reference'
    );
    
    // Return unique references (trimmed and deduplicated)
    const seen = new Set();
    const references = [];
    
    for (const row of rows) {
      const reference = (row.Reference || '').trim();
      // Create a key for deduplication by removing non-alphanumeric chars
      const key = reference.toLowerCase().replace(/[^a-z0-9]/gi, '');
      if (reference.length > 0 && !seen.has(key)) {
        seen.add(key);
        references.push(reference);
      }
    }
    
    references.sort();
    
    return NextResponse.json({ references });
  } catch (error) {
    console.error('Error fetching references:', error);
    return NextResponse.json(
      { error: 'Failed to fetch references', references: [] },
      { status: 500 }
    );
  }
}
