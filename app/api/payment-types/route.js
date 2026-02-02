import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT PaymentType FROM payments WHERE PaymentType IS NOT NULL AND PaymentType != "" ORDER BY PaymentType'
    );
    const paymentTypes = rows.map(row => row.PaymentType);
    return NextResponse.json({ paymentTypes });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}