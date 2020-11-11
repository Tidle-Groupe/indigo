//Build Prod du code
const fs = require('fs-extra');
const minify = require('@node-minify/core');
const htmlMinifier = require('@node-minify/html-minifier');
const csso = require('@node-minify/csso');
const uglifyES = require('@node-minify/uglify-es');

//Définition des fonctions
function replaceAll(recherche, remplacement, chaineAModifier){
    return chaineAModifier.split(recherche).join(remplacement);
}

//Lecture de la config générale
var configgjson = JSON.parse(fs.readFileSync('config.json', 'utf8'));

//Lecture de la config des routes
var routesjson = JSON.parse(fs.readFileSync('sources/routes.json', 'utf8'));

//Suppression de l'ancien build
fs.removeSync("build_prod");

//Copie du dossier assets
fs.copySync('sources/assets/static', 'build_prod/'+configgjson.domaines.assets+'/static');

//Copie du fichier de routage
fs.copySync('sources/routeur.php', 'build_prod/routeur.php');

var varlengthconfigroutes = routesjson.routes.length;
for(let a = 0; a < varlengthconfigroutes;){

    //Lecture de la config des pages
    var pagesjson = JSON.parse(fs.readFileSync('sources/'+routesjson.routes[a].chemin+'/pages.json', 'utf8'));

    //Lecture de la config des templates
    var templatejson = JSON.parse(fs.readFileSync('sources/'+routesjson.routes[a].chemin+'/templates.json', 'utf8'));
    
    //Création du repertoire de la première route
    fs.mkdirsSync('build_prod/'+configgjson.domaines.site+'/'+routesjson.routes[a].nom);

    //Copie du fichier du controleur
    fs.copySync('sources/'+routesjson.routes[a].chemin+'/controleur.php', 'build_prod/'+configgjson.domaines.site+'/'+routesjson.routes[a].nom+'/controleur.php');

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
        var page_replace = replaceAll('{{{:site:}}}', configgjson.prefix_domaine+configgjson.domaines.site, page_replace);

        //Remplacement du domaine des assets
        var page_replace = replaceAll('{{{:assets:}}}', configgjson.prefix_domaine+configgjson.domaines.assets, page_replace);

        //Remplacement du domaine de l'api
        var page_replace = replaceAll("{{{:api:}}}", configgjson.prefix_domaine+configgjson.domaines.api, page_replace);


        //


        //Réecriture du fichier
        fs.writeFileSync('build_prod/'+configgjson.domaines.site+'/'+routesjson.routes[a].nom+'/'+pagesjson.pages[b].nom+'.html', page_replace, 'utf8');

        //minify du fichier
        minify({
            compressor: htmlMinifier,
            input: 'build_prod/'+configgjson.domaines.site+'/'+routesjson.routes[a].nom+'/'+pagesjson.pages[b].nom+'.html',
            output: 'build_prod/'+configgjson.domaines.site+'/'+routesjson.routes[a].nom+'/'+pagesjson.pages[b].nom+'.html',
            options: {
                removeAttributeQuotes: true,
                removeComments: true,
                collapseInlineTagWhitespace: false,
                removeOptionalTags: false
            },
            callback: function(err, min) {}
        });
        b++
    }
    a++
}

//Compilation des exports
//css
var varlengthconfigcss = configgjson.assets.css.length;
for(let a = 0; a < varlengthconfigcss;){
    fs.mkdirsSync('build_prod/'+configgjson.domaines.assets+'/'+configgjson.assets.css[a].chemin);
    minify({
        compressor: csso,
        input: 'sources/assets/'+configgjson.assets.css[a].chemin+'/'+configgjson.assets.css[a].file,
        output: 'build_prod/'+configgjson.domaines.assets+'/'+configgjson.assets.css[a].chemin+'/'+configgjson.assets.css[a].file,
        callback: function(err, min) {}
      });
    a++
}

//js
var varlengthconfigjs = configgjson.assets.js.length;
for(let a = 0; a < varlengthconfigjs;){
    fs.mkdirsSync('build_prod/'+configgjson.domaines.assets+'/'+configgjson.assets.js[a].chemin);
    minify({
        compressor: uglifyES,
        input: 'sources/assets/'+configgjson.assets.js[a].chemin+'/'+configgjson.assets.js[a].file,
        output: 'build_prod/'+configgjson.domaines.assets+'/'+configgjson.assets.js[a].chemin+'/'+configgjson.assets.js[a].file,
        callback: function(err, min) {}
      });
    a++
}

//php
//html

console.log("Compilation terminée !");