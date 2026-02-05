<?php
// src/Controllers/AuthController.php

class AuthController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!isset($data->phone) || !isset($data->password)) {
            http_response_code(400);
            echo json_encode(["error" => "Phone and password required"]);
            return;
        }

        $query = "SELECT * FROM users WHERE phone = :phone LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":phone", $data->phone);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && user_verify_password($data->password, $user['password'])) {
            // In a real app, generate a JWT token here
            unset($user['password']); // Don't send password back
            echo json_encode([
                "message" => "Login successful",
                "user" => $user,
                "token" => "mock_token_" . $user['id'] // Mock token for now
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid credentials"]);
        }
    }

    public function register() {
         $data = json_decode(file_get_contents("php://input"));

         // Basic validation
         if (!isset($data->phone) || !isset($data->password) || !isset($data->name)) {
            http_response_code(400);
            echo json_encode(["error" => "Name, Phone and Password required"]);
            return;
         }

         // Check if user exists
         $checkQuery = "SELECT id FROM users WHERE phone = :phone";
         $stmt = $this->db->prepare($checkQuery);
         $stmt->bindParam(":phone", $data->phone);
         $stmt->execute();
         if($stmt->rowCount() > 0){
             http_response_code(409);
             echo json_encode(["error" => "User already exists"]);
             return;
         }

         // Hash password (simple placeholder hash for now, should use password_hash in prod)
         // Note: Using password_hash is standard.
         $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);

         $query = "INSERT INTO users (name, phone, password, role, father_name, village, dob) VALUES (:name, :phone, :password, :role, :fname, :village, :dob)";
         $stmt = $this->db->prepare($query);
         $role = isset($data->role) ? $data->role : 'customer'; 
         
         $stmt->bindParam(":name", $data->name);
         $stmt->bindParam(":phone", $data->phone);
         $stmt->bindParam(":password", $hashed_password);
         $stmt->bindParam(":role", $role);
         $stmt->bindParam(":fname", $data->father_name);
         $stmt->bindParam(":village", $data->village);
         $stmt->bindParam(":dob", $data->dob);

         if($stmt->execute()) {
             http_response_code(201);
             echo json_encode([
                 "message" => "User registered successfully",
                 "id" => $this->db->lastInsertId(),
                 "user" => [
                     "id" => $this->db->lastInsertId(),
                     "name" => $data->name,
                     "phone" => $data->phone,
                     "role" => $role,
                     "father_name" => $data->father_name ?? '',
                     "dob" => $data->dob ?? '',
                     "village" => $data->village ?? ''
                 ]
             ]);
         } else {
             http_response_code(500);
             echo json_encode(["error" => "Registration failed"]);
         }
    }
}

// Helper function for password verification to match the hash used
function user_verify_password($input, $hash) {
    return password_verify($input, $hash);
}
