<?php
	$path = '../cfg/';
	$files = scandir($path);
	$cfg_arr = [];
	foreach ($files as $file) {
		if ($file != '.' && $file != '..') {
			array_push($cfg_arr, ['name' => substr($file, 0, -5), 'settings' => file_get_contents($path . $file)]);
		}
	}
	echo json_encode($cfg_arr);
?>