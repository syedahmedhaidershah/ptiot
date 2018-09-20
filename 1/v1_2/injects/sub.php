<?php

require client."phpMQTT.php";

$server = "localhost";     // change if necessary
$port = 8161;                     // change if necessary
$username = "d0001";                   // set your username
$password = "pulsatemay24";                   // set your password
$client_id = "device_0001"; // make sure this is unique for connecting to sever - you could use uniqid()

$mqtt = new phpMQTT($server, $port, $client_id);

if(!$mqtt->connect(true, NULL, $username, $password)) {
		// echo "string";
	exit(1);
}

$topics['bluerhinos/phpMQTT/examples/publishtest'] = array("qos" => 0, "function" => "procmsg");
$mqtt->subscribe($topics, 0);

while($mqtt->proc()){
}


$mqtt->close();

function procmsg($topic, $msg){
		echo "Msg Recieved: " . date("r") . "\n";
		echo "Topic: {$topic}\n\n";
		echo "\t$msg\n\n";
}
