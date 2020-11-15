const fs = require('fs-extra');

var build = "prod";

eval(fs.readFileSync(__dirname + "/build.js")+'');
build_site("prod");
build_assets("prod");
build_api("prod");

//Message de fin de construction
console.log("Build terminée !");