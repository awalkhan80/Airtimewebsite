import fs from 'fs';

const data = JSON.parse(fs.readFileSync('extracted_data.json', 'utf8'));

const { Jn: settings, Yn: umrahPackages, Xn: flightOffers, Zn: groupTickets, Qn: visaServices, $n: medicalServices, er: bookings, tr: customers, nr: testimonials, rr: faqs } = data;

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'number') return str;
  if (typeof str === 'boolean') return str ? 1 : 0;
  if (typeof str === 'object') return "'" + JSON.stringify(str).replace(/'/g, "''").replace(/\\/g, "\\\\") + "'";
  return "'" + String(str).replace(/'/g, "''").replace(/\\/g, "\\\\") + "'";
}

let sql = `-- =====================================================================
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
DROP TABLE IF EXISTS \`settings\`;
CREATE TABLE \`settings\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL DEFAULT 'Airtime International Travel Agency',
  \`tagline\` varchar(255) DEFAULT 'Pioneer Travel Agency in Takht Bhai • IATA Sabre Certified',
  \`address\` text DEFAULT NULL,
  \`city\` varchar(100) DEFAULT 'Takht Bhai',
  \`province\` varchar(100) DEFAULT 'Khyber Pakhtunkhwa',
  \`country\` varchar(100) DEFAULT 'Pakistan',
  \`phone\` varchar(50) DEFAULT '+92 333 3652027',
  \`telephone\` varchar(50) DEFAULT '+92 932 550123',
  \`whatsapp\` varchar(50) DEFAULT '+92 333 3652027',
  \`email\` varchar(150) DEFAULT 'airtimetravels636@gmail.com',
  \`iataCode\` varchar(100) DEFAULT 'IATA-SABRE-962451',
  \`sabrePcc\` varchar(50) DEFAULT 'AIRT-PK',
  \`currency\` varchar(10) DEFAULT 'PKR',
  \`currencySymbol\` varchar(10) DEFAULT 'Rs.',
  \`businessHours\` text DEFAULT NULL,
  \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`settings\` (\`id\`, \`name\`, \`tagline\`, \`address\`, \`city\`, \`province\`, \`country\`, \`phone\`, \`telephone\`, \`whatsapp\`, \`email\`, \`iataCode\`, \`sabrePcc\`, \`currency\`, \`currencySymbol\`, \`businessHours\`) VALUES
(1, ${escapeSql(settings.name)}, ${escapeSql(settings.tagline)}, ${escapeSql(settings.address)}, ${escapeSql(settings.city)}, ${escapeSql(settings.province)}, ${escapeSql(settings.country)}, ${escapeSql(settings.phone)}, ${escapeSql(settings.telephone)}, ${escapeSql(settings.whatsapp)}, ${escapeSql(settings.email)}, ${escapeSql(settings.iataCode)}, ${escapeSql(settings.sabrePcc)}, ${escapeSql(settings.currency)}, ${escapeSql(settings.currencySymbol)}, ${escapeSql(settings.businessHours)});

-- ---------------------------------------------------------------------
-- 2. Table: admins
-- Default login: airtimetravels636@gmail.com / murtaza26
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`admins\`;
CREATE TABLE \`admins\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) NOT NULL DEFAULT 'Agency Administrator',
  \`email\` varchar(150) NOT NULL UNIQUE,
  \`password\` varchar(255) NOT NULL,
  \`role\` varchar(50) NOT NULL DEFAULT 'superadmin',
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default password 'murtaza26' hashed with password_hash BCRYPT
INSERT INTO \`admins\` (\`id\`, \`name\`, \`email\`, \`password\`, \`role\`) VALUES
(1, 'Murtaza Khan - Administrator', 'airtimetravels636@gmail.com', '$2y$10$wTqg.30bM23F5O.O7X0OxeFf5gA4222y3WvW9s8W0H8r2Jm4dFk6W', 'superadmin');

-- ---------------------------------------------------------------------
-- 3. Table: umrah_packages
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`umrah_packages\`;
CREATE TABLE \`umrah_packages\` (
  \`id\` varchar(64) NOT NULL,
  \`title\` varchar(255) NOT NULL,
  \`slug\` varchar(255) NOT NULL,
  \`duration\` varchar(100) DEFAULT NULL,
  \`makkahHotel\` varchar(255) DEFAULT NULL,
  \`madinahHotel\` varchar(255) DEFAULT NULL,
  \`makkahDistance\` varchar(100) DEFAULT NULL,
  \`madinahDistance\` varchar(100) DEFAULT NULL,
  \`flightIncluded\` tinyint(1) DEFAULT 1,
  \`visaIncluded\` tinyint(1) DEFAULT 1,
  \`transportIncluded\` tinyint(1) DEFAULT 1,
  \`ziyaratIncluded\` tinyint(1) DEFAULT 1,
  \`quadPrice\` int(11) DEFAULT 0,
  \`triplePrice\` int(11) DEFAULT 0,
  \`doublePrice\` int(11) DEFAULT 0,
  \`singlePrice\` int(11) DEFAULT 0,
  \`airline\` varchar(100) DEFAULT NULL,
  \`departure\` varchar(100) DEFAULT 'Peshawar / Islamabad',
  \`status\` varchar(50) DEFAULT 'Active',
  \`featured\` tinyint(1) DEFAULT 0,
  \`badge\` varchar(100) DEFAULT NULL,
  \`rating\` decimal(3,1) DEFAULT 5.0,
  \`reviewsCount\` int(11) DEFAULT 0,
  \`image\` text DEFAULT NULL,
  \`includes\` longtext DEFAULT NULL,
  \`excludes\` longtext DEFAULT NULL,
  \`itinerary\` longtext DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`idx_slug\` (\`slug\`),
  KEY \`idx_featured\` (\`featured\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

// Insert Umrah packages
sql += 'INSERT INTO `umrah_packages` (`id`, `title`, `slug`, `duration`, `makkahHotel`, `madinahHotel`, `makkahDistance`, `madinahDistance`, `flightIncluded`, `visaIncluded`, `transportIncluded`, `ziyaratIncluded`, `quadPrice`, `triplePrice`, `doublePrice`, `singlePrice`, `airline`, `departure`, `status`, `featured`, `badge`, `rating`, `reviewsCount`, `image`, `includes`, `excludes`, `itinerary`) VALUES\n';

sql += umrahPackages.map(pkg => {
  return `(${escapeSql(pkg.id)}, ${escapeSql(pkg.title)}, ${escapeSql(pkg.slug)}, ${escapeSql(pkg.duration)}, ${escapeSql(pkg.makkahHotel)}, ${escapeSql(pkg.madinahHotel)}, ${escapeSql(pkg.makkahDistance)}, ${escapeSql(pkg.madinahDistance)}, ${escapeSql(pkg.flightIncluded)}, ${escapeSql(pkg.visaIncluded)}, ${escapeSql(pkg.transportIncluded)}, ${escapeSql(pkg.ziyaratIncluded)}, ${escapeSql(pkg.quadPrice)}, ${escapeSql(pkg.triplePrice)}, ${escapeSql(pkg.doublePrice)}, ${escapeSql(pkg.singlePrice)}, ${escapeSql(pkg.airline)}, ${escapeSql(pkg.departure)}, ${escapeSql(pkg.status)}, ${escapeSql(pkg.featured)}, ${escapeSql(pkg.badge)}, ${escapeSql(pkg.rating)}, ${escapeSql(pkg.reviewsCount)}, ${escapeSql(pkg.image)}, ${escapeSql(pkg.includes)}, ${escapeSql(pkg.excludes)}, ${escapeSql(pkg.itinerary)})`;
}).join(',\n') + ';\n\n';

// Flight offers table
sql += `-- ---------------------------------------------------------------------
-- 4. Table: flight_offers
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`flight_offers\`;
CREATE TABLE \`flight_offers\` (
  \`id\` varchar(64) NOT NULL,
  \`airline\` varchar(100) NOT NULL,
  \`airlineCode\` varchar(20) NOT NULL,
  \`airlineLogo\` text DEFAULT NULL,
  \`origin\` varchar(100) NOT NULL,
  \`destination\` varchar(100) NOT NULL,
  \`originCode\` varchar(10) NOT NULL,
  \`destinationCode\` varchar(10) NOT NULL,
  \`tripType\` varchar(50) DEFAULT 'Return',
  \`price\` int(11) NOT NULL,
  \`cabin\` varchar(50) DEFAULT 'Economy',
  \`baggage\` varchar(100) DEFAULT '2x23 KG',
  \`meal\` varchar(100) DEFAULT 'Complimentary',
  \`stops\` varchar(100) DEFAULT 'Direct',
  \`departureTime\` varchar(50) DEFAULT NULL,
  \`arrivalTime\` varchar(50) DEFAULT NULL,
  \`validTill\` varchar(100) DEFAULT NULL,
  \`status\` varchar(50) DEFAULT 'Active',
  \`featured\` tinyint(1) DEFAULT 0,
  \`badge\` varchar(100) DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

sql += 'INSERT INTO `flight_offers` (`id`, `airline`, `airlineCode`, `airlineLogo`, `origin`, `destination`, `originCode`, `destinationCode`, `tripType`, `price`, `cabin`, `baggage`, `meal`, `stops`, `departureTime`, `arrivalTime`, `validTill`, `status`, `featured`, `badge`) VALUES\n';
sql += flightOffers.map(f => {
  return `(${escapeSql(f.id)}, ${escapeSql(f.airline)}, ${escapeSql(f.airlineCode)}, ${escapeSql(f.airlineLogo)}, ${escapeSql(f.origin)}, ${escapeSql(f.destination)}, ${escapeSql(f.originCode)}, ${escapeSql(f.destinationCode)}, ${escapeSql(f.tripType)}, ${escapeSql(f.price)}, ${escapeSql(f.cabin)}, ${escapeSql(f.baggage)}, ${escapeSql(f.meal)}, ${escapeSql(f.stops)}, ${escapeSql(f.departureTime)}, ${escapeSql(f.arrivalTime)}, ${escapeSql(f.validTill)}, ${escapeSql(f.status)}, ${escapeSql(f.featured)}, ${escapeSql(f.badge)})`;
}).join(',\n') + ';\n\n';

// Group tickets table
sql += `-- ---------------------------------------------------------------------
-- 5. Table: group_tickets
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`group_tickets\`;
CREATE TABLE \`group_tickets\` (
  \`id\` varchar(64) NOT NULL,
  \`groupType\` varchar(50) NOT NULL,
  \`groupName\` varchar(255) NOT NULL,
  \`airline\` varchar(100) NOT NULL,
  \`airlineCode\` varchar(20) NOT NULL,
  \`sector\` varchar(100) NOT NULL,
  \`origin\` varchar(100) NOT NULL,
  \`destination\` varchar(100) NOT NULL,
  \`departureDate\` varchar(50) DEFAULT NULL,
  \`returnDate\` varchar(50) DEFAULT NULL,
  \`totalSeats\` int(11) DEFAULT 30,
  \`availableSeats\` int(11) DEFAULT 10,
  \`pricePerSeat\` int(11) NOT NULL,
  \`baggage\` varchar(100) DEFAULT '2x23 KG',
  \`meal\` varchar(100) DEFAULT 'Included',
  \`status\` varchar(50) DEFAULT 'Active',
  \`pnr\` varchar(50) DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

sql += 'INSERT INTO `group_tickets` (`id`, `groupType`, `groupName`, `airline`, `airlineCode`, `sector`, `origin`, `destination`, `departureDate`, `returnDate`, `totalSeats`, `availableSeats`, `pricePerSeat`, `baggage`, `meal`, `status`, `pnr`) VALUES\n';
sql += groupTickets.map(g => {
  return `(${escapeSql(g.id)}, ${escapeSql(g.groupType)}, ${escapeSql(g.groupName)}, ${escapeSql(g.airline)}, ${escapeSql(g.airlineCode)}, ${escapeSql(g.sector)}, ${escapeSql(g.origin)}, ${escapeSql(g.destination)}, ${escapeSql(g.departureDate)}, ${escapeSql(g.returnDate)}, ${escapeSql(g.totalSeats)}, ${escapeSql(g.availableSeats)}, ${escapeSql(g.pricePerSeat)}, ${escapeSql(g.baggage)}, ${escapeSql(g.meal)}, ${escapeSql(g.status)}, ${escapeSql(g.pnr)})`;
}).join(',\n') + ';\n\n';

// Visa services table
sql += `-- ---------------------------------------------------------------------
-- 6. Table: visa_services
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`visa_services\`;
CREATE TABLE \`visa_services\` (
  \`id\` varchar(64) NOT NULL,
  \`title\` varchar(255) NOT NULL,
  \`category\` varchar(100) NOT NULL,
  \`processingTime\` varchar(100) DEFAULT NULL,
  \`validity\` varchar(100) DEFAULT NULL,
  \`fee\` int(11) NOT NULL,
  \`currency\` varchar(10) DEFAULT 'PKR',
  \`status\` varchar(50) DEFAULT 'Active',
  \`requirements\` longtext DEFAULT NULL,
  \`description\` text DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

sql += 'INSERT INTO `visa_services` (`id`, `title`, `category`, `processingTime`, `validity`, `fee`, `currency`, `status`, `requirements`, `description`) VALUES\n';
sql += visaServices.map(v => {
  return `(${escapeSql(v.id)}, ${escapeSql(v.title)}, ${escapeSql(v.category)}, ${escapeSql(v.processingTime)}, ${escapeSql(v.validity)}, ${escapeSql(v.fee)}, ${escapeSql(v.currency)}, ${escapeSql(v.status)}, ${escapeSql(v.requirements)}, ${escapeSql(v.description)})`;
}).join(',\n') + ';\n\n';

// Medical services table
sql += `-- ---------------------------------------------------------------------
-- 7. Table: medical_services
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`medical_services\`;
CREATE TABLE \`medical_services\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`category\` varchar(100) NOT NULL,
  \`affiliatedCenter\` varchar(255) DEFAULT NULL,
  \`localCoordination\` varchar(255) DEFAULT NULL,
  \`fee\` int(11) NOT NULL,
  \`processingTime\` varchar(100) DEFAULT NULL,
  \`description\` text DEFAULT NULL,
  \`requirements\` longtext DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

sql += 'INSERT INTO `medical_services` (`id`, `name`, `category`, `affiliatedCenter`, `localCoordination`, `fee`, `processingTime`, `description`, `requirements`) VALUES\n';
sql += medicalServices.map(m => {
  return `(${escapeSql(m.id)}, ${escapeSql(m.name)}, ${escapeSql(m.category)}, ${escapeSql(m.affiliatedCenter)}, ${escapeSql(m.localCoordination)}, ${escapeSql(m.fee)}, ${escapeSql(m.processingTime)}, ${escapeSql(m.description)}, ${escapeSql(m.requirements)})`;
}).join(',\n') + ';\n\n';

// Bookings table
sql += `-- ---------------------------------------------------------------------
-- 8. Table: bookings
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`bookings\`;
CREATE TABLE \`bookings\` (
  \`id\` varchar(64) NOT NULL,
  \`type\` varchar(100) NOT NULL,
  \`itemTitle\` varchar(255) NOT NULL,
  \`customerName\` varchar(255) NOT NULL,
  \`customerPhone\` varchar(100) NOT NULL,
  \`customerEmail\` varchar(255) DEFAULT NULL,
  \`city\` varchar(100) DEFAULT 'Takht Bhai',
  \`passengers\` int(11) DEFAULT 1,
  \`sharingType\` varchar(100) DEFAULT NULL,
  \`departureDate\` varchar(50) DEFAULT NULL,
  \`totalAmount\` int(11) DEFAULT 0,
  \`paidAmount\` int(11) DEFAULT 0,
  \`paymentStatus\` varchar(50) DEFAULT 'Unpaid',
  \`bookingStatus\` varchar(50) DEFAULT 'Pending',
  \`airline\` varchar(100) DEFAULT NULL,
  \`pnr\` varchar(50) DEFAULT NULL,
  \`notes\` text DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`idx_phone\` (\`customerPhone\`),
  KEY \`idx_status\` (\`bookingStatus\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

sql += 'INSERT INTO `bookings` (`id`, `type`, `itemTitle`, `customerName`, `customerPhone`, `customerEmail`, `city`, `passengers`, `sharingType`, `departureDate`, `totalAmount`, `paidAmount`, `paymentStatus`, `bookingStatus`, `airline`, `pnr`, `notes`) VALUES\n';
sql += bookings.map(b => {
  return `(${escapeSql(b.id)}, ${escapeSql(b.type)}, ${escapeSql(b.itemTitle)}, ${escapeSql(b.customerName)}, ${escapeSql(b.customerPhone)}, ${escapeSql(b.customerEmail)}, ${escapeSql(b.city)}, ${escapeSql(b.passengers)}, ${escapeSql(b.sharingType)}, ${escapeSql(b.departureDate)}, ${escapeSql(b.totalAmount)}, ${escapeSql(b.paidAmount)}, ${escapeSql(b.paymentStatus)}, ${escapeSql(b.bookingStatus)}, ${escapeSql(b.airline)}, ${escapeSql(b.pnr)}, ${escapeSql(b.notes)})`;
}).join(',\n') + ';\n\n';

// Customers table
sql += `-- ---------------------------------------------------------------------
-- 9. Table: customers
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`customers\`;
CREATE TABLE \`customers\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`phone\` varchar(100) NOT NULL,
  \`email\` varchar(255) DEFAULT NULL,
  \`city\` varchar(100) DEFAULT 'Takht Bhai',
  \`totalBookings\` int(11) DEFAULT 1,
  \`totalSpent\` bigint(20) DEFAULT 0,
  \`cnic\` varchar(100) DEFAULT NULL,
  \`notes\` text DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`idx_phone\` (\`phone\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

sql += 'INSERT INTO `customers` (`id`, `name`, `phone`, `email`, `city`, `totalBookings`, `totalSpent`, `cnic`, `notes`) VALUES\n';
sql += customers.map(c => {
  return `(${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.phone)}, ${escapeSql(c.email)}, ${escapeSql(c.city)}, ${escapeSql(c.totalBookings)}, ${escapeSql(c.totalSpent)}, ${escapeSql(c.cnic)}, ${escapeSql(c.notes)})`;
}).join(',\n') + ';\n\n';

// Testimonials table
sql += `-- ---------------------------------------------------------------------
-- 10. Table: testimonials
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`testimonials\`;
CREATE TABLE \`testimonials\` (
  \`id\` varchar(64) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`location\` varchar(255) DEFAULT NULL,
  \`role\` varchar(100) DEFAULT NULL,
  \`rating\` int(11) DEFAULT 5,
  \`quote\` text NOT NULL,
  \`avatar\` text DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

sql += 'INSERT INTO `testimonials` (`id`, `name`, `location`, `role`, `rating`, `quote`, `avatar`) VALUES\n';
sql += testimonials.map(t => {
  return `(${escapeSql(t.id)}, ${escapeSql(t.name)}, ${escapeSql(t.location)}, ${escapeSql(t.role)}, ${escapeSql(t.rating)}, ${escapeSql(t.quote)}, ${escapeSql(t.avatar)})`;
}).join(',\n') + ';\n\n';

// FAQs table
sql += `-- ---------------------------------------------------------------------
-- 11. Table: faqs
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`faqs\`;
CREATE TABLE \`faqs\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`question\` text NOT NULL,
  \`answer\` text NOT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

sql += 'INSERT INTO `faqs` (`id`, `question`, `answer`) VALUES\n';
sql += faqs.map((f, i) => {
  return `(${i + 1}, ${escapeSql(f.question)}, ${escapeSql(f.answer)})`;
}).join(',\n') + ';\n\n';

sql += `COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- Database setup complete!
-- Import this file into phpMyAdmin on Hostinger.
-- =====================================================================
`;

fs.writeFileSync('database.sql', sql, 'utf8');
fs.writeFileSync('public/database.sql', sql, 'utf8');
console.log('Successfully generated database.sql and public/database.sql!');
console.log('SQL file size:', sql.length, 'bytes');
