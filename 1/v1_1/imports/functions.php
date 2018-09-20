<?php
//Incase we need to stop the thread immediately with custom status-code/msg 
function halt($code, $res, $ec){
	http_response_code($code);
	$msg["msg"] = $res;
	$msg["error"] = true;
	$msg["code"] = $ec;
	if(isset($dbc)){
		$dbc->close();
	}
	die(json_encode($msg));	
}

//Incase we need to stop the thread immediately with custom status msg/error-status 
function respond($res, $err, $ec){
	$msg["msg"] = $res;
	$msg["error"] = $err;
	if($err){
		$msg["code"] = $ec;
	}
}

?>