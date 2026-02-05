<?php
// src/Controllers/ServiceController.php

class ServiceController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function index() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
            return;
        }

        try {
            $query = "SELECT * FROM services WHERE is_active = TRUE";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: application/json');
            echo json_encode($services);
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(["error" => "Database error", "message" => $e->getMessage()]);
        }
    }

    public function create() {
        // Admin only check here
        $data = json_decode(file_get_contents("php://input"), true);
        
        $query = "INSERT INTO services (name, description, price_normal, price_b2b, documents_required_json, form_schema) 
                  VALUES (:name, :desc, :pn, :pb, :docs, :form)";
        $stmt = $this->db->prepare($query);
        
        $params = [
            ':name' => $data['name'],
            ':desc' => $data['description'],
            ':pn' => $data['price_normal'],
            ':pb' => $data['price_b2b'],
            ':docs' => isset($data['documents_required_json']) ? json_encode($data['documents_required_json']) : '[]',
            ':form' => isset($data['form_schema']) ? json_encode($data['form_schema']) : '[]'
        ];

        if ($stmt->execute($params)) {
            echo json_encode(["message" => "Service Created", "id" => $this->db->lastInsertId()]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create service"]);
        }
    }
}
