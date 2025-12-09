<?php
require_once 'db.php';

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    $employee_id = $_SESSION['userId'];

    $sql = "SELECT id, first_name, last_name, contact_number, email, department FROM EMPLOYEE WHERE id = ? AND visible = 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $employee_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $employee = $result->fetch_assoc();
        echo json_encode(['success' => true, 'employee' => $employee]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Employee not found']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
}

$conn->close();
?>
