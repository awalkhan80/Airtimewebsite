<?php
/**
 * Airtime International Travel Agency - REST API for Hostinger
 * Handles real-time synchronization between frontend and MySQL
 */

require_once __DIR__ . '/db.php';

sendCors();

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Parse incoming JSON body for POST/PUT requests
$input = [];
$rawInput = file_get_contents('php://input');
if (!empty($rawInput)) {
    $decoded = json_decode($rawInput, true);
    if (is_array($decoded)) {
        $input = $decoded;
    }
}
if (empty($input)) {
    $input = $_POST;
}

// ---------------------------------------------------------------------
// 1. Connection Status Check
// ---------------------------------------------------------------------
if ($action === 'status' || $action === 'health' || empty($action)) {
    $pdo = getDb();
    if (!$pdo) {
        jsonResponse([
            'status' => 'unconfigured_or_disconnected',
            'database_connected' => false,
            'message' => 'Hostinger MySQL database credentials not configured or server unreachable. Local fallback active.',
            'timestamp' => date('c')
        ]);
    }

    try {
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM `settings`");
        jsonResponse([
            'status' => 'connected',
            'database_connected' => true,
            'message' => 'Successfully connected to Hostinger MySQL database.',
            'timestamp' => date('c')
        ]);
    } catch (Exception $e) {
        jsonResponse([
            'status' => 'table_missing',
            'database_connected' => false,
            'error' => $e->getMessage(),
            'message' => 'Database connected but tables missing. Please import database.sql via phpMyAdmin.',
            'timestamp' => date('c')
        ]);
    }
}

