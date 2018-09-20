<?php
require client."phpMQTT.php";

$server = "localhost";     // change if necessary
$port = 8161;                     // change if necessary
$username = "d0001";                   // set your username
$password = "pulsatemay24";                   // set your password
$client_id = "device_0001"; // make sure this is unique for connecting to sever - you could use uniqid()

$mqtt = new phpMQTT($server, $port, $client_id);

if ($mqtt->connect(true, NULL, $username, $password)) {
	$mqtt->publish("bluerhinos/phpMQTT/examples/publishtest", "Hello World! at " . date("r"), 0);
	$mqtt->close();
} else {
    echo "Time out!\n";
}
