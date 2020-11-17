//Build du code
const fs = require('fs-extra');
const minify = require('@node-minify/core');
const htmlMinifier = require('@node-minify/html-minifier');
const csso = require('@node-minify/csso');
const uglifyES = require('@node-minify/uglify-es');

//Lecture de la config
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    
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

//Définition des variables de base
if(build == "prod"){
    //Si l'export est une prod
    var domaine_site = config.domaines.site;
    var domaine_assets = config.domaines.assets;
    var domaine_api_int = config.domaines.site+"/api";
    var domaine_api_ext = config.domaines.api;

    var dir_export = "build_prod";
}else{
    //Sinon par défaut on considère l'export comme dev
    var domaine_site = "http://localhost";
    var domaine_assets = "http://localhost:9000";
    var domaine_api_int = "http://localhost/api";
    var domaine_api_ext = "";

    var dir_export = "build_dev";
}

function replace_domaines(input){
    //Remplacement du domaine du site
    var page_r = replaceAll('{{{:site:}}}', domaine_site, input);

    //Remplacement du domaine des assets
    var page_r = replaceAll('{{{:assets:}}}', domaine_assets, page_r);

    //Remplacement du domaine de l'api
    //var page_r = replaceAll("{{{:api:}}}", domaine_api, page_r);

    return page_r;
}