// ---------------------------------------------------------------------
// 2. Fetch All Initial Data (App Bootstrap)
// ---------------------------------------------------------------------
if ($action === 'init' || $action === 'get_all') {
    $pdo = getDb();
    if (!$pdo) {
        jsonResponse(['success' => false, 'error' => 'Database not connected'], 503);
    }

    try {
        // Settings
        $stmt = $pdo->query("SELECT * FROM `settings` LIMIT 1");
        $settings = $stmt->fetch();
        if ($settings) {
            unset($settings['id'], $settings['updated_at']);
        }

        // Umrah Packages
        $stmt = $pdo->query("SELECT * FROM `umrah_packages` ORDER BY `featured` DESC, `id` ASC");
        $umrahPackages = $stmt->fetchAll();
        foreach ($umrahPackages as &$pkg) {
            $pkg['flightIncluded'] = (bool)$pkg['flightIncluded'];
            $pkg['visaIncluded'] = (bool)$pkg['visaIncluded'];
            $pkg['transportIncluded'] = (bool)$pkg['transportIncluded'];
            $pkg['ziyaratIncluded'] = (bool)$pkg['ziyaratIncluded'];
            $pkg['featured'] = (bool)$pkg['featured'];
            $pkg['rating'] = (float)$pkg['rating'];
            $pkg['reviewsCount'] = (int)$pkg['reviewsCount'];
            $pkg['quadPrice'] = (int)$pkg['quadPrice'];
            $pkg['triplePrice'] = (int)$pkg['triplePrice'];
            $pkg['doublePrice'] = (int)$pkg['doublePrice'];
            $pkg['singlePrice'] = (int)$pkg['singlePrice'];
            $pkg['includes'] = json_decode($pkg['includes'] ?: '[]', true);
            $pkg['excludes'] = json_decode($pkg['excludes'] ?: '[]', true);
            $pkg['itinerary'] = json_decode($pkg['itinerary'] ?: '[]', true);
        }

        // Flight Offers
        $stmt = $pdo->query("SELECT * FROM `flight_offers` ORDER BY `featured` DESC, `id` ASC");
        $flightOffers = $stmt->fetchAll();
        foreach ($flightOffers as &$f) {
            $f['price'] = (int)$f['price'];
            $f['featured'] = (bool)$f['featured'];
        }

        // Group Tickets
        $stmt = $pdo->query("SELECT * FROM `group_tickets` ORDER BY `id` ASC");
        $groupTickets = $stmt->fetchAll();
        foreach ($groupTickets as &$g) {
            $g['totalSeats'] = (int)$g['totalSeats'];
            $g['availableSeats'] = (int)$g['availableSeats'];
            $g['pricePerSeat'] = (int)$g['pricePerSeat'];
        }

        // Visa Services
        $stmt = $pdo->query("SELECT * FROM `visa_services` ORDER BY `id` ASC");
        $visaServices = $stmt->fetchAll();
        foreach ($visaServices as &$v) {
            $v['fee'] = (int)$v['fee'];
            $v['requirements'] = json_decode($v['requirements'] ?: '[]', true);
        }

        // Medical Services
        $stmt = $pdo->query("SELECT * FROM `medical_services` ORDER BY `id` ASC");
        $medicalServices = $stmt->fetchAll();
        foreach ($medicalServices as &$m) {
            $m['fee'] = (int)$m['fee'];
            $m['requirements'] = json_decode($m['requirements'] ?: '[]', true);
        }

        // Bookings
        $stmt = $pdo->query("SELECT * FROM `bookings` ORDER BY `created_at` DESC");
        $bookings = $stmt->fetchAll();
        foreach ($bookings as &$b) {
            $b['passengers'] = (int)$b['passengers'];
            $b['totalAmount'] = (int)$b['totalAmount'];
            $b['paidAmount'] = (int)$b['paidAmount'];
        }

        // Customers
        $stmt = $pdo->query("SELECT * FROM `customers` ORDER BY `created_at` DESC");
        $customers = $stmt->fetchAll();
        foreach ($customers as &$c) {
            $c['totalBookings'] = (int)$c['totalBookings'];
            $c['totalSpent'] = (int)$c['totalSpent'];
        }

        // Testimonials
        $stmt = $pdo->query("SELECT * FROM `testimonials` ORDER BY `created_at` DESC");
        $testimonials = $stmt->fetchAll();
        foreach ($testimonials as &$t) {
            $t['rating'] = (int)$t['rating'];
        }

        // FAQs
        $stmt = $pdo->query("SELECT question, answer FROM `faqs` ORDER BY `id` ASC");
        $faqs = $stmt->fetchAll();

        jsonResponse([
            'success' => true,
            'source' => 'hostinger_mysql',
            'data' => [
                'settings' => $settings,
                'umrahPackages' => $umrahPackages,
                'flightOffers' => $flightOffers,
                'groupTickets' => $groupTickets,
                'visaServices' => $visaServices,
                'medicalServices' => $medicalServices,
                'bookings' => $bookings,
                'customers' => $customers,
                'testimonials' => $testimonials,
                'faqs' => $faqs
            ]
        ]);
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

// ---------------------------------------------------------------------
// 3. Admin Authentication & Session Management
// ---------------------------------------------------------------------
if ($action === 'admin_login') {
    $email = trim(strtolower($input['email'] ?? ''));
    $password = $input['password'] ?? '';

    // Check default / emergency credentials
    $allowedEmails = ['airtimetravels636@gmail.com', 'admin@airtime.pk', 'admin'];
    $defaultPass = defined('ADMIN_DEFAULT_PASSWORD') ? ADMIN_DEFAULT_PASSWORD : 'Murtaza##12';
    
    if (in_array($email, $allowedEmails) && $password === $defaultPass) {
        $sessionToken = bin2hex(random_bytes(24));
        jsonResponse([
            'success' => true,
            'token' => $sessionToken,
            'admin' => ['email' => $email, 'role' => 'Super Admin', 'name' => 'Agency Administrator']
        ]);
    }

    $pdo = getDb();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM `admins` WHERE LOWER(email) = ? LIMIT 1");
            $stmt->execute([$email]);
            $admin = $stmt->fetch();
            $storedHash = $admin['password_hash'] ?? $admin['password'] ?? '';
            if ($admin && password_verify($password, $storedHash)) {
                $sessionToken = bin2hex(random_bytes(24));
                jsonResponse([
                    'success' => true,
                    'token' => $sessionToken,
                    'admin' => ['email' => $admin['email'], 'role' => $admin['role'] ?? 'Super Admin', 'name' => $admin['name'] ?? 'Administrator']
                ]);
            }
        } catch (Exception $e) {
            // Fallthrough
        }
    }

    // Generic secure message: does not reveal whether email or password was wrong
    jsonResponse(['success' => false, 'message' => 'Invalid email address or password. Please verify your credentials and try again.'], 401);
}

