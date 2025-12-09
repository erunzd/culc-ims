<?php
require_once 'db.php';

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'add':
        $name = $_POST['name'];
        $contact_number = $_POST['contact_number'];
        $email = $_POST['email'];
        $credibility_status = $_POST['credibility_status'];

        $stmt = $conn->prepare("INSERT INTO CUSTOMERS (name, contact_number, email, credibility_status) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $name, $contact_number, $email, $credibility_status);
        $stmt->execute();
        $stmt->close();
        break;

    case 'edit':
        $customer_id = $_POST['customer_id'];
        $name = $_POST['name'];
        $contact_number = $_POST['contact_number'];
        $email = $_POST['email'];
        $credibility_status = $_POST['credibility_status'];

        $stmt = $conn->prepare("UPDATE CUSTOMERS SET name=?, contact_number=?, email=?, credibility_status=? WHERE id=?");
        $stmt->bind_param("ssssi", $name, $contact_number, $email, $credibility_status, $customer_id);
        $stmt->execute();
        $stmt->close();
        break;

    case 'delete':
        $customer_id = $_POST['customer_id'];

        $stmt = $conn->prepare("DELETE FROM CUSTOMERS WHERE id=?");
        $stmt->bind_param("i", $customer_id);
        $stmt->execute();
        $stmt->close();
        break;

    case 'read':
        $result = $conn->query("SELECT * FROM CUSTOMERS WHERE visible=1");
        $customers = [];
        while ($row = $result->fetch_assoc()) {
            $customers[] = $row;
        }
        echo json_encode($customers);
        break;
}

$conn->close();
