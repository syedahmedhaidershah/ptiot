<?php
// for getting basic information about a few devices
if(!isset($_POST["username"])){
	halt(403,"system OK.", 635);
}
$username = $_POST["username"];


$cred_check = $dbc->prepare("SELECT `aid` FROM `credentials` WHERE `username`=?");
$cred_check->bind_param('s', $username);
$cred_check->execute();
$cred_check->store_result();
$cred_check->bind_result($aid);
$cred_check->fetch();
if($cred_check->num_rows == 0){
	halt(403,'system OK.',636);
}
else{
	$init = $dbc->query("SELECT * FROM `access` WHERE `aid`=$aid");
	if($init->num_rows == 0){
		halt(403,'system OK.',637);
	}
	$allTemp = $init->fetch_assoc();
	$msg["msg"] = $allTemp;
}

$cred_check->close();
?>