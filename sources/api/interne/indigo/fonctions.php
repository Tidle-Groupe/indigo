<?php
//Fonction de retour des include avec header method allowe
function methodAPI($method, $inc){
    header("Access-Control-Allow-Methods: ".$method);
    include($inc);
}
//Fonction de retour d'erreur
function erreurAPI($message){
    //Renvois de la réponse
    echo json_encode(array("response"=>"error", "message"=>$message), JSON_PRETTY_PRINT);
}
//Fonction de retour des données de l'api
function returnAPI($array){
    //Renvois de la réponse
    echo json_encode($array, JSON_PRETTY_PRINT);
}