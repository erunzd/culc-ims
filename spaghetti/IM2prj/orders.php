<?php

require_once 'db.php';

// Fetch orders data
$sql = "SELECT order_id, customer_id, employee_id, order_date_created, order_date_completed, delivery_address, total_cost, date_paid, status FROM ORDERS";
$result = $conn->query($sql);

$orders = array();

if ($result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
} else {
    $orders = [];
}
$conn->close();

// Return JSON response
header('Content-Type: application/json');
echo json_encode($orders);
