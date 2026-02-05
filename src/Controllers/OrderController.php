<?php
// src/Controllers/OrderController.php

class OrderController {
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

    private function isWalletEnabled() {
        $stmt = $this->db->prepare("SELECT value_text FROM settings WHERE key_name = 'wallet_system_status'");
        $stmt->execute();
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return ($res && $res['value_text'] === 'enabled');
    }

    public function create() {
        $actorId = $this->getUserId(); // The person performing the click
        if (!$actorId) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['service_id'])) {
             http_response_code(400);
             echo json_encode(["error" => "Service ID required"]);
             return;
        }

        $serviceId = $data['service_id'];
        
        // --- ADDED: Assisted Workflow logic ---
        // Check if actor is Staff/Admin and wants to apply for someone else
        $targetUserId = $actorId;
        
        $actorQuery = "SELECT role FROM users WHERE id = :aid";
        $actorStmt = $this->db->prepare($actorQuery);
        $actorStmt->execute(['aid' => $actorId]);
        $actor = $actorStmt->fetch(PDO::FETCH_ASSOC);

        if (($actor['role'] === 'admin' || $actor['role'] === 'staff') && isset($data['target_user_id'])) {
            $targetUserId = (int)$data['target_user_id'];
        }
        // ---------------------------------------

        // 1. Get Service Price and Target User Role
        $uQuery = "SELECT name, role, wallet_balance FROM users WHERE id = :uid";
        $uStmt = $this->db->prepare($uQuery);
        $uStmt->execute(['uid' => $targetUserId]);
        $targetUser = $uStmt->fetch(PDO::FETCH_ASSOC);

        if (!$targetUser) {
            http_response_code(404);
            echo json_encode(["error" => "Target customer not found"]);
            return;
        }

        $sQuery = "SELECT name, price_normal, price_b2b FROM services WHERE id = :sid";
        $sStmt = $this->db->prepare($sQuery);
        $sStmt->execute(['sid' => $serviceId]);
        $service = $sStmt->fetch(PDO::FETCH_ASSOC);

        $price = ($targetUser['role'] === 'b2b') ? $service['price_b2b'] : $service['price_normal'];
        $walletActive = $this->isWalletEnabled();

        // 2. Check Balance (ONLY if wallet is enabled)
        if ($walletActive && $targetUser['wallet_balance'] < $price) {
            http_response_code(402); // Payment Required
            $name = $targetUserId === $actorId ? "Your" : $targetUser['name']."'s";
            echo json_encode(["error" => "Insufficient balance. $name wallet needs ₹" . ($price - $targetUser['wallet_balance']) . " more."]);
            return;
        }

            $formData = isset($data['form_data']) ? $data['form_data'] : null;
            $documentIds = isset($data['document_ids']) ? json_encode($data['document_ids']) : null;
            
            $this->db->beginTransaction();
            try {
                if ($walletActive) {
                    // 3. Deduct Balance from Target User
                    $deduct = "UPDATE users SET wallet_balance = wallet_balance - :price WHERE id = :uid";
                    $this->db->prepare($deduct)->execute(['price' => $price, 'uid' => $targetUserId]);

                    // 4. Record Transaction for Target User
                    $trans = "INSERT INTO wallet_transactions (user_id, amount, description) VALUES (:uid, :amt, :desc)";
                    $this->db->prepare($trans)->execute([
                        'uid' => $targetUserId,
                        'amt' => -$price,
                        'desc' => "Payment for Order (Service: {$service['name']})" . ($actorId !== $targetUserId ? " - Assisted by Staff" : "")
                    ]);
                }

                // 5. Create Order for Target User
                $payStatus = $walletActive ? 'paid' : 'pending_payment';
                $query = "INSERT INTO orders (user_id, service_id, form_data, document_ids, status, payment_status) VALUES (:uid, :sid, :fdata, :dids, 'received', :pstat)";
                $stmt = $this->db->prepare($query);
                $stmt->execute([
                    'uid' => $targetUserId, 
                    'sid' => $serviceId, 
                    'fdata' => $formData, 
                    'dids' => $documentIds,
                    'pstat' => $payStatus
                ]);
            $orderId = $this->db->lastInsertId();
            
            // 6. Log creation with Actor Reference
            $logDetails = ($actorId !== $targetUserId) 
                ? "Staff (ID #$actorId) applied on behalf of Customer (ID #$targetUserId)" 
                : "Customer applied via portal";

            $logQuery = "INSERT INTO order_logs (order_id, action, actor_id, details) VALUES (:oid, 'Order Created', :aid, :details)";
            $this->db->prepare($logQuery)->execute([
                'oid' => $orderId, 
                'aid' => $actorId, 
                'details' => $logDetails
            ]);

            $this->db->commit();
            echo json_encode(["message" => "Order created and paid", "order_id" => $orderId]);
        } catch (Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(["error" => "Order creation failed: " . $e->getMessage()]);
        }
    }

    public function getUserOrders() {
        $userId = $this->getUserId();
        $query = "SELECT o.*, s.name as service_name FROM orders o JOIN services s ON o.service_id = s.id WHERE o.user_id = :uid ORDER BY o.created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":uid", $userId);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($orders);
    }

    public function getPool() {
        $staffId = $this->getUserId();
        
        $query = "SELECT o.*, s.name as service_name, u.name as customer_name, u.phone as customer_phone 
                  FROM orders o 
                  JOIN services s ON o.service_id = s.id 
                  JOIN users u ON o.user_id = u.id
                  WHERE o.assigned_staff_id IS NULL OR o.assigned_staff_id = :sid 
                  ORDER BY o.created_at ASC";
                  
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":sid", $staffId);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($orders);
    }

    public function updateStatus() {
        $staffId = $this->getUserId();
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['order_id']) || !isset($data['action'])) {
             http_response_code(400);
             echo json_encode(["error" => "Order ID and Action required"]);
             return;
        }

        $orderId = $data['order_id'];
        $action = $data['action']; // 'claim', 'approve', 'reject', 'complete'
        
        // State Machine Logic could go here
        $query = "";
        $logAction = "";
        
        if ($action === 'claim') {
            $query = "UPDATE orders SET assigned_staff_id = :sid, status = 'processing' WHERE id = :oid AND assigned_staff_id IS NULL";
            $logAction = "Staff Claimed";
        } elseif ($action === 'approve_doc') {
             // Logic for Doc verification would be improved in real app
             // For now just logging
             echo json_encode(["message" => "Document approved"]);
             return;
        } elseif ($action === 'reject') {
             $reason = $data['reason'] ?? 'Document Rejected';
             $query = "UPDATE orders SET status = 'action_required', rejection_reason = :reason WHERE id = :oid AND assigned_staff_id = :sid";
             $logAction = "Order/Doc Rejected: " . $reason;
        } elseif ($action === 'complete') {
             $outDocs = isset($data['output_docs']) ? json_encode($data['output_docs']) : null;
             if ($outDocs) {
                 $query = "UPDATE orders SET status = 'completed', output_document_ids = :outdocs WHERE id = :oid AND assigned_staff_id = :sid";
             } else {
                 $query = "UPDATE orders SET status = 'completed' WHERE id = :oid AND assigned_staff_id = :sid";
             }
             $logAction = "Order Completed";
        } else {
             http_response_code(400);
             echo json_encode(["error" => "Invalid action"]);
             return;
        }

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":oid", $orderId);
        $stmt->bindParam(":sid", $staffId);
        if ($action === 'reject') $stmt->bindParam(":reason", $reason);
        if ($action === 'complete' && isset($outDocs)) $stmt->bindParam(":outdocs", $outDocs);
        
        if ($stmt->execute()) {
             if ($stmt->rowCount() > 0) {
                 // Log it
                 $this->db->prepare("INSERT INTO order_logs (order_id, action, actor_id) VALUES (?, ?, ?)")
                          ->execute([$orderId, $logAction, $staffId]);
                          
                 echo json_encode(["message" => "Success"]);
             } else {
                 http_response_code(400);
                 echo json_encode(["error" => "Action failed or unauthorized"]);
             }
        } else {
             http_response_code(500);
             echo json_encode(["error" => "DB Error"]);
        }
    }

    public function getMessages($orderId) {
        $query = "SELECT m.*, u.name as sender_name, u.role as sender_role 
                  FROM order_messages m 
                  JOIN users u ON m.sender_id = u.id 
                  WHERE m.order_id = :oid 
                  ORDER BY m.created_at ASC";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['oid' => $orderId]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function sendMessage() {
        $userId = $this->getUserId();
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['order_id']) || !isset($data['message'])) {
             http_response_code(400);
             echo json_encode(["error" => "Order ID and message required"]);
             return;
        }

        $query = "INSERT INTO order_messages (order_id, sender_id, message) VALUES (:oid, :sid, :msg)";
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            'oid' => $data['order_id'],
            'sid' => $userId,
            'msg' => $data['message']
        ]);

        echo json_encode(["message" => "Sent"]);
    }

    public function getLogs() {
        // Admin only
        $query = "SELECT l.*, o.id as order_ref, u.name as actor_name 
                  FROM order_logs l 
                  LEFT JOIN users u ON l.actor_id = u.id 
                  LEFT JOIN orders o ON l.order_id = o.id
                  ORDER BY l.timestamp DESC LIMIT 100";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function reuploadDoc() {
        $userId = $this->getUserId();
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['order_id']) || !isset($data['document_id']) || !isset($data['doc_type'])) {
             http_response_code(400);
             echo json_encode(["error" => "Missing required fields"]);
             return;
        }

        $orderId = $data['order_id'];
        $newDocId = $data['document_id'];
        $docType = $data['doc_type'];

        // 1. Verify Ownership and Status
        $query = "SELECT * FROM orders WHERE id = :oid AND user_id = :uid";
        $stmt = $this->db->prepare($query);
        $stmt->execute(['oid' => $orderId, 'uid' => $userId]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$order) {
            http_response_code(404);
            echo json_encode(["error" => "Order not found"]);
            return;
        }

        if ($order['status'] !== 'action_required') {
            http_response_code(400);
            echo json_encode(["error" => "Order does not require action"]);
            return;
        }

        // 2. Update Document JSON
        $currentDocs = $order['document_ids'] ? json_decode($order['document_ids'], true) : [];
        $currentDocs[$docType] = $newDocId;
        $newDocsJson = json_encode($currentDocs);

        // 3. Update Order Status
        $updateQuery = "UPDATE orders SET document_ids = :docs, status = 'processing', rejection_reason = NULL WHERE id = :oid";
        $uStmt = $this->db->prepare($updateQuery);
        
        if ($uStmt->execute(['docs' => $newDocsJson, 'oid' => $orderId])) {
            // 4. Log
            $logQuery = "INSERT INTO order_logs (order_id, action, actor_id, details) VALUES (:oid, 'Document Re-uploaded', :aid, :det)";
            $this->db->prepare($logQuery)->execute([
                'oid' => $orderId,
                'aid' => $userId,
                'det' => "Customer re-uploaded document: $docType"
            ]);

            echo json_encode(["message" => "Document updated, order sent back for review"]);
    }
    }

    public function getAnalytics() {
        // Admin only check should be here
        $userId = $this->getUserId();
        // Check if admin ...

        // 1. Revenue This Week
        $revenueQuery = "SELECT SUM(amount) as total FROM wallet_transactions WHERE amount < 0 AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        $revStmt = $this->db->prepare($revenueQuery);
        $revStmt->execute();
        $revenue = abs($revStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

        // 2. Fastest Staff (Avg time from claim -> complete)
        // complex query simplified for demo: Count completed orders by staff
        $staffQuery = "SELECT u.name, COUNT(o.id) as count 
                       FROM orders o 
                       JOIN users u ON o.assigned_staff_id = u.id 
                       WHERE o.status = 'completed' AND o.assigned_staff_id IS NOT NULL 
                       GROUP BY o.assigned_staff_id 
                       ORDER BY count DESC LIMIT 5";
        $staffStmt = $this->db->prepare($staffQuery);
        $staffStmt->execute();
        $topStaff = $staffStmt->fetchAll(PDO::FETCH_ASSOC);

        // 3. Most Popular Services
        $serviceQuery = "SELECT s.name, COUNT(o.id) as count 
                         FROM orders o 
                         JOIN services s ON o.service_id = s.id 
                         GROUP BY o.service_id 
                         ORDER BY count DESC LIMIT 5";
        $svcStmt = $this->db->prepare($serviceQuery);
        $svcStmt->execute();
        $topServices = $svcStmt->fetchAll(PDO::FETCH_ASSOC);

        // 4. Daily Orders (Last 7 Days)
        $dailyQuery = "SELECT DATE(created_at) as date, COUNT(*) as count 
                       FROM orders 
                       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
                       GROUP BY DATE(created_at) 
                       ORDER BY date ASC";
        $dayStmt = $this->db->prepare($dailyQuery);
        $dayStmt->execute();
        $dailyOrders = $dayStmt->fetchAll(PDO::FETCH_ASSOC);

        // 5. Recent Activity (Neural Feed)
        $logQuery = "SELECT l.action, l.timestamp, u.name as actor_name 
                    FROM order_logs l 
                    LEFT JOIN users u ON l.actor_id = u.id 
                    ORDER BY l.timestamp DESC LIMIT 10";
        $logStmt = $this->db->prepare($logQuery);
        $logStmt->execute();
        $recentActivity = $logStmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "revenue_week" => $revenue,
            "top_staff" => $topStaff,
            "top_services" => $topServices,
            "daily_orders" => $dailyOrders,
            "recent_activity" => $recentActivity
        ]);
    }
}
