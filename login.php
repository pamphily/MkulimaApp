<?php
header('Content-Type: application/json');

// Allow POST only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Only POST allowed']);
    exit;
}

require 'db.php'; // Your DB connection (see below)

// Read JSON input
$data = json_decode(file_get_contents("php://input"));

$email = $data->email ?? '';
$password = $data->password ?? '';

// Validate inputs
if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['message' => 'Email and password required']);
    exit;
}

// Lookup user
$stmt = $conn->prepare("SELECT * FROM accounts WHERE account_email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    if (password_verify($password, $user['account_password'])) {
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['account_id'],
                'name' => $user['account_name'],
                'email' => $user['account_email'],
                'type' => $user['account_type']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid password']);
    }
} else {
    http_response_code(404);
    echo json_encode(['message' => 'User not found']);
}