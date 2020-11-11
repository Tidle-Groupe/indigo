<?php
if (isset($argc)) {
    $query = $argv[1];
    foreach(explode('&', $query) as $chunk){
        $param = explode("=", $chunk);
    
        if($param){
            $_GET[$param[0]] = $param[1];
        }
    }

    $_GET['url'] = substr($_GET['url'],1);
    
    include('site/routeur.php');
}else {
	echo "argc and argv disabled\n";
}