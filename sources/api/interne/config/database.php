<?php
//Déclaration MariaDB
$mariadb = new PDO("mysql:host=db;dbname=api_interne;charset=utf8", "root", 'admin');

//Déclaration MongoDB

//Déclaration Postgres
$postgres = new PDO("pgsql:host=postgres;port=5432;dbname=postgres;user=postgres;password=admin");

//Déclaration Redis
$redis = new Redis();
$redis->connect('redis', 6379);

//Déclaration Memcached