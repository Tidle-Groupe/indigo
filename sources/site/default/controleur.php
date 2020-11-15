<?php
switch($url){
    case '':
        //Exemple d'une route exemple.com
        include("home.html");
        break;
    default:
    include("erreur.html");
}