//Parsage du html pour récupérer les scripts js et css utilisés 
//Script qui s'effectue une fois la compilation terminée, dans la partie js des assets
function get_scripts_js(page){
    //Variables de bases
    var regex = /<script.*?src="(.*?)"><\/script>/gmi;
    var balisejs = [];
    var srcjs = [];

    //Récupération du nombre de balises scripts
    var splitscriptend = page.split('</script>');
    var scriptlength = Number(splitscriptend.length-1);
    //Boucle de récupération pour chaques balises script
    for(let a = 0; a < scriptlength;){
        //Vérification qu'il s'agit d'une balise script src
        var src = regex.exec(page);
        if(src){
            //Ajout de la balise dans un tableau
            balisejs.push(src[0]);
            //Ajout de la source dans un tableau
            srcjs.push(src[1].replace(domaine_assets, ''));
        }
        a++;
    }
    //Boucle de retrait des balsies scripts de la page
    for(let a = 0; a < scriptlength;){
        //Retrait de la balise script de la page
        var page = page.replace(balisejs[a], '');
        a++;
    }
    //Mise à zéro du tableau des balises script
    var balisejs = [];

    //Gestion du retour
    return srcjs;
}

function mappage_scripts(array_js, page){
    var lengtharrayjs = array_js.length;
    //Boucle de récupération des éléments du tableau
    for(let a = 0; a < lengtharrayjs;){
        var scriptjs = array_js[a];
        if(!jsmap[array_js[a]]){
            jsmap[scriptjs] = [];
        }
        jsmap[scriptjs].push(page);
        a++;
    }
}

function mappage_pages(page, array_js){
    var lengtharrayjs = array_js.length;
    //Boucle de récupération des éléments du tableau
    for(let a = 0; a < lengtharrayjs;){
        var scriptjs = array_js[a];
        if(!pagemap[page]){
            pagemap[page] = [];
        }
        pagemap[page].push(scriptjs);
        a++;
    }
}

function html_parse_js(){
    //Récupération des routes du dossier à partir d'un tableau créer par le build site
    // build_route => donne la liste des routes, build_page[build_route]=> donne la liste des pages pour une route

    //Variable de base
    jspagesget = [];
    jsuses = [];
    jsmap = [];
    pagemap = [];
    jsordre = [];
    jsid = [];

    //Vérification des fichiers js utilsiés par chaques pages
    //Récupération de la longueur des routes
    var lengthroutes = build_route.length;
    for(let a = 0; a < lengthroutes;){
        var route = build_route[a];
        //Récupération de la longueur des pages
        var lengthpages = build_page[route].length;
        for(let b = 0; b < lengthpages;){
            var page = build_page[build_route[a]][b];
            //Récupération de la page
            var page_r = fs.readFileSync('./'+dir_export+'/site/'+route+'/'+page, 'utf8');
            var array_js = get_scripts_js(page_r);
            var lengtharrayjs = array_js.length;
            //Boucle de récupération des éléments du tableau
            for(let c = 0; c < lengtharrayjs;){
                if(!jspagesget['/'+route+'/'+page]){
                    jspagesget['/'+route+'/'+page] = [];
                }
                jspagesget['/'+route+'/'+page].push(array_js[c]);
                if(!jsuses.includes(array_js[c])){
                    jsuses.push(array_js[c]);
                }
                c++;
            }
            //Mappage des scripts par apport aux pages qui les appelles
            mappage_scripts(array_js, '/'+route+'/'+page);
            //Mappage des pages par apport aux scripts qu'elles appelles
            mappage_pages('/'+route+'/'+page, array_js);
            b++;
        }
        a++;
    }

    //On regarde sur quel niveau se trouve le script dans chaques scripts
    //On parcourt chaques scripts déclarés
    var jsuseslength = jsuses.length;
    for(let a = 0; a < jsuseslength;){
        var scriptname = jsuses[a];
        if(!jsordre[scriptname]){
            jsordre[scriptname] = [];
        }
        //On parcours les pages ou chaques scripts sont utilisés
        jsmaplength = jsmap[scriptname].length;
        for(let b = 0; b < jsmaplength;){
            var page = jsmap[scriptname][b];
            //On récupère l'index de l'élément sur le mappage de la page utiliser
            var ordre = pagemap[page].indexOf(scriptname);
            jsordre[scriptname][page] = ordre;
            b++;
        }
        a++;
    }

    //Gestion des fusions des fichiers utilisés au même niveau et sur les mêmes pages
    //Boucle sur un même fichier
    var jsuseslength = jsuses.length;
    for(let a = 0; a < jsuseslength;){
        var jsfusionsone = [];
        var jsfusion = [];
        var scriptname = jsuses[a];

        //Fusion des mêmes fichiers utilisés sur plusieurs pages
        //On regarde si le fichier apparaît sur plusieurs pages
        var jsmaplength = jsmap[scriptname].length;
        if(jsmaplength !== 1){
            //Si le fichier apparaît sur plusieurs pages on récupère l'ordre par apport aux pages
            for(let b = 0; b < jsmaplength;){
                var page = jsmap[scriptname][b];
                var ordre_execution = jsordre[scriptname][page];
                jsfusionsone.push(ordre_execution);
                b++;
            }
            //On regarde sur chaques pages si un id est présent dans d'autres fichiers
            for(let b = 0; b < jsmaplength;){
                var page = jsmap[scriptname][b];
                var ordre_execution = jsfusionsone[b];
                //Retrait de l'ordre actuel pour la boucle
                let debut = jsfusionsone.indexOf(ordre_execution);
                let jsfusionsretrait = jsfusionsone.splice(Number(debut-1), 1);

                //On vérifie si il existe un autre élément sur le même ordre dans le tableau
                if(jsfusionsretrait.includes(ordre_execution)){
                    console.log("Le fichier est en double !");
                }
                b++;
            }
        }

        a++;
    }

    //Attribution des id de scripts en fonction de l'ordre d'apparition dans les scripts
    var nextidscript = 0;
    var jsuseslength = jsuses.length;
    for(let a = 0; a < jsuseslength;){
        var scriptname = jsuses[a];
        //Si le script ne possède qu'un seul ordre 
        if(jsordre[scriptname].length == 1){
            jsid[scriptname] = [nextidscript];
            nextidscript++;
        }else{
            //Si le script apparaît à plusieurs ordres
            var jsordrelength = jsordre[scriptname].length;
            jsid[scriptname] = [];
            for(let b = 0; b < jsordrelength;){
                //On attribut un id à chaques ordres
                jsid[scriptname][b] = [nextidscript];
                nextidscript++;
                b++;
            }
        }
        a++;
    }

    //Réecriture des pages avec la balise avec le ou les nouveaux script



    /*console.log(jspagesget["/default/home.html"][0]);
    console.log(jsuses);
    console.log(jsmap);
    console.log(jsordre);
    console.log(jsid);*/
    console.log(jsmap);
    console.log(pagemap);
    console.log(jsordre['/js/script.js']['/default/home.html']);
}