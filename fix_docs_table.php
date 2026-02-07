<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=jassi_cafe', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $queries = [
        "ALTER TABLE documents ADD COLUMN type VARCHAR(255) AFTER user_id",
        "ALTER TABLE documents ADD COLUMN upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER original_name"
    ];

    foreach($queries as $q) {
        try {
            $db->exec($q);
            echo "Executed: $q\n";
        } catch (Exception $e) {
            echo "Failed: $q - " . $e->getMessage() . "\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
