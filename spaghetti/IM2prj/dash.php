<?php
include 'db.php';

$response = [
    'stats' => [],
    'summaries' => [],
    'inventory' => []
];

// Query for the stats
$sql = "SELECT 
            SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS to_be_packed,
            SUM(CASE WHEN status = 'Shipped' THEN 1 ELSE 0 END) AS to_be_shipped,
            SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS delivered
        FROM ORDERS WHERE visible = 1";
$result = $conn->query($sql);
$response['stats'] = $result->fetch_assoc();

// Query for summaries
$sql = "SELECT 
            SUM(quantity) AS quantity_in_hand,
            COUNT(DISTINCT location) AS number_of_branches,
            COUNT(DISTINCT wood_type) AS number_of_categories,
            (SELECT COUNT(DISTINCT customer_id) FROM ORDERS WHERE visible = 1) AS number_of_customers
        FROM INVENTORY WHERE visible = 1";
$result = $conn->query($sql);
$response['summaries'] = $result->fetch_assoc();

// Query for inventory
$sql = "SELECT product_code, wood_type, size, quantity, location, price FROM INVENTORY WHERE visible = 1";
$result = $conn->query($sql);
while ($row = $result->fetch_assoc()) {
    $response['inventory'][] = $row;
}

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>
