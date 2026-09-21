-- =====================================================================
-- Airtime International Travel Agency - Takht Bhai
-- Complete Production MySQL Database Schema & Initial Data for Hostinger
-- Compatible with Hostinger MySQL / MariaDB (phpMyAdmin / hPanel)
-- Character Set: utf8mb4 (Full Multilingual: English, Urdu, Arabic)
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- ---------------------------------------------------------------------
-- 1. Table: settings
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT 'Airtime International Travel Agency',
  `tagline` varchar(255) DEFAULT 'Pioneer Travel Agency in Takht Bhai • IATA Sabre Certified',
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT 'Takht Bhai',
  `province` varchar(100) DEFAULT 'Khyber Pakhtunkhwa',
  `country` varchar(100) DEFAULT 'Pakistan',
  `phone` varchar(50) DEFAULT '+92 333 3652027',
  `telephone` varchar(50) DEFAULT '+92 932 550123',
  `whatsapp` varchar(50) DEFAULT '+92 333 3652027',
  `email` varchar(150) DEFAULT 'airtimetravels636@gmail.com',
  `iataCode` varchar(100) DEFAULT 'IATA-SABRE-962451',
  `sabrePcc` varchar(50) DEFAULT 'AIRT-PK',
  `currency` varchar(10) DEFAULT 'PKR',
  `currencySymbol` varchar(10) DEFAULT 'Rs.',
  `businessHours` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`id`, `name`, `tagline`, `address`, `city`, `province`, `country`, `phone`, `telephone`, `whatsapp`, `email`, `iataCode`, `sabrePcc`, `currency`, `currencySymbol`, `businessHours`) VALUES
(1, 'Airtime International Travel Agency', 'Pioneer Travel Agency in Takht Bhai • IATA Sabre Certified', 'Malakand Road, Opposite Sajida Islam Hospital, Takht Bhai, KP, Pakistan', 'Takht Bhai', 'Khyber Pakhtunkhwa', 'Pakistan', '+92 333 3652027', '+92 932 550123', '+92 333 3652027', 'airtimetravels636@gmail.com', 'IATA-SABRE-962451', 'AIRT-PK', 'PKR', 'Rs.', 'Mon - Sat: 9:00 AM - 9:00 PM | Friday: 9:00 AM - 12:30 PM & 2:30 PM - 9:00 PM | Sun: 11:00 AM - 6:00 PM');

-- ---------------------------------------------------------------------
-- 2. Table: admins
-- User ID: airtimetravels636@gmail.com (Default password hashed with BCRYPT)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT 'Agency Administrator',
  `email` varchar(150) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'superadmin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Securely hashed default credentials (BCRYPT)
INSERT INTO `admins` (`id`, `name`, `email`, `password`, `password_hash`, `role`) VALUES
(1, 'Murtaza Khan - Administrator', 'airtimetravels636@gmail.com', '$2y$10$73QMn4WT3AsPXBDaeuhjBuL7EOhwFRAbH.ucUhBii8NfeRFR6OZ4S', '$2y$10$73QMn4WT3AsPXBDaeuhjBuL7EOhwFRAbH.ucUhBii8NfeRFR6OZ4S', 'superadmin');

