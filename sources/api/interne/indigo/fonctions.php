<?php
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
//Fonction de retour des include avec header method allowe
function methodeAPI($method, $inc){
    header("Access-Control-Allow-Methods: ".$method);
    if(stripos($method, $_SERVER["REQUEST_METHOD"]) !== FALSE){
        include('methode/'.$inc);
    }else{
        erreurAPI('method not allowed');
    }
}