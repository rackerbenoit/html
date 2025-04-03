<?php
// Display basic server information
echo "<h1>Server Information</h1>";
echo "<p>This page shows your server configuration.</p>";

// Check server type
$server_software = $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown';
$server_type = 'Unknown';
if (stripos($server_software, 'apache') !== false) {
    $server_type = 'Apache';
} elseif (stripos($server_software, 'nginx') !== false) {
    $server_type = 'Nginx';
} elseif (stripos($server_software, 'litespeed') !== false) {
    $server_type = 'LiteSpeed';
} elseif (stripos($server_software, 'microsoft-iis') !== false) {
    $server_type = 'Microsoft IIS';
}

echo "<h2>Server Type</h2>";
echo "<p><strong>Server Software:</strong> " . htmlspecialchars($server_software) . "</p>";
echo "<p><strong>Server Type:</strong> " . $server_type . "</p>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";

// Check if HTTPS is being used
$is_https = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ||
            (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
echo "<h2>HTTPS Status</h2>";
echo "<p><strong>Using HTTPS:</strong> " . ($is_https ? 'Yes' : 'No') . "</p>";

// Check for Apache modules if using Apache
if ($server_type == 'Apache') {
    echo "<h2>Apache Modules</h2>";
    if (function_exists('apache_get_modules')) {
        $modules = apache_get_modules();
        echo "<p><strong>mod_rewrite:</strong> " . (in_array('mod_rewrite', $modules) ? 'Enabled' : 'Disabled') . "</p>";
        echo "<p><strong>mod_ssl:</strong> " . (in_array('mod_ssl', $modules) ? 'Enabled' : 'Disabled') . "</p>";
    } else {
        echo "<p>Unable to check Apache modules (function apache_get_modules not available)</p>";
    }
}

// Link to the detailed phpinfo
echo "<h2>Detailed PHP Information</h2>";
echo "<p><a href='phpinfo.php'>View detailed PHP information</a> (if available)</p>";

// Link back to the main site
echo "<p><a href='index.html'>Return to homepage</a></p>";

// Link to the HTTPS test
echo "<p><a href='https-test.php'>Check HTTPS configuration</a></p>";
?>
