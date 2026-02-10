
-- Expos table
CREATE TABLE IF NOT EXISTS expos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status ENUM('active', 'upcoming', 'completed') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Expo dates table (for multiple dates)
CREATE TABLE IF NOT EXISTS expo_dates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    expo_id INT NOT NULL,
    event_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expo_id) REFERENCES expos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_expo_date (expo_id, event_date)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(255) NOT NULL,
    size VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Entry types table
CREATE TABLE IF NOT EXISTS entry_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- WhatsApp messages table
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO expos (name, location, status) VALUES
('Tech Expo 2024', 'Convention Center', 'active'),
('Trade Fair 2024', 'Exhibition Hall', 'upcoming'),
('Innovation Summit', 'Tech Park', 'active');

INSERT INTO expo_dates (expo_id, event_date) VALUES
(1, '2024-03-15'),
(1, '2024-03-16'),
(1, '2024-03-17'),
(2, '2024-04-10'),
(2, '2024-04-11'),
(3, '2024-05-20');

INSERT INTO products (category, size, status) VALUES
('Electronics', 'Medium', 'active'),
('Machinery', 'Large', 'active');

INSERT INTO entry_types (name) VALUES
('Product Inquiry'),
('Price Quote'),
('Technical Support');

INSERT INTO whatsapp_messages (title, message) VALUES
('Welcome Message', 'Hello! 👋\n\nThank you for visiting our booth at the expo.');


-- current expo:
-- Add to your database
CREATE TABLE IF NOT EXISTS app_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default current expo setting
INSERT INTO app_settings (setting_key, setting_value) 
VALUES ('current_expo_id', '1')
ON DUPLICATE KEY UPDATE setting_value = setting_value;


-- customer registration :
CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    expo_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    company_name VARCHAR(255),
    customer_type VARCHAR(100),
    email VARCHAR(255),
    whatsapp_number VARCHAR(20),
    alternate_number VARCHAR(20),
    address TEXT,
    product_id INT,  -- References products table directly
    type_of_enquiry_id INT,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    reference_by VARCHAR(255),
    remarks TEXT,
    next_followup_date DATE,
    employee_id INT,
    employee_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (expo_id) REFERENCES expos(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (type_of_enquiry_id) REFERENCES entry_types(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer attachments table
CREATE TABLE IF NOT EXISTS customer_attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- employee management
CREATE TABLE IF NOT EXISTS employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    role ENUM('Admin', 'Employee') DEFAULT 'Employee',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_department (department),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Departments table (optional - for dynamic departments)
CREATE TABLE IF NOT EXISTS departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default departments
INSERT INTO departments (name, status) VALUES
('Sales', 'active'),
('Marketing', 'active'),
('Production', 'active'),
('HR', 'active'),
('IT', 'active'),
('Finance', 'active'),
('Operations', 'active')
ON DUPLICATE KEY UPDATE name = name;

-- Insert sample employees (passwords are hashed version of 'pass123')
INSERT INTO employees (name, email, phone, username, password, department, role, status) VALUES
('John Doe', 'john@example.com', '9876543210', 'johndoe', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sales', 'Admin', 'active'),
('Jane Smith', 'jane@example.com', '9876543211', 'janesmith', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Marketing', 'Employee', 'active'),
('Mike Johnson', 'mike@example.com', '9876543212', 'mikejohnson', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Production', 'Employee', 'inactive'),
('Sarah Williams', 'sarah@example.com', '9876543213', 'sarahwilliams', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'HR', 'Admin', 'active'),
('Robert Brown', 'robert@example.com', '9876543214', 'robertbrown', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'IT', 'Employee', 'active')
ON DUPLICATE KEY UPDATE email = email;


-- login auth tokens:
-- Auth tokens table for session management
CREATE TABLE IF NOT EXISTS auth_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;