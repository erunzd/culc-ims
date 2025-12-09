<?php
require_once 'db.php';

header('Content-Type: application/json');

if (!isset($_POST['productCode']) || !isset($_POST['quantity'])) {
	echo json_encode(['success' => false, 'message' => 'Missing productCode or quantity']);
	exit();
}

$productCode = $_POST['productCode'];
$quantity = (int) $_POST['quantity'];

$stmt = $conn->prepare("UPDATE INVENTORY SET quantity = ? WHERE product_code = ?");
if (!$stmt) {
	echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
	exit();
}
$stmt->bind_param('is', $quantity, $productCode);
if ($stmt->execute()) {
	echo json_encode(['success' => true]);
} else {
	echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>