<?php
// for getting basic information about a few devices
if(!isset($_POST["devices"])){
	halt(403,"system OK.", 634);
}
$device = json_decode($_POST["devices"], true);
$devices = array();

$dev_check = $dbc->prepare("SELECT `did`,`name`,`room`,`state` FROM `devices` WHERE `did`=? AND `accesskey`=?");
foreach ($device as $key => $value) {
	$dev_check->bind_param('ds', $value, $accesskey);
	$dev_check->execute();
	$dev_check->store_result();
	$dev_check->bind_result($did,$n,$r,$state);
	$dev_check->fetch();
	if($dev_check->num_rows == 0){
		
		halt(403,'system OK.',631);
	}
	else{
		array_push( $devices, array(
			"did" => $did,
			"name" => $n,
			"room" => $r,
			"state" => $state
		));
	}
}

$msg["msg"] = $devices;
$dev_check->close();
?>