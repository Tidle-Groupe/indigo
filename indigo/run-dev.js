const fs = require('fs-extra');

eval(fs.readFileSync(__dirname + "/build.js")+'');
build("dev");
//Message de fin de construction
console.log("Build terminée !");