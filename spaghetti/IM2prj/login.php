<?php
session_start();

header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "lumber_company";

// Create connection using mysqli object
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection and return JSON on failure
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

// Get the email and password from the POST request
$email = isset($_POST['email']) ? $_POST['email'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in both email and password.']);
    exit();
}

// Fetch the user record by email
$stmt = $conn->prepare("SELECT id, email, password, permission FROM EMPLOYEE WHERE email = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement: ' . $conn->error]);
    exit();
}
$stmt->bind_param("s", $email);
if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Failed to execute statement: ' . $stmt->error]);
    exit();
}

// Retrieve result: prefer get_result(), fallback to bind_result()/fetch()
$user = null;
if (method_exists($stmt, 'get_result')) {
    $result = $stmt->get_result();
    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
    }
} else {
    $stmt->bind_result($db_id, $db_email, $db_password, $db_permission);
    if ($stmt->fetch()) {
        $user = [
            'id' => $db_id,
            'email' => $db_email,
            'password' => $db_password,
            'permission' => $db_permission
        ];
    }
}

if ($user) {
    // Accept either hashed passwords (password_verify) or plaintext as a temporary fallback
    $passwordMatches = false;
    if (password_verify($password, $user['password'])) {
        $passwordMatches = true;
    } elseif ($password === $user['password']) {
        // Plaintext fallback (temporary) - convert to hashed password in production
        $passwordMatches = true;
    }

    if ($passwordMatches) {
        // Check if the user is an admin
        $isAdmin = ($user['permission'] === 'Admin');

        // Set session variables
        $_SESSION['loggedin'] = true;
        $_SESSION['userId'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['isAdmin'] = $isAdmin;

        echo json_encode(['success' => true, 'isAdmin' => $isAdmin]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password. Please try again.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password. Please try again.']);
}

$stmt->close();
$conn->close();
