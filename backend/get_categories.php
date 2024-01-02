<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("config.php");

$connection = new mysqli($servername, $user, $password, $dbname);

if ($connection->connect_error) {
  die("Connection failed: " . $connection->connect_error);
}

$sqlCategories = "SELECT * FROM categories";
$result = $connection->query($sqlCategories);

if ($result) {
  $categories = array();

  while ($row = $result->fetch_assoc()) {
    $categories[] = $row;
  }

  echo json_encode(['status' => 'success', 'categories' => $categories]);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Failed to retrieve categories data!']);
}

$connection->close();
