<?php
$servicesQuery = "SELECT * FROM `services` ORDER BY `sid`";
$services = $dbc->query($servicesQuery);
if($services->num_rows > 0){
	$it = 0;
	while($ins = $services->fetch_assoc()){
		if($it%3 == 0){
			if($it > 0){
				echo "</div>";
			}
?>
		<div class="row text-center"><?php
		}
?>
		  <div class="col-md-4">
		    <span class="fa-stack fa-4x">
		      <i class="fa fa-circle fa-stack-2x text-primary"></i>
		       <?php echo '<i class="fa '.$ins["img"].' back-pic fa-stack-1x fa-inverse"></i>'; ?>
		    </span>
		    <h4 class="service-heading"><?php echo $ins["name"]; ?></h4>
		    <p><?php echo $ins["content"]; ?></p>
		  </div>
<?php
		if($it%3 == 0 && $it!=0){
?>
		</div>
<?php
		}
		$it++;
	}
	if($it+1 == $services->num_rows){
		echo "</div>";
	}
}
?>