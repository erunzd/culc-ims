<?php
require_once 'db.php';

header('Content-Type: application/json');

if (!isset($_POST['product'])) {
	echo json_encode(['success' => false, 'message' => 'Missing product data']);
	exit();
}

$product = json_decode($_POST['product'], true);
if (!$product) {
	echo json_encode(['success' => false, 'message' => 'Invalid product JSON']);
	exit();
}

$productCode = $product['productCode'] ?? null;
$woodType = $product['woodType'] ?? null;
$size = $product['size'] ?? null;
$unit = $product['unit'] ?? null;
$quantity = isset($product['quantity']) ? (int)$product['quantity'] : 0;
$location = $product['location'] ?? null;
$price = isset($product['price']) ? (float)$product['price'] : 0.0;

if (!$productCode || !$woodType) {
	echo json_encode(['success' => false, 'message' => 'Missing required product fields']);
	exit();
}

$stmt = $conn->prepare("INSERT INTO INVENTORY (product_code, wood_type, size, unit, quantity, location, price) VALUES (?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
	echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
	exit();
}

// types: product_code(string), wood_type(string), size(string), unit(string), quantity(int), location(string), price(double)
$stmt->bind_param('ssssisd', $productCode, $woodType, $size, $unit, $quantity, $location, $price);

if ($stmt->execute()) {
	echo json_encode(['success' => true]);
} else {
	echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>