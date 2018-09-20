<?php
$request = $injects.$require.'.php';
$check = file_exists( $request );
if(!$check){
	halt(403,'Access denied.', 626);
}
else{
	require $request;
	$msg["exec"] = $require;
}
?>