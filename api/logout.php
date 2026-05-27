<?php
// FILENAME: api/logout.php
// Handles user logout by destroying session

session_start();
header('Content-Type: application/json');

// Destroy the session
session_unset();
session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully.'
]);
?>
