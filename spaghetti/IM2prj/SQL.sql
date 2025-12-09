-- Drop the existing database if it exists
DROP DATABASE IF EXISTS lumber_company;

-- Create a new database
CREATE DATABASE lumber_company;

-- Use the newly created database
USE lumber_company;

-- Create EMPLOYEE table
CREATE TABLE EMPLOYEE (
    id INT PRIMARY KEY,
    last_name VARCHAR(50),
    first_name VARCHAR(50),
    contact_number VARCHAR(15),
    email VARCHAR(100),
    department VARCHAR(50),
    permission VARCHAR(50),
    password VARCHAR(255),
    visible TINYINT(1) DEFAULT 1
);

-- Create INVENTORY table
CREATE TABLE INVENTORY (
    product_code VARCHAR(10) PRIMARY KEY,
    wood_type VARCHAR(50),
    size VARCHAR(50),
    unit VARCHAR(10),
    quantity INT,
    location VARCHAR(100),
    price DECIMAL(10, 2),
    visible TINYINT(1) DEFAULT 1
);

-- Create LOW_STOCK view
CREATE VIEW LOW_STOCK AS
SELECT product_code, wood_type, size, unit, quantity, location, price
FROM INVENTORY
WHERE quantity <= 5;

-- Create ORDERS table
CREATE TABLE ORDERS (
    order_id INT PRIMARY KEY,
    customer_id INT,
    employee_id INT,
    order_date_created DATE,
    order_date_completed DATE,
    delivery_address VARCHAR(255),
    total_cost DECIMAL(10, 2),
    date_paid DATE,
    status VARCHAR(50),
    visible TINYINT(1) DEFAULT 1
);

-- Create CUSTOMERS table
CREATE TABLE CUSTOMERS (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    contact_number VARCHAR(15),
    email VARCHAR(100),
    credibility_status BOOLEAN,
    visible TINYINT(1) DEFAULT 1
);

-- Create DATA_LOGS_SALES table
CREATE TABLE DATA_LOGS_SALES (
    time TIMESTAMP,
    employee_id INT,
    employee_name VARCHAR(100),
    task VARCHAR(255)
);

-- Create DATA_LOGS_INVENTORY table
CREATE TABLE DATA_LOGS_INVENTORY (
    time TIMESTAMP,
    employee_id INT,
    employee_name VARCHAR(100),
    task VARCHAR(255)
);

-- Create DATA_LOGS_PRODUCTION table
CREATE TABLE DATA_LOGS_PRODUCTION (
    time TIMESTAMP,
    employee_id INT,
    employee_name VARCHAR(100),
    task VARCHAR(255)
);

-- Use the lumber_company database
USE lumber_company;

-- Insert data into EMPLOYEE table
INSERT INTO EMPLOYEE (id, last_name, first_name, contact_number, email, department, permission, password, visible)
VALUES
(1, 'Reyes', 'Juan', '09171234567', 'juan.reyes@example.com', 'Sales', 'Admin', 'password123', 1),
(2, 'Santos', 'Maria', '09181234567', 'maria.santos@example.com', 'Inventory', 'User', 'password456', 1),
(3, 'Dela Cruz', 'Jose', '09191234567', 'jose.delacruz@example.com', 'Production', 'User', 'password789', 1),
(4, 'Garcia', 'Ana', '09201234567', 'ana.garcia@example.com', 'Finance', 'User', 'password101', 1),
(5, 'Tan', 'Michael', '09211234567', 'michael.tan@example.com', 'IT', 'User', 'password202', 1);

-- Insert data into INVENTORY table
INSERT INTO INVENTORY (product_code, wood_type, size, unit, quantity, location, price, visible)
VALUES
('P001', 'Mahogany', '2x4', 'pcs', 5, 'A1', 150.00, 1),
('P002', 'Pine', '2x6', 'pcs', 2, 'A2', 100.00, 1),
('P003', 'Cedar', '4x4', 'pcs', 20, 'B1', 200.00, 1),
('P004', 'Oak', '6x6', 'pcs', 15, 'C1', 250.00, 1),
('P005', 'Narra', '2x2', 'pcs', 8, 'A3', 300.00, 1),
('P006', 'Bamboo', '1x1', 'pcs', 25, 'B2', 50.00, 1);