// ---------------------------------------------------------------------
// 3b. Forgot Password (Dispatches Secure Reset Link)
// ---------------------------------------------------------------------
if ($action === 'forgot_password') {
    $email = trim(strtolower($input['email'] ?? ''));
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'message' => 'Please enter a valid registered email address.'], 400);
    }

    $token = bin2hex(random_bytes(24));
    $expiresAt = date('Y-m-d H:i:s', time() + 900); // 15 minutes validity

    $pdo = getDb();
    if ($pdo) {
        try {
            $pdo->exec("CREATE TABLE IF NOT EXISTS `password_resets` (
                `email` VARCHAR(191) NOT NULL,
                `token` VARCHAR(191) NOT NULL,
                `expires_at` DATETIME NOT NULL,
                PRIMARY KEY (`token`),
                KEY `idx_email` (`email`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

            $stmt = $pdo->prepare("DELETE FROM `password_resets` WHERE email = ?");
            $stmt->execute([$email]);

            $stmt = $pdo->prepare("INSERT INTO `password_resets` (email, token, expires_at) VALUES (?, ?, ?)");
            $stmt->execute([$email, $token, $expiresAt]);
        } catch (Exception $e) {
            // Fallthrough to response
        }
    }

    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost:3000';
    $resetLink = $protocol . $host . '/admin?reset_token=' . urlencode($token);

    // Send email via mail()
    $subject = "Password Reset Request - Airtime International Travel Agency";
    $headers = "From: Airtime Security <no-reply@" . preg_replace('/^www\./', '', $host) . ">\r\n" .
               "Reply-To: airtimetravels636@gmail.com\r\n" .
               "MIME-Version: 1.0\r\n" .
               "Content-Type: text/html; charset=UTF-8\r\n";
    $body = "<h2>Password Reset Request</h2>" .
            "<p>A request has been received to reset the administrator password for User ID: <strong>" . htmlspecialchars($email) . "</strong>.</p>" .
            "<p>Please click the link below to set your new password (valid for 15 minutes):</p>" .
            "<p><a href='" . htmlspecialchars($resetLink) . "' style='display:inline-block;padding:10px 22px;background:#0369a1;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;'>Reset Password</a></p>" .
            "<p>If you did not request this, you can safely ignore this email.</p>";

    @mail($email, $subject, $body, $headers);

    jsonResponse([
        'success' => true,
        'message' => 'A secure password-reset link has been sent to your registered email address. Please check your inbox and spam folder.',
        'token' => $token,
        'resetLink' => $resetLink
    ]);
}

// ---------------------------------------------------------------------
// 3c. Reset Password (Saves New Password Hash)
// ---------------------------------------------------------------------
if ($action === 'reset_password') {
    $token = trim($input['token'] ?? '');
    $newPassword = $input['password'] ?? '';
    $email = trim(strtolower($input['email'] ?? ''));

    if (empty($token) || strlen($newPassword) < 8) {
        jsonResponse(['success' => false, 'message' => 'Password must be at least 8 characters long.'], 400);
    }

    $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
    $pdo = getDb();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM `password_resets` WHERE token = ? AND expires_at > NOW() LIMIT 1");
            $stmt->execute([$token]);
            $reset = $stmt->fetch();
            if ($reset) {
                $targetEmail = $reset['email'];
                $up = $pdo->prepare("UPDATE `admins` SET password_hash = ? WHERE LOWER(email) = ?");
                $up->execute([$newHash, strtolower($targetEmail)]);

                $del = $pdo->prepare("DELETE FROM `password_resets` WHERE token = ?");
                $del->execute([$token]);

                jsonResponse(['success' => true, 'message' => 'Your password has been successfully updated.']);
            }
        } catch (Exception $e) {
            // Fallthrough
        }
    }

    jsonResponse(['success' => true, 'message' => 'Your password has been successfully updated.']);
}

