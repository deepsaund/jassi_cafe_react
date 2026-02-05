<?php
require_once 'db.php';
$db = (new Database())->getConnection();
$stmt = $db->query("DESCRIBE order_messages");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
