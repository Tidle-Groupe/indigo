function pars_po(page){
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


        console.log(template_value);
        console.log(script_po);

        //traitement des valeurs

        return page_return;
    }else{
        return page;
    }
}