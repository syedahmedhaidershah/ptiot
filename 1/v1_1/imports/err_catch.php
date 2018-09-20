<?php
// custom error handler
function myerrorhandler($errno , $errstr, $errfile, $errline){
	if(!(error_reporting() & $errno)){
		return false;
	}
	$f = fopen('./res/errlog/log.txt', 'a+');
	fwrite($f, "[ \"$errfile\" ] (line: $errline) - $errno ->\t$errstr\n");
	fclose($f);
}
$new_errhandler = set_error_handler("myerrorhandler");