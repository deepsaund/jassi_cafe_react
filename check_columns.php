<?php
$db = new PDO('mysql:host=localhost;dbname=jassi_cafe', 'root', '');
$stmt = $db->query('DESCRIBE orders');
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach($results as $r) {
    echo $r['Field'] . "\n";
}
