<?php
// src/fix_schema.php
require_once 'db.php';

$db = (new Database())->getConnection();

try {
    // Check if payment_status exists in orders
    $db->exec("ALTER TABLE orders ADD COLUMN payment_status VARCHAR(20) DEFAULT 'unpaid'");
    echo "Column 'payment_status' added to 'orders' table.\n";
} catch (Exception $e) {
    echo "Notice: " . $e->getMessage() . " (Column might already exist)\n";
}

try {
    // Check if wallet_balance exists in users
    $db->exec("ALTER TABLE users ADD COLUMN wallet_balance DECIMAL(10,2) DEFAULT 0.00");
    echo "Column 'wallet_balance' added to 'users' table.\n";
} catch (Exception $e) {
    echo "Notice: " . $e->getMessage() . "\n";
}

try {
    // Check if dob exists in users
    $db->exec("ALTER TABLE users ADD COLUMN dob DATE NULL");
    echo "Column 'dob' added to 'users' table.\n";
} catch (Exception $e) {
    echo "Notice: " . $e->getMessage() . "\n";
}

try {
    // Check if document_ids exists in orders
    $db->exec("ALTER TABLE orders ADD COLUMN document_ids LONGTEXT NULL");
    echo "Column 'document_ids' added to 'orders' table.\n";
} catch (Exception $e) {
    echo "Notice: " . $e->getMessage() . " (Column might already exist)\n";
}
?>
