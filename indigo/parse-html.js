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

function export_map_add(page, script, id){
    //On vérifie que la page n'est pas déjà déclarée
    if(!array_export[page]){
        array_export[page] = [];
    }
    array_export[page].push(id);
    //On vérifie que le script n'est pas déjà déclaré
    if(!array_export_js[script]){
        array_export_js[script] = [];
    }
    //On vérfie que le l'id n'est pas déjà présent
    if(!array_export_js[script].includes(id)){
        array_export_js[script].push(id);
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
    jslistfusions = [];
    scriptexportbalise = [];
    jsfusionsinter = [];
    array_export = [];
    array_export_js = [];
    var nextidscript = 0;

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

    //Gestion des fusions de fichiers de même niveau
    //On parcourt chaques scripts déclarés
    var jsuseslength = jsuses.length;
    for(let a = 0; a < jsuseslength;){
        var scriptname = jsuses[a];
        ordre_array = [];
        
        //On regarde si le fichier apparaît sur plusieurs pages
        var jsmaplength = jsmap[scriptname].length;
        if(jsmaplength !== 1){
            if(!jsfusionsinter[scriptname]){
                jsfusionsinter[scriptname] = [];
            }
            console.log(scriptname+' apparaît sur plusieurs pages');
            //Boucle pour chaques pages ou le fichier apparait
            jsmaplength = jsmap[scriptname].length;
            for(let b = 0; b < jsmaplength;){
                //On récupère tous les ordres du fichier sur chacunes des pages ou il apparait
                ordre_array.push(jsordre[scriptname][jsmap[scriptname][b]]);
                b++;
            }
            //Boucle pour chaques pages ou le fichier apparait
            /*for(let b = 0; b < jsmaplength;){
                var page = jsmap[scriptname][b];
                var ordre_execution = jsordre[scriptname][page];

                //On retire l'ordre sur la page actuelle pour comparer si une autre page appelle le script au même ordre
                let jsfusionsretrait = ordre_array.splice(ordre_execution, 1);

                //On regarde si il existe un un autre élément sur le même ordre dans le tableau
                if(jsfusionsretrait.includes(ordre_execution)){
                    //On vérifie que la page n'est pas déjà incluse dans le tableau de fusion du script
                    console.log('match !');
                }
                console.log(jsfusionsretrait);
                console.log(ordre_execution);
                
                b++;
            }*/
            //On vérifie si deux scripts sont executés par les mêmes pages et dans le même ordre
            //Boucle pour chaques pages ou le fichier apparait
            console.log('=====');
            for(let b = 0; b < jsmaplength;){
                var page = jsmap[scriptname][b];
                var ordre_execution = jsordre[scriptname][page];

                //On récupère les pages ou sont executés les scripts
                var pages = jsmap[scriptname];

                //On regarde si le script est executer sur plusieurs pages
                if(pages.length !== 1){
                    //On créer un tableau pour répertorier la fusion inter-pages
                    for(let c = 0; c < jsmaplength;){
                        //On vérifie que le fichier se trouve au même niveau sur la page
                        if(ordre_execution == jsordre[scriptname][pages[c]]){
                            if(!jsfusionsinter[scriptname][ordre_execution]){
                                jsfusionsinter[scriptname][ordre_execution] = [];
                            }
                            //On vérifie que le fichier n'est pas déjà présent
                            if(!jsfusionsinter[scriptname][ordre_execution].includes(pages[c])){
                                jsfusionsinter[scriptname][ordre_execution].push(pages[c]);
                            }
                        }
                        c++;
                    }
                }

                b++;
            }
        }else{
            //Si le fichier n'apparaît que sur une page
            console.log("single exec "+scriptname);
        }
        a++;
    }

    //Attribution des id pour chaques scripts en fonction des fusions
    //On parcourt chaques fichiers script
    var jsuseslength = jsuses.length;
    for(let a = 0; a < jsuseslength;){
        var scriptname = jsuses[a];

        //On vérifie si une fusion à était effectuer sur l'élément
        if(jsfusionsinter[scriptname]){
            //Boucle de fusion pour le script
            for(let b = 0; b < jsfusionsinter[scriptname].length;){
                //Si la liste d'export contient plusieurs pages
                if(jsfusionsinter[scriptname][b].length !== 1){
                    //On boucle les différentes pages
                    for(let c = 0; c < jsfusionsinter[scriptname].length;){
                        console.log('fusion effectuée pour '+jsfusionsinter[scriptname][b][c]+' script: '+scriptname);
                        export_map_add(jsfusionsinter[scriptname][b][c], scriptname, nextidscript);
                        c++;
                    }
                }else{
                    console.log('fusion effectuée pour '+jsfusionsinter[scriptname][b]+' script: '+scriptname);
                    export_map_add(jsfusionsinter[scriptname][b], scriptname, nextidscript);
                    //On retire l'élément de la map d'export
                }
                b++;
                nextidscript++;
            }
        }else{
            //Si l'élément n'a pas était fusionné

            nextidscript++;
        }
        

        a++;
    }

    console.log(array_export);
    console.log(array_export_js);
}