-- ---------------------------------------------------------------------
-- 2b. Table: password_resets (Secure tokenized password reset links)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
  `email` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`token`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Table: umrah_packages
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `umrah_packages`;
CREATE TABLE `umrah_packages` (
  `id` varchar(64) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `makkahHotel` varchar(255) DEFAULT NULL,
  `madinahHotel` varchar(255) DEFAULT NULL,
  `makkahDistance` varchar(100) DEFAULT NULL,
  `madinahDistance` varchar(100) DEFAULT NULL,
  `flightIncluded` tinyint(1) DEFAULT 1,
  `visaIncluded` tinyint(1) DEFAULT 1,
  `transportIncluded` tinyint(1) DEFAULT 1,
  `ziyaratIncluded` tinyint(1) DEFAULT 1,
  `quadPrice` int(11) DEFAULT 0,
  `triplePrice` int(11) DEFAULT 0,
  `doublePrice` int(11) DEFAULT 0,
  `singlePrice` int(11) DEFAULT 0,
  `airline` varchar(100) DEFAULT NULL,
  `departure` varchar(100) DEFAULT 'Peshawar / Islamabad',
  `status` varchar(50) DEFAULT 'Active',
  `featured` tinyint(1) DEFAULT 0,
  `badge` varchar(100) DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT 5.0,
  `reviewsCount` int(11) DEFAULT 0,
  `image` text DEFAULT NULL,
  `includes` longtext DEFAULT NULL,
  `excludes` longtext DEFAULT NULL,
  `itinerary` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_slug` (`slug`),
  KEY `idx_featured` (`featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `umrah_packages` (`id`, `title`, `slug`, `duration`, `makkahHotel`, `madinahHotel`, `makkahDistance`, `madinahDistance`, `flightIncluded`, `visaIncluded`, `transportIncluded`, `ziyaratIncluded`, `quadPrice`, `triplePrice`, `doublePrice`, `singlePrice`, `airline`, `departure`, `status`, `featured`, `badge`, `rating`, `reviewsCount`, `image`, `includes`, `excludes`, `itinerary`) VALUES
('umrah-pkg-1', '15 Days Executive 5-Star VIP Umrah', '15-days-executive-vip-umrah', NULL, 'Fairmont Makkah Clock Royal Tower', 'Dar Al Taqwa Hotel Madinah', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Saudia (Saudi Arabian Airlines)', NULL, 'Active', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('umrah-pkg-2', '15 Days Premium 4-Star Umrah Package', '15-days-premium-4-star-umrah', NULL, 'Anjum Hotel Makkah / Al Shohada', 'Leader Al Muna Kareem Madinah', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PIA (Pakistan International Airlines)', NULL, 'Active', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('umrah-pkg-3', '21 Days Economy Saver Umrah Package', '21-days-economy-saver-umrah', NULL, 'Al Kiswah Towers Makkah', 'Taiba Front / Emaar Elite Madinah', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Flynas / Serene Air', NULL, 'Active', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('umrah-pkg-4', '10 Days Express Umrah (Direct Flights)', '10-days-express-umrah', NULL, 'Pullman Zamzam Makkah', 'Madinah Hilton Hotel', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Saudia (Saudi Arabian Airlines)', NULL, 'Active', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- ---------------------------------------------------------------------
-- 4. Table: flight_offers
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `flight_offers`;
CREATE TABLE `flight_offers` (
  `id` varchar(64) NOT NULL,
  `airline` varchar(100) NOT NULL,
  `airlineCode` varchar(20) NOT NULL,
  `airlineLogo` text DEFAULT NULL,
  `origin` varchar(100) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `originCode` varchar(10) NOT NULL,
  `destinationCode` varchar(10) NOT NULL,
  `tripType` varchar(50) DEFAULT 'Return',
  `price` int(11) NOT NULL,
  `cabin` varchar(50) DEFAULT 'Economy',
  `baggage` varchar(100) DEFAULT '2x23 KG',
  `meal` varchar(100) DEFAULT 'Complimentary',
  `stops` varchar(100) DEFAULT 'Direct',
  `departureTime` varchar(50) DEFAULT NULL,
  `arrivalTime` varchar(50) DEFAULT NULL,
  `validTill` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `featured` tinyint(1) DEFAULT 0,
  `badge` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `flight_offers` (`id`, `airline`, `airlineCode`, `airlineLogo`, `origin`, `destination`, `originCode`, `destinationCode`, `tripType`, `price`, `cabin`, `baggage`, `meal`, `stops`, `departureTime`, `arrivalTime`, `validTill`, `status`, `featured`, `badge`) VALUES
('flight-offer-1', 'Saudia', 'SV', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2 x 23 KG + 7 KG Hand Carry', NULL, NULL, NULL, NULL, '2026-11-30', 'Active', NULL, 'Most Popular'),
('flight-offer-2', 'Pakistan International Airlines', 'PK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2 x 23 KG + 7 KG Hand Carry', NULL, NULL, NULL, NULL, '2026-12-15', 'Active', NULL, 'Special Umrah Fare'),
('flight-offer-3', 'Emirates', 'EK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '30 KG Checked + 7 KG Hand', NULL, NULL, NULL, NULL, '2026-11-15', 'Active', NULL, 'Hot Deal'),
('flight-offer-4', 'Flynas', 'XY', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '30 KG Checked + 7 KG Hand', NULL, NULL, NULL, NULL, '2026-10-31', 'Active', NULL, 'Budget Choice');

-- ---------------------------------------------------------------------
-- 5. Table: group_tickets
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `group_tickets`;
CREATE TABLE `group_tickets` (
  `id` varchar(64) NOT NULL,
  `groupType` varchar(50) NOT NULL,
  `groupName` varchar(255) NOT NULL,
  `airline` varchar(100) NOT NULL,
  `airlineCode` varchar(20) NOT NULL,
  `sector` varchar(100) NOT NULL,
  `origin` varchar(100) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `departureDate` varchar(50) DEFAULT NULL,
  `returnDate` varchar(50) DEFAULT NULL,
  `totalSeats` int(11) DEFAULT 30,
  `availableSeats` int(11) DEFAULT 10,
  `pricePerSeat` int(11) NOT NULL,
  `baggage` varchar(100) DEFAULT '2x23 KG',
  `meal` varchar(100) DEFAULT 'Included',
  `status` varchar(50) DEFAULT 'Active',
  `pnr` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `group_tickets` (`id`, `groupType`, `groupName`, `airline`, `airlineCode`, `sector`, `origin`, `destination`, `departureDate`, `returnDate`, `totalSeats`, `availableSeats`, `pricePerSeat`, `baggage`, `meal`, `status`, `pnr`) VALUES
('group-ksa-1', 'KSA', NULL, 'Saudia Airlines', 'SV', 'PEW-JED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2PC (23+23 KG) + 7 KG', 'YES', 'Confirmed', NULL),
('group-ksa-2', 'KSA', NULL, 'PIA', 'PK', 'PEW-JED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2PC (23+23 KG) + 7 KG', 'YES', 'Confirmed', NULL),
('group-ksa-3', 'KSA', NULL, 'Saudia Airlines', 'SV', 'PEW-RUH', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2PC (23+23 KG) + 7 KG', 'YES', 'Confirmed', NULL),
('group-ksa-4', 'KSA', NULL, 'Flynas', 'XY', 'PEW-RUH', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '30 KG + 7 KG', 'NO', 'Confirmed', NULL),
('group-ksa-5', 'KSA', NULL, 'PIA', 'PK', 'PEW-MED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2PC (23+23 KG) + 7 KG', 'YES', 'Confirmed', NULL),
('group-ksa-6', 'KSA', NULL, 'Saudia Airlines', 'SV', 'ISB-JED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2PC (23+23 KG) + 7 KG', 'YES', 'Confirmed', NULL),
('group-ksa-7', 'KSA', NULL, 'AirSial', 'PF', 'ISB-JED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '20 KG + 7 KG', 'YES', 'Confirmed', NULL),
('group-ksa-8', 'KSA', NULL, 'PIA', 'PK', 'ISB-RUH', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2PC (23+23 KG) + 7 KG', 'YES', 'Confirmed', NULL),
('group-ksa-9', 'KSA', NULL, 'Flyadeal', 'F3', 'ISB-DMM', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '30 KG + 7 KG', 'NO', 'Confirmed', NULL),
('group-ksa-10', 'KSA', NULL, 'Saudia Airlines', 'SV', 'LHE-JED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2PC (23+23 KG) + 7 KG', 'YES', 'Confirmed', NULL),
('group-ksa-11', 'KSA', NULL, 'Flynas', 'XY', 'LHE-RUH', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '30 KG + 7 KG', 'NO', 'Confirmed', NULL),
('group-ksa-12', 'KSA', NULL, 'AirSial', 'PF', 'MUX-JED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '20 KG + 7 KG', 'YES', 'Confirmed', NULL),
('group-uae-1', 'UAE', NULL, 'FlyDubai', 'FZ', 'PEW-DXB', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '30 KG + 7 KG', 'YES', 'Confirmed', NULL),
('group-uae-2', 'UAE', NULL, 'AirSial', 'PF', 'PEW-DXB', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '20 KG + 7 KG', 'YES', 'Confirmed', NULL),
('group-uae-3', 'UAE', NULL, 'Air Arabia', 'G9', 'PEW-SHJ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '30 KG + 7 KG', 'NO', 'Confirmed', NULL),
('group-uae-4', 'UAE', NULL, 'FlyDubai', 'FZ', 'ISB-DXB', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '30 KG + 7 KG', 'YES', 'Confirmed', NULL),
('group-uae-5', 'UAE', NULL, 'AirSial', 'PF', 'ISB-DXB', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '20 KG + 7 KG', 'YES', 'Confirmed', NULL),
('group-uae-6', 'UAE', NULL, 'Etihad Airways', 'EY', 'ISB-AUH', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '30 KG + 7 KG', 'YES', 'Confirmed', NULL),
('group-uae-7', 'UAE', NULL, 'AirSial', 'PF', 'ISB-AUH', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '20 KG + 7 KG', 'YES', 'Confirmed', NULL),
('group-uae-8', 'UAE', NULL, 'FlyJinnah', '9P', 'ISB-SHJ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '20 KG + 7 KG', 'NO', 'Confirmed', NULL),
('group-uae-9', 'UAE', NULL, 'Emirates', 'EK', 'LHE-DXB', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '30 KG + 7 KG', 'YES', 'Confirmed', NULL),
('group-uae-10', 'UAE', NULL, 'AirSial', 'PF', 'LHE-DXB', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '20 KG + 7 KG', 'YES', 'Confirmed', NULL),
('group-uae-11', 'UAE', NULL, 'Etihad Airways', 'EY', 'LHE-AUH', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '30 KG + 7 KG', 'YES', 'Confirmed', NULL),
('group-uae-12', 'UAE', NULL, 'Air Arabia', 'G9', 'SKT-SHJ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '30 KG + 7 KG', 'NO', 'Confirmed', NULL);

-- ---------------------------------------------------------------------
-- 6. Table: visa_services
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `visa_services`;
CREATE TABLE `visa_services` (
  `id` varchar(64) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `processingTime` varchar(100) DEFAULT NULL,
  `validity` varchar(100) DEFAULT NULL,
  `fee` int(11) NOT NULL,
  `currency` varchar(10) DEFAULT 'PKR',
  `status` varchar(50) DEFAULT 'Active',
  `requirements` longtext DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `visa_services` (`id`, `title`, `category`, `processingTime`, `validity`, `fee`, `currency`, `status`, `requirements`, `description`) VALUES
('visa-1', 'Saudi Umrah eVisa', 'Umrah', '24 - 48 Hours', '90 Days Single / 1 Year Multiple', 45000, 'PKR', 'Active', '["Original Machine Readable Passport (valid at least 6 months)","High quality passport size photograph with white background","CNIC copy of applicant","B-Form for minors (under 18 years)","Saudi Health & COVID insurance (included in fee)"]', 'Official Umrah eVisa approved through the Saudi Ministry of Hajj & Umrah with instant barcoded confirmation.'),
('visa-2', 'Saudi Tourist eVisa (1 Year Multiple)', 'Tourist', '1 - 3 Days', '1 Year Multiple Entry (90 Days stay per visit)', 52000, 'PKR', 'Active', '["Passport valid for minimum 6 months","Recent passport photo (white background)","Valid credit card or payment authorization","Flight itinerary & hotel booking"]', 'Allows tourism across Saudi Arabia, performing Umrah outside Hajj season, and attending cultural festivals.'),
('visa-3', 'Saudi Family Visit Visa Endorsement', 'Family Visit', '3 - 7 Working Days', 'As per MOFA Visa Document', 38000, 'PKR', 'Active', '["Original MOFA Visa Document from Saudi Sponsor","Original Passport of visitors","Marriage Certificate (FRC / MRC from NADRA)","Birth Certificates for children","Polio certificate & Medical insurance"]', 'Full Etimad / Tasheer biometric appointment and visa endorsement service managed directly by Airtime Takht Bhai.'),
('visa-4', 'Saudi Work / Employment Visa Stamping', 'Work Visa', '7 - 14 Working Days', '90 Days for Entry', 65000, 'PKR', 'Active', '["Original Visa Slip (Wakala)","Medical Fitness Report (Wafid / GAMCA approved)","Degree/Diploma attestation from HEC & MOFA (if required)","Police Character Certificate","Driving License (for driver visas)"]', 'Complete handling of Saudi employment visas, medical coordination, and Protector of Emigrants clearance.');

-- ---------------------------------------------------------------------
-- 7. Table: medical_services
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `medical_services`;
CREATE TABLE `medical_services` (
  `id` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `affiliatedCenter` varchar(255) DEFAULT NULL,
  `localCoordination` varchar(255) DEFAULT NULL,
  `fee` int(11) NOT NULL,
  `processingTime` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `medical_services` (`id`, `name`, `category`, `affiliatedCenter`, `localCoordination`, `fee`, `processingTime`, `description`, `requirements`) VALUES
('med-1', 'Wafid (GAMCA) Pre-Departure Saudi Medical Slip', 'Saudi Work / Residence', 'Wafid Approved Diagnostic Centers (Peshawar & Mardan)', 'Sajida Islam Hospital Partnered Guidance, Takht Bhai', 8500, 'Instant Online Generation', 'Generation of mandatory Wafid (GAMCA) medical appointment slip for candidates traveling to Saudi Arabia for employment or permanent residency.', '["Original Passport copy","CNIC copy","Visa number and sponsor ID","2 Passport-sized photographs"]'),
('med-2', 'Umrah Senior Citizen Medical Fitness & Wheelchair Assistance', 'Spiritual Assistance', 'Opposite Sajida Islam Hospital, Takht Bhai', NULL, 3500, 'Same Day', 'Special arrangement for elderly pilgrims: medical clearance certificates, in-flight wheelchair request on Sabre system, and electric golf cart arrangements in Haramain.', '["Pilgrim CNIC & Passport","Current prescription / medical summary"]');

-- ---------------------------------------------------------------------
-- 8. Table: bookings
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` varchar(64) NOT NULL,
  `type` varchar(100) NOT NULL,
  `itemTitle` varchar(255) NOT NULL,
  `customerName` varchar(255) NOT NULL,
  `customerPhone` varchar(100) NOT NULL,
  `customerEmail` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT 'Takht Bhai',
  `passengers` int(11) DEFAULT 1,
  `sharingType` varchar(100) DEFAULT NULL,
  `departureDate` varchar(50) DEFAULT NULL,
  `totalAmount` int(11) DEFAULT 0,
  `paidAmount` int(11) DEFAULT 0,
  `paymentStatus` varchar(50) DEFAULT 'Unpaid',
  `bookingStatus` varchar(50) DEFAULT 'Pending',
  `airline` varchar(100) DEFAULT NULL,
  `pnr` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`customerPhone`),
  KEY `idx_status` (`bookingStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bookings` (`id`, `type`, `itemTitle`, `customerName`, `customerPhone`, `customerEmail`, `city`, `passengers`, `sharingType`, `departureDate`, `totalAmount`, `paidAmount`, `paymentStatus`, `bookingStatus`, `airline`, `pnr`, `notes`) VALUES
('AT-2026-8491', 'Umrah Package', '15 Days Executive 5-Star VIP Umrah', 'Muhammad Tariq Khan', '+92 301 8847291', 'tariq.khan@gmail.com', 'Takht Bhai', 4, 'Quad Sharing', '2026-10-20', 1940000, 1940000, 'Paid', 'Confirmed', 'Saudia (SV)', 'SABRE-7K2X9P', 'Family booking. Wheelchair requested for senior citizen. Makkah Clock Tower confirmed.'),
('AT-2026-8492', 'Airline Ticket', 'Peshawar (PEW) to Jeddah (JED) - Return', 'Engr. Asif Mehmood', '+92 333 9182740', 'asif.mardan@hotmail.com', 'Mardan', 2, NULL, '2026-10-15', 336000, 150000, 'Partial', 'Confirmed', 'Saudia', 'SABRE-9B4R1Q', 'Balance payable before ticket issuance date.'),
('AT-2026-8493', 'Saudi Visa', 'Saudi Umrah eVisa (Express)', 'Gul Faraz', '+92 345 6678129', 'gulfaraz78@gmail.com', 'Takht Bhai', 1, NULL, '2026-10-05', 45000, 45000, 'Paid', 'Confirmed', NULL, 'VISA-MOFA-9821', 'Visa stamped and handed over in Takht Bhai branch.'),
('AT-2026-8494', 'Umrah Package', '21 Days Economy Saver Umrah Package', 'Haji Shams-ur-Rehman', '+92 312 9988231', 'rehman.malakand@yahoo.com', 'Dargai / Malakand', 2, 'Double Sharing', '2026-11-05', 630000, 0, 'Unpaid', 'Pending', 'Flynas', 'PENDING-HOLD', 'Online web inquiry. Customer requested call-back regarding room sharing.');

-- ---------------------------------------------------------------------
-- 9. Table: customers
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT 'Takht Bhai',
  `totalBookings` int(11) DEFAULT 1,
  `totalSpent` bigint(20) DEFAULT 0,
  `cnic` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `customers` (`id`, `name`, `phone`, `email`, `city`, `totalBookings`, `totalSpent`, `cnic`, `notes`) VALUES
('cust-1', 'Muhammad Tariq Khan', '+92 301 8847291', 'tariq.khan@gmail.com', 'Takht Bhai', 3, 3450000, '16101-2345678-1', 'VIP regular client. Traveled with family for Umrah twice.'),
('cust-2', 'Engr. Asif Mehmood', '+92 333 9182740', 'asif.mardan@hotmail.com', 'Mardan', 2, 520000, '16102-9876543-3', 'Frequent international flyer to Saudi Arabia.'),
('cust-3', 'Haji Shams-ur-Rehman', '+92 312 9988231', 'rehman.malakand@yahoo.com', 'Malakand', 1, 630000, '16103-4567890-5', 'Inquired about 21-day package.');

-- ---------------------------------------------------------------------
-- 10. Table: testimonials
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `testimonials`;
CREATE TABLE `testimonials` (
  `id` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `rating` int(11) DEFAULT 5,
  `quote` text NOT NULL,
  `avatar` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `testimonials` (`id`, `name`, `location`, `role`, `rating`, `quote`, `avatar`) VALUES
('t-1', 'Haji Noor Muhammad', 'Takht Bhai, Malakand Road', 'Umrah Pilgrim (October)', 5, 'Alhamdulillah! Airtime International made our Umrah pilgrimage memorable. From the visa in 24 hours to our hotel in Fairmont Makkah, everything promised was delivered 100%. Being from Takht Bhai, having an authentic IATA Sabre agency right in front of Sajida Islam Hospital is a huge blessing.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'),
('t-2', 'Dr. Shahab Ud Din', 'Mardan / Peshawar', 'Family Umrah Group', 5, 'I compared multiple travel agencies in Peshawar and Islamabad, but Airtime Takht Bhai gave us the best transparent rate in PKR with zero hidden costs. Their direct Saudia tickets and Nusuk Rawdah permit assistance were flawless.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'),
('t-3', 'Kashif Afridi', 'Overseas Pakistani (Riyadh)', 'Parent Umrah & Ticketing', 5, 'I booked Umrah for my parents from Saudi Arabia through Airtime International. The team treated them like their own family, assisted with airport pickup in Jeddah, and escorted them through Makkah and Madinah Ziyarat.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80');

-- ---------------------------------------------------------------------
-- 11. Table: faqs
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `faqs`;
CREATE TABLE `faqs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `faqs` (`id`, `question`, `answer`) VALUES
(1, 'What documents are required for an Umrah visa from Pakistan?', 'You only need an original Machine Readable Passport (valid for at least 6 months), blue or white background photographs, and a copy of your NADRA CNIC (or B-Form for children). We handle the complete biometric registration, health insurance, and electronic visa issuance.'),
(2, 'How does the IATA Sabre system benefit customers?', 'As an IATA Sabre certified agency, Airtime International has direct, instantaneous access to global airline reservation inventories. We can issue tickets, hold seats, manage flight changes, and secure group discounts directly without third-party broker delays.'),
(3, 'How far are the hotels from Masjid al-Haram and Masjid an-Nabawi?', 'We offer distinct tiers: Our 5-Star Executive packages feature hotels directly on the Haram courtyards (0 to 100 meters, such as Fairmont Clock Tower or Pullman Zamzam). Our 4-Star packages are within 200-350 meters, and our budget-friendly packages include 24/7 complimentary air-conditioned shuttle service right to the Haram.'),
(4, 'Where is the Airtime International office located?', 'Our head office is conveniently situated on Main Malakand Road, Directly Opposite Sajida Islam Hospital, Takht Bhai, Khyber Pakhtunkhwa. Pilgrims and travelers from Takht Bhai, Mardan, Malakand, and Swat can easily visit us in person.'),
(5, 'Do you arrange medical appointment slips (Wafid / GAMCA) for Saudi visas?', 'Yes! We generate certified Wafid medical slips online for work and residence visas and guide applicants through medical testing at approved diagnostic centers in KP.');

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- Database setup complete!
-- Import this file into phpMyAdmin on Hostinger.
-- =====================================================================
