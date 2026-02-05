<?php
// src/Controllers/DocumentController.php

class DocumentController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    private function getUserId() {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if (strpos($auth, 'mock_token_') === 0) {
            return (int) str_replace('mock_token_', '', $auth);
        }
        return null; 
    }

    public function getUserDocuments() {
        $userId = $this->getUserId(); 
        if (!$userId) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            return;
        }

        $query = "SELECT * FROM documents WHERE user_id = :user_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":user_id", $userId);
        $stmt->execute();
        $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($documents);
    }

    public function upload() {
        $actorId = $this->getUserId(); 
        if (!$actorId) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            return;
        }

        if (!isset($_FILES['file']) || !isset($_POST['type'])) {
            http_response_code(400);
            echo json_encode(["error" => "File and type required"]);
            return;
        }

        // Assisted Upload Logic
        $ownerId = $actorId;
        $actorQuery = "SELECT role FROM users WHERE id = :aid";
        $actorStmt = $this->db->prepare($actorQuery);
        $actorStmt->execute(['aid' => $actorId]);
        $actor = $actorStmt->fetch(PDO::FETCH_ASSOC);

        if (($actor['role'] === 'admin' || $actor['role'] === 'staff') && isset($_POST['target_user_id'])) {
            $ownerId = (int)$_POST['target_user_id'];
        }

        $type = $_POST['type'];
        $file = $_FILES['file'];
        
        // Simple file validation
        $allowed = ['jpg', 'jpeg', 'png', 'pdf'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed)) {
             http_response_code(400);
             echo json_encode(["error" => "Invalid file type"]);
             return;
        }

        // Upload dir
        $uploadDir = __DIR__ . '/../../public/uploads/';
        if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $fileName = uniqid() . "_u" . $ownerId . "." . $ext;
        $targetPath = $uploadDir . $fileName;
        $dbPath = '/uploads/' . $fileName; // Relative path for DB
 
        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $query = "INSERT INTO documents (user_id, type, file_path, original_name) VALUES (:uid, :type, :path, :name)";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":uid", $ownerId);
            $stmt->bindParam(":type", $type);
            $stmt->bindParam(":path", $dbPath);
            $stmt->bindParam(":name", $file['name']);
            
            if ($stmt->execute()) {
                // If this is a profile photo, sync to users table
                if ($type === 'profile_photo') {
                    $uStmt = $this->db->prepare("UPDATE users SET profile_image = :path WHERE id = :uid");
                    $uStmt->execute(['path' => $dbPath, 'uid' => $ownerId]);
                }
                echo json_encode(["message" => "File uploaded", "path" => $dbPath, "id" => $this->db->lastInsertId()]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Database error"]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Upload failed"]);
        }
    }

    public function getAdminUserDocuments() {
        $actorId = $this->getUserId();
        if (!$actorId) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            return;
        }

        // Check for Admin/Staff permission
        $stmt = $this->db->prepare("SELECT role FROM users WHERE id = :id");
        $stmt->execute(['id' => $actorId]);
        $actor = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$actor || ($actor['role'] !== 'admin' && $actor['role'] !== 'staff')) {
            http_response_code(403);
            echo json_encode(["error" => "Forbidden: Insufficient permissions"]);
            return;
        }

        $targetUserId = $_GET['user_id'] ?? null;
        if (!$targetUserId) {
            http_response_code(400);
            echo json_encode(["error" => "User ID required"]);
            return;
        }

        $query = "SELECT * FROM documents WHERE user_id = :user_id ORDER BY created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":user_id", $targetUserId);
        $stmt->execute();
        $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($documents);
    }

    public function getByIds() {
        $ids = $_GET['ids'] ?? '';
        if (empty($ids)) {
            echo json_encode([]);
            return;
        }

        $idArray = explode(',', $ids);
        $placeholders = str_repeat('?,', count($idArray) - 1) . '?';
        
        $query = "SELECT * FROM documents WHERE id IN ($placeholders)";
        $stmt = $this->db->prepare($query);
        $stmt->execute($idArray);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}
