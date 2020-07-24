<?php
	$path = '../cfg/';

	if (!is_dir($path)) {
		mkdir($path);
	}

	$files = scandir($path);
	$cfgs = array();

	foreach ($files as $file) {
		if ($file != '.' && $file != '..') {
			$cfgs[str_replace('.json', '', $file)] = file_get_contents($path . $file);
			#array_push($cfg_arr, ['name' => substr($file, 0, -5), 'settings' => file_get_contents($path . $file)]);
		}
	}

	echo json_encode($cfgs);
?>