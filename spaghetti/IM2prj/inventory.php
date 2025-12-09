<?php
require_once 'db.php';

// Set error reporting to log errors instead of displaying them
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'get_inventory':
        getInventory($conn);
        break;
    case 'get_low_stock':
        getLowStock($conn);
        break;
    case 'add':
        addProduct($conn);
        break;
    case 'update':
        updateStock($conn);
        break;
    case 'delete':
        deleteProduct($conn);
        break;
    default:
        echo json_encode(['message' => 'Invalid action', 'success' => false]);
        break;
}

function getInventory($conn) {
    $sql = "SELECT product_code, wood_type, size, quantity, location, price FROM INVENTORY";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

function getLowStock($conn) {
    $sql = "SELECT product_code, wood_type, size, quantity, location, price FROM LOW_STOCK";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

function addProduct($conn) {
    $productCode = $_POST['productCode'];
    $woodType = $_POST['woodType'];
    $size = $_POST['size'];
    $quantity = $_POST['quantity'];
    $location = $_POST['location'];
    $price = $_POST['price'];

    $sql = "INSERT INTO INVENTORY (product_code, wood_type, size, quantity, location, price) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss", $productCode, $woodType, $size, $quantity, $location, $price);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Product added successfully', 'success' => true]);
    } else {
        error_log("Error: " . $stmt->error);
        echo json_encode(['message' => 'Error adding product', 'success' => false]);
    }
}

function updateStock($conn) {
    $productCode = $_POST['productCode'];
    $quantity = $_POST['quantity'];

    $sql = "UPDATE INVENTORY SET quantity = ? WHERE product_code = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $quantity, $productCode);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Stock updated successfully', 'success' => true]);
    } else {
        error_log("Error: " . $stmt->error);
        echo json_encode(['message' => 'Error updating stock', 'success' => false]);
    }
}

function deleteProduct($conn) {
    $productCode = $_POST['productCode'];

    $sql = "DELETE FROM INVENTORY WHERE product_code = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $productCode);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Product deleted successfully', 'success' => true]);
    } else {
        error_log("Error: " . $stmt->error);
        echo json_encode(['message' => 'Error deleting product', 'success' => false]);
    }
}

$conn->close();
?>
