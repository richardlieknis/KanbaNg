<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

include("config.php");

$task_id = $data['task_id'];
$title = $data['title'];
$description = $data['description'];
$category = $data['category'];
$assignees = json_encode($data['assignees']);
$due_date = $data['due_date'];
$priority = $data['priority'];
$subtasks = json_encode($data['subtasks']);
$status = $data['status'];

$connection = new mysqli($servername, $user, $password, $dbname);

if ($connection->connect_error) {
  die("Connection failed: " . $connection->connect_error);
}

// Prepared Statement, um SQL-Injections zu verhindern
$sqlUpdateTask = "UPDATE tasks SET title=?, description=?, category=?, assignees=?, due_date=?, priority=?, subtasks=?, status=? WHERE task_id=?";
$stmtUpdateTask = $connection->prepare($sqlUpdateTask);

if (!$stmtUpdateTask) {
  die("Prepare failed: " . $connection->error);
}

$stmtUpdateTask->bind_param('ssssssssi', $title, $description, $category, $assignees, $due_date, $priority, $subtasks, $status, $task_id);

// Führe das Prepared Statement aus
if ($stmtUpdateTask->execute()) {
  echo json_encode(['status' => 'success', 'message' => 'Task has been updated successfully!']);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Something went wrong during the update! :(']);
}

$stmtUpdateTask->close();
$connection->close();
