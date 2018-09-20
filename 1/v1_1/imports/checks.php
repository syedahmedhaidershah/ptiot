<?php
// this file contains all of the initial security checks
if($_SERVER["HTTP_HOST"] != $host){
	// ERROR 624
	halt(403,'system OK.',628);
}
else{
	if(!isset($_POST["require"])){
		// ERROR 624
		$phpinput = file_get_contents("php://input");
		if(strlen($phpinput) != 0){
			$reqTemp = explode('&', $phpinput);
			foreach ($reqTemp as $key => $value) {
				$paramTemp = explode('=', $value);
				$_POST[ $paramTemp[0] ] = $paramTemp[1];
			}
			if(!isset($_POST["access"]) && $_POST["require"] != "login"){
				// ERROR 625
				halt(403,'system OK.',625);
			}
			else{
				if(!isset($dbc)){
					// retreiving mysqli object
					require $imports.'dbc.php';
				}
				if(isset($_POST["access"])){
					$access= $_POST["access"];
					$accArr = json_decode($access, true);
					if(count($accArr) == 0){
						halt(403,'system OK.',627);
					}
					else{
						// pt_zone = area
						// pt_entity = building
						extract($accArr);
						if(!isset($pt_zone) || !isset($pt_entity) || !isset($accesskey)){
							halt(403,'system OK.',629);
						}
						else{
							$test_query = $dbc->prepare("SELECT `network`,`sublevel` FROM `access` WHERE `zone`=? AND `entity`=? AND `accesskey`=?");
							$test_query->bind_param('sss', $pt_zone, $pt_entity, $accesskey);
							$test_query->execute();
							$test_query->store_result();
							$test_query->bind_result($ret_net, $ret_sub);
							$test_query->fetch();
							
							if($test_query->num_rows == 0){
								halt(403,'system OK.',630);
							}
							else{
								$test_query->close();
								$msg["details"] = array(
									"network" => $ret_net,
									"sublevel" => $ret_sub
								);
							}
						}					
					}
				}
			}
		}
		else{
			halt(403,'system OK.',624);
		}
	}
	else{
		if(!isset($_POST["access"]) && $_POST["require"] != "login"){
		// ERROR 625
			halt(403,'system OK.',625);
		}
		else{
			if(!isset($dbc)){
				// retreiving mysqli object
				require $imports.'dbc.php';
			}
			if(isset($_POST["access"])){
				$access= $_POST["access"];
				$accArr = json_decode($access, true);
				if(count($accArr) == 0){
					halt(403,'system OK.',627);
				}
				else{
					// pt_zone = area
					// pt_entity = building
					extract($accArr);
					if(!isset($pt_zone) || !isset($pt_entity) || !isset($accesskey)){
						halt(403,'system OK.',629);
					}
					else{
						$test_query = $dbc->prepare("SELECT `network`,`sublevel` FROM `access` WHERE `zone`=? AND `entity`=? AND `accesskey`=?");
						$test_query->bind_param('sss', $pt_zone, $pt_entity, $accesskey);
						$test_query->execute();
						$test_query->store_result();
						$test_query->bind_result($ret_net, $ret_sub);
						$test_query->fetch();
						
						if($test_query->num_rows == 0){
							halt(403,'system OK.',630);
						}
						else{
							$test_query->close();
							$msg["details"] = array(
								"network" => $ret_net,
								"sublevel" => $ret_sub
							);
						}
					}					
				}
			}
		}
	}
}
?>	