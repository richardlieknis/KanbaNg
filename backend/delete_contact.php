<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

include("config.php");

// Überprüfe, ob die task_id vorhanden ist, um einen Löschvorgang durchzuführen
if (isset($data['contact_id'])) {
  $contact_id = $data['contact_id'];

  $connection = new mysqli($servername, $user, $password, $dbname);

  if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
  }

  // Prepared Statement, um SQL-Injections zu verhindern
  $sqlDeleteContact = "DELETE FROM contacts WHERE contact_id = ?";
  $stmtDeleteContact = $connection->prepare($sqlDeleteContact);

  if (!$stmtDeleteContact) {
    die("Prepare failed: " . $connection->error);
  }

  $stmtDeleteContact->bind_param('s', $contact_id);

  // Führe das Prepared Statement zum Löschen aus
  if ($stmtDeleteContact->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Contact has been deleted successfully!']);
  } else {
    echo json_encode(['status' => 'error', 'message' => 'Something went wrong while deleting the contact! :(']);
  }

  $stmtDeleteContact->close();
  $connection->close();
} else {
  echo json_encode(['status' => 'error', 'message' => 'Contact is missing!']);
}
