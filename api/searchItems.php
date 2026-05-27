<?php
// FILENAME: api/searchItems.php
// Searches for items by name with optional category and availability filters

require_once __DIR__ . '/../DBConnector.php';

header('Content-Type: application/json');

$search = trim($_GET['search'] ?? '');
$categories = explode(',', trim($_GET['categories'] ?? ''));
$statuses = explode(',', trim($_GET['statuses'] ?? ''));

// Filter out empty values
$categories = array_filter($categories);
$statuses = array_filter($statuses);

$query = 'SELECT i.*, c.category_name, u.first_name, u.last_name FROM `item` i 
          JOIN `category` c ON i.category_id = c.category_id 
          JOIN `user` u ON i.lender_id = u.lender_id 
          WHERE 1=1';

$params = [];
$types = '';

// Add search filter
if (!empty($search)) {
    $query .= ' AND (i.item_name LIKE ? OR i.item_description LIKE ?)';
    $searchTerm = '%' . $search . '%';
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $types .= 'ss';
}

// Add category filter
if (!empty($categories)) {
    $placeholders = implode(',', array_fill(0, count($categories), '?'));
    $query .= " AND c.category_id IN ($placeholders)";
    foreach ($categories as $cat) {
        $params[] = (int)$cat;
        $types .= 'i';
    }
}

// Add status filter
if (!empty($statuses)) {
    $placeholders = implode(',', array_fill(0, count($statuses), '?'));
    $query .= " AND i.item_status IN ($placeholders)";
    foreach ($statuses as $status) {
        $params[] = $status;
        $types .= 's';
    }
}

$query .= ' ORDER BY i.item_name ASC';

$stmt = $conn->prepare($query);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

echo json_encode($items);

$stmt->close();
$conn->close();
?>
