<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("config.php");

$connection = new mysqli($servername, $user, $password, $dbname);

if ($connection->connect_error) {
  die("Connection failed: " . $connection->connect_error);
}

$sqlContacts = "SELECT * FROM contacts";
$result = $connection->query($sqlContacts);

if ($result) {
  $contacts = array();

  while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
  }

  echo json_encode(['status' => 'success', 'contacts' => $contacts]);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Failed to retrieve contacts data!']);
}

$connection->close();
