const fs = require('fs-extra');
var name = process.argv[2] || false;
var chemin = process.argv[3] || name;

if(!name){
    console.log('Il manque le nom de la route')
    return false;
}

if(chemin == "assets"){
    console.log('Votre dossier ne peut pas avoir pour chemin assets')
    return false;
}

//Ajout de la nouvelle route au fichier
var routesjson = JSON.parse(fs.readFileSync('sources/routes.json', 'utf8'));
var varlengthconfigroutes = routesjson.routes.length;
for(let a = 0; a < varlengthconfigroutes;){
    if(typeof(newjson) == 'undefined'){
        var newjson = '{"nom":"'+routesjson.routes[a].nom+'","chemin":"'+routesjson.routes[a].chemin+'"}';
    } else {
        var newjson = newjson+',{"nom":"'+routesjson.routes[a].nom+'","chemin":"'+routesjson.routes[a].chemin+'"}';
    }
    a++
}

if(typeof(newjson) == 'undefined'){
    var newjson = '{"routes":[{"nom":"'+name+'","chemin":"'+chemin+'"}]}';
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
    var newjson = '{"routes":['+newjson+',{"nom":"'+name+'","chemin":"'+chemin+'"}]}';
}
        
fs.writeFileSync('sources/routes.json', newjson, 'utf8');

//Création des répertoires néscessaires
fs.mkdirsSync('sources/'+chemin+'/pages');
fs.mkdirsSync('sources/'+chemin+'/templates');

//Création des Json néscessaires
fs.writeFileSync('sources/'+chemin+'/pages.json', '{"pages":[]}');
fs.writeFileSync('sources/'+chemin+'/templates.json', '{"templates":[]}');

//Création du controleur de la route
fs.writeFileSync('sources/'+chemin+'/controleur.php', '');

console.log("Création de la route "+name+" terminée");
