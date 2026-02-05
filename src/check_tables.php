<?php
require_once 'db.php';
$db = (new Database())->getConnection();

$tables = ['users', 'services', 'orders', 'wallet_transactions', 'order_logs', 'settings', 'documents'];
foreach ($tables as $t) {
    try {
        $res = $db->query("SELECT 1 FROM $t LIMIT 1");
        echo "Table '$t' EXISTS.\n";
    } catch (Exception $e) {
        echo "Table '$t' MISSING!\n";
    }
}
?>
