<?php 
    $onload = array(); //associative array storing all info for site onload

    //get all cfgs
    ob_start(); //start buffering

    include 'get_cfgs.php';

    $cfgs = ob_get_clean(); //collect output, stop buffering
    $onload['cfgs'] = json_decode($cfgs);

    //get all sensors
    ob_start(); //start buffering

    #include 'get_sensors.php';

    $sensors = ob_get_clean(); //collect output, stop buffering
    #$onload['sensors'] = $sensors;

    //output
    echo json_encode($onload);
?>