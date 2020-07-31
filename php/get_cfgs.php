<?php
    $path = '../cfg/'; //path of saved cfgs

    //if directory does not exist, create it
    if (!is_dir($path)) {
        mkdir($path);
    }

    //store cfgs in associative array (name -> settings)
    $files = scandir($path);
    $cfgs = array();

    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            $cfgs[str_replace('.json', '', $file)] = json_decode(file_get_contents($path . $file));
            #array_push($cfg_arr, ['name' => substr($file, 0, -5), 'settings' => file_get_contents($path . $file)]);
        }
    }

    //output
    echo json_encode($cfgs);
?>