<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

include("config.php");

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

// Prepared Statement, um SQL-Injections zu verhindern^
$sqlTask = "INSERT INTO tasks (title, description, category, assignees, due_date, priority, subtasks, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$stmtTask = $connection->prepare($sqlTask);

if (!$stmtTask) {
  die("Prepare failed: " . $connection->error);
}

$stmtTask->bind_param('ssssssss', $title, $description, $category, $assignees, $due_date, $priority, $subtasks, $status);

// Führe das Prepared Statement aus

if ($stmtTask->execute()) {
  echo json_encode(['status' => 'success', 'message' => 'New task has been created successfully!']);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Something went wrong! :(']);
}

$stmtTask->close();
$connection->close();