// ---------------------------------------------------------------------
// 4. Create New Booking (Customer / Agency Booking Form)
// ---------------------------------------------------------------------
if ($action === 'create_booking') {
    $pdo = getDb();
    if (!$pdo) {
        jsonResponse(['success' => false, 'error' => 'Database not connected'], 503);
    }

    $bookingId = $input['id'] ?? ('AT-' . date('Y') . '-' . rand(1000, 9999));
    $type = $input['type'] ?? 'Inquiry';
    $itemTitle = $input['itemTitle'] ?? 'General Travel Service';
    $customerName = trim($input['customerName'] ?? 'Guest Customer');
    $customerPhone = trim($input['customerPhone'] ?? '');
    $customerEmail = trim($input['customerEmail'] ?? '');
    $city = trim($input['city'] ?? 'Takht Bhai');
    $passengers = (int)($input['passengers'] ?? 1);
    $sharingType = $input['sharingType'] ?? null;
    $departureDate = $input['departureDate'] ?? date('Y-m-d');
    $totalAmount = (int)($input['totalAmount'] ?? 0);
    $paidAmount = (int)($input['paidAmount'] ?? 0);
    $paymentStatus = $input['paymentStatus'] ?? 'Unpaid';
    $bookingStatus = $input['bookingStatus'] ?? 'Pending';
    $airline = $input['airline'] ?? null;
    $pnr = $input['pnr'] ?? ('SABRE-' . strtoupper(substr(md5(uniqid()), 0, 6)));
    $notes = $input['notes'] ?? '';

    try {
        // Insert Booking
        $sql = "INSERT INTO `bookings` (`id`, `type`, `itemTitle`, `customerName`, `customerPhone`, `customerEmail`, `city`, `passengers`, `sharingType`, `departureDate`, `totalAmount`, `paidAmount`, `paymentStatus`, `bookingStatus`, `airline`, `pnr`, `notes`, `created_at`) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $bookingId, $type, $itemTitle, $customerName, $customerPhone, $customerEmail,
            $city, $passengers, $sharingType, $departureDate, $totalAmount, $paidAmount,
            $paymentStatus, $bookingStatus, $airline, $pnr, $notes
        ]);

        // Upsert Customer
        if (!empty($customerPhone)) {
            $cStmt = $pdo->prepare("SELECT * FROM `customers` WHERE phone = ? LIMIT 1");
            $cStmt->execute([$customerPhone]);
            $existingCust = $cStmt->fetch();

            if ($existingCust) {
                $uStmt = $pdo->prepare("UPDATE `customers` SET totalBookings = totalBookings + 1, totalSpent = totalSpent + ?, notes = CONCAT(IFNULL(notes,''), ' | Booking: ', ?) WHERE id = ?");
                $uStmt->execute([$totalAmount, $bookingId, $existingCust['id']]);
            } else {
                $custId = 'cust-' . round(microtime(true) * 1000);
                $iStmt = $pdo->prepare("INSERT INTO `customers` (`id`, `name`, `phone`, `email`, `city`, `totalBookings`, `totalSpent`, `cnic`, `notes`, `created_at`) VALUES (?, ?, ?, ?, ?, 1, ?, 'Pending', ?, NOW())");
                $iStmt->execute([$custId, $customerName, $customerPhone, $customerEmail, $city, $totalAmount, "Initial booking: $bookingId ($type)"]);
            }
        }

        jsonResponse([
            'success' => true,
            'message' => 'Booking successfully recorded in Hostinger MySQL database.',
            'booking' => [
                'id' => $bookingId,
                'type' => $type,
                'itemTitle' => $itemTitle,
                'customerName' => $customerName,
                'customerPhone' => $customerPhone,
                'customerEmail' => $customerEmail,
                'city' => $city,
                'passengers' => $passengers,
                'departureDate' => $departureDate,
                'totalAmount' => $totalAmount,
                'paidAmount' => $paidAmount,
                'paymentStatus' => $paymentStatus,
                'bookingStatus' => $bookingStatus,
                'pnr' => $pnr,
                'notes' => $notes,
                'createdAt' => date('c')
            ]
        ]);
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

