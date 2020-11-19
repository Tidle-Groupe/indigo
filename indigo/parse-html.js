//Parsage du html pour récupérer les scripts js et css utilisés 
//Script qui s'effectue une fois la compilation terminée, dans la partie js des assets
function get_scripts_js(page, page_name){
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
            var get_scripts = get_scripts_js(page_r, route+'-'+page);

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

    //Assignation d'un id pour chaques scripts
    var jsutiliseslength = jsutilises.length;
    for(let a = 0; a < jsutiliseslength;){
        var scriptname = jsutilises[a];
        idscriptsjs[scriptname] = a;
        a++;
    }
    console.log(idscriptsjs);

    //Tableau pour le schéma d'ordre des pages
    schemascripts = [];

    //Création d'un schéma d'utilisation pour chaques pages
    var pageutiliseslength = pageutilises.length;
    for(let a = 0; a < pageutiliseslength;){
        var page = pageutilises[a];
        schemascripts[page] = [];
        //On récupère les scripts de la page
        var pagemaplength = pagemap[page].length;
        for(let b = 0; b < pagemaplength;){
            var script = pagemap[page][b];
            var idscript = idscriptsjs[script];
            schemascripts[page].push(idscript);
            b++;
        }
        a++;
    }
    console.log(schemascripts);
    console.log("===");

    //Parcours des schémas pour voir si il y a des correspondances
    var pageutiliseslength = pageutilises.length;
    for(let a = 0; a < pageutiliseslength;){
        var page = pageutilises[a];
        var schemascriptslength = schemascripts[page].length;
        for(let b = 0; b < schemascriptslength;){
            var id_script = schemascripts[page][b];
            console.log(id_script);
            b++;
        }
        a++;
    }
}