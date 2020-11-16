<?php
//Include de sécurité
include('indigo/secu.php');
//Set des Headers
header("Access-Control-Allow-Origin: *");
header("Vary: Origin");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
if(crsf_check()){
    $url = $_SERVER['REQUEST_URI'];
    //Suppression du /api
    $url = substr($url, 4);
    //Suppression du / à la fin de l'url si présent
    if(substr($url, -1) == "/"){
        $url = substr($url, 0, -1);
    }
    
    //Include des fonctions de base
    include('config/database.php');
    include('indigo/fonctions.php');
    
    //Recherche des routes
    switch($url){
        case '/route/test':
            //Exemple d'une route exemple.com/api/route/test
            methodeAPI('GET', 'route-test.php');
            break;
        default:
            erreurAPI('no found');
    }
}else{
    include('indigo/fonctions.php');
    erreurAPI('no crsf check');
}
