================================================================================
AIRTIME INTERNATIONAL TRAVEL AGENCY - TAKHT BHAI
HOSTINGER DEPLOYMENT & MYSQL DATABASE SETUP GUIDE
================================================================================
Head Office: Malakand Road, Opposite Sajida Islam Hospital, Takht Bhai, KP
Phone / WhatsApp: +92 333 3652027 | Landline: +92 932 550123
Email: airtimetravels636@gmail.com
IATA Sabre PCC: AIRT-PK | License: IATA-SABRE-962451

Congratulations! This package contains everything you need to run your Airtime
Travel website on Hostinger with full MySQL database persistence.

--------------------------------------------------------------------------------
PACKAGE CONTENTS:
--------------------------------------------------------------------------------
1. index.html & assets/    -> Complete React Frontend (Vite production build)
2. .htaccess               -> Apache/LiteSpeed web server configuration for Hostinger
                              (handles React SPA routing without 404 errors on refresh)
3. database.sql            -> Production MySQL Database schema & initial seed data
                              (all packages, flights, group tickets, visas, bookings)
4. api/config.php          -> Database credentials file (DB name, user, password)
5. api/db.php              -> PDO MySQL connector (UTF-8 / utf8mb4 for Arabic & Urdu)
6. api/index.php           -> REST API for bookings, settings, inquiries, customers
7. api/test_db.php         -> Visual browser diagnostic tool to test your connection

================================================================================
STEP-BY-STEP HOSTINGER INSTALLATION GUIDE (Takes 5 Minutes)
================================================================================

--------------------------------------------------------------------------------
STEP 1: UPLOAD FILES TO HOSTINGER
--------------------------------------------------------------------------------
1. Log in to your Hostinger hPanel (https://hpanel.hostinger.com).
2. Go to "Websites" -> Click "Manage" next to your domain.
3. In the search bar or left menu, open "File Manager" (Files -> File Manager).
4. Navigate inside the "public_html" folder.
5. Upload this ZIP file ("airtime-travel-hostinger.zip") into "public_html".
6. Right-click the uploaded ZIP file and click "Extract". Choose "public_html".
7. Verify that you have:
   - index.html
   - .htaccess
   - assets/
   - images/
   - api/
   - database.sql

--------------------------------------------------------------------------------
STEP 2: CREATE YOUR MYSQL DATABASE ON HOSTINGER
--------------------------------------------------------------------------------
1. In Hostinger hPanel, go to "Databases" -> "MySQL Databases".
2. Under "Create a New MySQL Database And Database User":
   - MySQL Database name: enter e.g. "airtime" (Full name will be like: u123456789_airtime)
   - MySQL Username: enter e.g. "user" (Full user will be like: u123456789_user)
   - Password: Click "Generate" or create a strong password.
3. Click "Create".
4. NOTE DOWN YOUR CREDENTIALS:
   - Database Name:  (e.g., u123456789_airtime)
   - Database User:  (e.g., u123456789_user)
   - Password:       (the password you just entered)
   - Host:           localhost (Hostinger always uses 'localhost')

--------------------------------------------------------------------------------
STEP 3: IMPORT "database.sql" INTO PHPMYADMIN
--------------------------------------------------------------------------------
1. On the same "MySQL Databases" page in Hostinger hPanel, find your new database
   in the list below.
2. Click the button "Enter phpMyAdmin" next to your database.
3. Once phpMyAdmin opens, click on your database name in the left sidebar.
4. Click on the "Import" tab at the top.
5. Click "Choose File" and select "database.sql" (from your computer or public_html).
6. Leave all settings as default (Character set: UTF-8).
7. Scroll to the bottom and click "Import".
8. You will see green checkmarks: All 11 tables created and populated!
   - settings
   - admins
   - umrah_packages
   - flight_offers
   - group_tickets
   - visa_services
   - medical_services
   - bookings
   - customers
   - testimonials
   - faqs

--------------------------------------------------------------------------------
STEP 4: CONFIGURE "api/config.php"
--------------------------------------------------------------------------------
1. Return to Hostinger File Manager -> open the "api" folder inside "public_html".
2. Double-click "config.php" to edit it.
3. Update lines 16, 19, and 22 with your actual credentials:

   define('DB_HOST', 'localhost');
   define('DB_NAME', 'u123456789_airtime'); // Put your real database name
   define('DB_USER', 'u123456789_user');    // Put your real database username
   define('DB_PASS', 'YourRealPassword');   // Put your real password

4. Click "Save & Close".

--------------------------------------------------------------------------------
STEP 5: TEST YOUR DATABASE CONNECTION
--------------------------------------------------------------------------------
1. Open your web browser and navigate to:
   https://yourdomain.com/api/test_db.php
2. You will see a diagnostic screen:
   - If connected: A green "Connected - Hostinger MySQL Connected Successfully"
     banner will appear with the counts of all records.
   - If any error: It will tell you exactly what went wrong (e.g., wrong password).

--------------------------------------------------------------------------------
ADMIN LOGIN CREDENTIALS
--------------------------------------------------------------------------------
To access the Admin Management Console:
URL: https://yourdomain.com/admin
User ID (Email): airtimetravels636@gmail.com
Default Password: Murtaza##12

(Passwords are stored using secure BCRYPT hashing. You can reset your password
anytime via the "Forgot Password" option on the login screen or via Admin Settings).

================================================================================
NEED ASSISTANCE?
================================================================================
For technical support or inquiries:
Airtime International Travel Agency - Takht Bhai Head Office
WhatsApp / Helpline: +92 333 3652027
Email: airtimetravels636@gmail.com
================================================================================