function build_site(build){
    
    function get_layout(d, r) {
        //Détection des layouts
        var layout_get = fs.readdirSync('./sources/site/'+r+'/layout/'+d);
        var lengthlayout = layout_get.length;
        for(let a = 0; a < lengthlayout;){
            //Vérification que l'élément existe
            if(fs.pathExistsSync('./sources/site/'+r+'/layout/'+d+layout_get[a])){
                //Si c'est un fichier
                if(fs.lstatSync('./sources/site/'+r+'/layout/'+d+layout_get[a]).isFile()){
                    if(get_extension(layout_get[a]) == "html"){
                        layout_route.push(d+get_no_extension(layout_get[a]));
                    }
                }

                //Si c'est un répertoire
                if(fs.lstatSync('./sources/site/'+r+'/layout/'+d+layout_get[a]).isDirectory()){
                    get_layout(d+layout_get[a]+'/', r);
                }
            }
            a++;
        }
    }

    //Suppression de l'ancien build
    fs.removeSync("./"+dir_export+'/site');


    //Gestion de la partie site

    //Copie du fichier de routage
    fs.copySync('./sources/site/routeur.php', './'+dir_export+'/site/routeur.php');

    //Copie du fichier index
    fs.copySync('./sources/site/index.php', './'+dir_export+'/site/index.php');

    //Copie du fichier .htaccess
    fs.copySync('./sources/site/.htaccess', './'+dir_export+'/site/.htaccess');

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
                fs.mkdirsSync('./'+dir_export+'/site/'+routes[a]);

                //Déplacement du controleur de la route
                fs.copySync('./sources/site/'+routes[a]+'/controleur.php', './'+dir_export+'/site/'+routes[a]+'/controleur.php');

                //Récupération des layouts pour la route
                var layout_route = [];
                get_layout('', routes[a]);


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

                            //Parsage du po avec renvois sous forme de code html
                            eval(fs.readFileSync(__dirname + "/parse-po.js")+'');
                            var page_r = pars_po(page_r, routes[a]);

                            //Remplacement des layouts
                            var lengthlayout = layout_route.length;
                            for(let c = 0; c < lengthlayout;){
                                //Vérification qu'il s'agit bien d'un fichier
                                var layout_return = fs.readFileSync('./sources/site/'+routes[a]+'/layout/'+layout_route[c]+'.html', 'utf8');
                                var page_r = replaceAll("<indigo:"+layout_route[c]+"></indigo>", layout_return, page_r);
                                c++;
                            }

                            //Remplacement des variables
                            var lengthvar = config.variables.length;
                            for(let c = 0; c < lengthvar;){
                                var page_r = replaceAll("{{{indigo:"+config.variables[c].var+"}}}", config.variables[c].replace, page_r);
                                c++;
                            }

                            var page_r = replace_domaines(page_r);

                            //Réecriture du fichier
                            fs.writeFileSync('./'+dir_export+'/site/'+routes[a]+'/'+page_name+'.html', page_r, 'utf8');

                            //minify du fichier
                            minify({
                                compressor: htmlMinifier,
                                input: './'+dir_export+'/site/'+routes[a]+'/'+page_name+'.html',
                                output: './'+dir_export+'/site/'+routes[a]+'/'+page_name+'.html',
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
}
function build_assets(build){
    //Gestion de la partie assets

    //Suppression de l'ancien dossier
    fs.removeSync('./'+dir_export+'/assets');

    //Copie du dossier assets
    fs.copySync('./sources/assets/static', './'+dir_export+'/assets/static');

    //CSS
    function css_replace(d) {
        //Création du répertoire
        fs.mkdirsSync('./'+dir_export+'/assets/css/'+d);
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
                            output: './'+dir_export+'/assets/css/'+d+assets_css[a]
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
        fs.mkdirsSync('./'+dir_export+'/assets/js/'+d);
        //Détection des fichiers js présents
        var assets_js = fs.readdirSync('./sources/assets/js/'+d);
        var lengthjs = assets_js.length;
        for(let a = 0; a < lengthjs;){
            //Vérification que l'élément existe
            if(fs.pathExistsSync('./sources/assets/js/'+d+assets_js[a])){
                //Si c'est un fichier
                if(fs.lstatSync('./sources/assets/js/'+d+assets_js[a]).isFile()){
                    if(get_extension(assets_js[a]) == "js"){
                        //Récupération du js
                        var content_js = fs.readFileSync('./sources/assets/js/'+d+assets_js[a], 'utf8');
                        //Changement du domaine d'api intern
                        var content_js = replaceAll('http://api.intern', domaine_api_int, content_js);
                        //Changement des domaines
                        var content_js = replace_domaines(content_js);
                        //Réecriture du fichier
                        fs.writeFileSync('./'+dir_export+'/assets/js/'+d+assets_js[a], content_js, 'utf8');
                        minify({
                            compressor: uglifyES,
                            input: './'+dir_export+'/assets/js/'+d+assets_js[a],
                            output: './'+dir_export+'/assets/js/'+d+assets_js[a]
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
}
function build_api(build){
    //Gestion de la partie api

    //Gestion de la partie api interne
    if(build == "prod"){
        //Création du répertoire 
        fs.mkdirsSync('./build_prod/api/interne');

        //Copie de l'ensemble des fichiers
        fs.copySync('./sources/api/interne', './build_prod/api/interne');

        //Récupération du routeur
        var api_routeur = fs.readFileSync('./build_prod/api/interne/routeur.php', 'utf8');
        //Changement du allow origin
        var api_routeur = replaceAll("header(\"Access-Control-Allow-Origin: *\");", "header(\"Access-Control-Allow-Origin: "+config.domaines.site+"\");", api_routeur);
        //Changement des domaines du site pour l'api interne
        if(domaine_site.startsWith('https://')){
            domaine_site_http = replaceAll("https://", "", domaine_site);
            domaine_site_bo = true;
        }else{
            domaine_site_http = replaceAll("http://", "", domaine_site);
            domaine_site_bo = false;
        }
        var api_routeur = replaceAll("$domain_cookie = \"localhost\";", "$domain_cookie = \""+domaine_site_http+"\";", api_routeur);
        var api_routeur = replaceAll("$ssl_cookie = false;", "$ssl_cookie = "+domaine_site_bo+";", api_routeur);
        fs.writeFileSync('./build_prod/api/interne/routeur.php', api_routeur, 'utf8');
    }
}