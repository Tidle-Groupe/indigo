//Build Dev du code
const fs = require('fs-extra');

//Définition des fonctions
function replaceAll(recherche, remplacement, chaineAModifier){
    return chaineAModifier.split(recherche).join(remplacement);
}

//Lecture de la config générale
var configgjson = JSON.parse(fs.readFileSync('config.json', 'utf8'));

//Lecture de la config des routes
var routesjson = JSON.parse(fs.readFileSync('sources/routes.json', 'utf8'));

//Suppression de l'ancien build
fs.removeSync("build_dev/site");
fs.removeSync("build_dev/assets");

//Copie du dossier assets
fs.copySync('sources/assets/static', 'build_dev/assets/static');

//Copie du fichier de routage
fs.copySync('sources/routeur.php', 'build_dev/site/routeur.php');

//Copie de la couche compatibilité
fs.copySync('couche-compatibilite.php', 'build_dev/couche-compatibilite.php');

var varlengthconfigroutes = routesjson.routes.length;
for(let a = 0; a < varlengthconfigroutes;){

    //Lecture de la config des pages
    var pagesjson = JSON.parse(fs.readFileSync('sources/'+routesjson.routes[a].chemin+'/pages.json', 'utf8'));

    //Lecture de la config des templates
    var templatejson = JSON.parse(fs.readFileSync('sources/'+routesjson.routes[a].chemin+'/templates.json', 'utf8'));
    
    //Création du repertoire de la première route
    fs.mkdirsSync('build_dev/site/'+routesjson.routes[a].nom);

    //Copie du fichier du controleur
    fs.copySync('sources/'+routesjson.routes[a].chemin+'/controleur.php', 'build_dev/site/'+routesjson.routes[a].nom+'/controleur.php');

    var varlengthconfigpage = pagesjson.pages.length;
    for(let b = 0; b < varlengthconfigpage;){

        //Page à remplacer
        var page_replace = fs.readFileSync('sources/'+routesjson.routes[a].chemin+'/pages/'+pagesjson.pages[b].chemin, 'utf8');

        //Ajout des templates
        var varlengthtemplate = templatejson.templates.length;
        for(let i = 0; i < varlengthtemplate;){
            var page_replace = replaceAll("<indigo:"+templatejson.templates[i].nom+"></indigo:"+templatejson.templates[i].nom+">", fs.readFileSync('sources/'+routesjson.routes[a].chemin+'/templates/'+templatejson.templates[i].chemin, 'utf8'), page_replace);
            i++
        }

        //Remplacement des variables
        var varlengthconfig = configgjson.variables.length;
        for(let i = 0; i < varlengthconfig;){
            var page_replace = replaceAll("{{{indigo:"+configgjson.variables[i].var+"}}}", configgjson.variables[i].replace, page_replace);
            i++
        }

        //Remplacement du domaine du site
        var page_replace = replaceAll('{{{:site:}}}', 'http://localhost:8000', page_replace);

        //Remplacement du domaine des assets
        var page_replace = replaceAll('{{{:assets:}}}', 'http://localhost:9000', page_replace);

        //Remplacement du domaine de l'api
        var page_replace = replaceAll("{{{:api:}}}", configgjson.prefix_domaine+configgjson.domaines.api, page_replace);

        //Réecriture du fichier
        fs.writeFileSync('build_dev/site/'+routesjson.routes[a].nom+'/'+pagesjson.pages[b].nom+'.html', page_replace, 'utf8');
        b++
    }
    a++
}

//Copie des exports
//css
var varlengthconfigcss = configgjson.assets.css.length;
for(let a = 0; a < varlengthconfigcss;){
    fs.mkdirsSync('build_dev/assets/'+configgjson.assets.css[a].chemin);
    fs.copySync('sources/assets/'+configgjson.assets.css[a].chemin+'/'+configgjson.assets.css[a].file, 'build_dev/assets/'+configgjson.assets.css[a].chemin+'/'+configgjson.assets.css[a].file);
    a++
}

//js
var varlengthconfigjs = configgjson.assets.js.length;
for(let a = 0; a < varlengthconfigjs;){
    fs.mkdirsSync('build_dev/assets/'+configgjson.assets.js[a].chemin);
    fs.copySync('sources/assets/'+configgjson.assets.js[a].chemin+'/'+configgjson.assets.js[a].file, 'build_dev/assets/'+configgjson.assets.js[a].chemin+'/'+configgjson.assets.js[a].file);
    a++
}

//php
//html

console.log("Compilation terminée !");