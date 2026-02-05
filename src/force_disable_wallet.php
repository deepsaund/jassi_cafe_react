<?php
require_once 'db.php';
$db = (new Database())->getConnection();
$db->exec("UPDATE settings SET value_text = 'disabled' WHERE key_name = 'wallet_system_status'");
echo "Success: Wallet system is now DISABLED in the database.";
?>
