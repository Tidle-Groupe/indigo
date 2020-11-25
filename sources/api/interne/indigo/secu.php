<?php
//Vérification du token crsf
function crsf_check(){
    $allheader = getallheaders();
    if(!empty($_COOKIE['c_check']) OR !empty($allheader['x-csrf-token'])){
        if($_COOKIE['c_check'] == $allheader['x-csrf-token']){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}