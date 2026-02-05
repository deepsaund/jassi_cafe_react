<?php
namespace Config;

class Database {
    private $host = "localhost";
    private $db_name = "jc_db";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new \PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
        } catch(\PDOException $exception) {
            // In a real app, log this error instead of echoing
            error_log("Connection error: " . $exception->getMessage());
            die(json_encode(["error" => "Database connection failed"]));
        }

        return $this->conn;
    }
}
