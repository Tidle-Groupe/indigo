//Parsage du html pour récupérer les scripts js et css utilisés 
//Script qui s'effectue une fois la compilation terminée, dans la partie js des assets
htmlfunction get_scripts_js(page, page_name){
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

    var lengthsrcjs = srcjs.length;
    //Boucle de récupération des éléments du tableau
    var output = {};
    for(let a = 0; a < lengthsrcjs;){
        if(!output["scripts"]){
            output["scripts"] = [];
        }
        output["scripts"].push(srcjs[a]);
        a++;
    }

    //Ecriture d'un json pour écrire le résultat
    var rjson = JSON.stringify(output);
    fs.writeFileSync('./build_indigo_tmp/'+page_name+'.json', rjson, 'utf8');
}

function verif_script_niveau(ordre, ordre_array){
    //On retire l'ordre sur la page actuelle pour comparer si une autre page appelle le script au même ordre
    let jsfusionsretrait = ordre_array.splice(ordre, 1);

    //On regarde si il existe un un autre élément sur le même ordre dans le tableau
    if(jsfusionsretrait.includes(ordre)){
        return true;
    }else{
        return false;
    }
}

function html_parse_js(){
    //Récupération des routes du dossier à partir d'un tableau créer par le build site
    // build_route => donne la liste des routes, build_page[build_route]=> donne la liste des pages pour une route

    //Création du dossier des tableaux de build
    fs.mkdirsSync('./build_indigo_tmp/');

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
            get_scripts_js(page_r, route+'-'+page);
            b++;
        }
        a++;
    }
}