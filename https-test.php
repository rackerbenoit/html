<?php
// Check if HTTPS is being used
$is_https = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') || 
            (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

// Get server information
$server_software = $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown';
$host = $_SERVER['HTTP_HOST'] ?? 'Unknown';
$protocol = $is_https ? 'HTTPS' : 'HTTP';
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

// Check security headers
$headers = [];
$all_headers = getallheaders();
$security_headers = [
    'Strict-Transport-Security',
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-XSS-Protection',
    'X-Frame-Options',
    'Referrer-Policy'
];

foreach ($security_headers as $header) {
    $headers[$header] = isset($all_headers[$header]) ? $all_headers[$header] : 'Not set';
}

// Output HTML
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTTPS Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #333;
        }
        .status {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .warning {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h1>HTTPS Test Results</h1>
    
    <div class="status <?php echo $is_https ? 'success' : 'error'; ?>">
        <strong>Connection Status:</strong> 
        <?php echo $is_https ? 'Secure (HTTPS)' : 'Not Secure (HTTP)'; ?>
    </div>
    
    <h2>Server Information</h2>
    <table>
        <tr>
            <th>Server Software</th>
            <td><?php echo htmlspecialchars($server_software); ?></td>
        </tr>
        <tr>
            <th>Host</th>
            <td><?php echo htmlspecialchars($host); ?></td>
        </tr>
        <tr>
            <th>Protocol</th>
            <td><?php echo $protocol; ?></td>
        </tr>
        <tr>
            <th>User Agent</th>
            <td><?php echo htmlspecialchars($user_agent); ?></td>
        </tr>
    </table>
    
    <h2>Security Headers</h2>
    <table>
        <?php foreach ($headers as $header => $value): ?>
        <tr>
            <th><?php echo htmlspecialchars($header); ?></th>
            <td><?php echo htmlspecialchars($value); ?></td>
        </tr>
        <?php endforeach; ?>
    </table>
    
    <h2>Recommendations</h2>
    <?php if (!$is_https): ?>
    <div class="status warning">
        <p><strong>Your site is not using HTTPS.</strong> To fix this:</p>
        <ol>
            <li>Make sure you have an SSL certificate installed on your server</li>
            <li>Configure your web server to use the SSL certificate</li>
            <li>Set up proper redirects from HTTP to HTTPS</li>
            <li>Check that the .htaccess file is properly configured</li>
        </ol>
    </div>
    <?php else: ?>
    <div class="status success">
        <p><strong>Your site is properly configured to use HTTPS!</strong></p>
    </div>
    <?php endif; ?>
    
    <p><a href="index.html">Return to homepage</a></p>
</body>
</html>