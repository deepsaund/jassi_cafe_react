<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=jassi_cafe', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $queries = [
        "ALTER TABLE orders ADD COLUMN document_ids TEXT AFTER form_data",
        "ALTER TABLE orders ADD COLUMN rejected_docs TEXT AFTER document_ids",
        "ALTER TABLE orders ADD COLUMN output_document_ids TEXT AFTER rejected_docs",
        "ALTER TABLE orders ADD COLUMN internal_note TEXT AFTER output_document_ids"
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
