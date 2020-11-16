<?php
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
//Suppression du / à la fin de l'url si présent
if(substr($url, -1) == "/"){
    $url = substr($url, 0, -1);
}

//Recherche des routes
include("default/controleur.php");