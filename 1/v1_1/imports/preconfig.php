<?php
//setting up response container
$msg = array(
	"error" => false,
	"msg" => "system OK."
);

//paths to directories
$imports = $dir . 'imports' . DS;
$injects = $dir . 'injects' . DS;

if(!isset($dbc)){
	// retreiving mysqli object
	require $imports.'dbc.php';
}

// retreiving basic functions
require $imports.'functions.php';

// setting custom error handler
require $imports.'err_catch.php';

// retreiving server, API & database configuration 
require $imports.'config.php';

// retreiving checks
require $imports.'checks.php';
require $imports.'reboot.php';

// retreiving request purpose
$require = $_POST["require"];


?>