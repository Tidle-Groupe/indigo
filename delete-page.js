const fs = require('fs-extra');
var route = process.argv[2] || false;
var name = process.argv[3] || false;

if(!name){
    console.log('Il manque la route de la page')
    return false;
}

if(!name){
    console.log('Il manque le nom de la page')
    return false;
}

//Vérification que la route existe
var routeexist = fs.readFileSync('sources/routes.json', 'utf8');
if(routeexist.includes('chemin":"'+route)){

    //retrait de la route au fichier
    var pagesjson = JSON.parse(fs.readFileSync('sources/'+route+'/pages.json', 'utf8'));
    var varlengthconfigpages = pagesjson.pages.length;
    for(let a = 0; a < varlengthconfigpages;){
        if(pagesjson.pages[a].nom == name){
            //Suppression des répertoires
            fs.removeSync('sources/'+route+'/pages/'+pagesjson.pages[a].chemin);
            var delstat = 1;
        }else{
            if(typeof(newjson) == 'undefined'){
                var newjson = '{"nom":"'+pagesjson.pages[a].nom+'","chemin":"'+pagesjson.pages[a].chemin+'"}';
            } else {
                var newjson = newjson+',{"nom":"'+pagesjson.pages[a].nom+'","chemin":"'+pagesjson.pages[a].chemin+'"}';
            }
        }
        a++
    }

}else{
    console.log("Le chemin de la route associée n'existe pas");
    return false;
}

if(typeof(delstat) == 'undefined'){
    console.log("La page "+name+" n'existe pas");
} else {
    if(typeof(newjson) == 'undefined'){
        var newjson = '{"pages":[]}';
        fs.writeFileSync('sources/'+route+'/pages.json', newjson, 'utf8');
    }else{
        var newjson = '{"pages":['+newjson+']}';
        fs.writeFileSync('sources/'+route+'/pages.json', newjson, 'utf8');
    }
    
    console.log("Suppression de la page "+name+" terminée");
}