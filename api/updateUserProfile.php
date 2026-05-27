<?php
// FILENAME: api/updateUserProfile.php
// Update user profile information

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../DBConnector.php';

// Check if user is logged in
if (!isset($_SESSION['student_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

// Get the JSON data
$data = json_decode(file_get_contents('php://input'), true);

$student_id = $_SESSION['student_id'];
$first_name = trim($data['first_name'] ?? '');
$last_name = trim($data['last_name'] ?? '');
$email = trim($data['email'] ?? '');
$new_student_id = trim($data['student_id'] ?? $student_id);

// Validate input
if (empty($first_name) || empty($last_name) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Check if email is already used by another user
$checkEmailStmt = $conn->prepare('SELECT student_id FROM `user` WHERE email = ? AND student_id != ?');
$checkEmailStmt->bind_param('ss', $email, $student_id);
$checkEmailStmt->execute();
$checkEmailResult = $checkEmailStmt->get_result();

if ($checkEmailResult->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email is already in use']);
    exit;
}
$checkEmailStmt->close();

// Check if new student_id is already used by another user (only if student_id is being changed)
if ($new_student_id !== $student_id) {
    $checkStudentStmt = $conn->prepare('SELECT student_id FROM `user` WHERE student_id = ?');
    $checkStudentStmt->bind_param('s', $new_student_id);
    $checkStudentStmt->execute();
    $checkStudentResult = $checkStudentStmt->get_result();
    
    if ($checkStudentResult->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Student ID is already in use']);
        exit;
    }
    $checkStudentStmt->close();
}

// Update user data
// If student_id is being changed, we need to update the primary key
if ($new_student_id !== $student_id) {
    // Start transaction for primary key change
    $conn->begin_transaction();
    
    try {
        // Get all current data
        $getStmt = $conn->prepare('SELECT lender_id, borrower_id, password_hash FROM `user` WHERE student_id = ?');
        $getStmt->bind_param('s', $student_id);
        $getStmt->execute();
        $userData = $getStmt->get_result()->fetch_assoc();
        $getStmt->close();
        
        // Delete old record
        $deleteStmt = $conn->prepare('DELETE FROM `user` WHERE student_id = ?');
        $deleteStmt->bind_param('s', $student_id);
        $deleteStmt->execute();
        $deleteStmt->close();
        
        // Insert with new student_id
        $insertStmt = $conn->prepare('INSERT INTO `user` (student_id, lender_id, borrower_id, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $insertStmt->bind_param('sssssss', $new_student_id, $userData['lender_id'], $userData['borrower_id'], $first_name, $last_name, $email, $userData['password_hash']);
        $insertStmt->execute();
        $insertStmt->close();
        
        $conn->commit();
        
        // Update session
        $_SESSION['student_id'] = $new_student_id;
        $_SESSION['first_name'] = $first_name;
        $_SESSION['last_name'] = $last_name;
        $_SESSION['email'] = $email;
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Update failed: ' . $e->getMessage()]);
        exit;
    }
} else {
    // Just update the fields
    $stmt = $conn->prepare('UPDATE `user` SET first_name = ?, last_name = ?, email = ? WHERE student_id = ?');
    $stmt->bind_param('ssss', $first_name, $last_name, $email, $student_id);
    
    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'message' => 'Update failed']);
        exit;
    }
    $stmt->close();
    
    // Update session
    $_SESSION['first_name'] = $first_name;
    $_SESSION['last_name'] = $last_name;
    $_SESSION['email'] = $email;
}

echo json_encode([
    'success' => true,
    'message' => 'Profile updated successfully',
    'user' => [
        'student_id' => $new_student_id,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'email' => $email
    ]
]);

$conn->close();
?>
