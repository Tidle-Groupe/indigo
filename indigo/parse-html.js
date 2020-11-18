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

function html_parse_js(){
    //Récupération des routes du dossier à partir d'un tableau créer par le build site
    // build_route => donne la liste des routes, build_page[build_route]=> donne la liste des pages pour une route

    //Variable de base
    jspagesget = [];
    jsuses = [];

    //Vérification des fichiers js utilsiés par chaques pages
    //Récupération de la longueur des routes
    var lengthroutes = build_route.length;
    for(let a = 0; a < lengthroutes;){
        var route = build_route[a];
        //Création du tableau pour la route
        jspagesget[route] = [];
        //Récupération de la longueur des routes
        var lengthpages = build_page[route].length;
        for(let b = 0; b < lengthpages;){
            var page = build_page[build_route[a]];
            //Création du tableau pour la route
            jspagesget[route][page] = [];
            //Récupération de la page
            var page_r = fs.readFileSync('./'+dir_export+'/site/'+route+'/'+page, 'utf8');
            var array_js = get_scripts_js(page_r);
            var lengtharrayjs = array_js.length;
            //Boucle de récupération des éléments du tableau
            for(let c = 0; c < lengtharrayjs;){
                jspagesget[route][page].push(array_js[c]);
                jsuses.push(array_js[c]);
                c++;
            }
            b++;
        }
        a++;
    }

    
}