<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "lumber_company";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo "Connection failed: " . $conn->connect_error;
    exit();
}

// Employee data with plain text passwords
$employees = [
    ['id' => 1, 'password' => 'password123'],
    ['id' => 2, 'password' => 'password456'],
    ['id' => 3, 'password' => 'password789'],
    ['id' => 4, 'password' => 'password101'],
    ['id' => 5, 'password' => 'password202']
];

// Hash passwords and update the database
foreach ($employees as $employee) {
    $hashedPassword = password_hash($employee['password'], PASSWORD_BCRYPT);
    $stmt = $conn->prepare("UPDATE EMPLOYEE SET password = ? WHERE id = ?");
    $stmt->bind_param("si", $hashedPassword, $employee['id']);
    if ($stmt->execute()) {
        echo "Password for employee ID " . $employee['id'] . " updated successfully.<br>";
    } else {
        echo "Error updating password for employee ID " . $employee['id'] . ": " . $stmt->error . "<br>";
    }
    $stmt->close();
}

$conn->close();
?>
