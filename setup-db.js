const mysql = require('mysql2/promise');

async function setupDatabase() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'donations'
  });

  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        UserId int(11) NOT NULL AUTO_INCREMENT,
        FullName varchar(255) NOT NULL,
        Email varchar(255) NOT NULL,
        Password varchar(255) NOT NULL,
        Role enum('super_admin','admin','viewer') NOT NULL DEFAULT 'viewer',
        IsActive tinyint(1) NOT NULL DEFAULT 1,
        CreatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        LastLogin datetime DEFAULT NULL,
        PRIMARY KEY (UserId),
        UNIQUE KEY Email (Email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Users table created/verified');

    // Check if users exist
    const [existing] = await pool.query('SELECT COUNT(*) as count FROM users');
    
    if (existing[0].count === 0) {
      // Insert default users with bcrypt hashed passwords
      // Password for superadmin & admin: Admin@123
      // Password for viewer: Viewer@123
      await pool.query(`
        INSERT INTO users (FullName, Email, Password, Role, IsActive) VALUES
        ('Super Admin', 'superadmin@nirmaan.org', '$2a$10$rPQxLxYMZLOEGWYPZ1q8/.KdZjRVvQvvv2OGqvqRfPH5bKxvWQXDy', 'super_admin', 1),
        ('Admin User', 'admin@nirmaan.org', '$2a$10$rPQxLxYMZLOEGWYPZ1q8/.KdZjRVvQvvv2OGqvqRfPH5bKxvWQXDy', 'admin', 1),
        ('Viewer User', 'viewer@nirmaan.org', '$2a$10$8jKQZHzMBGNVPjhWwNQhB.YJqJ1YRYBcJKz8sYIE1jFTJyQWHYA3.', 'viewer', 1)
      `);
      console.log('✅ Default users inserted');
    } else {
      console.log('ℹ️  Users already exist, skipping insert');
    }

    // Show all tables
    const [tables] = await pool.query('SHOW TABLES');
    console.log('\n📋 Current tables in database:');
    tables.forEach(t => console.log('   -', Object.values(t)[0]));

    // Show users
    const [users] = await pool.query('SELECT UserId, FullName, Email, Role, IsActive FROM users');
    console.log('\n👥 Users in database:');
    users.forEach(u => console.log(`   - ${u.FullName} (${u.Email}) - Role: ${u.Role}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

setupDatabase();
