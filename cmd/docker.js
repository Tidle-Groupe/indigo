//Script d'installation à l'inistialisation de l'environnement
const fs = require('fs-extra');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//Déclarations fonctions
function replaceAll(rec, rem, c){
    return c.split(rec).join(rem);
}
function cleanArray(array) {
    var i, j, len = array.length, out = [], obj = {};
    for(i = 0; i < len; i++){
      obj[array[i]] = 0;
    }
    for(j in obj){
      out.push(j);
    }
    return out;
}
function docker_mariadb_add(d){
    return d+"\r\n\r\n  db:\r\n    image: mariadb\r\n    ports:\r\n      - 3306:3306\r\n    environment:\r\n      MYSQL_ROOT_PASSWORD: admin\r\n      MYSQL_DATABASE: api_interne\r\n\r\n  phpmyadmin:\r\n    image: phpmyadmin\r\n    ports:\r\n      - 8080:80\r\n    environment:\r\n      - PMA_ARBITRARY=1";
}
function docker_redis_add(d){
    return d+"\r\n\r\n  redis:\r\n    image: redis\r\n    ports:\r\n      - 6379:6379";
}
function docker_postgres_add(d){
    return d+"\r\n\r\n  postgres:\r\n    image: postgres\r\n    ports:\r\n      - 5432:5432\r\n    environment:\r\n      POSTGRES_PASSWORD: admin\r\n\r\n";
}
function docker_mongodb_add(d){
    return d+"\r\n\r\n  mongo:\r\n    image: mongo\r\n    ports:\r\n      - 27017:27017\r\n    environment:\r\n      MONGO_INITDB_ROOT_USERNAME: root\r\n      MONGO_INITDB_ROOT_PASSWORD: admin\r\n\r\n  mongo-express:\r\n    image: mongo-express\r\n    ports:\r\n      - 8082:8081\r\n    environment:\r\n      ME_CONFIG_MONGODB_ADMINUSERNAME: root\r\n      ME_CONFIG_MONGODB_ADMINPASSWORD: admin";
}
function docker_memcached_add(d){
    return d+"\r\n\r\n  memcached:\r\n    image: memcached\r\n    ports:\r\n      - 11211:11211";
}
function bdd_choix(bdd, cache){
    console.log("Installation en cours...");
    //Passage en minuscule de l'entrée
    var bdd = bdd.toLowerCase();
    var cache = cache.toLowerCase();

    //Récupération du choix bdd dans un tableau
    var bdd_recherche = bdd.split("-");

    //Valeur par défaut si l'utilisateur ne choisis rien
    if(bdd_recherche.length == 1){
        bdd_recherche.splice(0);
        bdd_recherche.push("mariadb");
    }

    //Retrait des éléments en double
    var bdd_recherche = cleanArray(bdd_recherche);
    
    //Ajout des éléments pour chaques options
    var ajout = 0;
    var links = 0;
    var links_name = "";
    var docker_compose = "version: '3.1'\r\n\r\nservices:\r\n\r\n  php_site_api:\r\n    image: tidleindigo/serverlocal:latest\r\n    ports:\r\n      - 80:80\r\n    {links_list}volumes:\r\n      - ./build_dev/site:/app/site\r\n      - ./sources/api/interne:/app/site/api\r\n\r\n  apache_assets:\r\n    image: httpd\r\n    ports:\r\n      - 9000:80\r\n    volumes:\r\n      - ./build_dev/assets:/usr/local/apache2/htdocs";
    if(bdd_recherche.includes("mariadb")){
        var docker_compose = docker_mariadb_add(docker_compose);
        ajout++;
        links++;
        links_name = links_name+"      - db:db\r\n";
    }
    if(bdd_recherche.includes("redis")){
        var docker_compose = docker_redis_add(docker_compose);
        ajout++;
        links++;
        links_name = links_name+"      - redis:redis\r\n";
    }
    if(bdd_recherche.includes("postgres")){
        var docker_compose = docker_postgres_add(docker_compose);
        ajout++;
        links++;
        links_name = links_name+"      - postgres:postgres\r\n";
    }
    if(bdd_recherche.includes("mongodb")){
        var docker_compose = docker_mongodb_add(docker_compose);
        ajout++;
        links++;
        links_name = links_name+"      - mongo:mongo\r\n";
    }

    //Vérification qu'au moins un élement est détecter
    if(ajout == 0){
        //Valeur par défaut si rien n'est rentrer
        var docker_compose = docker_mariadb_add(docker_compose);
        links++;
        links_name = links_name+"      - db:db\r\n";
    }

    //Récupération du choix memcached
    switch(cache){
        case 'o':
            //Réponse oui
            var docker_compose = docker_memcached_add(docker_compose);
            links++;
            links_name = links_name+"      - memcached:memcached\r\n";
        default:
            //Par défaut, non
    }

    //Ajout des links aux bases de données présentes
    if(links == 0){
        var links_replace = "";
    }else{
        var links_replace = "links:\r\n"+links_name+"    ";
    }
    var docker_compose = replaceAll("{links_list}", links_replace, docker_compose);

    //Ecriture du fichier docker
    fs.writeFileSync('./indigo.yml', docker_compose, 'utf8');
    console.log("Installation terminée !");
}

//Initialisation de la première route

//Construction du fichier docker à partir des éléments rentrés
console.log("Quelles bases de données voulez vous utiliser ?");
console.log("saisissez les noms séparés de - ");
console.log("Redis-MongoDB-MariaDB-Postgres");
rl.question('', (choix_bdd) => {
    console.log("Installer Memcached ? O-N");
    rl.question('', (choixmemcached) => {
        bdd_choix(choix_bdd, choixmemcached);
        rl.close();
    });
});
