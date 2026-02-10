import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

// Create transporter lazily
function createTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER || 'transactions@nirmaan.org',
      pass: process.env.SMTP_PASSWORD || 'stwkrqyqrvcvtxfu'
    }
  });
}

// Helper to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Get financial year from date
function getFinancialYear(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth();
  const year = date.getFullYear();
  
  if (month >= 3) { // April onwards
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
}

// Generate 80G PDF HTML (for INR donations)
function generate80GPDFHTML(payment, variables) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #333; padding: 30px 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .logo img { width: 120px; }
    .org-info { text-align: right; font-size: 11px; }
    .org-info p { margin: 3px 0; }
    .org-info .label { font-weight: bold; color: #003c7a; }
    .text-gray { color: #525252; }
    .text-nirmaan { color: #003c7a; font-weight: bold; }
    .greeting { margin: 30px 0 15px 0; }
    .greeting h3 { font-size: 13px; font-weight: bold; color: #333; }
    .message { color: #525252; font-size: 11px; line-height: 1.6; text-align: justify; margin-bottom: 20px; }
    .signature { margin: 20px 0; }
    .signature p { margin: 3px 0; }
    hr { border: none; border-top: 1px solid #ccc; margin: 20px 0; }
    .details-section { display: flex; justify-content: space-between; margin: 20px 0; }
    .details-box { width: 48%; }
    .details-box h3 { font-size: 13px; color: #003c7a; margin-bottom: 15px; }
    .detail-row { margin-bottom: 12px; }
    .detail-row .label { font-weight: bold; color: #333; display: block; margin-bottom: 2px; }
    .detail-row .value { color: #525252; }
    .donation-section { margin-top: 20px; }
    .donation-section h3 { font-size: 13px; color: #003c7a; margin-bottom: 15px; }
    .donation-grid { display: flex; justify-content: space-between; }
    .donation-item { width: 48%; }
    .donation-item .label { font-weight: bold; color: #333; display: block; margin-bottom: 2px; }
    .donation-item .value { color: #525252; }
    .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #525252; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <img src="https://nirmaan.org/assets/img/nirmaan_logo.png" alt="Nirmaan Organization" />
    </div>
    <div class="org-info">
      <p><span class="label">Address:</span> <span class="text-gray">Nirmaan Organization, H.No. 1-98/9/3,</span></p>
      <p><span class="text-gray">Jaihind Enclave, Madhapur, Hyderabad - 500081</span></p>
      <p><span class="label">Email:</span> <span class="text-gray">contact@nirmaan.org</span></p>
    </div>
  </div>

  <div class="greeting">
    <h3>Dear ${variables.fullname},</h3>
  </div>

  <div class="message">
    <p>Thank you, Nirmaan Organization is very grateful for your generous donation of <span class="text-nirmaan">${variables.amount} ${variables.currency}</span> on <span class="text-nirmaan">${variables.receipt_date}</span> for <span class="text-nirmaan">${variables.cause}</span>.</p>
  </div>

  <div class="message">
    <p>The humanitarian efforts of Nirmaan Organization provide comfort and hope to so many during their times of need. Thank you for your commitment to this critically important work. Our mission depends on the support and compassion of donors like you. On behalf of those we serve, thank you for standing with us.</p>
  </div>

  <div class="signature">
    <p><strong>Sincerely,</strong></p>
    <p class="text-gray">Mayur Patnala (Founder & CEO),</p>
    <p class="text-gray">Nirmaan Organization.</p>
  </div>

  <hr />

  <div class="details-section">
    <div class="details-box">
      <h3>Organization details:</h3>
      <div class="detail-row">
        <span class="label">PAN:</span>
        <span class="value">AAAAN5250A</span>
      </div>
      <div class="detail-row">
        <span class="label">Registered Address:</span>
        <span class="value">H.No. 1-98/9/3, Jaihind Enclave, Madhapur, Hyderabad - 500081</span>
      </div>
      <div class="detail-row">
        <span class="label">80g:</span>
        <span class="value">80G-AAAAN5250AF20214 dated 28-05-2021 issued 11-Clause (i) of first proviso to sub-section (5) of section 80G</span>
      </div>
      <div class="detail-row">
        <span class="label">12A:</span>
        <span class="value">12A-AAAAN5250AE20214 dated 28-05-2021 issued 01-Sub clause (i) of clause (ac) of sub -section (1) of section 12A</span>
      </div>
    </div>
    <div class="details-box">
      <h3>Donor details:</h3>
      <div class="detail-row">
        <span class="label">Name:</span>
        <span class="value">${variables.fullname}</span>
      </div>
      <div class="detail-row">
        <span class="label">Address:</span>
        <span class="value">${variables.address || '-'}</span>
      </div>
      <div class="detail-row">
        <span class="label">PAN:</span>
        <span class="value">${variables.pan || '-'}</span>
      </div>
      <div class="detail-row">
        <span class="label">Email:</span>
        <span class="value">${variables.email}</span>
      </div>
      <div class="detail-row">
        <span class="label">Date & Financial Year:</span>
        <span class="value">${variables.receipt_date} (${variables.financial_year})</span>
      </div>
    </div>
  </div>

  <hr />

  <div class="donation-section">
    <h3>Donation Details:</h3>
    <div class="donation-grid">
      <div class="donation-item">
        <span class="label">Receipt ID:</span>
        <span class="value">${variables.receipt_id}</span>
      </div>
      <div class="donation-item">
        <span class="label">Amount:</span>
        <span class="value">${variables.amount} ${variables.currency}</span>
      </div>
    </div>
  </div>

  <hr />

  <div class="footer">
    <p>This receipt is system generated and no signature is required.</p>
  </div>
</body>
</html>
  `;
}

// Generate 501c3 PDF HTML (for USD donations)
function generate501c3PDFHTML(payment, variables) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #333; padding: 30px 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h2 { color: #003c7a; margin-bottom: 10px; }
    .org-info { font-size: 11px; color: #525252; }
    .org-info p { margin: 3px 0; }
    .greeting { margin: 30px 0 15px 0; }
    .greeting h3 { font-size: 13px; font-weight: bold; color: #333; }
    .text-nirmaan { color: #003c7a; font-weight: bold; }
    .message { color: #525252; font-size: 11px; line-height: 1.6; text-align: justify; margin-bottom: 15px; }
    .signature { margin: 25px 0; }
    .signature p { margin: 3px 0; color: #525252; }
    hr { border: none; border-top: 1px solid #ccc; margin: 20px 0; }
    .donation-box { background: #f5f5f5; border: 1px solid #ddd; border-radius: 5px; padding: 20px; margin: 20px 0; }
    .donation-box h3 { color: #003c7a; margin-bottom: 15px; font-size: 13px; }
    .donation-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .donation-row:last-child { border-bottom: none; }
    .donation-row .label { font-weight: bold; color: #003c7a; }
    .donation-row .value { color: #333; }
    .tax-info { background: #e8f4ff; border-left: 4px solid #003c7a; padding: 15px; margin: 20px 0; font-size: 11px; }
    .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #888; }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://nirmaan.org/assets/img/nirmaan_logo.png" alt="Nirmaan USA" style="width: 150px; margin-bottom: 15px;" />
    <h2>NIRMAAN USA</h2>
    <div class="org-info">
      <p><strong>Address:</strong> 7 Tralee Ct Bloomington IL 61704</p>
      <p><strong>EIN:</strong> 85-2571471</p>
    </div>
  </div>

  <div class="greeting">
    <h3>Dear ${variables.fullname},</h3>
  </div>

  <div class="message">
    <p>Thank you. Nirmaan USA is very grateful for your generous gift of <span class="text-nirmaan">$${variables.amount} ${variables.currency}</span> on <span class="text-nirmaan">${variables.receipt_date}</span> for <span class="text-nirmaan">${variables.cause}</span>.</p>
  </div>

  <div class="message">
    <p>Please see below for a copy of your tax receipt information for your donation.</p>
  </div>

  <div class="message">
    <p>The humanitarian efforts of Nirmaan USA provide comfort and hope to so many during their times of need. Thank you for your commitment to this critically important work. Our mission depends on the support and compassion of donors like you.</p>
  </div>

  <div class="message">
    <p>On behalf of those we serve, thank you for standing with us.</p>
  </div>

  <div class="signature">
    <p><strong>Sincerely,</strong></p>
    <p>Mayur Patnala (Founder & CEO),</p>
    <p>Nirmaan Organization</p>
  </div>

  <hr />

  <div class="donation-box">
    <h3>Donation Details</h3>
    <div class="donation-row">
      <span class="label">Donor Name:</span>
      <span class="value">${variables.fullname}</span>
    </div>
    <div class="donation-row">
      <span class="label">Donation Amount:</span>
      <span class="value">$${variables.amount} ${variables.currency}</span>
    </div>
    <div class="donation-row">
      <span class="label">Date:</span>
      <span class="value">${variables.receipt_date}</span>
    </div>
    <div class="donation-row">
      <span class="label">Transaction ID:</span>
      <span class="value">${variables.receipt_id}</span>
    </div>
    <div class="donation-row">
      <span class="label">Cause:</span>
      <span class="value">${variables.cause}</span>
    </div>
  </div>

  <div class="tax-info">
    <strong>Tax Deduction Information:</strong><br/><br/>
    As required by IRS regulations, we provide the following information: Nirmaan USA is a 501(c)(3) not for profit organization. Our federal tax identification number is <strong>85-2571471</strong>. As no goods or services have been provided in connection with this gift, the full amount is deductible to the fullest extent provided by law.
  </div>

  <div class="footer">
    <p>This receipt is system generated and no signature is required.</p>
    <p>© ${new Date().getFullYear()} Nirmaan USA. All rights reserved.</p>
  </div>
</body>
</html>
  `;
}

// Generate PDF using Puppeteer
async function generatePDF(htmlContent, receiptId) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
  });
  
  await browser.close();
  
  // Save PDF to receipts folder
  const receiptsDir = path.join(process.cwd(), 'receipts');
  if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir, { recursive: true });
  }
  
  const pdfPath = path.join(receiptsDir, `${receiptId}.pdf`);
  fs.writeFileSync(pdfPath, pdfBuffer);
  
  return { pdfBuffer, pdfPath };
}

// Select email template based on cause and currency
function selectTemplate(cause, currency, reference) {
  if (currency === 'USD') {
    return 'default-email-template.html';
  }
  
  if ((cause === 'Gift a Childhood' || cause === 'Udaan Library 2025' || cause === 'Empower a Mother') && 
      reference === 'support-rajeev-tummala-charity-challenge') {
    return 'rajeev-tummala.html';
  }
  else if (cause === 'Himalayan Clouds Challenge') {
    return 'rajeev-tummala-generic.html';
  }
  else if (cause === 'Gift a Childhood') {
    return 'gift-a-childhood-template.html';
  }
  else if (cause === 'Youth Skill Development') {
    return 'ysd-template.html';
  }
  else if (cause === 'Backpacks for Dreams 2025') {
    return 'btstemplate.html';
  }
  else if (cause === 'Support Rural Dreams at Spoorthy Bhavan') {
    return 'spoorthy-bhavan.html';
  }
  else if (cause === 'Miles for Mind') {
    return 'experian-run-2025.html';
  }
  else {
    return 'default-inr.html';
  }
}

// Load and process email template
function loadTemplate(templateName, variables) {
  try {
    const templatePath = path.join(process.cwd(), 'components', 'templates', templateName);
    
    if (!fs.existsSync(templatePath)) {
      const defaultPath = path.join(process.cwd(), 'components', 'templates', 'default-email-template.html');
      if (!fs.existsSync(defaultPath)) {
        return null;
      }
      let template = fs.readFileSync(defaultPath, 'utf8');
      for (const [key, value] of Object.entries(variables)) {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
      }
      return template;
    }
    
    let template = fs.readFileSync(templatePath, 'utf8');
    for (const [key, value] of Object.entries(variables)) {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
    }
    
    return template;
  } catch (error) {
    console.error('Error loading template:', error);
    return null;
  }
}

export async function POST(request) {
  try {
    const { paymentId } = await request.json();
    
    if (!paymentId) {
      return NextResponse.json(
        { success: false, message: 'Payment ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch payment details from database
    const [payments] = await pool.query(
      `SELECT * FROM payments WHERE PaymentId = ?`,
      [paymentId]
    );
    
    if (payments.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Payment not found' },
        { status: 404 }
      );
    }
    
    const payment = payments[0];
    
    if (!payment.Email) {
      return NextResponse.json(
        { success: false, message: 'Donor email not available' },
        { status: 400 }
      );
    }
    
    // Determine receipt type based on currency
    const isUSD = payment.Currency === 'USD';
    const receiptType = isUSD ? '501(c)(3)' : '80G';
    
    // Prepare template variables
    const variables = {
      fullname: payment.FullName || `${payment.FirstName || ''} ${payment.LastName || ''}`.trim(),
      amount: parseFloat(payment.Amount).toLocaleString('en-IN'),
      currency: payment.Currency,
      receipt_date: formatDate(payment.PaymentDate),
      receipt_id: payment.ReceiptId,
      cause: payment.Cause || 'General Donation',
      address: payment.Address || '',
      email: payment.Email,
      pan: payment.PAN || '',
      reference: payment.Reference || '',
      financial_year: getFinancialYear(payment.PaymentDate)
    };
    
    // Generate PDF HTML based on currency
    const pdfHTML = isUSD 
      ? generate501c3PDFHTML(payment, variables)
      : generate80GPDFHTML(payment, variables);
    
    // Generate PDF
    const { pdfBuffer, pdfPath } = await generatePDF(pdfHTML, payment.ReceiptId);
    
    // Load email template
    const templateName = selectTemplate(payment.Cause, payment.Currency, payment.Reference);
    const emailHTML = loadTemplate(templateName, variables);
    
    if (!emailHTML) {
      return NextResponse.json(
        { success: false, message: 'Failed to load email template' },
        { status: 500 }
      );
    }
    
    // Send email with PDF attachment
    const mailOptions = {
      from: '"Nirmaan Organization" <transactions@nirmaan.org>',
      to: payment.Email,
      subject: `Thank You for Your Donation to Nirmaan: ${receiptType} Receipt Enclosed!`,
      html: emailHTML,
      attachments: [
        {
          filename: `${payment.ReceiptId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };
    
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    
    console.log(`Receipt sent successfully to ${payment.Email} for payment ${paymentId} (${receiptType}) with PDF attachment`);
    
    return NextResponse.json({
      success: true,
      message: `${receiptType} receipt sent successfully to ${payment.Email} with PDF attachment`,
      receiptType,
      email: payment.Email,
      pdfPath
    });
    
  } catch (error) {
    console.error('Error sending receipt:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send receipt: ' + error.message },
      { status: 500 }
    );
  }
}
