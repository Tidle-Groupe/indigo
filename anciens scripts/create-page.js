const fs = require('fs-extra');
var route = process.argv[2] || false;
var name = process.argv[3] || false;
var chemin = process.argv[4] || name+'.html';

if(!route){
    console.log('Il manque le chemin de la route associée à la page')
    return false;
}

if(!name){
    console.log('Il manque le nom de la page')
    return false;
}

//Vérification que la route existe
var routeexist = fs.readFileSync('sources/routes.json', 'utf8');
if(routeexist.includes('chemin":"'+route)){

    //Ajout de la nouvelle page au fichier
    var pagesjson = JSON.parse(fs.readFileSync('sources/'+route+'/pages.json', 'utf8'));
    var varlengthconfigpages = pagesjson.pages.length;
    for(let a = 0; a < varlengthconfigpages;){
        if(typeof(newjson) == 'undefined'){
            var newjson = '{"nom":"'+pagesjson.pages[a].nom+'","chemin":"'+pagesjson.pages[a].chemin+'"}';
        } else {
            var newjson = newjson+',{"nom":"'+pagesjson.pages[a].nom+'","chemin":"'+pagesjson.pages[a].chemin+'"}';
        }
        a++
    }

}else{
    console.log("Le chemin de la route associée n'existe pas");
    return false;
}

if(typeof(newjson) == 'undefined'){
    var newjson = '{"pages":[{"nom":"'+name+'","chemin":"'+chemin+'"}]}';
}else{
    if(newjson.includes('"nom":"'+name+'"')){
        console.log('Le nom est déjà pris');
        return false;
    }else{
        if(newjson.includes('"chemin":"'+chemin+'"')){
            console.log('Le chemin est déjà occupé');
            return false;
        }
    }
    var newjson = '{"pages":['+newjson+',{"nom":"'+name+'","chemin":"'+chemin+'"}]}';
}
        
fs.writeFileSync('sources/'+route+'/pages.json', newjson, 'utf8');

//Création du fichier de la page
fs.writeFileSync('sources/'+route+'/pages/'+chemin, '');

console.log("Création de la page "+name+" terminée");
