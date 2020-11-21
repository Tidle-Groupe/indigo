const fs = require('fs-extra');
const chokidar = require('chokidar');

var build = "dev";

//Message de début de construction
console.log("Début du build !");

//Execution du build de départ
eval(fs.readFileSync(__dirname + "/build.js")+'');
//Comptage du temps du build de départ
var timebuildsite = Date.now();
build_bib_js = build_site("dev");
var timebuildsite = Date.now()-timebuildsite;
var timebuildassets = Date.now();
build_assets("dev", build_bib_js);
var timebuildassets = Date.now()-timebuildassets;
build_api("dev");
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
      build_site("dev");
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
      build_assets("dev", build_bib_js);
      timebuildassets = Date.now()-clock;
      console.log("Build assets fini");
      clocklastassets = Date.now();
    }
  });
}