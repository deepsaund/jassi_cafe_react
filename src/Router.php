<?php
// src/Router.php

class Router {
    private $routes = [];

    public function add($method, $path, $handler) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler
        ];
    }

    public function dispatch($method, $uri) {
        // Remove query string from URI
        $uri = strtok($uri, '?');

        // Handle subdirectories (e.g., /WEBSITE/public/api/...)
        // We want to match /api/... even if the full URI is /WEBSITE/public/api/...
        $originalUri = $uri;
        
        foreach ($this->routes as $route) {
            // Check for exact match first
            if ($route['method'] === $method && $route['path'] === $uri) {
                return call_user_func($route['handler']);
            }
            
            // If no exact match, try matching the end of the URI
            // e.g. if route path is /api/login and URI is /WEBSITE/public/api/login
            if ($route['method'] === $method && 
                strlen($uri) > strlen($route['path']) && 
                substr($uri, -strlen($route['path'])) === $route['path']) {
                return call_user_func($route['handler']);
            }
        }

        // 404 Not Found
        header("HTTP/1.0 404 Not Found");
        echo json_encode(['error' => 'Route not found']);
    }
}
