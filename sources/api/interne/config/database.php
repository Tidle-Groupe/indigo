<?php
//Déclaration MariaDB
$mariadb = new PDO("mysql:host=127.0.0.1;dbname=tidle_api;charset=utf8", "root", 'admin');

//Déclaration MongoDB

//Déclaration Postgres

//Déclaration Redis
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

//Déclaration Memcached