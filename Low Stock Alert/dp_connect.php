<?php
include 'db_connect.php';

// Query the LOW_STOCK view
$sql = "SELECT * FROM LOW_STOCK";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Low Stock Alerts</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .alert { 
            background-color: #ffcccc; 
            color: #990000; 
            padding: 10px; 
            margin: 10px 0; 
            border: 1px solid red; 
            border-radius: 5px;
        }
        table { border-collapse: collapse; width: 100%; margin-top: 15px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>

<h2>Low Stock Alerts</h2>

<?php
if ($result->num_rows > 0) {
    echo "<div class='alert'>Warning: Some products are low on stock!</div>";
    echo "<table>
            <tr>
                <th>Product Code</th>
                <th>Wood Type</th>
                <th>Size</th>
                <th>Unit</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Price</th>
            </tr>";
    while($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>".$row["product_code"]."</td>
                <td>".$row["wood_type"]."</td>
                <td>".$row["size"]."</td>
                <td>".$row["unit"]."</td>
                <td>".$row["quantity"]."</td>
                <td>".$row["location"]."</td>
                <td>".$row["price"]."</td>
              </tr>";
    }
    echo "</table>";
} else {
    echo "<p>All stock levels are sufficient.</p>";
}
$conn->close();
?>

</body>
</html>
