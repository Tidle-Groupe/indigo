const fs = require('fs-extra');
const exec = require('child_process').execSync;
//Création d'un nouvelle espace de travail indigo
var Args = process.argv.slice(2);
repertoire = Args[1];

//Fonction de vérification des éléments de base
function verif_base(){
    //On vérifie la présence d'un nom pour l'environnement
    if(repertoire){
        //On vérifie que le nom respecte le nom d'un dossier valide
        var regex = RegExp('^([a-zA-Z0-9_-]|[à-ú]|[À-Ú])+$');
        if(regex.test(repertoire)){
            //On vérifie que le dossier n'est pas existant
            if(fs.pathExistsSync(repertoire)){
                //Si dossier existant on vérifie qu'il est vide
                if(fs.readdirSync(repertoire).length !== 0){
                    console.log("Le répertoire \""+repertoire+"\" existe déjà et n'est pas vide");
                    return false;
                }
            }else{
                //Si il n'existe pas on créer le répertoire
                fs.mkdirsSync(repertoire);
            }
            return true;
        }else{
            console.log("Merci de retirer les caractères spéciaux de votre nom de projet indigo");
            return false;
        }
    }else{
        console.log("Merci de spécifier un nom à votre projet indigo après new (indigo new <nom-du-projet>)");
        return false;
    }
}

//Loader
async function loader(msg){
    const P = ['\\', '|', '/', '-'];
    let x = 0;
    const loader = setInterval(() => {
      process.stdout.write(`\r${msg} ${P[x++]}`);
      x %= P.length;
    }, 250);
}

//Fonction pour récupérer le répertoire global
function get_global_directory(){
    return exec('npm config get prefix').toString();
}

//Création du package
function package_generate(name){
    //Passage du nom en caractères alphanumérique
    var namer = name.split(/\W/g).join('');
    var json = '{\r\n  "name": "'+namer+'",\r\n  "version": "0.0.0",\r\n  "scripts": {\r\n    "Build": "indigo build",\r\n    "Run": "indigo run",\r\n    "Docker": "indigo docker"\r\n  },\r\n  "private": true\r\n}';
    fs.writeFileSync(name+'/package.json', json, 'utf8');
}

//Vérification de base
if(verif_base()){
    console.log("Installation en cours du projet \""+repertoire+"\"");
    //On récupère le répertoire global
    var global_dir = get_global_directory();
    var global_dir = global_dir.replace(/\n|\r/g,'');
    //On copie le répertoire source par défaut
    fs.copySync(global_dir+'\\node_modules\\@tidle-groupe\\indigo\\sources', repertoire+'/sources');
    //Création du fichier indigo
    fs.writeJsonSync(repertoire+'/indigo.json', {"version":"1.0.0"});
    //Création du package
    package_generate(repertoire);
    //On copie le fichier de config initial
    fs.copySync(global_dir+'\\node_modules\\@tidle-groupe\\indigo\\config.json', repertoire+'/config.json');
    console.log("Installation terminée");

    //Appel du script de d'installation docker
    require('../indigo/docker.js');

    //Arrêt du script
    //return process.exit(0);
}