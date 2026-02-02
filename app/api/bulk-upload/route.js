import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// Generate unique Receipt ID
function generateReceiptId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RCP-${timestamp}-${random}`;
}

// Validate required fields
function validateRecord(record, index) {
  const errors = [];
  const requiredFields = ['FullName', 'Email', 'Amount', 'Currency', 'PaymentDate'];
  
  for (const field of requiredFields) {
    if (!record[field] || record[field].toString().trim() === '') {
      errors.push(`Row ${index + 1}: Missing required field '${field}'`);
    }
  }

  // Validate email format
  if (record.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.Email)) {
    errors.push(`Row ${index + 1}: Invalid email format '${record.Email}'`);
  }

  // Validate amount is a number
  if (record.Amount && isNaN(parseFloat(record.Amount))) {
    errors.push(`Row ${index + 1}: Amount must be a number`);
  }

  // Validate currency
  if (record.Currency && !['USD', 'INR'].includes(record.Currency.toUpperCase())) {
    errors.push(`Row ${index + 1}: Currency must be USD or INR`);
  }

  return errors;
}

export async function POST(request) {
  let connection;
  
  try {
    const { records } = await request.json();

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No records provided or invalid format' },
        { status: 400 }
      );
    }

    // Validate all records first
    const allErrors = [];
    for (let i = 0; i < records.length; i++) {
      const errors = validateRecord(records[i], i);
      allErrors.push(...errors);
    }

    if (allErrors.length > 0) {
      return NextResponse.json({
        success: false,
        inserted: 0,
        failed: records.length,
        errors: allErrors.slice(0, 20) // Return first 20 errors
      }, { status: 400 });
    }

    // Get a connection from the pool for transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let insertedCount = 0;
    const insertErrors = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      try {
        const receiptId = generateReceiptId();
        
        await connection.query(
          `INSERT INTO payments (
            ReceiptId, FullName, FirstName, LastName, Email, Mobile, 
            PaymentType, TransactionId, Currency, Amount, TransactionFee, 
            Cause, Country, Address, ZIP, PAN, PaymentStatus, PaymentDate, Reference
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            receiptId,
            record.FullName || '',
            record.FirstName || '',
            record.LastName || '',
            record.Email || '',
            record.Mobile || '',
            record.PaymentType || 'one_time',
            record.TransactionId || '',
            (record.Currency || 'USD').toUpperCase(),
            parseFloat(record.Amount) || 0,
            parseFloat(record.TransactionFee) || 0,
            record.Cause || 'General Fund',
            record.Country || '',
            record.Address || '',
            record.ZIP || '',
            record.PAN || '',
            record.PaymentStatus || 'completed',
            record.PaymentDate ? new Date(record.PaymentDate) : new Date(),
            record.Reference || ''
          ]
        );
        
        insertedCount++;
      } catch (insertError) {
        insertErrors.push(`Row ${i + 1}: ${insertError.message}`);
      }
    }

    // If any errors, rollback
    if (insertErrors.length > 0) {
      await connection.rollback();
      return NextResponse.json({
        success: false,
        inserted: 0,
        failed: records.length,
        errors: insertErrors.slice(0, 20)
      }, { status: 400 });
    }

    // Commit transaction
    await connection.commit();

    return NextResponse.json({
      success: true,
      inserted: insertedCount,
      failed: 0,
      errors: [],
      message: `Successfully uploaded ${insertedCount} payment records`
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    
    if (connection) {
      await connection.rollback();
    }

    return NextResponse.json({
      success: false,
      inserted: 0,
      failed: 0,
      errors: [error.message],
      message: 'Failed to process bulk upload'
    }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
