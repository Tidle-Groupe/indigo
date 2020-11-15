const fs = require('fs-extra');
const chokidar = require('chokidar');

//Lecture de la config générale
var configgjson = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var clockbuildlimite = 1;
var clocksleep = configgjson.devtimesleepbuild;
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//Execution du build de départ
eval(fs.readFileSync(__dirname + "/build.js")+'');
build("dev");

//Ecoute des modifications du dossier sources
chokidar.watch('./sources/site').on('all', (event, path) => {
    if(clockbuildlimite == 0){
      console.log(event, path);
      build("dev");
      console.log("Build fini");
    }
});
  
sleep(clocksleep).then(() => {
    clockbuildlimite = 0;
    console.log("Build terminée, bon code !");
});