<?php
require_once 'db.php';

// Fetch data from DATA_LOGS_SALES
$salesQuery = "SELECT time, employee_id AS employeeId, employee_name AS employeeName, task FROM DATA_LOGS_SALES";
$salesResult = $conn->query($salesQuery);
$salesData = [];
while ($row = $salesResult->fetch_assoc()) {
    $salesData[] = $row;
}

// Fetch data from DATA_LOGS_INVENTORY
$inventoryQuery = "SELECT time, employee_id AS employeeId, employee_name AS employeeName, task FROM DATA_LOGS_INVENTORY";
$inventoryResult = $conn->query($inventoryQuery);
$inventoryData = [];
while ($row = $inventoryResult->fetch_assoc()) {
    $inventoryData[] = $row;
}

// Fetch data from DATA_LOGS_PRODUCTION
$productionQuery = "SELECT time, employee_id AS employeeId, employee_name AS employeeName, task FROM DATA_LOGS_PRODUCTION";
$productionResult = $conn->query($productionQuery);
$productionData = [];
while ($row = $productionResult->fetch_assoc()) {
    $productionData[] = $row;
}

// Combine all data
$data = [
    'sales' => $salesData,
    'inventory' => $inventoryData,
    'production' => $productionData,
];

// Return data as JSON
header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>
