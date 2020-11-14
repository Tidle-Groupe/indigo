<?php
//Fonction de retour d'erreur
function erreurAPI($methods, $code_erreur, $message){
    //Code de réponse http
    http_response_code($code_erreur);
    // Headers requis
    header("Access-Control-Allow-Methods: ".$methods);
    
    //Renvois de la réponse
    echo json_encode(array("response"=>"error", "message"=>$message), JSON_PRETTY_PRINT);
}
//Fonction de retour des données de l'api
function returnAPI($method, $array){
    //Code de réponse http
    http_response_code(200);
    // Headers requis
    header("Access-Control-Allow-Methods: ".$method);

    //Renvois de la réponse
    echo json_encode($array, JSON_PRETTY_PRINT);
}