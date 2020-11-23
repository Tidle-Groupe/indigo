const fs = require('fs-extra');
//Récupération des arguments
var Args = process.argv.slice(2);

//Fonction de vérification indigo
function verif_indigo(){
    if(fs.pathExistsSync('indigo.json')){
        //On vérifie les informations de version, etc
        return true;
    }else{
        return false;
    }
}

//On regarde si le répertoire d'execution est un espace de travail indigo
if(verif_indigo()){
    //Si c'est le cas

    //Redirection vers le script correspondant
    switch (Args[0]) {
        //Démarrage du serveur local du projet
        case 'run':
            require('../cmd/run.js');
            break;
        //Build du projet pour la production
        case 'build':
            require('../cmd/build.js');
            break;
        //Installation de docker pour indigo (installation commune pour tous les espaces de travail)
        case 'docker':
            require('../cmd/docker.js');
            break;
        //Affichage des commandes disponibles
        default:
            require('../cmd/help.js');
    }

}else{
    //Si ce n'est pas le cas
    switch (Args[0]) {
        //Création d'un nouvelle espace de travail indigo
        case 'new':
            require('../cmd/new.js');
            break;
        //Installation de docker pour indigo (installation commune pour tous les espaces de travail)
        case 'docker':
            require('../cmd/docker.js');
            break;
        //Affichage des commandes disponibles
        case 'help':
            require('../cmd/help.js');
            break;
        //Affichage d'une erreur espace de travail indigo non reconnus
        default:
            console.log("Le répertoire courant n'est pas un espace de travail indigo, la commande \"indigo "+Args[0]+"\" ne peut pas être utilisée ici");
    }
}