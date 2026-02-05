<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );

// Basic Router
// URI structure expected: /api/resource/id
// $uri[0] is empty, $uri[1] is 'api', $uri[2] is resource

if (!isset($uri[2])) {
    echo json_encode(["message" => "Welcome to Jassi Cafe API"]);
    exit();
}

$resource = $uri[2];
$id = isset($uri[3]) ? $uri[3] : null;

// Routing Logic
switch ($resource) {
    case 'auth':
        require_once '../../src/Controllers/AuthController.php';
        $controller = new AuthController();
        $controller->handleRequest();
        // echo json_encode(["message" => "Auth Endpoint"]);
        break;
    case 'services':
        echo json_encode(["message" => "Services Endpoint"]);
        break;
    default:
        http_response_code(404);
        echo json_encode(["error" => "Resource not found"]);
        break;
}
