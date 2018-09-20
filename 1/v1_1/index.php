<?php
// //////////// Pulsate Technologies Communications API //////////////////////////////////// 
// Author: Syed Ahmed Haider Shah
// Purpose: IoT Backend / Devices Communication
// Version: 0.0.1
// Phase: Beta

// declaring a directory separator character
define('DS','/');

// retreiving base directory of api
$dir = __DIR__. DS;

// retreiving pre configuration variables  and modules
require $dir.'imports/preconfig.php';

// retreiving API processor
require $imports.'process.php';

// shutting down mysql database connection
if(isset($dbc)){
	$dbc->close();
}
// sending response in JSON
die(json_encode($msg, JSON_FORCE_OBJECT));

?>