-- Insert data into ORDERS table
INSERT INTO ORDERS (order_id, customer_id, employee_id, order_date_created, order_date_completed, delivery_address, total_cost, date_paid, status, visible)
VALUES
(1001, 1, 1, '2024-07-01', '2024-07-05', '123 Mango St., Cebu City', 5000.00, '2024-07-04', 'Completed', 1),
(1002, 2, 2, '2024-07-03', '2024-07-07', '456 Banawa St., Cebu City', 7500.00, '2024-07-06', 'Completed', 1),
(1003, 3, 3, '2024-07-05', '2024-07-10', '789 Mabolo St., Cebu City', 3000.00, '2024-07-09', 'Pending', 1),
(1004, 4, 4, '2024-07-08', '2024-07-12', '101 Ayala St., Cebu City', 9000.00, '2024-07-11', 'Completed', 1),
(1005, 5, 1, '2024-07-11', '2024-07-15', '202 SM Seaside, Cebu City', 4500.00, '2024-07-14', 'Pending', 1);

-- Insert data into CUSTOMERS table
INSERT INTO CUSTOMERS (id, name, contact_number, email, credibility_status, visible)
VALUES
(1, 'Pedro Cruz', '09201234567', 'pedro.cruz@example.com', 1, 1),
(2, 'Ana Lopez', '09211234567', 'ana.lopez@example.com', 1, 1),
(3, 'Luis Santos', '09221234567', 'luis.santos@example.com', 0, 1),
(4, 'Maria Clara', '09231234567', 'maria.clara@example.com', 1, 1),
(5, 'Jose Rizal', '09241234567', 'jose.rizal@example.com', 0, 1);

-- Insert data into DATA_LOGS_SALES table
INSERT INTO DATA_LOGS_SALES (time, employee_id, employee_name, task)
VALUES
('2024-07-01 08:00:00', 1, 'Juan Reyes', 'Processed Order #1001'),
('2024-07-03 09:30:00', 2, 'Maria Santos', 'Updated Inventory'),
('2024-07-05 11:00:00', 3, 'Jose Dela Cruz', 'Produced Product Code 101'),
('2024-07-07 10:00:00', 4, 'Ana Garcia', 'Checked Financial Records'),
('2024-07-09 14:00:00', 5, 'Michael Tan', 'IT Maintenance');

-- Insert data into DATA_LOGS_INVENTORY table
INSERT INTO DATA_LOGS_INVENTORY (time, employee_id, employee_name, task)
VALUES
('2024-07-02 10:00:00', 2, 'Maria Santos', 'Checked Inventory Levels'),
('2024-07-04 14:00:00', 1, 'Juan Reyes', 'Received New Shipment'),
('2024-07-06 16:00:00', 3, 'Jose Dela Cruz', 'Updated Inventory System'),
('2024-07-08 09:00:00', 4, 'Ana Garcia', 'Organized Inventory Records'),
('2024-07-10 12:00:00', 5, 'Michael Tan', 'Reviewed Inventory Report');

-- Insert data into DATA_LOGS_PRODUCTION table
INSERT INTO DATA_LOGS_PRODUCTION (time, employee_id, employee_name, task)
VALUES
('2024-07-03 07:00:00', 3, 'Jose Dela Cruz', 'Started Production for Order #1002'),
('2024-07-05 10:00:00', 1, 'Juan Reyes', 'Quality Check for Order #1001'),
('2024-07-07 15:00:00', 2, 'Maria Santos', 'Finished Production for Order #1003'),
('2024-07-09 08:00:00', 4, 'Ana Garcia', 'Initiated New Production Line'),
('2024-07-11 11:00:00', 5, 'Michael Tan', 'Monitored Production Workflow');
