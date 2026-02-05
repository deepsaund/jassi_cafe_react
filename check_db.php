<?php
require_once 'src/db.php';
$db = (new Database())->getConnection();
$stmt = $db->query("SELECT id, name, profile_image FROM users");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
