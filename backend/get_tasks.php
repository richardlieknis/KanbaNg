<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("config.php");

$connection = new mysqli($servername, $user, $password, $dbname);

if ($connection->connect_error) {
  die("Connection failed: " . $connection->connect_error);
}

$sqlTasks = "SELECT * FROM tasks";
$result = $connection->query($sqlTasks);

if ($result) {
  $tasks = array();

  while ($row = $result->fetch_assoc()) {
    $row['assignees'] = json_decode($row['assignees'], true);
    $row['subtasks'] = json_decode($row['subtasks'], true);

    $tasks[] = $row;
  }

  echo json_encode(['status' => 'success', 'tasks' => $tasks]);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Failed to retrieve contacts data!']);
}

$connection->close();
