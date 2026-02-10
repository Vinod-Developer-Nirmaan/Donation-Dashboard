// Test script to debug send-receipt API
const mysql = require('mysql2/promise');

async function testSendReceipt() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'donations'
  });

  try {
    // Test 1: Check database connection
    console.log('1. Testing database connection...');
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('   ✅ Database connected');

    // Test 2: Check if payments table exists and has data
    console.log('\n2. Checking payments table...');
    const [payments] = await pool.query('SELECT PaymentId, FullName, Email, Amount, Currency FROM payments LIMIT 5');
    console.log(`   ✅ Found ${payments.length} payments`);
    
    if (payments.length > 0) {
      console.log('\n   Sample payments:');
      payments.forEach(p => {
        console.log(`   - ID: ${p.PaymentId}, Name: ${p.FullName}, Email: ${p.Email}, Amount: ${p.Amount} ${p.Currency}`);
      });

      // Test 3: Find a payment with email
      console.log('\n3. Finding payment with email...');
      const [withEmail] = await pool.query('SELECT PaymentId, FullName, Email, Amount, Currency FROM payments WHERE Email IS NOT NULL AND Email != "" LIMIT 1');
      
      if (withEmail.length > 0) {
        console.log(`   ✅ Found payment with email: ID=${withEmail[0].PaymentId}, Email=${withEmail[0].Email}`);
        console.log(`\n   Use this PaymentId to test: ${withEmail[0].PaymentId}`);
      } else {
        console.log('   ❌ No payments found with email addresses');
      }
    }

    // Test 4: Check nodemailer
    console.log('\n4. Testing nodemailer import...');
    const nodemailer = require('nodemailer');
    console.log('   ✅ Nodemailer imported successfully');

    // Test 5: Create transporter (don't actually send)
    console.log('\n5. Creating email transporter...');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'transactions@nirmaan.org',
        pass: process.env.SMTP_PASSWORD || 'stwkrqyqrvcvtxfu'
      }
    });
    console.log('   ✅ Transporter created');

    // Test 6: Verify transporter connection
    console.log('\n6. Verifying SMTP connection...');
    try {
      await transporter.verify();
      console.log('   ✅ SMTP connection verified');
    } catch (smtpError) {
      console.log('   ❌ SMTP Error:', smtpError.message);
      console.log('   Note: Email sending may fail due to SMTP credentials');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testSendReceipt();
