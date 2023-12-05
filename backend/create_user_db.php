<?php
include("config.php");

$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];

$connection = new mysqli($servername, $user, $password, $dbname);

if ($connection->connect_error) {
  die("Connection failed: " . $connection->connect_error);
}

$sql = "INSERT INTO users (name, password, email)" .
  "VALUES ('$username', '$password', '$email')";

if ($connection->query($sql) === TRUE) { // query() returns TRUE on success
  echo "New record created successfully";
}
