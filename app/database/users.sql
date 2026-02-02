-- Users table for authentication
CREATE TABLE IF NOT EXISTS `users` (
  `UserId` int(11) NOT NULL AUTO_INCREMENT,
  `FullName` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL UNIQUE,
  `Password` varchar(255) NOT NULL,
  `Role` enum('super_admin','admin','viewer') NOT NULL DEFAULT 'viewer',
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `LastLogin` datetime DEFAULT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default users with bcrypt hashed passwords
-- Password for superadmin: Admin@123
-- Password for admin: Admin@123
-- Password for viewer: Viewer@123

INSERT INTO `users` (`FullName`, `Email`, `Password`, `Role`, `IsActive`) VALUES
('Super Admin', 'superadmin@nirmaan.org', '$2a$10$rPQxLxYMZLOEGWYPZ1q8/.KdZjRVvQvvv2OGqvqRfPH5bKxvWQXDy', 'super_admin', 1),
('Admin User', 'admin@nirmaan.org', '$2a$10$rPQxLxYMZLOEGWYPZ1q8/.KdZjRVvQvvv2OGqvqRfPH5bKxvWQXDy', 'admin', 1),
('Viewer User', 'viewer@nirmaan.org', '$2a$10$8jKQZHzMBGNVPjhWwNQhB.YJqJ1YRYBcJKz8sYIE1jFTJyQWHYA3.', 'viewer', 1);

-- Note: Run this SQL in your MySQL database
-- The hashed passwords above are generated with bcrypt
-- For testing, you can also use plain text comparison initially
