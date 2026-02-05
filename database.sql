CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    father_name VARCHAR(255),
    village VARCHAR(255),
    pincode VARCHAR(10),
    role ENUM('customer', 'staff', 'admin', 'b2b') DEFAULT 'customer',
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_normal DECIMAL(10, 2) NOT NULL,
    price_b2b DECIMAL(10, 2) NOT NULL,
    documents_required_json JSON, -- e.g. ["aadhaar", "pan", "photo"]
    form_schema JSON, -- e.g. [{"label": "DOB", "type": "date"}, {"label": "Mother Name", "type": "text"}]
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL, -- aadhaar, pan, etc.
    file_path VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    assigned_staff_id INT,
    form_data JSON, -- Stores the values filled in the dynamic form
    status ENUM('received', 'processing', 'action_required', 'completed', 'cancelled') DEFAULT 'received',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    rejection_reason TEXT, -- Start 'processing' -> 'action_required' if rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (assigned_staff_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    action VARCHAR(255) NOT NULL, -- e.g. "Order Created", "Staff Claimed", "Doc Rejected"
    actor_id INT, -- Who performed the action
    details TEXT, -- Extra info if needed
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    sender_id INT NOT NULL, -- Customer or Staff/Admin
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL, -- Positive for credit, Negative for debit
    description VARCHAR(255), -- e.g. "Order #123 Payment", "Wallet Top-up"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS b2b_pricing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    b2b_user_id INT NOT NULL,
    custom_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (b2b_user_id) REFERENCES users(id)
);
