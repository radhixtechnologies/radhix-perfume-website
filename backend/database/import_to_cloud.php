<?php
echo "=====================================================\n";
echo "  BOSS N BUZZ - Aiven Cloud MySQL Database Importer\n";
echo "=====================================================\n\n";

$host = 'mysql-17006a2e-shivamkashyap0699-6157.j.aivencloud.com';
$port = 20876;
$user = 'avnadmin';
$dbname = 'defaultdb';

if (isset($argv[1]) && !empty($argv[1])) {
    $pass = $argv[1];
} else {
    echo "Enter Aiven Password: ";
    $pass = trim(fgets(STDIN));
}

if (empty($pass)) {
    echo "Error: Password cannot be empty!\n";
    exit(1);
}

echo "\nConnecting to Aiven Cloud MySQL ({$host}:{$port})...\n";

try {
    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
    ];
    
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo ">> Successfully connected to Aiven Cloud Database!\n\n";
    
    $sqlFile = __DIR__ . '/bossnbuzz_export.sql';
    if (!file_exists($sqlFile)) {
        echo "Error: {$sqlFile} not found!\n";
        exit(1);
    }
    
    echo ">> Reading SQL export file (" . round(filesize($sqlFile) / 1024, 2) . " KB)...\n";
    $sql = file_get_contents($sqlFile);
    
    echo ">> Importing tables, products, orders and brand settings...\n";
    $pdo->exec($sql);
    
    echo "\n=====================================================\n";
    echo " SUCCESS: All tables & data successfully uploaded to Aiven!\n";
    echo "=====================================================\n";
    
} catch (PDOException $e) {
    echo "\nConnection / Import Failed:\n" . $e->getMessage() . "\n";
    exit(1);
}
