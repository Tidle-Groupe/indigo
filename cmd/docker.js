//Script de gestion des conteneurs docker pour les projets indigo
const exec = require('child_process').execSync;
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Fonction de démarrage
function docker_compose(cmd){
    //Execution du docker-compose start
    exec('docker-compose -f docker.yml '+cmd).toString();
}

//Fonction de routage
function routage_choix(choix){
    //Passage en minuscule
    var choix = choix.toLowerCase();

    //Redirection vers la fonction
    switch(choix){
        //Commande start
        case 'start':
            docker_compose("start");
            break;
        //Commande stop
        case 'stop':
            docker_compose("stop");
            break;
        //Commande uninstall
        case 'uninstall':
            docker_compose("down");
            break;
        //Affichage du help de la commande
        default:
    }

}

//Demande de l'action à effectuer sur les conteneurs
console.log("Quelle action effectuer ?");
console.log("start, stop, uninstall, help");
rl.question('', (choix) => {
    routage_choix(choix);
});