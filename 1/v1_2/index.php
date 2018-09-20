<?php
// //////////// Pulsate Technologies Communications API //////////////////////////////////// 
// Author: Syed Ahmed Haider Shah
// Purpose: IoT Backend / Devices Communication
// Version: 0.0.1
// Phase: Beta

namespace Bluerhinos;

// declaring a directory separator character
define('DS','/');
$dir = __DIR__ . DS;
define('imports', $dir.'imports/');
define('injects', $dir.'injects/');
define('client', $dir.'client/');

require injects.'sub.php';

?>