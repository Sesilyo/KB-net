<?php
// FILENAME: api/getUserProfile.php
// Get user profile information

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../DBConnector.php';

// Check if user is logged in
if (!isset($_SESSION['student_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$student_id = $_SESSION['student_id'];

// Query user data from database
$stmt = $conn->prepare('SELECT student_id, lender_id, borrower_id, first_name, last_name, email FROM `user` WHERE student_id = ?');
$stmt->bind_param('s', $student_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}

$user = $result->fetch_assoc();

echo json_encode([
    'success' => true,
    'user' => [
        'student_id' => $user['student_id'],
        'lender_id' => $user['lender_id'],
        'borrower_id' => $user['borrower_id'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'email' => $user['email']
    ]
]);

$stmt->close();
$conn->close();
?>
