<?php
// for switching a device

$device = $_POST["device"];

$dev_check = $dbc->prepare("SELECT `state` FROM `devices` WHERE `did`=? AND `accesskey`=?");
$dev_check->bind_param('ds', $device, $accesskey);
$dev_check->execute();
$dev_check->store_result();
$dev_check->bind_result($state);
$dev_check->fetch();

if($dev_check->num_rows == 0){
	halt(403,'system OK.',631);
}
else{
	$dev_check->close();
	$state = intval(!$state);

	$toggle_query = $dbc->prepare("UPDATE `devices` SET `state`=$state WHERE `did`=? AND `accesskey`=?");
	$toggle_query->bind_param('ds', $device, $accesskey);
	$toggle_query->execute();
	$toggle_query->store_result();
	if($toggle_query->affected_rows > 0){
		$retName = $dbc->query("SELECT `name`,`room` FROM `devices` WHERE `did`=$device AND `accesskey`='$accesskey'");
		if($retName){
			if($retName->num_rows > 0){
				$devDet = $retName->fetch_assoc();
				$msg["name"] = $devDet["name"];
				$msg["room"] = $devDet["room"];
				$msg["state"] = $state;
				$msg["msg"] = "success";
			}
			else{
				halt(500,'error. contact admin.',633);
			}
		}
		else{
			halt(500,'error. contact admin.',632);
		}
	}
	$toggle_query->close();
}
?>