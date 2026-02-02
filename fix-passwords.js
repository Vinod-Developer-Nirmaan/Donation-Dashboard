const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function fixPasswords() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'donations'
  });

  try {
    // Generate correct bcrypt hashes
    const adminHash = await bcrypt.hash('Admin@123', 10);
    const viewerHash = await bcrypt.hash('Viewer@123', 10);

    console.log('🔐 Generated new password hashes');

    // Update superadmin password
    await pool.query(
      'UPDATE users SET Password = ? WHERE Email = ?',
      [adminHash, 'superadmin@nirmaan.org']
    );
    console.log('✅ Updated superadmin@nirmaan.org password');

    // Update admin password
    await pool.query(
      'UPDATE users SET Password = ? WHERE Email = ?',
      [adminHash, 'admin@nirmaan.org']
    );
    console.log('✅ Updated admin@nirmaan.org password');

    // Update viewer password
    await pool.query(
      'UPDATE users SET Password = ? WHERE Email = ?',
      [viewerHash, 'viewer@nirmaan.org']
    );
    console.log('✅ Updated viewer@nirmaan.org password');

    // Verify the updates
    console.log('\n🔍 Verifying passwords...');
    
    const [users] = await pool.query('SELECT Email, Password FROM users');
    
    for (const user of users) {
      const testPassword = user.Email.includes('viewer') ? 'Viewer@123' : 'Admin@123';
      const isValid = await bcrypt.compare(testPassword, user.Password);
      console.log(`   ${user.Email}: ${isValid ? '✅ Password works!' : '❌ Password mismatch'}`);
    }

    console.log('\n📋 Login Credentials:');
    console.log('   superadmin@nirmaan.org / Admin@123');
    console.log('   admin@nirmaan.org / Admin@123');
    console.log('   viewer@nirmaan.org / Viewer@123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixPasswords();
