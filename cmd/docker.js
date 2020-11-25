//Script de gestion des conteneurs docker pour les projets indigo
const exec = require('child_process').execSync;
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Fonction docker compose
function docker_compose(cmd){
    //Execution du docker-compose
    console.log("Execution de l'action...");
    exec('docker-compose -f docker.yml '+cmd).toString();
}

//Fonction d'affichage du help
function help(){
    var help = `
      indigo docker <options>
  
      start .............. démarre les conteneurs docker de l'espace de travail indigo courant
      stop ............... arrête les conteneurs docker de l'espace de travail indigo courant
      install ............ installe les conteneurs docker de l'espace de travail indigo courant
      uninstall .......... supprime les conteneurs docker de l'espace de travail indigo courant
      help ............... permet d'afficher cette aide
      
      Pour plus d'informations, reportez-vous à la documentation:
      https://github.com/Tidle-Groupe/indigo/wiki`;
      
    console.log(help);
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
        //Commande install
        case 'install':
            docker_compose("up -d");
            break;
        //Commande uninstall
        case 'uninstall':
            docker_compose("down");
            break;
        //Affichage du help de la commande
        default:
            help();
    }

}

//Si une option est fournis avec la commande
var Args = process.argv.slice(2);
if(Args[1]){
    routage_choix(Args[1]);
    rl.close();
}else{
    //Demande de l'action à effectuer sur les conteneurs
    console.log("Quelle action effectuer ?");
    console.log("start, stop, install, uninstall, help");
    rl.question('', (choix) => {
        routage_choix(choix);
        rl.close();
    });

}