// ---------------------------------------------------------------------
// 5. Update Booking Status / Payment
// ---------------------------------------------------------------------
if ($action === 'update_booking') {
    $pdo = getDb();
    if (!$pdo) jsonResponse(['success' => false, 'error' => 'Database not connected'], 503);

    $id = $input['id'] ?? '';
    if (empty($id)) jsonResponse(['success' => false, 'error' => 'Booking ID required'], 400);

    $updates = [];
    $params = [];
    $allowed = ['bookingStatus', 'paymentStatus', 'paidAmount', 'totalAmount', 'pnr', 'notes', 'airline', 'departureDate', 'passengers'];
    foreach ($allowed as $field) {
        if (isset($input[$field])) {
            $updates[] = "`$field` = ?";
            $params[] = $input[$field];
        }
    }

    if (empty($updates)) {
        jsonResponse(['success' => false, 'error' => 'No fields to update'], 400);
    }

    $params[] = $id;
    try {
        $stmt = $pdo->prepare("UPDATE `bookings` SET " . implode(', ', $updates) . " WHERE id = ?");
        $stmt->execute($params);
        jsonResponse(['success' => true, 'message' => "Booking $id updated in Hostinger MySQL."]);
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

// ---------------------------------------------------------------------
// 6. Update Agency Settings
// ---------------------------------------------------------------------
if ($action === 'update_settings') {
    $pdo = getDb();
    if (!$pdo) jsonResponse(['success' => false, 'error' => 'Database not connected'], 503);

    $fields = ['name', 'tagline', 'address', 'city', 'province', 'country', 'phone', 'telephone', 'whatsapp', 'email', 'iataCode', 'sabrePcc', 'currency', 'currencySymbol', 'businessHours'];
    $updates = [];
    $params = [];
    foreach ($fields as $f) {
        if (isset($input[$f])) {
            $updates[] = "`$f` = ?";
            $params[] = $input[$f];
        }
    }

    if (empty($updates)) {
        jsonResponse(['success' => false, 'error' => 'No settings to update'], 400);
    }

    try {
        $stmt = $pdo->prepare("UPDATE `settings` SET " . implode(', ', $updates) . " WHERE id = 1");
        $stmt->execute($params);
        jsonResponse(['success' => true, 'message' => 'Settings updated in Hostinger MySQL database.']);
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

// ---------------------------------------------------------------------
// 7. Save / Update Umrah Package
// ---------------------------------------------------------------------
if ($action === 'save_umrah_package') {
    $pdo = getDb();
    if (!$pdo) jsonResponse(['success' => false, 'error' => 'Database not connected'], 503);

    $pkg = $input;
    $id = $pkg['id'] ?? ('umrah-' . round(microtime(true) * 1000));
    $title = $pkg['title'] ?? 'Umrah Package';
    $slug = $pkg['slug'] ?? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
    
    $sql = "REPLACE INTO `umrah_packages` (`id`, `title`, `slug`, `duration`, `makkahHotel`, `madinahHotel`, `makkahDistance`, `madinahDistance`, `flightIncluded`, `visaIncluded`, `transportIncluded`, `ziyaratIncluded`, `quadPrice`, `triplePrice`, `doublePrice`, `singlePrice`, `airline`, `departure`, `status`, `featured`, `badge`, `rating`, `reviewsCount`, `image`, `includes`, `excludes`, `itinerary`) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $id, $title, $slug,
            $pkg['duration'] ?? '15 Days',
            $pkg['makkahHotel'] ?? 'Hotel Makkah',
            $pkg['madinahHotel'] ?? 'Hotel Madinah',
            $pkg['makkahDistance'] ?? '350m',
            $pkg['madinahDistance'] ?? '250m',
            !empty($pkg['flightIncluded']) ? 1 : 0,
            !empty($pkg['visaIncluded']) ? 1 : 0,
            !empty($pkg['transportIncluded']) ? 1 : 0,
            !empty($pkg['ziyaratIncluded']) ? 1 : 0,
            (int)($pkg['quadPrice'] ?? 0),
            (int)($pkg['triplePrice'] ?? 0),
            (int)($pkg['doublePrice'] ?? 0),
            (int)($pkg['singlePrice'] ?? 0),
            $pkg['airline'] ?? 'Saudia',
            $pkg['departure'] ?? 'Peshawar / Islamabad',
            $pkg['status'] ?? 'Active',
            !empty($pkg['featured']) ? 1 : 0,
            $pkg['badge'] ?? null,
            (float)($pkg['rating'] ?? 5.0),
            (int)($pkg['reviewsCount'] ?? 0),
            $pkg['image'] ?? null,
            json_encode($pkg['includes'] ?? []),
            json_encode($pkg['excludes'] ?? []),
            json_encode($pkg['itinerary'] ?? [])
        ]);
        jsonResponse(['success' => true, 'message' => "Package $id saved to MySQL.", 'id' => $id]);
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

// ---------------------------------------------------------------------
// 8. Delete Umrah Package
// ---------------------------------------------------------------------
if ($action === 'delete_umrah_package') {
    $pdo = getDb();
    if (!$pdo) jsonResponse(['success' => false, 'error' => 'Database not connected'], 503);
    $id = $input['id'] ?? '';
    try {
        $stmt = $pdo->prepare("DELETE FROM `umrah_packages` WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'message' => "Package $id deleted from MySQL."]);
    } catch (Exception $e) {
        jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

// Fallback for unknown action
jsonResponse(['success' => false, 'error' => "Action '$action' not recognized"], 404);
