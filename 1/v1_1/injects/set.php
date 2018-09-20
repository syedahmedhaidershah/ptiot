<?php
// for getting basic information about a few devices
if(!isset($_POST["sensors"])){
	halt(403,"system OK.", 634);
}
$sensor = json_decode($_POST["sensors"], true);
$sensors = array();

$sen_check = $dbc->prepare("UPDATE `sensors` SET `reading`=? WHERE `sid`=? AND `accesskey`=?");
foreach ($sensor as $key => $value) {
	$sid = $value["sid"];
	$reading = $value["reading"];
	$sen_check->bind_param('dds', $reading, $sid, $accesskey);
	$sen_check->execute();
	if($sen_check->affected_rows == 0){
		halt(200,'system OK.',631);
	}
	else{
		array_push( $sensors, array(
			"sid" => $sid,
			"message" => "published"
		));
	}
}

$msg["msg"] = $sensors;
$sen_check->close();
?>