<?php

define('DS','/');

$dir =  __DIR__.DS;
$imports =  $dir.'imports'.DS;
$config =  $dir.'config'.DS;
$modules =  $dir.'modules'.DS;

require $imports.'intializer/index.php';
require $modules.'view/index.php';
?>