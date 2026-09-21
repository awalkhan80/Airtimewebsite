<?php
/**
 * Airtime International Travel Agency - Database Diagnostic & Connection Checker
 * Open this file in your browser: https://yourdomain.com/api/test_db.php
 */

require_once __DIR__ . '/config.php';

header('Content-Type: text/html; charset=utf-8');

$isConfigured = (DB_PASS !== 'Your_Hostinger_Database_Password_Here' && DB_NAME !== 'u123456789_airtime');
$connectionError = null;
$pdo = null;
$tables = [];

if ($isConfigured) {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        // Get table counts
        $expectedTables = ['settings', 'admins', 'umrah_packages', 'flight_offers', 'group_tickets', 'visa_services', 'medical_services', 'bookings', 'customers', 'testimonials', 'faqs'];
        foreach ($expectedTables as $tbl) {
            try {
                $stmt = $pdo->query("SELECT COUNT(*) as count FROM `$tbl`");
                $tables[$tbl] = $stmt->fetch()['count'];
            } catch (Exception $e) {
                $tables[$tbl] = 'Missing (Import database.sql)';
            }
        }
    } catch (PDOException $e) {
        $connectionError = $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Airtime Hostinger Database Status</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; line-height: 1.6; }
        .card { max-width: 720px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        h1 { margin-top: 0; font-size: 24px; color: #38bdf8; display: flex; align-items: center; gap: 12px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; }
        .badge-success { background: #065f46; color: #34d399; }
        .badge-danger { background: #991b1b; color: #f87171; }
        .badge-warn { background: #854d0e; color: #fde047; }
        .config-box { background: #090d16; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 14px; margin: 20px 0; border: 1px solid #1e293b; }
        .config-item { margin: 6px 0; }
        .config-label { color: #94a3b8; }
        .config-value { color: #38bdf8; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #334155; }
        th { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        .btn { display: inline-block; padding: 10px 20px; border-radius: 8px; background: #0284c7; color: white; text-decoration: none; font-weight: bold; margin-top: 20px; }
        .btn:hover { background: #0369a1; }
        .steps { margin-top: 24px; background: #182234; padding: 20px; border-radius: 8px; }
        .steps ol { margin: 0; padding-left: 20px; }
        .steps li { margin: 8px 0; color: #cbd5e1; }
    </style>
</head>
<body>
    <div class="card">
        <h1>
            <span>✈️ Airtime Travel Agency</span>
            <span>Hostinger Database Diagnostics</span>
        </h1>
        <p style="color: #94a3b8; margin-bottom: 24px;">Takht Bhai Head Office • IATA Sabre Certified Agency System</p>

        <?php if (!$isConfigured): ?>
            <div style="background: rgba(234, 179, 8, 0.15); border: 1px solid #ca8a04; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <span class="badge badge-warn">Config Needed</span>
                <strong style="margin-left: 8px; color: #fef08a;">Database credentials not configured yet</strong>
                <p style="margin: 8px 0 0; color: #e2e8f0; font-size: 14px;">
                    Please open <code>api/config.php</code> via Hostinger File Manager and enter your MySQL database name, user, and password.
                </p>
            </div>
        <?php elseif ($connectionError): ?>
            <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #b91c1c; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <span class="badge badge-danger">Connection Failed</span>
                <strong style="margin-left: 8px; color: #fca5a5;">Could not connect to Hostinger MySQL</strong>
                <p style="margin: 8px 0 0; color: #fecaca; font-family: monospace; font-size: 13px;">
                    <?= htmlspecialchars($connectionError) ?>
                </p>
            </div>
        <?php else: ?>
            <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #059669; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <span class="badge badge-success">Connected</span>
                <strong style="margin-left: 8px; color: #6ee7b7;">Hostinger MySQL Database Connected Successfully!</strong>
                <p style="margin: 8px 0 0; color: #a7f3d0; font-size: 14px;">
                    All queries are executing against your live Hostinger MySQL instance.
                </p>
            </div>
        <?php endif; ?>

        <div class="config-box">
            <div class="config-item"><span class="config-label">Host:</span> <span class="config-value"><?= htmlspecialchars(DB_HOST) ?></span></div>
            <div class="config-item"><span class="config-label">Database Name:</span> <span class="config-value"><?= htmlspecialchars(DB_NAME) ?></span></div>
            <div class="config-item"><span class="config-label">Username:</span> <span class="config-value"><?= htmlspecialchars(DB_USER) ?></span></div>
            <div class="config-item"><span class="config-label">Password:</span> <span class="config-value"><?= DB_PASS === 'Your_Hostinger_Database_Password_Here' ? '<span style="color:#ef4444">Default Placeholder (Please Update)</span>' : '••••••••••••' ?></span></div>
        </div>

        <?php if ($pdo && count($tables) > 0): ?>
            <h3 style="color: #f1f5f9; margin-top: 24px;">Database Tables & Records</h3>
            <table>
                <thead>
                    <tr>
                        <th>Table</th>
                        <th>Status / Row Count</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($tables as $tbl => $cnt): ?>
                        <tr>
                            <td style="font-weight: 500;"><?= htmlspecialchars($tbl) ?></td>
                            <td>
                                <?php if (is_numeric($cnt)): ?>
                                    <span style="color: #38bdf8; font-weight: bold;"><?= $cnt ?> records</span>
                                <?php else: ?>
                                    <span style="color: #f87171;"><?= htmlspecialchars($cnt) ?></span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>

        <div class="steps">
            <h4 style="margin-top: 0; color: #38bdf8;">Hostinger Setup Guide (3 Steps)</h4>
            <ol>
                <li><strong>Create Database:</strong> Go to Hostinger hPanel &rarr; <em>Databases</em> &rarr; <em>MySQL Databases</em>. Create your database and username.</li>
                <li><strong>Import Schema:</strong> Click <em>Enter phpMyAdmin</em> next to your database, go to the <em>Import</em> tab, choose <code>database.sql</code> from your download, and click <em>Import</em>.</li>
                <li><strong>Update Config:</strong> Open <code>api/config.php</code> in Hostinger File Manager and set your DB_NAME, DB_USER, and DB_PASS.</li>
            </ol>
        </div>

        <div style="margin-top: 24px; text-align: center;">
            <a href="/" class="btn">&larr; Return to Website</a>
        </div>
    </div>
</body>
</html>
