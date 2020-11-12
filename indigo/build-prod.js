//Build Prod du code
const fs = require('fs-extra');

//Lecture de la config
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

//Suppression de l'ancien build
fs.removeSync("build_prod");

//Copie du dossier assets
fs.copySync('./sources/assets/static', './build_prod/assets/static');

//Copie du fichier de routage
fs.copySync('./sources/site/routeur.php', './build_prod/site/routeur.php');

//Détection des routes présentes dans le dossier sources (sources/site/route1, sources/site/route2, etc.)
var routes = fs.readdirSync('./sources/site');

//Boucle d'execution dans le répertoire des routes
var lengthroutes = routes.length;
for(let a = 0; a < lengthroutes;){

    //Vérification que l'élément existe
    if(fs.pathExistsSync('./sources/site/'+routes[a])){
        //Vérification qu'il s'agit bien d'un dossier
        if(fs.lstatSync('./sources/site/'+routes[a]).isDirectory()){
            //Détection des pages présentes dans la route
            var page = fs.readdirSync('./sources/site/'+routes[a]+'/page');

            //Boucle d'execution dans le répertoire des pages
            var lengthpage = page.length;
            for(let b = 0; a < lengthpage;){

                //Vérification que l'élément existe
                if(fs.pathExistsSync('./sources/site/'+routes[a]+'/page/'+page[b])){
                    //Vérification qu'il s'agit bien d'un fichier
                    if(fs.lstatSync('./sources/site/'+routes[a]+'/page/'+page[b]).isFile()){

                        //Manipulations sur le fichier page

                    }
                }

                b ++;
            }
        }
    }

    a ++;
}

//Message de fin de compilation
console.log("Compilation terminée !");