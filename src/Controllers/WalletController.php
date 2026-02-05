<?php
// src/Controllers/WalletController.php

class WalletController {
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

    public function getTransactions() {
        $userId = $this->getUserId();
        if (!$userId) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            return;
        }
        $query = "SELECT * FROM wallet_transactions WHERE user_id = :uid ORDER BY created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":uid", $userId);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function addFunds() {
        $userId = $this->getUserId();
        if (!$userId) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            return;
        }
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['amount']) || $data['amount'] <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid amount"]);
            return;
        }

        $amount = (float)$data['amount'];
        $this->db->beginTransaction();

        try {
            // Update User Balance
            $updateUser = "UPDATE users SET wallet_balance = wallet_balance + :amt WHERE id = :uid";
            $stmt = $this->db->prepare($updateUser);
            $stmt->execute(['amt' => $amount, 'uid' => $userId]);

            // record transaction
            $log = "INSERT INTO wallet_transactions (user_id, amount, description) VALUES (:uid, :amt, 'Funds added via Dashboard')";
            $stmt = $this->db->prepare($log);
            $stmt->execute(['amt' => $amount, 'uid' => $userId]);

            $this->db->commit();
            echo json_encode(["message" => "Funds added successfully", "new_balance" => $this->getNewBalance($userId)]);
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(["error" => "Failed to add funds"]);
        }
    }

    private function getNewBalance($userId) {
        $stmt = $this->db->prepare("SELECT wallet_balance FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetchColumn();
    }
    public function getAdminTransactions() {
        // Admin check should be here
        $query = "SELECT t.*, u.name as user_name, u.email, u.company_name 
                  FROM wallet_transactions t 
                  JOIN users u ON t.user_id = u.id 
                  ORDER BY t.created_at DESC LIMIT 100";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}
