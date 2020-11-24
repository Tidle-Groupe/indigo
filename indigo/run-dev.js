const fs = require('fs-extra');
const exec = require('child_process').execSync;
const chokidar = require('chokidar');

//Message de début de construction
console.log("Début du build !");

//Evenements à la fermeture
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, () => {
    //On supprime le répertoire de dev_build
    fs.removeSync('./build_dev');
    //On stop les conteneurs docker
    exec('docker-compose -f docker.yml stop');
    process.exit(0);
  });
});

//Vérification que les conteneurs tournent
//Récupération de la config
var content = JSON.parse(fs.readFileSync('indigo.json', 'utf8'));
//Execution de la commande docker ps
var list_start = exec('docker ps').toString();
//Si aucuns conteneurs allumés ne correspondent au nom des conteneurs du projet courant
if(!list_start.includes(" "+content.docker_name+"_")){
  console.log("Démarrage des conteneurs docker du projet...");
  //On start manuellement le docker compose
  exec('docker-compose -f docker.yml start');
}

//Execution du build de départ
var build = require('../indigo/build.js');
build.init("dev");
//Comptage du temps du build de départ
var timebuildsite = Date.now();
build_bib_js = build.build_site("dev");
//si on à pas de retour d'erreur
if(build_bib_js !== 'error'){
  var timebuildsite = Date.now()-timebuildsite;
  var timebuildassets = Date.now();
  build.build_assets("dev", build_bib_js);
  var timebuildassets = Date.now()-timebuildassets;
  build.build_api("dev");
  watchfilebuild(timebuildsite, timebuildassets);
  //Message de fin de construction
  console.log("Build terminée !");

  //Fonction d'execution du build lors de modifications
  function watchfilebuild(timebuildinitsite, timebuildinitassets){
    timebuildsite = timebuildinitsite;
    timebuildassets = timebuildinitassets;
    clocklastsite = Date.now();
    clocklastassets = Date.now();

    //Ecoute des modifications du dossier sources site
    chokidar.watch('./sources/site').on('all', (event, path) => {
      if(Number(clocklastsite+timebuildsite+500) < Date.now()){
        console.log(event, path);
        //Message de début de construction
        console.log("Début du build !");
        //Comptage du nouveau temps de build
        var clock = Date.now();
        build.build_site("dev");
        timebuildsite = Date.now()-clock;
        console.log("Build site fini");
        clocklastsite = Date.now();
      }
    });

    //Ecoute des modifications du dossier sources assets
    chokidar.watch('./sources/assets').on('all', (event, path) => {
      if(Number(clocklastassets+timebuildassets+500) < Date.now()){
        console.log(event, path);
        //Message de début de construction
        console.log("Début du build !");
        //Comptage du nouveau temps de build
        var clock = Date.now();
        build.build_assets("dev", build_bib_js);
        timebuildassets = Date.now()-clock;
        console.log("Build assets fini");
        clocklastassets = Date.now();
      }
    });
  }
}