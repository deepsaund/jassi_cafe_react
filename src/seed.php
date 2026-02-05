<?php
// src/seed.php
require_once 'db.php';

$db = (new Database())->getConnection();

// Clear existing data (optional, be careful in prod)
// $db->exec("TRUNCATE TABLE services"); 

// 1. PAN Card Service
$panSchema = json_encode([
    ["name" => "dob", "label" => "Date of Birth", "type" => "date", "required" => true],
    ["name" => "father_name", "label" => "Father's Name", "type" => "text", "required" => true],
    ["name" => "pan_number", "label" => "Existing PAN Number (if any)", "type" => "text", "required" => false]
]);
$panDocs = json_encode(["aadhaar", "photo", "signature"]);

// 2. Aadhaar Address Update
$aadhaarSchema = json_encode([
    ["name" => "aadhaar_number", "label" => "Aadhaar Number", "type" => "text", "required" => true],
    ["name" => "new_address", "label" => "New Address", "type" => "textarea", "required" => true]
]);
$aadhaarDocs = json_encode(["proof_of_address"]);

$services = [
    [
        "name" => "New PAN Card",
        "description" => "Apply for a new Permanent Account Number (PAN) card. Requires Aadhaar.",
        "price_normal" => 200.00,
        "price_b2b" => 150.00,
        "documents_required_json" => $panDocs,
        "form_schema" => $panSchema
    ],
    [
        "name" => "Aadhaar Address Update",
        "description" => "Update your address in Aadhaar card. Requires valid address proof.",
        "price_normal" => 100.00,
        "price_b2b" => 80.00,
        "documents_required_json" => $aadhaarDocs,
        "form_schema" => $aadhaarSchema
    ]
];

$stmt = $db->prepare("INSERT INTO services (name, description, price_normal, price_b2b, documents_required_json, form_schema) VALUES (:name, :desc, :pn, :pb, :docs, :form)");

foreach ($services as $svc) {
    // Check if exists
    $check = $db->prepare("SELECT id FROM services WHERE name = :name");
    $check->execute([':name' => $svc['name']]);
    if ($check->rowCount() == 0) {
        $stmt->execute([
            ':name' => $svc['name'],
            ':desc' => $svc['description'],
            ':pn' => $svc['price_normal'],
            ':pb' => $svc['price_b2b'],
            ':docs' => $svc['documents_required_json'],
            ':form' => $svc['form_schema']
        ]);
        echo "Added service: " . $svc['name'] . "\n";
    } else {
        echo "Service already exists: " . $svc['name'] . "\n";
    }
}

// Ensure Admin User Exists
$users = [
    ['Admin User', '1234567890', 'admin123', 'admin'],
    ['Staff Member', '9876543210', 'staff123', 'staff'],
    ['Common Customer', '1122334455', 'cust123', 'customer'],
    ['B2B Partner', '5544332211', 'b2b123', 'b2b']
];

foreach ($users as $user) {
    list($name, $phone, $pass, $role) = $user;
    $check = $db->prepare("SELECT id FROM users WHERE phone = ?");
    $check->execute([$phone]);
    if ($check->rowCount() == 0) {
        $hashed = password_hash($pass, PASSWORD_DEFAULT);
        $ins = $db->prepare("INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)");
        $ins->execute([$name, $phone, $hashed, $role]);
        echo "Added user: $name ($role)\n";
    } else {
        echo "User exists: $name\n";
    }
}

