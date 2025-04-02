-- Initialize database tables for Texas Refinery PDF Scraper

-- Table for storing regex patterns
CREATE TABLE IF NOT EXISTS regex_patterns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    pattern TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing error logs
CREATE TABLE IF NOT EXISTS error_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    browser_info TEXT,
    page_url TEXT,
    is_emailed BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing download history
CREATE TABLE IF NOT EXISTS download_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    year TEXT NOT NULL,
    month TEXT,
    facility_id TEXT,
    file_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    error_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Table for storing user settings
CREATE TABLE IF NOT EXISTS user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE,
    email TEXT,
    is_admin BOOLEAN DEFAULT 0,
    notification_enabled BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing admin settings
CREATE TABLE IF NOT EXISTS admin_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_name TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default regex pattern
INSERT INTO regex_patterns (name, pattern, description, is_active)
VALUES (
    'Default Pattern', 
    '(?P<year>\d{4})[-_](?P<month>[a-z]+)[-_](?P<facility>\d{2}-\d{4})', 
    'Default pattern for parsing refinery PDF filenames',
    1
);

-- Insert default admin settings
INSERT INTO admin_settings (setting_name, setting_value, description)
VALUES 
    ('notification_email', 'admin@example.com', 'Email address to receive error notifications'),
    ('smtp_host', 'smtp.example.com', 'SMTP server hostname'),
    ('smtp_port', '587', 'SMTP server port'),
    ('smtp_user', 'user@example.com', 'SMTP username'),
    ('smtp_pass', 'password', 'SMTP password'),
    ('base_url', 'https://www.rrc.texas.gov', 'Base URL for Texas RRC website'),
    ('max_threads', '10', 'Maximum number of concurrent download threads');
