<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

include("config.php");

$contact_id = $data['contact_id'] ?? null;
$name = $data['name'] ?? null;
$email = $data['email'] ?? null;
$phone = $data['phone'] ?? null;
$location = $data['location'] ?? null;

$connection = new mysqli($servername, $user, $password, $dbname);

if ($connection->connect_error) {
  die("Connection failed: " . $connection->connect_error);
}

// Prepared Statement, um SQL-Injections zu verhindern
$sqlUpdateContact = "UPDATE contacts SET name=?, email=?, phone=?, location=? WHERE contact_id=?";
$stmtUpdateContact = $connection->prepare($sqlUpdateContact);

if (!$stmtUpdateContact) {
  die("Prepare failed: " . $connection->error);
}

$stmtUpdateContact->bind_param('ssssi', $name, $email, $phone, $location, $contact_id);

// Führe das Prepared Statement aus
if ($stmtUpdateContact->execute()) {
  echo json_encode(['status' => 'success', 'message' => 'Contact has been updated successfully!']);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Something went wrong during the update! :(']);
}

$stmtUpdateContact->close();
$connection->close();
