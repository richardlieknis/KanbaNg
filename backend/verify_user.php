<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

include("config.php");

$email = $data['email'];
$user_pw = $data['password'];

$connection = new mysqli($servername, $user, $password, $dbname);

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// Prepared Statement, um SQL-Injections zu verhindern
$sql = "SELECT name, password FROM users WHERE email=?";
$stmt = $connection->prepare($sql);

if (!$stmt) {
    die("Prepare failed: " . $connection->error);
}

$stmt->bind_param('s', $email);

// Führe das Prepared Statement aus
$stmt->execute();

// Binden Sie die Ergebnisse an Variablen
$stmt->bind_result($username, $storedHash);

// Überprüfen Sie das Passwort
if ($stmt->fetch() && password_verify($user_pw, $storedHash)) {
    echo json_encode(['status' => 'success', 'message' => 'User verified successfully', 'username' => $username]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
}

$stmt->close();
$connection->close();
