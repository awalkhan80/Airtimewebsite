<?php
/**
 * Airtime International Travel Agency - Hostinger MySQL Database Configuration
 * 
 * Instructions for Hostinger:
 * 1. Log in to Hostinger hPanel (https://hpanel.hostinger.com)
 * 2. Go to "Databases" -> "MySQL Databases"
 * 3. Create a new Database & User (e.g., u123456789_airtime, u123456789_admin)
 * 4. Enter the exact details below:
 */

// Hostinger MySQL Host (Default is localhost)
define('DB_HOST', 'localhost');

// Your Hostinger Database Name (e.g. u123456789_airtime)
define('DB_NAME', 'u123456789_airtime');

// Your Hostinger Database Username (e.g. u123456789_airtime_user)
define('DB_USER', 'u123456789_user');

// Your Hostinger Database Password
define('DB_PASS', 'Your_Hostinger_Database_Password_Here');

// Database Character Set (utf8mb4 supports Urdu, Arabic & English)
define('DB_CHARSET', 'utf8mb4');

// Default Admin Credentials for Dashboard
define('ADMIN_EMAIL', 'airtimetravels636@gmail.com');
define('ADMIN_DEFAULT_PASSWORD', 'Murtaza##12');
