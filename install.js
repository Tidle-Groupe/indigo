//Script d'installation à l'inistialisation de l'environnement
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//Déclarations fonctions
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
    return d+"\r\n\r\n  mariadb:\r\n    image: mariadb\r\n    restart: always\r\n    environment:\r\n      MYSQL_ROOT_PASSWORD: admin";
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
    var docker_compose = "version: '3.1'\r\n\r\nservices:";
    if(bdd_recherche.includes("mariadb")){
        var docker_compose = docker_mariadb_add(docker_compose);
        ajout++;
    }

    //Vérification qu'au moins un élement est détecter
    if(ajout == 0){
        //Valeur par défaut si rien n'est rentrer
        docker_mariadb_add();
    }

    //Récupération du choix memcached
    switch(cache){
        case 'o':
            //Réponse oui
        default:
            //Par défaut, non
    }
    console.log(bdd_recherche);
    console.log(docker_compose);
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
