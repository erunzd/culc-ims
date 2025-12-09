<?php
require_once 'db.php';

header('Content-Type: application/json');

if (!isset($_POST['productCode'])) {
	echo json_encode(['success' => false, 'message' => 'Missing productCode']);
	exit();
}

$productCode = $_POST['productCode'];

$stmt = $conn->prepare("DELETE FROM INVENTORY WHERE product_code = ?");
if (!$stmt) {
	echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
	exit();
}
$stmt->bind_param('s', $productCode);
if ($stmt->execute()) {
	echo json_encode(['success' => true]);
} else {
	echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>