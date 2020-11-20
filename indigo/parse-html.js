//Parsage du html pour récupérer les scripts js et css utilisés 
//Script qui s'effectue une fois la compilation terminée, dans la partie js des assets
function get_scripts_js(page, pagerepertory){
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
            //Vérification qu'il s'agisse d'une balise src sur le domaine des assets
            var verif = src[0].indexOf(domaine_assets+"/");
            if(verif > -1){
                //Ajout de la balise dans un tableau
                balisejs.push(src[0]);
                //Ajout de la source dans un tableau
                srcjs.push(src[1].replace(domaine_assets, ''));
            }
        }
        a++;
    }
    //Boucle de retrait des balsies scripts de la page
    var srcjslength = srcjs.length;
    for(let a = 0; a < srcjslength;){
        //Retrait de la balise script de la page
        var page = page.replace(balisejs[a], '');
        a++;
    }
    //Réecriture de la page sans les balises
    fs.writeFileSync(pagerepertory, page, 'utf8');
    //Mise à zéro du tableau des balises script
    var balisejs = [];

    //Gestion du retour
    return srcjs;
}

function create_balise(idscript){
    return "<script src=\""+domaine_assets+"/js/"+idscript+".js\"></script>";
}

function rewrite_balise_js(scripts, pagerepertory){
    //Récupération de la page
    var page = fs.readFileSync(pagerepertory, 'utf8');
    //Ajout des balises à la fin du document
    var page = page.replace('</body>', scripts+'</body>');
    //Réecriture du fichier
    fs.writeFileSync(pagerepertory, page, 'utf8');
}

function recup_script_origin(path){
    if(fs.pathExistsSync(path)){
        var content = fs.readFileSync(path, 'utf8');
        return content;
    }else{
        return "";
    }
}

