const fs = require('fs-extra');
var name = process.argv[2] || false;

if(!name){
    console.log('Il manque le nom de la route')
    return false;
}

//retrait de la route au fichier
var routesjson = JSON.parse(fs.readFileSync('sources/routes.json', 'utf8'));
var varlengthconfigroutes = routesjson.routes.length;
for(let a = 0; a < varlengthconfigroutes;){
    if(routesjson.routes[a].nom == name){
        //Suppression des répertoires
        fs.removeSync('sources/'+routesjson.routes[a].chemin);
        var delstat = 1;
    }else{
        if(typeof(newjson) == 'undefined'){
            var newjson = '{"nom":"'+routesjson.routes[a].nom+'","chemin":"'+routesjson.routes[a].chemin+'"}';
        } else {
            var newjson = newjson+',{"nom":"'+routesjson.routes[a].nom+'","chemin":"'+routesjson.routes[a].chemin+'"}';
        }
    }
    a++
}
if(typeof(delstat) == 'undefined'){
    console.log("La route "+name+" n'existe pas");
} else {
    if(typeof(newjson) == 'undefined'){
        var newjson = '{"routes":[]}';
        fs.writeFileSync('sources/routes.json', newjson, 'utf8');
    }else{
        var newjson = '{"routes":['+newjson+']}';
        fs.writeFileSync('sources/routes.json', newjson, 'utf8');
    }
    
    console.log("Suppression de la route "+name+" terminée");
}