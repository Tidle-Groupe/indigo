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

function create_balise_js(idscript, route){
    return "<script src=\""+domaine_assets+"/js/"+route+"/"+idscript+".js\"></script>";
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

function rewrite_script(type, scriptid, content, route){
    //Réecriture du fichier
    fs.writeFileSync('./'+dir_export+'/assets/'+type+'_tmp/'+route+'/'+scriptid+'.'+type, content, 'utf8');
    //Si c'est un js
    if(type == "js"){
        //Minify du js
        minify({
            compressor: uglifyES,
            input: './'+dir_export+'/assets/'+type+'_tmp/'+route+'/'+scriptid+'.'+type,
            output: './'+dir_export+'/assets/'+type+'_tmp/'+route+'/'+scriptid+'.'+type
        });
    }
}

function scripts_bundler(type, routeactive){
    //Récupération des routes du dossier à partir d'un tableau créer par le build site
    // build_route => donne la liste des routes, build_page[build_route]=> donne la liste des pages pour une route

    //Tableau de base
    pagemap = [];
    typeutilises = [];
    pageutilises = [];

    //Vérification des fichiers type utilisés par chaques pages
    //Récupération de la longueur des routes
    //Récupération de la longueur des pages
    var lengthpages = build_page[routeactive].length;
    for(let a = 0; a < lengthpages;){
        var page = build_page[routeactive][a];
        //Récupération de la page
        var page_r = fs.readFileSync('./'+dir_export+'/site/'+routeactive+'/'+page, 'utf8');
        //Si c'est un js
        if(type == "js"){
            var get_scripts = get_scripts_js(page_r, './'+dir_export+'/site/'+routeactive+'/'+page);
        }

        //Récupération du mappage
        var lengthscript = get_scripts.length;
        var pagenamearay = '/'+routeactive+'/'+page;
        //Boucle de récupération des éléments du tableau
        for(let b = 0; b < lengthscript;){
            //Mappage des éléments pages
            var scripttype = get_scripts[b];
            if(!pagemap[pagenamearay]){
                pagemap[pagenamearay] = [];
            }
            pagemap[pagenamearay].push(scripttype);
            //Liste des type
            if(!typeutilises.includes(scripttype)){
                typeutilises.push(scripttype);
            }
            //Liste des pages
            if(!pageutilises.includes(pagenamearay)){
                pageutilises.push(pagenamearay);
            }
            b++;
        }

        a++;
    }
    //console.log(pagemap);
    //console.log(typeutilises);

    //Si la page possède des scripts
    if(typeutilises.length !== 0){
        //Création d'un répertoire pour l'export de la route
        fs.mkdirsSync('./'+dir_export+'/assets/'+type+'_tmp/'+routeactive);

        //Tableaux des ids pour chaques scripts
        idscriptstype = [];
        var incrid = 0;

        //Assignation d'un id pour chaques scripts
        var typeutiliseslength = typeutilises.length;
        for(let a = 0; a < typeutiliseslength;){
            var scriptname = typeutilises[a];
            idscriptstype[scriptname] = a;
            a++;
            incrid++;
        }
        //console.log(idscriptstype);

        //console.log("===");

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
            //Var init verif non fusion
            var pagefusion = false;
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
                    var scripttype = scripts[b];

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
                                if(scripts_distante.includes(scripttype)){
                                    //console.log(page+' : '+page_distante+' contient '+scripttype);
                                    //On vérifie si les deux pages on déjà un autre script en commun
                                    if(array_page[page].includes(page_distante)){
                                        //Si l'élément d'avant se suit sur les deux pages
                                        //On regarde si les deux éléments se suivent dans la page actuelle
                                        if(scripts.indexOf(scripttype) == Number(scripts.indexOf(lastscripttype)+1)){
                                            //On regarde si les deux éléments se suivent dans la page distante
                                            if(scripts_distante.indexOf(scripttype) == Number(scripts_distante.indexOf(lastscripttype)+1)){
                                                //Si les deux éléments se suivent sur les deux pages
                                                var verifbouclefusion = false;

                                                //On parcours tous le tableau des fusions
                                                var fusionlength = fusion.length;
                                                for(let d = 0; d < fusionlength;){
                                                    var tab_fusion = fusion[d];
                                                    //On vérifie si les deux éléments ne sont pas déjà dans un tableau
                                                    if(tab_fusion.includes(lastscripttype)){
                                                        var indexlastscripttype = tab_fusion.indexOf(lastscripttype);
                                                        //On vérifie que le tableau inclus le script
                                                        if(tab_fusion.includes(scripttype)){
                                                            var indexscripttype = tab_fusion.indexOf(scripttype);
                                                            //On vérifie que le script suit l'ancien script dans le tableau
                                                            if(indexscripttype == Number(indexlastscripttype+1)){
                                                                //console.log(lastscripttype+' est déjà dans un tableau suivis par '+scripttype);
                                                                var verifbouclefusion = true;
                                                                //Si on ne trouve pas la page dans la liste des pages associées à la fusion
                                                                if(!fusionpage[d].includes(page)){
                                                                    //On ajoute la page
                                                                    fusionpage[d].push(page);
                                                                }
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    d++;
                                                }

                                                //Si la vérification échoue
                                                if(!verifbouclefusion){

                                                    //On regarde si le lastscripttype existe en dernière position dans un tableau
                                                    //On parcours tous le tableau des fusions
                                                    var fusionlength = fusion.length;
                                                    for(let d = 0; d < fusionlength;){
                                                        var tab_fusion = fusion[d];
                                                        
                                                        //Récupération du dernier élément du tableau et comparaison avec le lasttypescript
                                                        var tabfusionlength = Number(tab_fusion.length-1);
                                                        //Si le dernier élément du tableau est égal au script précédent
                                                        if(tab_fusion[tabfusionlength] == lastscripttype){
                                                            //On ajoute le script à la fusion si il n'est pas déjà dedans
                                                            if(!tab_fusion.includes(scripttype)){
                                                                //On ajoute la fusion
                                                                tab_fusion.push(scripttype);
                                                            }
                                                            //On ajoute le script à la fusion page si pas déjà présent
                                                            if(!fusionpage[d].includes(page)){
                                                                //On ajoute la fusion
                                                                fusionpage[d].push(page);
                                                            }
                                                            var verifbouclefusion = true;
                                                            break;
                                                        }

                                                        d++;
                                                    }

                                                    //Si la vérification échoue
                                                    if(!verifbouclefusion){
                                                        fusion[incrfusion] = [lastscripttype, scripttype];
                                                        fusionpage[incrfusion] = [page_distante, page];
                                                        incrfusion++;
                                                        //console.log(lastscripttype+' suit '+scripttype+' dans '+page);
                                                    }
                                                }
                                                //Dans tous les cas on ajoute le script actuel à la var lastscript et on indique que la page à euût une fusion
                                                var lastscripttype = scripttype;
                                                var pagefusion = true;
                                            }else{
                                                scriptreplique[page][scripttype] = page_distante;
                                                var lastscripttype = scripttype;
                                            }
                                        }else{
                                            scriptreplique[page][scripttype] = page_distante;
                                            var lastscripttype = scripttype;
                                        }
                                    }else{
                                        array_page[page].push(page_distante);
                                        scriptreplique[page][scripttype] = page_distante;
                                        var lastscripttype = scripttype;
                                    }
                                }else{
                                    scriptreplique[page][scripttype] = "";
                                    var lastscripttype = scripttype;
                                }
                            }
                        }
                        c++;
                    }
                    
                    b++;
                }

                //Vérification que la page n'a subie aucunes fusions et que la page contient plus d'un script
                if(!pagefusion && scriptslength > 1){
                    //On créer des fusions (un seul fichier) pour chaques pages qui contient plus d'un script et pas
                    //On créer un tableau de fusion pour la page
                    fusion[incrfusion] = [];
                    //On boucle le scriptreplique de la page
                    for(var key in scriptreplique[page]){
                        //Récupération de l'id du script
                        fusion[incrfusion].push(key);
                    }
                    //On ajoute la page au tableau
                    fusionpage[incrfusion] = [page];
                    incrfusion++;
                }

            }

            a++;
        }

        //Tableaux des ids pour chaques fusions
        idscriptstypefusion = [];

        //Assignation d'un id pour chaques fusions
        var fusionpagelength = fusion.length;
        for(let a = 0; a < fusionpagelength;){
            idscriptstypefusion.push(incrid);
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
                    var idscriptfusion = idscriptstypefusion[fusiontabid];
                    exportbalisespages[page].push(idscriptfusion);

                    b++;
                }
            }

            //Récupération de scriptreplique de la page
            if(scriptreplique[page]){
                for(var key in scriptreplique[page]){
                    //Récupération de l'id du script
                    var idscript = idscriptstype[key];
                    exportbalisespages[page].push(idscript);
                    //console.log(key);
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
                                var idscriptfusion = idscriptstypefusion[idfusionpage];
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
                        var idscript = idscriptstype[script];
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
            //console.log(page+':');
            var baliseexport = "";
            //On récupère la liste des exports finale de la page
            var exportfinallength = exportfinal[page].length;
            for(let b = 0; b < exportfinallength;){
                var scriptidpage = exportfinal[page][b];
                //Si c'est un js
                if(type == "js"){
                    var baliseexport = baliseexport+create_balise_js(scriptidpage, routeactive);
                }
                b++;
            }
            //Réecriture de la balise pour la page
            //Si c'est un js
            if(type == "js"){
                rewrite_balise_js(baliseexport, './'+dir_export+'/site'+page);
            }
            //console.log(baliseexport);

            a++;
        }

        //Réecriture des scripts type non fusionnés
        //On récupère la liste des scripts type utilisés seuls
        var scriptssolouselength = scriptssolouse.length;
        for(let a = 0; a < scriptssolouselength;){
            var scriptname = scriptssolouse[a];
            var idscript = idscriptstype[scriptname];
            //On récupère le script d'origine
            var content = recup_script_origin('./'+dir_export+'/assets'+scriptname);
            //On réecrit le script
            rewrite_script(type, idscript, content, routeactive);

            a++;
        }

        //Réecriture des scripts type fusionnés
        var fusionlength = fusion.length;
        for(let a = 0; a < fusionlength;){
            var fusiontab = fusion[a];
            var content = "";
            //On récupère l'id de cette fusion
            var idscriptfusion = idscriptstypefusion[a];
            //On récupère le contenu de chaques scripts
            var fusiontablength = fusiontab.length;
            for(let b = 0; b < fusiontablength;){
                var fusiontabelement = fusiontab[b];
                var content = content+recup_script_origin('./'+dir_export+'/assets'+fusiontabelement);
                b++;
            }
            //On réecrit le script
            rewrite_script(type, idscriptfusion, content, routeactive);
            
            a++;
        }

        //console.log(scriptreplique);
        //console.log(fusion);
        //console.log(fusionpage);
    }
}