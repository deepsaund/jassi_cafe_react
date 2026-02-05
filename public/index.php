<?php
// index.php

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../src/db.php';
require_once '../src/Router.php';

// Autoload Controllers
spl_autoload_register(function ($class_name) {
    if (file_exists('../src/Controllers/' . $class_name . '.php')) {
        require_once '../src/Controllers/' . $class_name . '.php';
    }
});

$router = new Router();
$db = (new Database())->getConnection();

// Check if database connection is successful
if ($db === null) {
    http_response_code(503);
    header('Content-Type: application/json');
    echo json_encode([
        "error" => "Database connection failed",
        "message" => "Unable to connect to database. Please check your database configuration."
    ]);
    exit();
}

// define routes
$router->add('POST', '/api/auth/login', function() use ($db) {
    $controller = new AuthController($db);
    $controller->login();
});

$router->add('POST', '/api/auth/register', function() use ($db) {
    $controller = new AuthController($db);
    $controller->register();
});

$router->add('POST', '/api/auth/profile', function() use ($db) {
    $controller = new UserController($db);
    $controller->updateProfile();
});

$router->add('GET', '/api/services', function() use ($db) {
    $controller = new ServiceController($db);
    $controller->index();
});

$router->add('GET', '/api/documents', function() use ($db) {
    $controller = new DocumentController($db);
    $controller->getUserDocuments();
});

$router->add('GET', '/api/documents/batch', function() use ($db) {
    $controller = new DocumentController($db);
    $controller->getByIds();
});

$router->add('GET', '/api/admin/documents', function() use ($db) {
    $controller = new DocumentController($db);
    $controller->getAdminUserDocuments();
});

$router->add('POST', '/api/documents/upload', function() use ($db) {
    $controller = new DocumentController($db);
    $controller->upload();
});

$router->add('POST', '/api/orders', function() use ($db) {
    $controller = new OrderController($db);
    $controller->create();
});

$router->add('GET', '/api/orders', function() use ($db) {
    $controller = new OrderController($db);
    $controller->getUserOrders();
});

$router->add('GET', '/api/staff/orders', function() use ($db) {
    $controller = new OrderController($db);
    $controller->getPool();
});

$router->add('POST', '/api/staff/orders/update', function() use ($db) {
    $controller = new OrderController($db);
    $controller->updateStatus();
});

$router->add('GET', '/api/admin/users', function() use ($db) {
    $controller = new UserController($db);
    $controller->index();
});

$router->add('POST', '/api/admin/users', function() use ($db) {
    $controller = new UserController($db);
    $controller->create();
});

$router->add('PUT', '/api/admin/users/(\d+)', function($matches) use ($db) {
    $controller = new UserController($db);
    $controller->update($matches[1]);
});

$router->add('POST', '/api/admin/services', function() use ($db) {
    $controller = new ServiceController($db);
    $controller->create();
});

$router->add('GET', '/api/wallet/transactions', function() use ($db) {
    $controller = new WalletController($db);
    $controller->getTransactions();
});

$router->add('POST', '/api/wallet/add-funds', function() use ($db) {
    $controller = new WalletController($db);
    $controller->addFunds();
});

$router->add('GET', '/api/admin/wallet/transactions', function() use ($db) {
    $controller = new WalletController($db);
    $controller->getAdminTransactions();
});

$router->add('GET', '/api/admin/logs', function() use ($db) {
    $controller = new OrderController($db);
    $controller->getLogs();
});

$router->add('GET', '/api/orders/messages', function() use ($db) {
    if (!isset($_GET['order_id'])) {
        echo json_encode([]);
        return;
    }
    $controller = new OrderController($db);
    $controller->getMessages($_GET['order_id']);
});

$router->add('POST', '/api/orders/messages', function() use ($db) {
    $controller = new OrderController($db);
    $controller->sendMessage();
});

$router->add('GET', '/api/admin/settings', function() use ($db) {
    $controller = new UserController($db);
    $controller->getSettings();
});

$router->add('POST', '/api/admin/settings', function() use ($db) {
    $controller = new UserController($db);
    $controller->updateSettings();
});

$router->add('POST', '/api/orders/reupload', function() use ($db) {
    $controller = new OrderController($db);
    $controller->reuploadDoc();
});

$router->add('GET', '/api/admin/analytics', function() use ($db) {
    $controller = new OrderController($db);
    $controller->getAnalytics();
});

// Dispatch
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