function rewrite_script_js(scriptid, content){
    //Réecriture du fichier
    fs.writeFileSync('./'+dir_export+'/assets/js/'+scriptid+'.js', content, 'utf8');
    //Minify du js
    minify({
        compressor: uglifyES,
        input: './'+dir_export+'/assets/js/'+scriptid+'.js',
        output: './'+dir_export+'/assets/js/'+scriptid+'.js'
    });
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
            var get_scripts = get_scripts_js(page_r, './'+dir_export+'/site/'+route+'/'+page);

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
                                console.log(page+' : '+page_distante+' contient '+scriptjs);
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
                                                            //Si on ne trouve pas la page dans la liste des pages associées à la fusion
                                                            if(!fusionpage[d].includes(page)){
                                                                //On ajoute la page
                                                                fusionpage[d].push(page);
                                                            }
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
                                                    var tabfusionlength = Number(tab_fusion.length-1);
                                                    //Si le dernier élément du tableau est égal au script précédent
                                                    if(tab_fusion[tabfusionlength] == lastscriptjs){
                                                        //On ajoute le script à la fusion si il n'est pas déjà dedans
                                                        if(!tab_fusion.includes(scriptjs)){
                                                            //On ajoute la fusion
                                                            tab_fusion.push(scriptjs);
                                                        }
                                                        //On ajoute le script à la fusion page si pas déjà présent
                                                        if(!fusionpage[d].includes(page)){
                                                            //On ajoute la fusion
                                                            fusionpage[d].push(page);
                                                        }
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
                                            //Dans tous les cas on ajoute le script actuel à la var lastscript
                                            var lastscriptjs = scriptjs;
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
                            }else{
                                scriptreplique[page][scriptjs] = "";
                                var lastscriptjs = scriptjs;
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
    var fusionnumber = [];

    //Création des balises de scripts pour chaques pages
    //On récupère une page
    var pageutiliseslength = pageutilises.length;
    for(let a = 0; a < pageutiliseslength;){
        var page = pageutilises[a];
        fusionnumber[page] = [];
        exportbalisespages[page] = [];
        
        //On regarde si la page apparaît dans un tableau de fusion
        var fusionpagelength = fusionpage.length;
        for(let b = 0; b < fusionpagelength;){
            var tabfusionone = fusionpage[b];
            //Si la page apparaît dans le tableau de fusion
            if(tabfusionone.includes(page)){
                fusionnumber[page].push(b);

                //On regarde sur chaques scripts de scriptreplique de la page
                for(var key in scriptreplique[page]){
                    //Si une clef de tableau correspond au contenu de script replique
                    for(let c = 0; c < fusion[b].length;){
                        if(key == fusion[b][c]){
                            //On supprime la clef
                            delete scriptreplique[page][key];
                        }
                        c++;
                    }
                }
                
            }
            b++;
        }

        //Si la page est dans un tableau de fusion
        var fusionnumberlength = fusionnumber[page].length;
        if(fusionnumberlength !== 0){
            //On parcourt le tableau de la page
            for(let b = 0; b < fusionnumberlength;){
                var fusiontabid = fusionnumber[page][b];
                var idscriptfusion = idscriptsjsfusion[fusiontabid];
                exportbalisespages[page].push(idscriptfusion);

                b++;
            }
        }

        //Récupération de scriptreplique de la page
        if(scriptreplique[page]){
            for(var key in scriptreplique[page]){
                //Récupération de l'id du script
                var idscript = idscriptsjs[key];
                exportbalisespages[page].push(idscript);
                console.log(key);
            }
        }
        
        a++;
    }

    //Tableau d'export final
    var exportfinal = [];

    //Tableau pour contenir la liste des scripts seuls utlisés
    var scriptssolouse = [];

    //On remet les scripts dans l'ordre d'apparition sur chaques pages
    //On récupère une page
    var pageutiliseslength = pageutilises.length;
    for(let a = 0; a < pageutiliseslength;){
        var page = pageutilises[a];
        exportfinal[page] = [];
        var pageidfusion = [];
        //On boucle les scripts appelés par la page dans l'ordre
        var pagemaplength = pagemap[page].length;
        for(let b = 0; b < pagemaplength;){
            var script = pagemap[page][b];
            var scriptverif = false;

            //On vérifie que le script ne fait pas partis d'une liste de fusion déjà vérifiée
            var pageidfusionlength = pageidfusion.length;
            for(let c = 0; c < pageidfusionlength;){
                var pageidfusionnumber = pageidfusion[c];
                var fusionverif = fusion[pageidfusionnumber];
                //Si une liste de fusion déjà déclarée contient le script
                if(fusionverif.includes(script)){
                    var scriptverif = true;
                }
                c++;
            }

            //Si la vérification échoue
            if(!scriptverif){
                //On regarde si le script est une fusion pour la page
                //On regarde si la liste des pages faisant appel à la fusion contient notre page actuelle
                var idfusionpage = fusionnumber[page][0];
                if(idfusionpage >= 0){
                    if(fusionpage[idfusionpage].includes(page)){
                        //On regarde si le script actuel est une fusion pour le même id
                        if(fusion[idfusionpage].includes(script)){
                            //On ajoute l'id de fusion à la liste pour ne plus vérifier ses scripts sur la page
                            pageidfusion.push(idfusionpage);
                            var scriptverif = true;
                            //On récupère l'ordre du script sur la page d'origine
                            var ordrepageorigine = pagemap[page].indexOf(script);
                            //On récupère l'id du script de fusion
                            var idscriptfusion = idscriptsjsfusion[idfusionpage];
                            //On envois le script dans le tableau d'export à la même place que dans le script d'origine
                            exportfinal[page].splice(ordrepageorigine, 0, idscriptfusion);
                        }
                    }
                }

                //On execute si le script n'est pas une fusion
                if(!scriptverif){
                    //On ajoute le script dans la liste des fichiers scripts non fusionnés si pas déjà présent
                    if(!scriptssolouse.includes(script)){
                        scriptssolouse.push(script);
                    }
                    //On récupère l'ordre du script dans la page d'origine
                    var ordrepageorigine = pagemap[page].indexOf(script);
                    //On récupère l'id du script
                    var idscript = idscriptsjs[script];
                    //On envois le script dans le tableau d'export à la même place que dans le script d'origine
                    exportfinal[page].splice(ordrepageorigine, 0, idscript);
                }
            }

            b++;
        }
        a++;
    }

    //Export des balises pour chaques pages
    //On récupère une page
    var pageutiliseslength = pageutilises.length;
    for(let a = 0; a < pageutiliseslength;){
        var page = pageutilises[a];
        console.log(page+':');
        var baliseexport = "";
        //On récupère la liste des exports finale de la page
        var exportfinallength = exportfinal[page].length;
        for(let b = 0; b < exportfinallength;){
            var scriptidpage = exportfinal[page][b];
            var baliseexport = baliseexport+create_balise(scriptidpage);
            b++;
        }
        //Réecriture de la balise pour la page
        rewrite_balise_js(baliseexport, './'+dir_export+'/site'+page);
        console.log(baliseexport);

        a++;
    }

    //Réecriture des scripts js non fusionnés
    //On récupère la liste des scripts js utilisés seuls
    var scriptssolouselength = scriptssolouse.length;
    for(let a = 0; a < scriptssolouselength;){
        var scriptname = scriptssolouse[a];
        var idscript = idscriptsjs[scriptname];
        //On récupère le script d'origine
        var content = recup_script_origin('./sources/assets'+scriptname);
        //On réecrit le script
        rewrite_script_js(idscript, content);

        a++;
    }

    //Réecriture des scripts js fusionnés
    var fusionlength = fusion.length;
    for(let a = 0; a < fusionlength;){
        var fusiontab = fusion[a];
        var content = "";
        //On récupère l'id de cette fusion
        var idscriptfusion = idscriptsjsfusion[a];
        //On récupère le contenu de chaques scripts
        var fusiontablength = fusiontab.length;
        for(let b = 0; b < fusiontablength;){
            var fusiontabelement = fusiontab[b];
            var content = content+recup_script_origin('./sources/assets'+fusiontabelement);
            b++;
        }
        //On réecrit le script
        rewrite_script_js(idscriptfusion, content);
        
        a++;
    }

    console.log(scriptreplique);
    console.log(fusion);
    console.log(fusionpage);
}