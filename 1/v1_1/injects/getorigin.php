<?php
// for getting origin information for a few devices

$device = json_decode($_POST["keys"], true);
$devices = array();

$dev_check = $dbc->prepare("SELECT `zone`,`entity`,`network`,`sublevel`,`creation` FROM `access` WHERE `accesskey`=?");
foreach ($device as $key => $value) {
	$dev_check->bind_param('s', $value);
	$dev_check->execute();
	$dev_check->store_result();
	$dev_check->bind_result($z, $e, $n, $s, $c);
	$dev_check->fetch();
	if($dev_check->num_rows == 0){
		halt(403,'system OK.',631);
	}
	else{
		array_push( $devices, array(
			"zone" => $z,
			"entity" => $e,
			"network" => $n,
			"sublevel" => $s,
			"creation" => $c
		));
	}
}

$msg["msg"] = $devices;
$dev_check->close();
?>