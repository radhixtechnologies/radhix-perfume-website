<?php
/**
 * BOSS N BUZZ ORIGINALS - Database Connection (PDO)
 * Automatically adapts between Localhost and Cloud MySQL (Aiven, Railway, Render, etc.)
 */
class Database {
    private static $conn = null;

    public static function getConnection() {
        if (self::$conn === null) {
            // Check for standard cloud connection URI or individual parameters
            $dbUrl = getenv('DATABASE_URL') ?: getenv('MYSQL_URL');
            
            if ($dbUrl) {
                $parsed = parse_url($dbUrl);
                $host = $parsed['host'] ?? '127.0.0.1';
                $port = $parsed['port'] ?? 3306;
                $user = $parsed['user'] ?? 'root';
                $pass = $parsed['pass'] ?? '';
                $dbname = ltrim($parsed['path'] ?? 'bossnbuzz_db', '/');
            } else {
                $host = getenv('DB_HOST') ?: '127.0.0.1';
                $port = getenv('DB_PORT') ?: 3306;
                $user = getenv('DB_USER') ?: 'root';
                $pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : (getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '');
                $dbname = getenv('DB_NAME') ?: 'bossnbuzz_db';
            }

            try {
                $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false, // Needed for cloud providers like Aiven
                ];
                self::$conn = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Database connection error: ' . $e->getMessage()
                ]);
                exit;
            }
        }
        return self::$conn;
    }
}
