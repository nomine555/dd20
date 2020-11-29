
//var url = "../core/SRD5e/gamemastering/magic-items.html"
var url = "../core/SRD5e/gamemastering/monsters-foes/monsters-alphabetical.html"

//var url = "../core/js/spells.js"

var text;

var listado = [
"alce.html", 
"alce_gigante.html", 
"arbusto_consciente.html", 
"avispa_gigante.html", 
"babuino.html", 
"ballena_asesina.html", 
"buho.html", 
"buho_gigante.html", 
"buitre.html", 
"buitre_gigante.html", 
"caballito_de_mar.html", 
"caballito_de_mar_gigante.html", 
"caballo_de_guerra.html", 
"caballo_de_monta.html", 
"caballo_de_tiro.html", 
"cabra.html", 
"cabra_gigante.html", 
"camello.html", 
"cangrejo.html", 
"cangrejo_gigante.html", 
"chacal.html", 
"ciempies_gigante.html", 
"ciervo.html", 
"cocodrilo.html", 
"cocodrilo_gigante.html", 
"comadreja.html", 
"comadreja_gigante.html", 
"cuervo.html", 
"elefante.html", 
"enjambre_de_cuervos.html", 
"enjambre_de_insectos.html", 
"enjambre_de_murcielagos.html", 
"enjambre_de_piranas.html", 
"enjambre_de_ratas.html", 
"enjambre_de_serpientes_venenosas.html", 
"escarabajo_de_fuego_gigante.html", 
"escorpion.html", 
"escorpion_gigante.html", 
"gato.html", 
"hachapico.html", 
"halcon.html", 
"halcon_sangriento.html", 
"hiena.html", 
"hiena_gigante.html", 
"huargo.html", 
"jabali.html", 
"jabali_gigante.html", 
"lagarto.html", 
"lagarto_gigante.html", 
"leon.html", 
"lobo.html", 
"lobo_de_invierno.html", 
"lobo_terrible.html", 
"mamut.html", 
"mastin.html", 
"mula.html", 
"murcielago.html", 
"murcielago_gigante.html", 
"oso_negro.html", 
"oso_pardo.html", 
"oso_polar.html", 
"pantera.html", 
"perro_de_la_muerte.html", 
"perro_intermitente.html", 
"pirana.html", 
"poni.html", 
"pulpo.html", 
"pulpo_gigante.html", 
"rana.html", 
"rana_gigante.html", 
"rata.html", 
"rata_gigante.html", 
"rinoceronte.html", 
"sapo_gigante.html", 
"serpiente_constrictora.html", 
"serpiente_constrictora_gigante.html", 
"serpiente_venenosa.html", 
"serpiente_venenosa_gigante.html", 
"serpiente_voladora.html", 
"simio.html", 
"simio_gigante.html", 
"tejon.html", 
"tejon_gigante.html", 
"tiburon_cazador.html", 
"tiburon_de_arrecife.html", 
"tiburon_gigante.html", 
"tigre.html", 
"tigre_dientes_de_sable.html" 
];

function print(text) {
    document.getElementById("textout").innerHTML = text;
}

function run() {
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            text = xmlhttp.responseText;
            corregir_listado();
            //extract_lists_witha();
            //flip();
        }
    }
    xmlhttp.send(null);
    
}

function extract_titles() {
    
    output = "";
    reg = /name=\"(.*)\"/gi;  
    console.log("empezamos")

    while (match = reg.exec(text)) {
        nombre = match[1].replace("TOC-","").replace(/-/g," ");
        output = output + "[\"" + nombre + "\",\"" + url + "#" + match[1] + "\"],<br>";
}
    //text = text.replace(reg, "$2");
    
    // .replace(/(\w+), (\w+)/g, "$2 $1"));
    print(output);
}

function extract_lists() {
    
    output = "";
    reg = /href=\"([^"]*)\"/gi;  
    console.log("empezamos")

    while (match = reg.exec(text)) {
        nombre = match[1].substring(match[1].indexOf("#")+1);
        nombre = nombre.replace("TOC-","").replace(/-/g," ");
        output = output + "[\"" + nombre + "\",\"" + match[1] + "\"],<br>";
}
    //text = text.replace(reg, "$2");
    
    // .replace(/(\w+), (\w+)/g, "$2 $1"));
    print(output);
}

function extract_lists_witha() {
    
    output = "";
    reg = /href=\"([^"]*)\"([^>]*)>(([^<]*))<\/a>/gi;  
    console.log("empezamos")

    while (match = reg.exec(text)) {
        nombre = match[3];
        output = output + "[\"" + nombre + "\",\"" + match[1] + "\"],<br>";
}
    //output.replace(/ \"/gi,"").replace(/\" /gi,"");
    //text = text.replace(reg, "$2");
    
    // .replace(/(\w+), (\w+)/g, "$2 $1"));
    print(output);
}

function corregir_listado() {
    output = "";
    for (var i = 0; i < listado.length; i++) {   
        output = output + "[\"" + MaysPrimera(listado[i].replace(/_/gi," ").replace(/.html/gi,"")) + "\",\"" + listado[i] + "\"],<br>";
        
    }
    print(output)
    
}

function flip() {
    
    quotedText = /"([^"]*)".."([^"]*)"../g;
    text = text.replace(quotedText, "\"$1\",\"$2\"],");
    
    quotedText = /"([^"]*)"."([^"]*)"../g;
    text = text.replace(quotedText, "\"$2\",\"$1\"],<br>");   
    
    print(text);
}

function MaysPrimera(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}