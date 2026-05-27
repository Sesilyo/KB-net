<?php
// FILENAME: api/updateProfile.php
// Updates user profile information (name, student_id, email)

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../DBConnector.php';

// Check if user is logged in
if (!isset($_SESSION['student_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in.']);
    exit;
}

$student_id = $_SESSION['student_id'];
$first_name = trim($_POST['first_name'] ?? '');
$last_name = trim($_POST['last_name'] ?? '');
$email = trim($_POST['email'] ?? '');
$new_student_id = trim($_POST['student_id'] ?? '');

// Validation
if (empty($first_name) || empty($last_name) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit;
}

// Check if new student_id is different and already exists
if ($new_student_id !== $student_id) {
    $check_stmt = $conn->prepare('SELECT student_id FROM `user` WHERE student_id = ?');
    $check_stmt->bind_param('s', $new_student_id);
    $check_stmt->execute();
    if ($check_stmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Student ID already exists.']);
        exit;
    }
    $check_stmt->close();
}

// Check if email is already used by another user
$check_email = $conn->prepare('SELECT student_id FROM `user` WHERE email = ? AND student_id != ?');
$check_email->bind_param('ss', $email, $student_id);
$check_email->execute();
if ($check_email->get_result()->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already in use.']);
    exit;
}
$check_email->close();

// Update user profile
if ($new_student_id !== $student_id) {
    // If student_id changes, we need to update both the record and the session
    $stmt = $conn->prepare('UPDATE `user` SET first_name = ?, last_name = ?, email = ?, student_id = ? WHERE student_id = ?');
    $stmt->bind_param('sssss', $first_name, $last_name, $email, $new_student_id, $student_id);
    
    if ($stmt->execute()) {
        // Update session with new student_id
        $_SESSION['student_id'] = $new_student_id;
        $_SESSION['first_name'] = $first_name;
        $_SESSION['last_name'] = $last_name;
        $_SESSION['email'] = $email;
        
        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user' => [
                'student_id' => $new_student_id,
                'first_name' => $first_name,
                'last_name' => $last_name,
                'email' => $email
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update profile.']);
    }
} else {
    // Update only name and email
    $stmt = $conn->prepare('UPDATE `user` SET first_name = ?, last_name = ?, email = ? WHERE student_id = ?');
    $stmt->bind_param('ssss', $first_name, $last_name, $email, $student_id);
    
    if ($stmt->execute()) {
        // Update session
        $_SESSION['first_name'] = $first_name;
        $_SESSION['last_name'] = $last_name;
        $_SESSION['email'] = $email;
        
        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user' => [
                'student_id' => $student_id,
                'first_name' => $first_name,
                'last_name' => $last_name,
                'email' => $email
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update profile.']);
    }
}

$stmt->close();
$conn->close();
?>
