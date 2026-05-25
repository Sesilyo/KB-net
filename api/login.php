<?php
// FILENAME: api/login.php

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../DBConnector.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$email    = trim($_POST['email']    ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit;
}

// ── Query User ───────────────────────────────────────────────────────────────
$stmt = $conn->prepare('SELECT student_id, first_name, last_name, email, password_hash FROM `user` WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'No account found with that email.']);
    exit;
}

$user = $result->fetch_assoc();

// ── Verify Password ──────────────────────────────────────────────────────────
if (!password_verify($password, $user['password_hash'])) {
    echo json_encode(['success' => false, 'message' => 'Incorrect password.']);
    exit;
}

// ── Set Session & Respond ────────────────────────────────────────────────────
$_SESSION['student_id'] = $user['student_id'];
$_SESSION['first_name'] = $user['first_name'];
$_SESSION['last_name']  = $user['last_name'];
$_SESSION['email']      = $user['email'];

echo json_encode([
    'success' => true,
    'message' => 'Login successful.',
    'user'    => [
        'student_id' => $user['student_id'],
        'first_name' => $user['first_name'],
        'last_name'  => $user['last_name'],
        'email'      => $user['email'],
    ]
]);

$stmt->close();
$conn->close();
?>