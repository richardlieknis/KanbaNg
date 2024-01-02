<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

include("config.php");

$name = $data['name'];
$email = $data['email'];
$phone = $data['phone'];
$location = $data['location'];

$connection = new mysqli($servername, $user, $password, $dbname);

if ($connection->connect_error) {
  die("Connection failed: " . $connection->connect_error);
}

// Prepared Statement, um SQL-Injections zu verhindern
$sqlContact = "INSERT INTO contacts (name, email, phone, location) VALUES (?, ?, ?, ?)";
$stmtContact = $connection->prepare($sqlContact);

if (!$stmtContact) {
  die("Prepare failed: " . $connection->error);
}

$stmtContact->bind_param('ssss', $name, $email, $phone, $location);

// Führe das Prepared Statement aus

if ($stmtContact->execute()) {
  echo json_encode(['status' => 'success', 'message' => 'New contact has been created successfully!']);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Something went wrong! :(']);
}

$stmtContact->close();
$connection->close();
