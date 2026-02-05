<?php
// src/Controllers/UserController.php

class UserController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    private function getUserId() {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if (preg_match('/mock_token_(\d+)/', $auth, $matches)) {
            return (int) $matches[1];
        }
        return null;
    }

    public function getSettings() {
        $stmt = $this->db->prepare("SELECT * FROM settings");
        $stmt->execute();
        $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $formatted = [];
        foreach($settings as $s) {
            $formatted[$s['key_name']] = $s['value_text'];
        }
        echo json_encode($formatted);
    }

    public function updateSettings() {
        $actorId = $this->getUserId();
        
        // Final check for Admin permission
        $aQuery = "SELECT role FROM users WHERE id = :aid";
        $aStmt = $this->db->prepare($aQuery);
        $aStmt->execute(['aid' => $actorId]);
        $actor = $aStmt->fetch(PDO::FETCH_ASSOC);

        if (!$actor || $actor['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(["error" => "Restricted Access: Administrators only."]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) return;

        foreach($data as $key => $value) {
            $stmt = $this->db->prepare("INSERT INTO settings (key_name, value_text) VALUES (:k, :v) ON DUPLICATE KEY UPDATE value_text = :v");
            $stmt->execute(['k' => $key, 'v' => $value]);
        }
        echo json_encode(["message" => "Settings updated successfully"]);
    }

    public function index() {
        // Admin only check should be here
        $search = $_GET['search'] ?? null;
        $role = $_GET['role'] ?? null;
        
        $query = "SELECT id, name, phone, father_name, dob, village, role, wallet_balance, created_at FROM users WHERE 1=1";
        $params = [];

        if ($role) {
            $query .= " AND role = :role";
            $params[':role'] = $role;
        }

        if ($search) {
            $query .= " AND (name LIKE :s OR phone LIKE :s OR father_name LIKE :s OR village LIKE :s)";
            $params[':s'] = "%$search%";
        }
        
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function create() {
        // Admin creates staff/b2b/customer
        $data = json_decode(file_get_contents("php://input"), true);
        
        $pass = password_hash($data['password'], PASSWORD_DEFAULT);
        $query = "INSERT INTO users (name, phone, password, father_name, village, role) 
                  VALUES (:name, :phone, :pass, :fname, :village, :role)";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            ':name' => $data['name'],
            ':phone' => $data['phone'],
            ':fname' => $data['father_name'] ?? null,
            ':village' => $data['village'] ?? null,
            ':pass' => $pass,
            ':role' => $data['role']
        ]);
        
        echo json_encode(["message" => "User created", "id" => $this->db->lastInsertId()]);
    }

    public function update($id) {
        // Admin updates user
        $data = json_decode(file_get_contents("php://input"), true);
        
        $query = "UPDATE users SET name = :name, phone = :phone, father_name = :fname, village = :village, role = :role";
        $params = [
            ':name' => $data['name'],
            ':phone' => $data['phone'],
            ':fname' => $data['father_name'] ?? null,
            ':village' => $data['village'] ?? null,
            ':role' => $data['role'],
            ':id' => $id
        ];

        // Only update password if provided
        if (!empty($data['password'])) {
            $query .= ", password = :pass";
            $params[':pass'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        $query .= " WHERE id = :id";
        
        $stmt = $this->db->prepare($query);
        
        if ($stmt->execute($params)) {
            echo json_encode(["message" => "User updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update user"]);
        }
    }

    public function updateProfile() {
        $userId = $this->getUserId();
        if (!$userId) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) return;

        $query = "UPDATE users SET email = :email, father_name = :fname, village = :village WHERE id = :id";
        $params = [
            ':email' => $data['email'] ?? null,
            ':fname' => $data['father_name'] ?? null,
            ':village' => $data['village'] ?? null,
            ':id' => $userId
        ];

        $stmt = $this->db->prepare($query);
        if ($stmt->execute($params)) {
            echo json_encode(["message" => "Profile updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update profile"]);
        }
    }
}
