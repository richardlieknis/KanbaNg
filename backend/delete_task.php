<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

include("config.php");

// Überprüfe, ob die task_id vorhanden ist, um einen Löschvorgang durchzuführen
if (isset($data['task_id'])) {
  $task_id = $data['task_id'];

  $connection = new mysqli($servername, $user, $password, $dbname);

  if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
  }

  // Prepared Statement, um SQL-Injections zu verhindern
  $sqlDeleteTask = "DELETE FROM tasks WHERE task_id = ?";
  $stmtDeleteTask = $connection->prepare($sqlDeleteTask);

  if (!$stmtDeleteTask) {
    die("Prepare failed: " . $connection->error);
  }

  $stmtDeleteTask->bind_param('s', $task_id);

  // Führe das Prepared Statement zum Löschen aus
  if ($stmtDeleteTask->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Task has been deleted successfully!']);
  } else {
    echo json_encode(['status' => 'error', 'message' => 'Something went wrong while deleting the task! :(']);
  }

  $stmtDeleteTask->close();
  $connection->close();
} else {
  echo json_encode(['status' => 'error', 'message' => 'Task is missing!']);
}
