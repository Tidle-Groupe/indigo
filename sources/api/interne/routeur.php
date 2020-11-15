<?php
//Include de sécurité
include('indigo/secu.php');
//Set des Headers
header("Access-Control-Allow-Origin: http://localhost");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
if(crsf_check()){
    $url = '';
    $routeur_switch_continu = true;
    if(isset($_GET['url'])) {
        $url = $_GET['url'];
    }
    //Suppression du /api
    $url = substr($url, 4);
    
    //Include des fonctions de base
    include('config/database.php');
    include('indigo/fonctions.php');
    
    //Recherche des routes
    switch($url){
        case 'route/test':
            //Exemple d'une route exemple.com/api/route/test
            include('methode/route-test.php');
            break;
        default:
            erreurAPI('no found');
    }
}else{
    include('indigo/fonctions.php');
    erreurAPI('no crsf check');
}
