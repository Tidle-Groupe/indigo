//Parsage du html pour récupérer les scripts js et css utilisés 
const fs = require('fs-extra');

//Récupération de la page
var page_r = fs.readFileSync('./build_prod/site/default/home.html', 'utf8');
get_scripts_js(page_r);

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
            srcjs.push(src[1]);
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

    //Réecriture de la balise unique pour la page
    var page = page.replace('</body>', '<script src="http://assets.exemple.fr/js/membre/script.js"></script></body>');

    console.log(page);
}