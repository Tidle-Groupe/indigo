var http = require("http");
path = require("path");
const fs = require('fs-extra');
url = require("url");
runner = require("child_process");
const chokidar = require('chokidar');

//Lecture de la config générale
var configgjson = JSON.parse(fs.readFileSync('config.json', 'utf8'));

//Définition des variables et fonctions
var clockbuildlimite = 1;
var clocksleep = configgjson.devtimesleepbuild;
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//Appel du script de build
eval(fs.readFileSync(__dirname + "/build-dev.js")+'');

//Ecoute des modifications du dossier sources
chokidar.watch(__dirname+'/sources').on('all', (event, path) => {
  if(clockbuildlimite == 0){
    console.log(event, path);
    eval(fs.readFileSync(__dirname + "/build-dev.js")+'');
  }
});

sleep(clocksleep).then(() => {
  clockbuildlimite = 0;
  console.log("L'environnement de développement est prêt, bon code !");
});

//Serveur pour les assets
const port = 9000;
http.createServer(function (req, res) {
  // découpe l'URL
  const parsedUrl = url.parse(req.url);
  // Extrait le chemin de l'URL
  let pathname = "./build_dev/assets"+parsedUrl.pathname;
  // Associe le type MIME par rapport au suffixe du fichier demandé
  const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'application/font-sfnt'
  };
  fs.exists(pathname, function (exist) {
    if(!exist) {
      // si le fichier n'existe pas, renvoie 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }
    // s'il s'agit d'un répertoire, on tente d'y trouver un fichier index.html
    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
    }
    // lecture du fichier local
    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // extraction du suffixe de fichier selon le chemin basé sur l'URL fournie. ex. .js, .doc, ...
        const ext = path.parse(pathname).ext;
        // si le fichier est trouvé, définit le content-type et envoie les données
        res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });
}).listen(parseInt(port));
console.log(`Le serveur des assets écoute sur le port ${port}`);



//Serveur du domaine principal

//Envois d'une erreur
function sendError(errCode, errString, response)
{
  response.writeHead(errCode, {"Content-Type": "text/plain;charset=utf-8"});
  response.write(errString + "\n");
  response.end();
  return false;
}

//Envois des données à l'utilisateur
function sendData(err, stdout, stderr, response)
{
  if (err) return sendError(500, stderr, response);
  response.writeHead(200,{"Content-Type": "text/html;charset=utf-8"});
  response.write(stdout);
  response.end();
}

//Execution du code php
function runScript(exists, file, param, response)
{
  if(!exists) return sendError(404, 'Routeur non existant, merci de faire un build-dev', response);
  runner.exec("php " + file + " " + param,
  function(err, stdout, stderr) { sendData(err, stdout, stderr, response); });
}

//Interogation du routeur sur le controleur à suivre
function php(request, response)
{
  var urlpath = url.parse(request.url).pathname;
  var param = url.parse(request.url).query;
  if(param === null){
    var param = '"url='+urlpath+'"';
  }else{
    var param = '"'+param+'&url='+urlpath+'"';
  }
  //Pour le debeug => console.log(param);
  var localpath = path.join(process.cwd(), "build_dev\\couche-compatibilite.php");
  fs.exists(localpath, function(result) { runScript(result, localpath, param, response)});
}

var server = http.createServer(php);
server.listen(8000);
console.log("Le serveur de développement est accessible sur le port 8000.");