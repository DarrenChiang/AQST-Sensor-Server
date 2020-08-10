<?php
    $dbname = "sensor_data";
    $username = "root";
    $password = "";

    try {
        $db = new PDO("mysql:host=localhost;dbname=$dbname", $username, $password);
        echo "Connected to database successfully.";
    } catch (PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
    }
?>