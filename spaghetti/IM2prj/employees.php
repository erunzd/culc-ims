<?php
require_once 'db.php';

$action = $_POST['action'];

if ($action == 'fetch') {
    $sql = "SELECT * FROM EMPLOYEE";
    $result = $conn->query($sql);
    $employees = array();
    while ($row = $result->fetch_assoc()) {
        $employees[] = $row;
    }
    echo json_encode($employees);
} elseif ($action == 'add') {
    $id = $_POST['id'];
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $contact_number = $_POST['contact_number'];
    $email = $_POST['email'];
    $department = $_POST['department'];
    $permission = $_POST['permission'];
    $sql = "INSERT INTO EMPLOYEE (id, first_name, last_name, contact_number, email, department, permission) 
            VALUES ('$id', '$first_name', '$last_name', '$contact_number', '$email', '$department', '$permission')";
    if ($conn->query($sql) === TRUE) {
        echo "Record added successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
} elseif ($action == 'edit') {
    $id = $_POST['id'];
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $contact_number = $_POST['contact_number'];
    $email = $_POST['email'];
    $department = $_POST['department'];
    $permission = $_POST['permission'];
    $sql = "UPDATE EMPLOYEE SET first_name='$first_name', last_name='$last_name', contact_number='$contact_number', email='$email', department='$department', permission='$permission' WHERE id='$id'";
    if ($conn->query($sql) === TRUE) {
        echo "Record updated successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
} elseif ($action == 'delete') {
    $id = $_POST['id'];
    $sql = "DELETE FROM EMPLOYEE WHERE id='$id'";
    if ($conn->query($sql) === TRUE) {
        echo "Record deleted successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>