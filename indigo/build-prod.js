//Build Prod du code
const fs = require('fs-extra');
const minify = require('@node-minify/core');
const htmlMinifier = require('@node-minify/html-minifier');
const csso = require('@node-minify/csso');
const uglifyES = require('@node-minify/uglify-es');

//Définition des fonctions
function replaceAll(rec, rem, c){
    return c.split(rec).join(rem);
}
function get_extension(f) {
    return f.slice((f.lastIndexOf('.') - 1 >>> 0) + 2);
}
function get_no_extension(f) {
    let c = f.replace(/^.*\\/, '');
    return c.replace(/\.([a-z]+)$/, '');
}

//Lecture de la config
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

//Suppression de l'ancien build
fs.removeSync("./build_prod");


//Gestion de la partie site

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
            //Création du répertoire de la route
            fs.mkdirsSync('./build_prod/site/'+routes[a]);

            //Détection des pages présentes dans la route
            var page = fs.readdirSync('./sources/site/'+routes[a]+'/page');

            //Boucle d'execution dans le répertoire des pages
            var lengthpage = page.length;
            for(let b = 0; b < lengthpage;){

                //Vérification que l'élément existe
                if(fs.pathExistsSync('./sources/site/'+routes[a]+'/page/'+page[b])){
                    //Vérification qu'il s'agit bien d'un fichier
                    if(fs.lstatSync('./sources/site/'+routes[a]+'/page/'+page[b]).isFile()){

                        //Récupération de la page
                        var page_r = fs.readFileSync('./sources/site/'+routes[a]+'/page/'+page[b], 'utf8');

                        //Récupération du fichier de la page sans extension
                        var page_name = get_no_extension(page[b]);

                        //Vérification de l'extension de la page
                        switch(get_extension(page[b])){
                            case 'po':
                                //Parsage du fichier pour récupérer les éléments déclaratifs
                                eval(fs.readFileSync(__dirname + "/parse-po.js")+'');
                                var page_r = pars_po(page_r);
                            default:
                                //Par défaut on fait la même manipulation que pour un fichier html
                        }

                        //Remplacement des variables
                        var lengthvar = config.variables.length;
                        for(let c = 0; c < lengthvar;){
                            var page_r = replaceAll("{{{indigo:"+config.variables[c].var+"}}}", config.variables[c].replace, page_r);
                            c++;;
                        }

                        //Réecriture du fichier
                        fs.writeFileSync('./build_prod/site/'+routes[a]+'/'+page_name+'.html', page_r, 'utf8');

                        //minify du fichier
                        minify({
                            compressor: htmlMinifier,
                            input: './build_prod/site/'+routes[a]+'/'+page_name+'.html',
                            output: './build_prod/site/'+routes[a]+'/'+page_name+'.html',
                            options: {
                                removeAttributeQuotes: true,
                                removeComments: true,
                                collapseInlineTagWhitespace: false,
                                removeOptionalTags: false
                            }
                        });

                    }
                }

                b ++;
            }
        }
    }

    a ++;
}


//Gestion de la partie assets

//Copie du dossier assets
fs.copySync('./sources/assets/static', './build_prod/assets/static');

//CSS
function css_replace(d) {
    //Création du répertoire
    fs.mkdirsSync('./build_prod/assets/css/'+d);
    //Détection des fichiers css présents
    var assets_css = fs.readdirSync('./sources/assets/css/'+d);
    var lengthcss = assets_css.length;
    for(let a = 0; a < lengthcss;){
        //Vérification que l'élément existe
        if(fs.pathExistsSync('./sources/assets/css/'+d+assets_css[a])){
            //Si c'est un fichier
            if(fs.lstatSync('./sources/assets/css/'+d+assets_css[a]).isFile()){
                if(get_extension(assets_css[a]) == "css"){
                    minify({
                        compressor: csso,
                        input: './sources/assets/css/'+d+assets_css[a],
                        output: './build_prod/assets/css/'+d+assets_css[a]
                    });
                }
            }

            //Si c'est un répertoire
            if(fs.lstatSync('./sources/assets/css/'+d+assets_css[a]).isDirectory()){
                css_replace(d+assets_css[a]+'/');
            }
        }
        a++;
    }
}
css_replace('');

//JS
function js_replace(d) {
    //Création du répertoire
    fs.mkdirsSync('./build_prod/assets/js/'+d);
    //Détection des fichiers js présents
    var assets_js = fs.readdirSync('./sources/assets/js/'+d);
    var lengthjs = assets_js.length;
    for(let a = 0; a < lengthjs;){
        //Vérification que l'élément existe
        if(fs.pathExistsSync('./sources/assets/js/'+d+assets_js[a])){
            //Si c'est un fichier
            if(fs.lstatSync('./sources/assets/js/'+d+assets_js[a]).isFile()){
                if(get_extension(assets_js[a]) == "js"){
                    minify({
                        compressor: uglifyES,
                        input: './sources/assets/js/'+d+assets_js[a],
                        output: './build_prod/assets/js/'+d+assets_js[a]
                    });
                }
            }

            //Si c'est un répertoire
            if(fs.lstatSync('./sources/assets/js/'+d+assets_js[a]).isDirectory()){
                js_replace(d+assets_js[a]+'/');
            }
        }
        a++;
    }
}
js_replace('');

//Message de fin de compilation
console.log("Compilation terminée !");