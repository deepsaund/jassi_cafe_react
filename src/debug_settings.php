<?php
require_once 'db.php';
$db = (new Database())->getConnection();
$stmt = $db->query("SELECT * FROM settings");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
