<?php
// KB-Net: Registers a new student user into the database.

header('Content-Type: application/json');

require_once __DIR__ . '/../DBConnector.php';

// ── Only accept POST ──────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ── Collect & sanitise inputs ─────────────────────────────────────────────────
$student_id = trim($_POST['student_id'] ?? '');
$first_name = trim($_POST['first_name'] ?? '');
$last_name  = trim($_POST['last_name']  ?? '');
$email      = trim($_POST['email']      ?? '');
$password   = trim($_POST['password']   ?? '');

// ── Auto-generate lender_id and borrower_id ───────────────────────────────────
$res = $conn->query("SELECT MAX(CAST(SUBSTRING(lender_id, 3) AS UNSIGNED)) AS max_num
                     FROM user
                     WHERE lender_id IS NOT NULL");

if (!$res) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB error generating IDs: ' . $conn->error]);
    exit;
}

$row       = $res->fetch_assoc();
$next_num  = (int)($row['max_num'] ?? 0) + 1;
$lender_id   = 'L-' . str_pad($next_num, 4, '0', STR_PAD_LEFT);
$borrower_id = 'B-' . str_pad($next_num, 4, '0', STR_PAD_LEFT);

// ── Hash the password ─────────────────────────────────────────────────────────
$password_hash = password_hash($password, PASSWORD_BCRYPT);

// ── Insert into DB ────────────────────────────────────────────────────────────
$sql  = "INSERT INTO `user`
             (student_id, lender_id, borrower_id, first_name, last_name, email, password_hash)
         VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB prepare error: ' . $conn->error]);
    exit;
}

$stmt->bind_param('sssssss',
    $student_id, $lender_id, $borrower_id,
    $first_name, $last_name, $email, $password_hash
);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
        'success'     => true,
        'message'     => 'Account created successfully!',
        'student_id'  => $student_id,
        'lender_id'   => $lender_id,
        'borrower_id' => $borrower_id
    ]);
} else {
    if ($conn->errno === 1062) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Student ID or email already exists.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'DB error: ' . $stmt->error]);
    }
}

$stmt->close();
$conn->close();