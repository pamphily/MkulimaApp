<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

$name = $data->name ?? '';
$email = $data->email ?? '';
$phone = $data->phone ?? '';
$type = $data->type ?? 'Regular User';
$password = $data->password ?? '';

if (!$name || !$email || !$phone || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing fields']);
    exit;
}

// Check if email already exists
$check = $conn->prepare("SELECT account_id FROM accounts WHERE account_email = ?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();
if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    exit;
}

// Hash the password
$hashed_password = password_hash($password, PASSWORD_BCRYPT);

// Insert new user
$stmt = $conn->prepare("INSERT INTO accounts (account_name, account_email, account_type, account_phone, account_password) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $name, $email, $type, $phone, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to register']);
}