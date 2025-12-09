<?php
session_start();

header('Content-Type: application/json');

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    echo json_encode([
        'loggedin' => true,
        'userId' => $_SESSION['userId'],
        'email' => $_SESSION['email'],
        'isAdmin' => $_SESSION['isAdmin']
    ]);
} else {
    echo json_encode(['loggedin' => false]);
}
?>
