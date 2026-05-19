<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "kb_net";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error);
    die("Database connection error.");
}

?>