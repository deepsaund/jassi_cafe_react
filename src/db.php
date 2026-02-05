<?php
// src/db.php

class Database {
    private $host = 'localhost';
    private $db_name = 'jc_db';
    private $username = 'root';
    private $password = '';
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            // Log error to file instead of echoing (prevents HTML in JSON responses)
            error_log("Database Connection Error: " . $exception->getMessage());
            // Return null so controllers can handle the error
            return null;
        }
        return $this->conn;
    }
}
