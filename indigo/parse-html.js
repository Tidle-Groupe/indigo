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

function create_balise(idscript){
    return "<script src=\""+domaine_assets+"/js/"+idscript+".js\"></script>";
}

function html_parse_js(){
    //Récupération des routes du dossier à partir d'un tableau créer par le build site
    // build_route => donne la liste des routes, build_page[build_route]=> donne la liste des pages pour une route

    //Tableau de base
    pagemap = [];
    jsutilises = [];
    pageutilises = [];

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
            var get_scripts = get_scripts_js(page_r);

            //Récupération du mappage
            var lengthscript = get_scripts.length;
            var pagenamearay = '/'+route+'/'+page;
            //Boucle de récupération des éléments du tableau
            for(let c = 0; c < lengthscript;){
                //Mappage des éléments pages
                var scriptjs = get_scripts[c];
                if(!pagemap[pagenamearay]){
                    pagemap[pagenamearay] = [];
                }
                pagemap[pagenamearay].push(scriptjs);
                //Liste des js
                if(!jsutilises.includes(scriptjs)){
                    jsutilises.push(scriptjs);
                }
                //Liste des pages
                if(!pageutilises.includes(pagenamearay)){
                    pageutilises.push(pagenamearay);
                }
                c++;
            }

            b++;
        }
        a++;
    }
    console.log(pagemap);
    console.log(jsutilises);

    //Tableaux des ids pour chaques scripts
    idscriptsjs = [];
    var incrid = 0;

    //Assignation d'un id pour chaques scripts
    var jsutiliseslength = jsutilises.length;
    for(let a = 0; a < jsutiliseslength;){
        var scriptname = jsutilises[a];
        idscriptsjs[scriptname] = a;
        a++;
        incrid++;
    }
    console.log(idscriptsjs);

    console.log("===");

    //Tableau de base
    array_page = [];
    scriptreplique = [];
    fusion = [];
    fusionpage = [];

    //Variable de base
    incrfusion = 0;

    //On récupère une page
    var pageutiliseslength = pageutilises.length;
    for(let a = 0; a < pageutiliseslength;){
        var page = pageutilises[a];
        //On créer le tableau pour la page
        array_page[page] = [];
        scriptreplique[page] = [];
        //On charge les scripts de cette page
        var scripts = pagemap[page];

        //Si la page possède des scripts
        var scriptslength = scripts.length;
        if(scriptslength !== 0){
            //On récupère chaques scripts
            for(let b = 0; b < scriptslength;){
                var scriptjs = scripts[b];

                //On récupère les scripts sur les autres pages
                for(let c = 0; c < pageutiliseslength;){
                    var page_distante = pageutilises[c];
                    var scripts_distante = pagemap[page_distante];

                    //On vérifie qu'il ne s'agisse pas de la même page
                    if(page_distante !== page){
                        
                        //Si la page distante contient des scripts
                        var scripts_distantelength = scripts_distante.length;
                        if(scripts_distantelength !== 0){
                            //Execution de la vérification si la page actuelle contient le script distant
                            if(scripts_distante.includes(scriptjs)){
                                console.log(page_distante+' contient '+scriptjs);
                                //On vérifie si les deux pages on déjà un autre script en commun
                                if(array_page[page].includes(page_distante)){
                                    //Si l'élément d'avant se suit sur les deux pages
                                    //On regarde si les deux éléments se suivent dans la page actuelle
                                    if(scripts.indexOf(scriptjs) == Number(scripts.indexOf(lastscriptjs)+1)){
                                        //On regarde si les deux éléments se suivent dans la page distante
                                        if(scripts_distante.indexOf(scriptjs) == Number(scripts_distante.indexOf(lastscriptjs)+1)){
                                            //Si les deux éléments se suivent sur les deux pages
                                            var verifbouclefusion = false;

                                            //On parcours tous le tableau des fusions
                                            var fusionlength = fusion.length;
                                            for(let d = 0; d < fusionlength;){
                                                var tab_fusion = fusion[d];
                                                //On vérifie si les deux éléments ne sont pas déjà dans un tableau
                                                if(tab_fusion.includes(lastscriptjs)){
                                                    var indexlastscriptjs = tab_fusion.indexOf(lastscriptjs);
                                                    //On vérifie que le tableau inclus le script
                                                    if(tab_fusion.includes(scriptjs)){
                                                        var indexscriptjs = tab_fusion.indexOf(scriptjs);
                                                        //On vérifie que le script suit l'ancien script dans le tableau
                                                        if(indexscriptjs == Number(indexlastscriptjs+1)){
                                                            console.log(lastscriptjs+' est déjà dans un tableau suivis par '+scriptjs);
                                                            var verifbouclefusion = true;
                                                        }
                                                    }
                                                }
                                                d++;
                                            }

                                            //Si la vérification échoue
                                            if(!verifbouclefusion){

                                                //On regarde si le lastscriptjs existe en dernière position dans un tableau
                                                //On parcours tous le tableau des fusions
                                                var fusionlength = fusion.length;
                                                for(let d = 0; d < fusionlength;){
                                                    var tab_fusion = fusion[d];
                                                    
                                                    //Récupération du dernier élément du tableau et comparaison avec le lastjsscript
                                                    var tabfusionlength = tab_fusion.length;
                                                    if(tab_fusion[tabfusionlength] == lastscriptjs){
                                                        fusion[tabfusionlength].push(scriptjs);
                                                        fusionpage[incrfusion].push(page);
                                                        var verifbouclefusion = true;
                                                    }

                                                    d++;
                                                }

                                                //Si la vérification échoue
                                                if(!verifbouclefusion){
                                                    fusion[incrfusion] = [lastscriptjs, scriptjs];
                                                    fusionpage[incrfusion] = [page_distante, page];
                                                    incrfusion++;
                                                    console.log(lastscriptjs+' suit '+scriptjs+' dans '+page);
                                                }
                                            }

                                        }else{
                                            scriptreplique[page][scriptjs] = page_distante;
                                            var lastscriptjs = scriptjs;
                                        }
                                    }else{
                                        scriptreplique[page][scriptjs] = page_distante;
                                        var lastscriptjs = scriptjs;
                                    }
                                }else{
                                    array_page[page].push(page_distante);
                                    scriptreplique[page][scriptjs] = page_distante;
                                    var lastscriptjs = scriptjs;
                                }
                            }
                        }
                    }
                    c++;
                }
                
                b++;
            }
        }

        a++;
    }

    //Tableaux des ids pour chaques fusions
    idscriptsjsfusion = [];

    //Assignation d'un id pour chaques fusions
    var fusionpagelength = fusion.length;
    for(let a = 0; a < fusionpagelength;){
        idscriptsjsfusion.push(incrid);
        a++;
        incrid++;
    }

    //Tableau des balises d'export
    var exportbalisespages = [];

    //Création des balises de scripts pour chaques pages
    //On récupère une page
    var pageutiliseslength = pageutilises.length;
    for(let a = 0; a < pageutiliseslength;){
        var page = pageutilises[a];
        var fusionnumber = [];
        exportbalisespages[page] = [];
        
        //On regarde si la page apparaît dans un tableau de fusion
        var fusionpagelength = fusionpage.length;
        for(let b = 0; b < fusionpagelength;){
            var tabfusionone = fusionpage[b];
            //Si la page apparaît dans le tableau de fusion
            if(tabfusionone.includes(page)){
                fusionnumber.push(b);
            }
            b++;
        }

        //Si la page est dans un tableau de fusion
        var fusionnumberlength = fusionnumber.length;
        if(fusionnumberlength !== 0){
            //On parcourt le tableau de la page
            for(let b = 0; b < fusionnumberlength;){
                var fusiontabid = fusionnumber[b];
                var idscriptfusion = idscriptsjsfusion[fusiontabid];
                exportbalisespages[page].push(create_balise(idscriptfusion));

                b++;
            }
        }
        a++;
    }

    console.log(scriptreplique);
    console.log(fusion);
    console.log(fusionpage);
    console.log(exportbalisespages);
}