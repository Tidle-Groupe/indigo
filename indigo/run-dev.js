const fs = require('fs-extra');
const chokidar = require('chokidar');

//Lecture de la config générale
var configgjson = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var build = "dev";

var clockbuildlimite = 1;
var clocksleep = configgjson.devtimesleepbuild;
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//Execution du build de départ
eval(fs.readFileSync(__dirname + "/build.js")+'');
build_site("dev");
build_assets("dev");
build_api("dev");

//Ecoute des modifications du dossier sources site
chokidar.watch('./sources/site').on('all', (event, path) => {
    if(clockbuildlimite == 0){
      console.log(event, path);
      build_site("dev");
      console.log("Build site fini");
    }
});

//Ecoute des modifications du dossier sources assets
chokidar.watch('./sources/assets').on('all', (event, path) => {
  if(clockbuildlimite == 0){
    console.log(event, path);
    build_assets("dev");
    console.log("Build assets fini");
  }
});
  
sleep(clocksleep).then(() => {
    clockbuildlimite = 0;
    console.log("Build terminée, bon code !");
});