<?php
    // FILENAME: getItems.php

    require_once __DIR__ . '/../DBConnector.php';

    $result = $conn -> query("  SELECT  i.item_id, i.item_name, i.item_status, i.price_pr_hr, i.image_path,
                                        c.category_name, u.first_name, u.last_name
                                FROM item i
                                JOIN category c ON i.category_id = c.category_id
                                JOIN user u ON i.user_id = u.student_id
    ");

    $items = [];
    while ( $row = $result -> fetch_assoc() ) {
        $items[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($items);

?>