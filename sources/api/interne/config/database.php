<?php
class DataBase{
    //Déclaration MariaDB
    function mariadb(){
        return new PDO("mysql:host=db;dbname=api_interne;charset=utf8", "root", 'admin');
    }

    //Déclaration MongoDB
    function mongodb(){
        return new MongoDB\Driver\Manager("mongodb://root:admin@mongo/api_intern"); 
    }


    //Déclaration Postgres
    function postgresql(){
        return new PDO("pgsql:host=postgres;port=5432;dbname=postgres;user=postgres;password=admin");
    }

    //Déclaration Redis
    function redis(){
        $redis = new Redis();
        $redis->connect('redis', 6379);
        return $redis;
    }

    //Déclaration Memcached
    function memcached(){
        $memcached = new Memcached();
        $memcached->addServer("memcached", 11211);
        return $memcached;
    }
}