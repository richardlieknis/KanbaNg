<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

include("config.php");

$name = $data['name'];
$color = $data['color'];

$connection = new mysqli($servername, $user, $password, $dbname);

if ($connection->connect_error) {
  die("Connection failed: " . $connection->connect_error);
}

// Prepared Statement, um SQL-Injections zu verhindern
$sqlCatagory = "INSERT INTO categories (name, color) VALUES (?, ?)";
$stmtCatagory = $connection->prepare($sqlCatagory);

if (!$stmtCatagory) {
  die("Prepare failed: " . $connection->error);
}

$stmtCatagory->bind_param('ss', $name, $color);

// Führe das Prepared Statement aus

if ($stmtCatagory->execute()) {
  echo json_encode(['status' => 'success', 'message' => 'Your catagory has been created successfully!']);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Something went wrong! :(']);
}

$stmtCatagory->close();
$connection->close();
