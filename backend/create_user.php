<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

include("config.php");

$username = $data['username'];
$email = $data['email'];
$user_pw = $data['password'];


$options = ['cost' => 12];
$salt = password_hash($user_pw, PASSWORD_BCRYPT, $options);

$connection = new mysqli($servername, $user, $password, $dbname);

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// Prepared Statement, um SQL-Injections zu verhindern
$sql = "INSERT INTO users (name, password, email) VALUES (?, ?, ?)";
$stmt = $connection->prepare($sql);

if (!$stmt) {
    die("Prepare failed: " . $connection->error);
}

$stmt->bind_param('sss', $username, $salt, $email);

// Führe das Prepared Statement aus
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Your account has been created successfully!']);
} else {
    // Wenn die Einfügeoperation fehlschlägt, gib einen Fehler aus
    echo json_encode(['status' => 'error', 'message' => 'Something went wrong! :(']);
}

$stmt->close();
$connection->close();
