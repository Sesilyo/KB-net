<?php 
// FILENAME: getSession.php
// called by main.js on every protected page to check to check if user is logged in

session_start();    // resume existing session (set by login.php)
header('Content-Type: application/json');

// guard block to check if the session has student_id set (is logged in)
// used by main.js to redirect to login page
if (!isset($_SESSION['borrower_id'])) {
    echo json_encode(['success' => false]);
        exit;
    }

// session is active, returns all relevant user data
echo json_encode([
    'success'       => true,
    'borrower_id'   => $_SESSION['borrower_id'],
    'lender_id'     => $_SESSION['lender_id'],
    'first_name'    => $_SESSION['first_name'],
    'last_name'     => $_SESSION['last_name'],
]);
?>