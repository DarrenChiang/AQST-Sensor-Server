<?php
	$path = '../cfg/';
	$name = $_POST['name'];
	$settings = stripslashes($_POST['settings']);#json_encode($_POST['settings'], JSON_PRETTY_PRINT);
	$file = $path . $name . '.json';
	
	if (file_put_contents($file, $settings)) {
		echo "CFG saved successfully.";
	} else {
		echo "CFG failed to save.";
	}
?>