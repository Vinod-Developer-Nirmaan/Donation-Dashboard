-- Offline Donations Table
-- Use this SQL to create the offline_donations table if it doesn't exist

CREATE TABLE IF NOT EXISTS `offline_donations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `FullName` tinytext DEFAULT NULL,
  `Email` tinytext DEFAULT NULL,
  `Amount` int(100) DEFAULT NULL,
  `Currency` tinytext DEFAULT NULL,
  `Spoc` tinytext DEFAULT NULL,
  `Cause` text DEFAULT NULL,
  `Anonymous` int(11) DEFAULT 0,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `Reference` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
