<?php
// src/create_settings.php
require_once 'db.php';

$db = (new Database())->getConnection();

try {
    $db->exec("CREATE TABLE IF NOT EXISTS settings (
        key_name VARCHAR(50) PRIMARY KEY,
        value_text TEXT
    )");
    
    $stmt = $db->prepare("INSERT IGNORE INTO settings (key_name, value_text) VALUES ('wallet_system_status', 'enabled')");
    $stmt->execute();
    
    echo "Settings table created and initialized.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
