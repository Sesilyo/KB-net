<?php 
    // FILENAME: updateTransaction.php
    // Updates transaction record
    // For lender

    require_once __DIR__ . '/../DBConnector.php';
    header('Content-Type: application/json');

    // fetch all transaction data from json input
    $data = json_decode(file_get_contents('php://input'), true);

    $transaction_id     = $data['transaction_id']   ?? null;
    $item_id            = $data['item_id']          ?? null;
    $lender_id          = $data['lender_id']        ?? null;
    $borrower_id        = $data['borrower_id']      ?? null;
    $start_date         = $data['start_date']       ?? null;
    $end_date           = $data['end_date']         ?? null;
    $returned_date      = $data['returned_date']    ?? null;
    $notes              = $data['notes']            ?? null;
    $penalty_fee        = $data['penalty_fee']      ?? null;
    
    // guard block for missing transaction id
    if (!$transaction_id) {
        echo json_encode(['error' => 'Missing transaction id']);
        exit;
    }

    // if item is marked as returned but no return date, set it to now
    if($is_returned == 1 && !$returned_date) {
        $returned_date = date('Y-m-d H:i:s');
    }

    // preparing update statement
    $statement = prepare(
        "UPDATE transaction
            SET start_date      = ?,
                end_date        = ?,
                returned_date   = ?,
                notes           = ?,
                penalty_fee     = ?
                
        WHERE transaction_id = ?"
    );

    $statement->bind_param('ssissds',
                $start_date,
                $end_date,
                $returned_date,
                $notes,
                $penalty_fee,
                $transaction_id);
    $statement->execute();

    echo json_encode([
        'success'       =>  $statement->affected_rows >= 0,
        'affected rows' =>  $statement->affected_rows
    ]);
    
    ?>
