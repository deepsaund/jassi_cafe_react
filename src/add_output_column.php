<?php
require_once __DIR__ . '/Config/Database.php';

use Config\Database;

$database = new Database();
$db = $database->getConnection();

try {
    $sql = "ALTER TABLE orders ADD COLUMN output_document_ids TEXT DEFAULT NULL";
    $db->exec($sql);
    echo "Column 'output_document_ids' added successfully.";
} catch (PDOException $e) {
    echo "Error (might already exist): " . $e->getMessage();
}
?>
