<?php
    $path = '../cfg/'; //path of saved cfgs
    $name = $_POST['cfg']; //get name from post request
    $file = $path . $name . '.json';

    if (!file_exists($file)) {
        echo "Internal Error: cfg json file does not exist.";
        exit();
    }
        
    if (unlink($file)) {
        echo "Configuration " . $name . " has been deleted.";
    } else {
        echo "Internal Error: Configuration " . $name . " could not be deleted.";
    }
?>