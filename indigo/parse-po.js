function pars_po(page, route){
    console.log("Parsage du .po");

    //Recherche du début du script
    var debut = page.indexOf('<?po');

    //Si une déclaration est effectuée po
    if(debut > -1){

        //Séparation de la fin du script
        var splitfin = page.split('?>');

        //splitfin.length => si le split fait plus de 2, ça veux dire qu'il y a plusieurs déclarations

        //Récupération de tous le script
        var script_po = splitfin[0].slice(debut).trim();

        //Retrait de l'entête script dans l'export
        var page_return = page.replace(script_po, '').trim();
        var page_return = page_return.replace('?>', '').trim();

        //Retrait de la balise de déclaration de début dans le script po
        var script_po = script_po.replace('<?po', '').trim();

        //Recherche de la déclaration d'un template
        var template_debut = script_po.indexOf('@indigo-template');

        //Si une déclaration de template est effectuée
        if(template_debut > -1){
            //Récupération de la ligne complète
            var template_line = script_po.slice(template_debut).trim();
            var template_line = template_line.split(';');
            var template_line = template_line[0].trim();

            //Récupération de la valeure du template
            var template_value = template_line.split('=');
            var template_value = template_value[1].trim();
            var template_value = template_value.slice(1);
            var template_value = template_value.slice(0, template_value.length-1);

            //Retrait de l'élement traité de la chaine de traitement
            var script_po = script_po.replace(template_line, '').trim();
            var script_po = script_po.replace(';', '').trim();
        }


        //Récupération des variables
        var var_egal = script_po.split('";');

        //Si une déclaration de variable est effectuée
        if(var_egal.length > 1){
            var nombre_variable = Number(var_egal.length-1);
            var tab_variables_nom = [];
            var tab_variables_str = [];
            for(let a = 0; a < nombre_variable;){
                var var_value = var_egal[a].split('=');

                //Récupération du nom de la variable
                var var_value_nom = var_value[0].trim();

                //Retrait de la guillemet de la valeur
                var var_value_str = var_value[1].trim();
                var var_value_str = var_value_str.slice(1);

                //Ajout des valeurs dans le tableau des variables
                tab_variables_nom.push(var_value_nom);
                tab_variables_str.push(var_value_str);

                a++;
            }
            console.log(tab_variables_nom);
            console.log(tab_variables_str);
        }

        //traitement des valeurs

        //Ajout du template
        //Vérification que l'élément existe
        if(fs.pathExistsSync('./sources/site/'+route+'/template/'+template_value)){
            //Vérification qu'il s'agit bien d'un fichier
            if(fs.lstatSync('./sources/site/'+route+'/template/'+template_value).isFile()){
                var template_return = fs.readFileSync('./sources/site/'+route+'/template/'+template_value, 'utf8');
                var page_return = template_return.replace('{{{template-body}}}', page_return);
            }
        }

        //Ajout des variables
        var varlength = tab_variables_nom.length;
        for(let b = 0; b < varlength;){
            var page_return = replaceAll("{{{template:"+tab_variables_nom[b]+"}}}", tab_variables_str[b], page_return);
            b++;
        }

        return page_return;
    }else{
        return page;
    }
}