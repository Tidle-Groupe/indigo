const fs = require('fs-extra');

//Message de début
console.log("Début du build !");

var build = require('../indigo/build.js');
build.init("prod");
var build_bib_js = build.build_site("prod");
//si on à pas de retour d'erreur
if(build_bib_js !== 'error'){
    build.build_assets("prod", build_bib_js);
    build.build_api("prod");

    //Message de fin de construction
    console.log("Build terminée !");
}else{
    console.error("Le dossier sources de votre projet est absent");
}