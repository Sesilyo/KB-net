<?php
    // FILENAME: getTransactions.php
    // fetches all transactions for a user based on their role (lender, borrower)

    require_once __DIR__ . '/../DBConnector.php';
    header('Content-Type: application/json');

    $role           = $_GET['role']         ?? null;
    $id             = $_GET['id']           ?? null;
    $is_returned    = $_GET['is_returned']  ?? null;
    
    // guard block, both role and id required
    if(!$role || !$id) {
        echo json_encode(['error' => 'Missing role or id']);
        exit;
    }

    // guard block, only lender/borrower role allowed
    if(!in_array($role, ['borrower', 'lender'])) {
        echo json_encode(['error' => 'Invalid role']);
        exit;
    }

    // building param arrays and WHERE conditions
    $conditions = [];   // holds role based on condition
    $params     = [];   // values to bind to each placeholder ?
    $types      = '';   // type codes form bind_param

    // filter id depending on role
    if($role === 'lender') {
        $conditions[] = 't.lender_id = ?';
    } else {
        $conditions[] = 't.borrower_id = ?';
    }
    $params[] = $id;
    $types    = 's';

    // filter for item return
    if($is_returned !== null && in_array($is_returned, ['0', '1'])) {
        $conditions[] = 't.is_returned = ?';
        $params[]     = (int)$is_returned;
        $types       .= 'i';
    }

    $where = 'WHERE ' . implode(' AND ', $conditions);  // implode = concatenate with an operator

    // full SQL query
    $sql = "SELECT t.*,
                    i.item_name, i.image_path, i.price_pr_hr,
                    c.category_name,
                    u.first_name, u.last_name
            FROM transaction t
            JOIN item       i ON t.item_id = i.item_id
            JOIN category   c ON i.category_id = c.category_id
            JOIN user       u ON (
                CASE
                    WHEN '$role' = 'borrower' THEN t.lender_id = u.lender_id
                    ELSE                            t.borrower_id  = u.borrower_id
                END
            )
            $where
            ORDER BY t.start_date DESC";

    // prepare, bind, execute
    $statement  = $conn->prepare($sql);
    $statement  ->bind_param($types, ...$params);
    $statement  ->execute();
    $result     = $statement->get_result();

    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    echo json_encode($rows);
?>
