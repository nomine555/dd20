// Main var that sets 'At Glance' - 'Body' - 'Conclusion'
// Indica estado, si estamos en el menu de monstruos

var debug = "on";
var select = '2';
var firstclick = false;
var maps = [0, 0, 0, 0, 0];
var lastinfo = ["", "", "", "", "", "", ""];
var index = [[], [], []];
var content_file = "";
var version;
var visitas = 0;
var tutorial_page = 0;
var showinginfo = false;
var image_controls = false;
var image_controls_N = 0;
var imageN = 1;
var imageName;
var lateral_closed = false;
var addurl = "";
var aventura = "gate";
var showDiceclick = false;
var binary = "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
var number = ["00", "01", "10", "11"];
var salt = 34587757654943352;
var musicpause = true;
var languages = ['en', 'es'];
var url_completa_wiki = "";
var update_id = "";
var update_delete = "";
var compartir = false;
var old_fragment_url = "";

//Tomado de: https://web.dev/web-share/
function shareimg() {
    //alert("Entramos en shareimg");
    Log("Compartir: entramos en funcion shareimg");
    try {
        if (navigator.share) {
            navigator.share({
                title: 'DD20',
                text: 'Visit Digital d20',
                url: 'http://www.digitald20.com',
            });
        } else
            Log("El navegador no permite compartir");
    } catch (error) {
        Log(error)
    }
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

//Funciones al cargar un tipo de contenido
function starting_index_flow() {
    cargarMenu();
    GetSettings();

    if (typeof aversion !== 'undefined') {
        if (aversion > 1) {
           
            fragment_url = getContentFile();

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", fragment_url);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4) {
                    var customcontent = xmlhttp.responseText;
                    

                var eventos = [];
                var flechas = [];
                    
                var reg = new RegExp("<tw-passagedata pid=\"([^\"]*)\"[^n]*name=\"([^\"]*)\"[^t]*tags=\"([^\"]*flow[^\"]*)\"[^p]*position=\"([^,]*),([^\"]*)\"[^>]*>", "gi");
                if (debug == "on") {
                        var reg2 = new RegExp("(\\[\\[)([^\\]]*)\\]\\]", "gi");
                    }
                    else {
                        // <a href="index.html?param=4">Ganchos de la aventura</a>
                        
                        var reg2 = new RegExp(/<a href="(index|encounter).html\?param=[0-9]*">([^<]*)<\/a>/, "gi");
                    }
                    
                customcontent.match(reg).forEach((element, index) => {
					
                    eventos.push([element.replace(reg, "$1").trim(), element.replace(reg, "$2").trim(),element.replace(reg, "$3").trim(), element.replace(reg, "$4").trim(),element.replace(reg, "$5").trim()]);
                    
                    var search = customcontent.indexOf(element);
                    var end    = customcontent.indexOf("</tw-passagedata>", search);
                    var localcontent = customcontent.substring(search, end);
                    
                    if (debug == "on") {
                        search = localcontent.indexOf("CONCLUSION");
                       
                    }
                    else {
                        search = localcontent.indexOf('CONCLUSION</h2>');
                        
                        
                    }
                    end = localcontent.length;
                    if (search > -1)
                        var conclusion = localcontent.substring(search,end);
                    else
                        var conclusion = localcontent;

                   
                    try {
                    conclusion.match(reg2).forEach((element2, index) => {
                            flechas.push([nametoid(element.replace(reg, "$2")),nametoid(element2.replace(reg2, "$2"))]);
                    });
                        } catch (e) {
                            console.log("No hay enlaces en la entrada: " + element)
                        }
                    
                });
               
                var text = "";
                var maxX = 0;
                var maxY = 0;
                eventos.forEach((element, index) => {
                    if (parseInt(element[3]) > maxX)
                        maxX = parseInt(element[3]);
                    if (parseInt(element[4]) > maxY)
                        maxY = parseInt(element[4]);
                    
                });
                
                eventos.forEach((element, index) => {
					
					if (element[2].indexOf("encounter") > -1) {
                    	text = text + '<a id="'+nametoid(element[1])+'" href="./encounter.html?param='+element[0]+'" class="image-map-flow text strong-tint button" style="left: '+85*parseInt(element[3])/maxX+'%; top: '+85*parseInt(element[4])/maxY+'%;">'+element[1]+'</a>\n';
					}
					else {
                    	text = text + '<a id="'+nametoid(element[1])+'" href="./index.html?param='+element[0]+'" class="image-map-flow text strong-tint button" style="left: '+85*parseInt(element[3])/maxX+'%; top: '+85*parseInt(element[4])/maxY+'%;">'+element[1]+'</a>\n';
					}
                });
                document.getElementById("index-flow-background").innerHTML = text;
                    newdrawLines(flechas);
                }
            }
            xmlhttp.send(null);            
        }}
else {
    DrawLines();
}

}

function nametoid(s) {
    return s.trim().toLowerCase().replace(/[^a-z-0-9]/gi, '-');
}

function newdrawLines(tabla) {
    console.log(tabla)
    tabla.forEach((element) => {
        console.log(element)
        new LeaderLine(document.getElementById(element[0]), document.getElementById(element[1]), {
            color: 'black',
            size: 3
        });
    });
}

//Manual SRD
function startmanual() {
    cargarMenu();
    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("startmanual: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }
    localStorage.setItem('lang', lang);

    if (lang == "es") {
        LoadWikiFirst("../core/SRD5es/index.html");
    }
    if (lang == "en") {
        LoadWikiFirst("../core/SRD5en/index.html");
    }
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

//Diagrama de flujo de aventura
function starting_index_map() {

    cargarMenu();
    content_file = getContentFile();
    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("starting_index_map: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }
    localStorage.setItem('lang', lang);


    var lastmap = localStorage.getItem("lastmap" + aventura);
    var url = "" + window.location;
    if (lastmap === null) {
        lastmap = mainmap;
        localStorage.setItem("lastmap" + aventura, lastmap);
    }

    if (url.indexOf("param=") > -1) {
        url = url.replace("#", "");
        lastmap = url.substring(url.indexOf("param=") + 6, url.indexOf("&", url.indexOf("param=")));
        localStorage.setItem("lastmap" + aventura, lastmap);
    }

    if (url.indexOf("room=") > -1) {
        url = url.replace("index-map", "lugares").replace("&", "-map&").replace("param=", "param=@");
        url = "./" + url.substring(url.indexOf("lugares"));
        Log("url: " + url);
        setTimeout(function () {
            LoadWiki(url)
        }, 500);
    }

    if (typeof aversion !== 'undefined') {
    	if (aversion > 1) {
        	LoadMap("./maps/" + lastmap + ".html", 'mapindex', "", '100', -1);        
        }	
    } 
	else if (soloen == 1) {
    	LoadMap("./maps/" + lastmap + "-en" + ".html", 'mapindex', "", '100', -1);
    }
	else {
    	LoadMap("./maps/" + lastmap + "-" + lang + ".html", 'mapindex', "", '100', -1);
    }


}

//Página de PNJ's
function starting_index_npcs() {
    cargarMenu();
    content_file = getContentFile();
    LoadPassageNPC(content_file, "@main-npcs", 'layertext');
}

function starting_gate() {
    Log("Empezamos starting_gate");
    window.history.pushState(null, "", window.location.href);

    cargarMenu();
    var page = "" + window.location;

    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("starting_gate: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }

    localStorage.setItem('lang', lang);

    if (version === null) {
        version = "5";
        localStorage.setItem('version' + aventura, version);
    }

    // Esto hay que hacerlo genérico
    try {
        if (lang == "es") {
            document.getElementById('lbl_filter_lang').innerHTML = "Idioma";
            document.getElementById('lbl_filter_lvl').innerHTML = "Niveles";
            document.getElementById('show_filters_text').innerHTML = "Mostrar filtros";
            document.getElementById('lbl_english-check').innerHTML = "Inglés";
            document.getElementById('lbl_spanish-check').innerHTML = "Español";
            document.getElementById('lbl_low').innerHTML = "Nivel bajo (1-4)";
            document.getElementById('lbl_med').innerHTML = "Nivel medio (5-10)";
            document.getElementById('lbl_high').innerHTML = "Nivel alto (11-16)";
            document.getElementById('lbl_vhigh').innerHTML = "Nivel muy alto (17+)";
            document.getElementById('btn_apply').value = "Aplicar";
            document.getElementById('btn_clear').value = "Limpiar";
        }
    } catch (e) {
        console.log(e)
    }

    // Ocultamos el idioma que nos sobra en ingles todo, en español parte.
    if (lang == "en") {
        // Aplicamos el Filtro de Ingles
        setonlyenglishfilter();
        //Ocultamos las descripciones en inglés, de las aventuras
        var slides = document.getElementsByClassName("main-gate-description");
        for (var i = 0; i < slides.length; i++) {
            if (hasClass(slides[i], "es"))
                slides[i].style.display = "none";
        }
    } else {
        var slides = document.getElementsByClassName("main-gate-description");
        for (var i = 0; i < slides.length; i++) {
            if (hasClass(slides[i], "en"))
                slides[i].style.display = "none";
        }

        // Traducimos
        var play = document.getElementById("ahidden").innerHTML;
        var download = document.getElementById("dhidden").innerHTML;
        var lplay = document.getElementById("ahidden-" + lang).innerHTML;
        var lbuy = document.getElementById("bhidden-" + lang).innerHTML;

        var slides = document.getElementsByClassName("main-gate-button");
        for (var i = 0; i < slides.length; i++) {
            if (slides[i].innerHTML == play) {
                slides[i].innerHTML = lplay;
            } else {
                slides[i].innerHTML = lbuy;
            }
        }
    }

    //Mostramos la version del js abajo
    document.getElementById("msg-versiones").innerHTML = "v.j" + currentjsversion;

    GetSettings();
    getBuyedItems();

    //Si somos developers
    if (somos_developers() == 1) {
        if (page.indexOf("index-develop.html") < 0) {
            window.location = "index-develop.html";
        }
    }

    Log("Acabamos starting_gate");
}

function somos_developers() {

    var somos_developers = 0;
    personajes = localStorage.getItem('personajes');
    if (personajes !== null) {
        var arr_personajes = personajes.split(",");
        for (var i = 0; i < arr_personajes.length; i++) {
            if (MD5(arr_personajes[i]) == "2dc8443e0e8bede5a44e2b3bba37adb9") {
                somos_developers = 1;
            }
        }
    }
    return somos_developers;
}


//Tutorial
function starting_tutorial() {
    cargarMenu();

    var locationhash = "";
    var url = "" + window.location;
    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("starting_tutorial: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }
    localStorage.setItem('lang', lang);

    var from = url.match(/from=([^\&]*)[&|#]?/);
    if (from !== null) {
        addurl = "&from=" + from[1];
    }

    if (url.indexOf('tutorial=on') > -1) {
        localStorage.setItem('tutorial', 'on');
    } else if (url.indexOf('tutorial=off') > -1) {
        localStorage.setItem('tutorial', 'off');
    }

    if (url.indexOf('version=5') > -1) {
        localStorage.setItem('version' + aventura, '5');
    } else {
        localStorage.setItem('version' + aventura, '3.5');
    }

    if (localStorage.getItem("tutorial") === null) {
        localStorage.setItem('tutorial', 'on');
    }

    if (lang == "es") {
        document.getElementById("exittutorial").innerHTML = "Salir";
        document.getElementById("btnback").innerHTML = "Atrás";
        document.getElementById("next-tutorial").innerHTML = "Adelante";
        document.getElementById("noshowtutorial").innerHTML = "No mostrar la proxima vez";
    }

    // Estamos en la pagina de tutorial-encounter
    if (url.indexOf('encounter') > -1) {

        content_file = getContentFile();
        LoadPassageEncounter(content_file, '20', 'title', 'layertext', 'gamethrough-1', 'gamethrough-3');

        localStorage.setItem('tutorial', 'on'); // ¿Es necesario?
        tutorial_page = 3;
        NextTutorial();

    }

    // Estamos en la pagina de tutorial    
    else {

        if (url.indexOf('page=3') > -1) {
            locationhash = "#personajes";
            tutorial_page = 2;
        }

        if (url.indexOf('page=2') > -1) {
            tutorial_page = 1;
        }

        content_file = getContentFile();
        LoadPassageIndex(content_file, "@bienvenido", 'layertext', locationhash, "");
        // Realmente estamos en el tutorial???
        if (localStorage.getItem('tutorial') == 'on') {
            NextTutorial();
        }
    }
}

//Escena tipo "index"
function starting_index(tag) {
    cargarMenu();
    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("starting_index: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }
	console.log("Idioma: " + lang)
    localStorage.setItem('lang', lang);

    content_file = getContentFile();
	console.log(content_file)
	
    if (tag == "player") {
        var passage_id = location.search.split('param=')[1] ? location.search.split('param=')[1] : '@resumen';
        LoadPassageIndex(content_file, passage_id, 'layertext', "", tag);
    }
    // El último número es el passage por defecto
    var passage_id = location.search.split('param=')[1] ? location.search.split('param=')[1] : '@resumen';
    LoadPassageIndex(content_file, passage_id, 'layertext', "", tag);
}

function starting_pregate(tag) {

    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("starting_pregate: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }
    localStorage.setItem('lang', lang);

    if (lang == "es") {
        document.getElementById('sdcard').innerHTML = "Por favor, esta aplicación necesita acceso a la memoria del dispositivo para funcionar correctamente.";
    }
}

//Encuentro
function starting_encounter() {
    cargarMenu();
    checkVersion("compartir");
    Log("Starting encounter...")

    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("starting_encounter: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }
    localStorage.setItem('lang', lang);

    if (lang == "es") {
        document.getElementsByTagName("body")[0].classList.add('mainbody-es');
        document.getElementsByTagName("body")[0].classList.remove('mainbody');
    }

    content_file = getContentFile();
    var passage_id = location.search.split('param=')[1] ? location.search.split('param=')[1] : '3';
    LoadPassageEncounter(content_file, passage_id, 'title', 'layertext', 'gamethrough-1', 'gamethrough-3');
    //document.getElementById("layertext").focus();

    getBuyedItems();
}


function SaveMasterOn() {
    var masteron = document.getElementById("masteron").checked;
    localStorage.setItem('masteron', masteron);
    location.reload();
    /*
    if (masteron) {          
         document.getElementById("charactersheet").style.display = "none";
    } else {        
         document.getElementById("charactersheet").style.display = "";
    }
    */


}


/*
function showadventures() {
	var checkBox = document.getElementById("showadventures");
	if (checkBox.checked == true) {
		var slides = document.getElementsByClassName("adventure");
		for (var i = 0; i < slides.length; i++) {
			if ((hasClass(slides[i], "es")) && (!hasClass(slides[i], "comprar")))
				slides[i].style.display = "block";
		}
	} else {
		var slides = document.getElementsByClassName("adventure");
		for (var i = 0; i < slides.length; i++) {
			if (hasClass(slides[i], "es"))
				slides[i].style.display = "none";
		}
	}
}
*/

function starting_config() {

    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("starting_config: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }
    localStorage.setItem('lang', lang);

    var version = localStorage.getItem("version" + aventura);
    var tutorial = localStorage.getItem("tutorial");

    if (lang == "es") {
        var element = document.getElementById("es");
        element.checked = true;
        // Cambiamos textos
        document.getElementById('config-text-version').innerHTML = "Version del juego";
        document.getElementById("config-text-back").innerHTML = "Volver";
        document.getElementById("config-text-language").innerHTML = "Idioma";
        document.getElementById("config-text-startup").innerHTML = "Inicio";
        document.getElementById("config-text-nav").innerHTML = "Navegación";
        document.getElementById("config-text-start").innerHTML = "Iniciar con Tutorial";
        document.getElementById("config-text-gate").innerHTML = "Ir a portada";
        document.getElementById("config-text-tutorial").innerHTML = "Ir al tutorial";

    } else {
        var element = document.getElementById("en");
        element.checked = true;
    }

    if (version == '3.5') {
        var element = document.getElementById("dnd3.5");
        element.checked = true;
    } else {
        var element = document.getElementById("dnd5");
        element.checked = true;
    }

    if (tutorial == "on") {
        var element = document.getElementById("tutorial");
        element.checked = true;
    } else if (tutorial == "off") {
        var element = document.getElementById("tutorial");
        element.checked = false;
    }

    content_file = getContentFile();
    LoadPassageIndex(content_file, '1', 'layertext', "", "config");

}

function CalculatePlayersTag(element) {

    var lplayer = localStorage.getItem('player');
    if (null === lplayer)
        lplayer = "{}";
    player = JSON.parse(lplayer);
    elements = element.getElementsByTagName('a');
    for (i = 0; i < elements.length; i++) {
        destino = elements[i].href;
        id = destino.substring(destino.indexOf("param=") + 6);
        if (id in player) {
            binary = binary.substr(0, i * 2) + number[player[id]] + binary.substr(i * 2 + 2, binary.length);
        }
    }
    Log(binary);
    binary = reverseString(binary);
    base10 = parseInt(binary, 2);
    m = (base10 + salt) % 1296;
    letra = m.toString(36);

    codigo = base10.toString(36);
    codigo = codigo + letra;
    while (codigo.length < 4) {
        codigo = "0" + codigo;
    }
    try {
        document.getElementById("player-tag").innerHTML = codigo;
    } catch (error) {
        Log(error)
    }
    /*
    entero = parseInt(codigo, 36);
    bin = entero.toString(2);
    Log(bin);
    bin = reverseString(bin);
    
    for (var i = 0; i < bin.length; i = i + 2) {
        n = parseInt(bin.charAt(i)+bin.charAt(i+1),2);
        Log( i/2 + "," + n);
    }
    */

    /*
    delete player[id];
    player[id] = room;
    localStorage.setItem("player", JSON.stringify(player));
    */

}

function reverseString(str) {
    return str.split("").reverse().join("");
}

function ShowNPC(capa) {

    if (MaxNpcs > 0) {
        for (i = 1; i < (MaxNpcs + 1); i++) {
            document.getElementById('npc' + i).style.display = "none";
        }
        document.getElementById('npc' + capa).style.display = "";
    } else {
        for (i = MaxNpcs; i < 0; i++) {
            Log('npc' + (-i));
            document.getElementById('npc' + (-i)).style.display = "none";
        }
        document.getElementById('npc' + capa).style.display = "";
    }
}

function getContentFile() {
	
	var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("getContentFile: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }
    localStorage.setItem('lang', lang);
	
    if (typeof debug_content_file !== "undefined") {		
			if (aventura == "salorium") 
				if (lang == "es")
					return "..\\twine\\salorium-5-es.html";
			
        return debug_content_file;
    }   

    var version = localStorage.getItem("version" + aventura);
    if (version === null) {
        version = "5";
    }
    var content_file = "content";

    if (lang.substring(0, 2) == "es")
        content_file = content_file + '-es';


    if (version == "5")
        content_file = content_file + '-5';


    //if ( debug == "on" ) {
    //    content_file = content_file + "-debug";
    //}

    content_file = content_file + ".html";
    return content_file;

}

function LoadPassageEncounter(file, id, title_div, main_div, glance_div, conclusion_div) {

    var message = {
        "file": file,
        "id": id,
        "title_div": title_div,
        "main_div": main_div,
        "glance_div": glance_div,
        "conclusion_div": conclusion_div
    }

    try {
        window.webkit.messageHandlers.LoadPassageEncounter.postMessage(message);

    } catch (error) {
        console.log("no estamos en iOS")

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", file);
        //Log("loadencounter: " + file);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                var text = xmlhttp.responseText;
				
                LoadPassageEncounter_back(text, file, id, title_div, main_div, glance_div, conclusion_div);
            }
        }
        xmlhttp.send(null);
    }
}

function LoadPassageEncounter_back(text, file, id, title_div, main_div, glance_div, conclusion_div) {

	if (typeof aversion !== 'undefined') 
        	if (aversion > 1) {
				Quicklinks(text);
			}

		
	var maintext = text;
	var Nbotones = 0;
	
    if (document.readyState !== "loading") {
		
		 text = text.replace(/<n>/g, '\n');

        var element_title = document.getElementById(title_div);
        var element_body = document.getElementById(main_div);
        var element_atglance = document.getElementById(glance_div);
        var element_conclusion = document.getElementById(conclusion_div);
        var npcs = [[], []];

        text = RepairLinks(text);
        var passage = getPassage(text, id);
        title = passage[1];
        text = passage[0];
        
        var allpassage = getalltext(text);


		if (typeof aversion !== 'undefined') {
        	if (aversion > 1) {

                if (debug == "on")
                {allpassage[0] = allpassage[0].substr(allpassage[0].indexOf("#"));}
                else 
                {allpassage[0] = allpassage[0].substr(allpassage[0].indexOf("<h1"));}
                
					var offset = 0;
					var Nbotones = 0;
				//try {
                    /*
                        var reg = new RegExp("<img src=\"([^\"]*)\" alt=\"map\">", "gi");
                var reg2 = new RegExp("<h1[^>]*>@([^<]*)<!--([^,]*),([^,]*),([^,]*),([^>]*)-->", "gi");
                var reg3 = new RegExp("<h1[^>]*>([^<]*)<!--([^,]*),([^>]*)-->", "gi");
            */
                    
                    if (debug == "on")
                    {var reg = new RegExp("!\\[([^\\]]*)\\]\\((.*)\\)", "gi");}
					else
                    {var reg = new RegExp("<img src=\"([^\"]*)\" alt=\"([^\"]*)\">", "gi");}
                    
                    text.match(reg).forEach((element, index) => {	
                        console.log("match: " + element)
						
                        if (debug == "on") {
						var tipo = element.replace(reg, "$1").trim();
						var url = element.replace(reg, "$2").trim();
                            }
                        else {
                        var tipo = element.replace(reg, "$2").trim();
						var url = element.replace(reg, "$1").trim();                            
                        }
                        
						
						if (tipo.indexOf("map") > -1) {
							
							Nbotones++;
							// Necesitamos la imagen del MAPA!
							
							document.getElementById("button" + (index + offset)).style.backgroundImage = 'url(' + getMapImage(maintext, url) + ')';
														
							document.getElementById("button" + (index + offset)).onclick = (function(opt1, opt2, opt3, opt4, opt5) {
								return function() {
									LoadMap(opt1, opt2, opt3, opt4, opt5);
								};
							})(url, 'layer' + (index + offset), "", '90', (index + offset));							
							
						}
						if (tipo.indexOf("image") > -1) {							
							AddImage('layer' + (index + offset), url);
							document.getElementById("button" + (index + offset)).style.backgroundImage = 'url(' + url + ')';
							Nbotones++;
						}
						if (tipo.indexOf("audio") > -1) {
							offset = offset - 1;
							allpassage[0] = "<audio controls src='"+url+"'></audio><br>  \n" + allpassage[0];
						}
						if (tipo.indexOf("music") > -1) {
							offset = offset - 1;
							document.getElementById("music").src = url;
						}
					});
                //} catch (e) {
                    //console.log("No hay imágenes ni sonido en el encuentro!: " + e)}
		}
		} else {
			npcs = getnpcs(text);
        	music = gettext(text, 'music');
			for (var i = 0; i < npcs.length; i++) {

            if (npcs[i].indexOf('html') < 0) {
                AddImage('layer' + i, npcs[i]);
                document.getElementById("button" + i).style.backgroundImage = 'url(' + npcs[i] + ')';
            } else {
                document.getElementById("button" + i).style.backgroundImage = 'url(' + npcs[i].replace("html", "jpg") + ')';
                var leyend = "@" + npcs[i].substring(npcs[i].lastIndexOf("-") + 1, npcs[i].indexOf(".html")) + "-leyend";
                document.getElementById("button" + i).onclick = (function (opt1, opt2, opt3, opt4, opt5) {
                    return function () {
                        LoadMap(opt1, opt2, opt3, opt4, opt5);
                    };
                })(npcs[i].trim(), 'layer' + i, leyend, '90', i);
            }
        }
			Nbotones = npcs.length;
			document.getElementById("music").src = getMusicDir() + music;
		}

        // Hacemos el markdown, Resturamso las comillas, Y creamos los estilos para Show/Unshow
        bodytext = enmarked(allpassage[0]);
        atglance = enmarked(allpassage[1]);
        conclusion = enmarked(allpassage[2]);


			if (Nbotones == 3) {
					//document.getElementById("buttonaudio").style.width = "30%";
					document.getElementById("button1").style.width = "30%"
					document.getElementById("button2").style.width = "30%"
					document.getElementById("button3").style.display = "none";
					document.getElementById("button4").style.display = "none";
				}

				if (Nbotones == 2) {
					document.getElementById("button0").style.backgroundSize = "cover";
					document.getElementById("buttonaudio").style.width = "45%";
					document.getElementById("button1").style.width = "45%";
					document.getElementById("button2").style.display = "none";
					document.getElementById("button3").style.display = "none";
					document.getElementById("button4").style.display = "none";
				}

				if (Nbotones == 1) {
					document.getElementById("button0").style.backgroundSize = "cover";
					document.getElementById("button0").style.height = "95%";
					document.getElementById("buttonaudio").style.top = "-100%";

					document.getElementById("button1").style.display = "none";
					document.getElementById("button2").style.display = "none";
					document.getElementById("button3").style.display = "none";
					document.getElementById("button4").style.display = "none";
				}

        element_title.innerHTML = title;
        element_body.innerHTML = bodytext;
        element_atglance.innerHTML = atglance;
        element_conclusion.innerHTML = conclusion;

        

        Update_href_first(element_body);
        Update_href_first(element_atglance);
        Update_href_first(element_conclusion);

        // Player conclusions 

        var lplayer = localStorage.getItem('player');
        if (null === lplayer)
            lplayer = "{}";
        player = JSON.parse(lplayer);
        localStorage.setItem("player", JSON.stringify(player));
        if (id in player) {
            element_conclusion.getElementsByTagName('a')[player[id]].className = "checkedblog";
        }

        after_load();


    } else {
        setTimeout(function () {
            LoadPassageEncounter_back(text, file, id, title_div, main_div, glance_div, conclusion_div)
        }, 500);
    }
}

		function getMapImage(customcontent, id) {
            if (debug == "on")
				var reg = new RegExp("!\\[map\\]\\(([^\\)]*)\\)", "gi");
            else
                var reg = new RegExp("<img src=\"([^\"]*)\" alt=\"map\">", "gi");
				var map = getPassage(customcontent, id);
				return map[0].match(reg)[0].replace(reg, "$1");
		}

function getPassage(text, id) {
    console.log(id)
	
    if (isNaN(id)) {

		//var reg = new RegExp("<tw-passagedata pid=\"([^\"]*)\"[^n]*name=\"([^\"]*)\"[^f]*flow[^p]*position=\"([^,]*),([^\"]*)\"[^>]*>", "gi");
        // <tw-passagedata pid="1" name="Adventure Synopsis" tags="index @summary"         
        var reg = new RegExp("<tw-passagedata[^>]*tags=\"[^\"]*"+id+"[\"| ][^>]*>", "gi");
        search = text.indexOf(text.match(reg)[0]);

        //var search = text.indexOf(" " + id);
        //search = text.lastIndexOf('<tw-passagedata pid="', search);
        var search_space = text.indexOf('>',search);
        var search_out = text.indexOf('</tw-passagedata>', search + 1);
        var search2 = text.indexOf('name="', search + 1);
        var search_out2 = text.indexOf('"', search2 + 7);
    } else {

        var search = text.indexOf('<tw-passagedata pid="' + id);
        var search_space = text.indexOf('>',search);
        var search_out = text.indexOf('</tw-passagedata>', search + 1);
        var search2 = text.indexOf('name="', search + 1);
        var search_out2 = text.indexOf('"', search2 + 7);
    }
    return [text.substring(search, search_space+1) + '\n' + text.substring(search_space+1, search_out), text.substring(search2 + 6, search_out2)];
}

function getalltext(text) {

    var body;
    var atglance;
    var conclusion;
    

    if (debug == "on") {
        presearch = text.indexOf(">");
        search = text.indexOf("AT A GLANCE");
        search2 = text.indexOf("\n", search);
        search2 = text.indexOf("\n", search2 + 1);
        search_out = text.indexOf("CONCLUSION", search);
        search_out2 = text.indexOf("\n", search_out);
        search_out2 = text.indexOf("\n", search_out2 + 1);
        search_final = text.indexOf("images {", search_out);
        search_final2 = text.indexOf("FOR PLAYERS", search_out);
        if (search_final < 0)
            search_final = text.length;
        if (search_final2 < 0)
            search_final2 = text.length;
        if (search_final > search_final2)
            search_final = search_final2;
        
    } else {
        
        presearch = text.indexOf(">");
        search = text.indexOf('<h2 id="at-a-glance');
        search2 = text.indexOf("</h2>", search + 1) + 5;
        search_out = text.indexOf('<h2 id="conclusion', search);
        search_out2 = text.indexOf("</h2>", search_out + 1) + 5;
        search_final = text.indexOf("images {", search_out2);
        search_final2 = text.indexOf('<h2 id="for-players"', search_out2);
        if (search_final < 0)
            search_final = text.length;
        if (search_final2 < 0)
            search_final2 = text.length;

        if (search_final > search_final2)
            search_final = search_final2;
    }

    body = text.substring(presearch+1, search);
    atglance = text.substring(search2, search_out);
    conclusion = text.substring(search_out2, search_final);

    return [body, atglance, conclusion];

}

function unescapef(text) {
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '\"');
    return text;

    /*return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '\"');*/
}

function getShowOff(text) {
    /*
    var end = text.lastIndexOf("//");
    var search_out = 0;
    if (end > 0)
    do {
    var search     = text.indexOf("//",search_out);
    var search_out = text.indexOf("//", search + 2);    
    var id_div     = text.substring(search + 2, search_out);
    text =   text.substring(0,search) 
        + "<a href='#' onclick='EscondeMuestra(\""+id_div+"\")'>" + id_div + "</a>" 
        + text.substring(search_out + 2,text.length);
        
    search        = text.indexOf("\\",search_out);
    search_out    = text.indexOf("\\", search + 2);    
    var full_div  = text.substring(search + 2, search_out);    
    text =   text.substring(0,search) + "<div id=\"" + id_div 
        + "\" style=\"display:none;visibility:hidden;\"><pre>" 
        + text.substring(search+2,search_out) + "</div></pre>" 
        + text.substring(search_out+2,text.length);

    } while (search < end)
        */
    return text;
}

function getnpcs(text) {
    search = text.indexOf("images {");
    search_out = text.indexOf("}", search);
    npcs = text.substring(search + 8, search_out).split(",");
    return npcs;
}

function gettext(text, section) {
    search = text.indexOf(section + " {");
    search_out = text.indexOf("}", search);
    return text.substring(search + 2 + section.length, search_out);
}

function AddImage(layer, image) {	

    var element = document.createElement("img");
    document.getElementById(layer).appendChild(element);
    element.style.margin = 'auto';

    // Alargadas rotamos
    if (image.indexOf('-portrait') > -1) {
        image = image.replace("-portrait", "");
    }
    element.src = image
    element.className = "imagelinks"

    if (image.indexOf('-map') > -1) {
        element.style.boxShadow = "0 0 50px 50px rgba(0, 0, 0, .5)";
    } else {
        element.style.boxShadow = "-500px -500px 0 1500px rgba(0, 0, 0, 1)";
    }


    // Esto es para los nuevos botones dinámicos
    // Se reutiliza la antigua capa para meter los nuevos botones y centrarlos bien. 
    var butonlayer = document.getElementById(layer).getElementsByClassName("index-icon-close")[0];
    butonlayer.setAttribute("style", "pointer-events:none");
    butonlayer.removeAttribute("onclick");
    butonlayer.style.left = 0;
    butonlayer.style.top = 0;
    butonlayer.style.backgroundImage = "";

    var bclose = document.createElement("img");
    butonlayer.appendChild(bclose);
    bclose.src = '../core/images/icons/icon-index-7.png';
    bclose.className = "icon-close";

    if (compartir) {
        var bshare = document.createElement("img");
        butonlayer.appendChild(bshare);
        bshare.src = '../core/images/icons/share.png';
        bshare.className = "icon-share";

        bshare.onclick = function () {
            ShareButton()
        };
    }
    bclose.onclick = function () {
        CloseImage()
    };

    element.onload = function () {

        var aspect = this.naturalWidth / this.naturalHeight;
        if (screen.width > screen.height) {
            var device_aspect = screen.width / screen.height;
        } else {
            var device_aspect = screen.height / screen.width;
        }
        var size = "100";

        console.log(this.naturalWidth + "," + this.naturalHeight + "," + screen.height + "," + screen.width)
        if (this.src.indexOf('-map') > -1)
            var size = "90";

        /*    if (this.naturalHeight > screen.height) {
                if (aspect)
                element.style.width = 'auto';
                element.style.height = size+'vh';
            } else */
        if (aspect < device_aspect) {
            element.style.width = 'auto';
            element.style.height = size + 'vh';
            butonlayer.style.width = size * aspect + 'vh';
            butonlayer.style.height = size + 'vh';
            butonlayer.style.left = (device_aspect * 100 - aspect * size) / 2 + "vh";

        } else {
            element.style.width = size + 'vw';
            element.style.height = 'auto';
            butonlayer.style.width = size + 'vw';
            butonlayer.style.height = size / aspect + 'vw';
            butonlayer.style.top = (100 / device_aspect - size / aspect) / 2 + "vw";
        }

    }

    if (image.indexOf("N1-") > -1) {
        var nn = image.indexOf("N1-");
        image_controls_N = parseInt(image.substr(nn + 3, 1));
        image_controls = true;
        imageName = image;
    }
}

function LoadMap(fragment_url, element_id, leyenda, size, show) {


	 var showlayer = 0;
    if (arguments.length > 4) {

        showlayer = show;
        if (maps[show] > 0) {
            Show(showlayer);
            return;
        } else maps[show] = 1;
    }
    showlayer = "" + showlayer;
    leyenda = "" + leyenda;
	
	 var customcontent = localStorage.getItem("customcontent" + aventura);

            if (customcontent === null) {
				
    if (typeof aversion !== 'undefined')
        if (aversion > 1) {
            
            old_fragment_url = fragment_url;
            fragment_url = getContentFile();
        }

    var message = {
        "fragment_url": fragment_url,
        "element_id": element_id,
        "leyenda": leyenda,
        "size": size,
        "showlayer": showlayer
    }
    try {
        window.webkit.messageHandlers.LoadMap.postMessage(message);

    } catch (error) {
        console.log("no estamos en iOS")

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", fragment_url);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                var text = xmlhttp.responseText;
                LoadMap_back(text, fragment_url, element_id, leyenda, size, showlayer);
            }
        }
        xmlhttp.send(null);
    }
	} else {
		
                reg = new RegExp(".\/maps\/(.*)\.html", "gi");
		
				if (reg.test(fragment_url)) {
                var id = "@" + fragment_url.match(reg)[0].replace(reg, "$1");
				} else var id = fragment_url;                 

				var map = getPassage(customcontent, id);
                var reg = new RegExp("!\\[map\\]\\(([^\\)]*)\\)", "gi");
                var urlmap = map[0].match(reg)[0].replace(reg, "$1");

                var text = '<!--BEGIN--><div id="loadedmap" class="maplinks" style="background-image: url(' + urlmap + ');background-repeat: no-repeat;background-size: contain;background-position: top left;"><span  class="nleyenda text">';

                reg = new RegExp("# ([^&]*)&lt;!--([^,]*),([^&]*)--&gt;", "gi");
                var reg2 = new RegExp("# @([^&]*)&lt;!--([^,]*),([^&]*)--&gt;", "gi");
        
                var offset = 0;
                map[0].match(reg).forEach((element, index) => {
                    if (element.indexOf("@") > -1) {
                        
                        text = text + '<a href="./index-map.html?param=' + element.replace(reg2, "$1").trim() + '&" style="left: ' + element.replace(reg2, "$2") + '%;top: ' + element.replace(reg2, "$3") + '%; width: auto; height: auto;" class="bigclickable">'+toTitleCase(element.replace(reg2, "$1").trim().replace("@","").replace("-"," "))+'</a>'
                        offset = offset - 1;
                    } else {
                        text = text + '<a  href="./lugares.html?param=' + id + '&amp;room=' + (index + 1) + '" style="left: ' + element.replace(reg, "$2") + '%;top: ' + element.replace(reg, "$3") + '%;" class="clickable">'+(index+offset+1)+'</a>';
                    }

                });

                text = text + '</span></div><!--END-->';               
                LoadMap_back(text, fragment_url, element_id, leyenda, size, showlayer);
            }
}


function LoadMap_back(text, fragment_url, element_id, leyenda, size, showlayer) {

    var customcontent = localStorage.getItem("customcontent" + aventura);
    if (customcontent === null) {
    if (typeof aversion !== 'undefined')
        if (aversion > 1) {
            console.log(fragment_url)
            fragment_url = old_fragment_url;
            

            reg = new RegExp(".\/maps\/(.*)\.html", "gi");
			if (reg.test(fragment_url)) {
                var id = "@" + fragment_url.match(reg)[0].replace(reg, "$1");
            } else var id = fragment_url;   
			            
            var map = getPassage(text, id);

            
            if (debug == "on") {

            var reg = new RegExp("!\\[map\\]\\(([^\\)]*)\\)", "gi");
            var reg2 = new RegExp("# @([^&]*)&lt;!--([^,]*),([^&]*)--&gt;", "gi");
            var reg3 = new RegExp("# ([^&]*)&lt;!--([^,]*),([^&]*)--&gt;", "gi");

            } else {
                var reg = new RegExp("<img src=\"([^\"]*)\" alt=\"map\">", "gi");
                var reg2 = new RegExp("<h1[^>]*>@([^<]*)<!--([^,]*),([^,]*)-->", "gi");
                var reg3 = new RegExp("<h1[^>]*>([^<]*)<!--([^,]*),([^>]*)-->", "gi");
            }
            
            var urlmap = map[0].match(reg)[0].replace(reg, "$1");
            
            text = '<!--BEGIN--><div id="loadedmap" class="maplinks" style="background-image: url(' + urlmap + ');background-repeat: no-repeat;background-size: contain;background-position: top left;"><span  class="nleyenda text">';

            
            var offset = 0;
            map[0].match(reg3).forEach((element, index) => {
                if (element.indexOf("@") > -1) {
                    // <a href="./index-map.html?param=tabalard&" style="left: 45%;top: 42%;; width: 13%; height: 6%" class="bigclickable"></a>

                    text = text + '<a href="./index-map.html?param=' + element.replace(reg2, "$1").trim() + '&" style="left: ' + element.replace(reg2, "$2") + '%;top: ' + element.replace(reg2, "$3") + '%; width: auto; height: auto;" class="bigclickable">'+toTitleCase(element.replace(reg2, "$1").trim().replace("@","").replace("-"," "))+'</a>'
                    offset = offset - 1;
                    /*
                    text = text + '<a href="./index-map.html?param=' + element.replace(reg2, "$1").trim() + '&" style="left: ' + element.replace(reg2, "$2") + '%;top: ' + element.replace(reg2, "$3") + '%;; width: ' + element.replace(reg2, "$4") + '%; height: ' + element.replace(reg2, "$5") + '%" class="bigclickable">'+element.replace(reg2, "$1").trim().replace("@","")+'</a>'
                    offset = offset - 1;
                    */
                    
                } else {
                    text = text + '<a  href="./lugares.html?param=' + id + '&amp;room=' + (index + 1) + '" style="left: ' + element.replace(reg3, "$2") + '%;top: ' + element.replace(reg3, "$3") + '%;" class="clickable">'+(index+offset+1)+'</a>';
                }

            });

            text = text + '</span></div><!--END-->';

        }
    } 
      

    // Showlayer indica si estamos en el Indice general de mapas o en un encuentro 
    // Size indica lo mismo que showlayer en el fondo, es 90% o 100%  
    showlayer = parseInt(showlayer);
    size = parseInt(size);

    // Esto nos permite editar los mapas con comodidad en brackets 
    text = text.replace(/<n>/g, '\n');
    text = text.replace("../../core/images/", "../core/images/");
    text = text.replace("../images", "./images")

    var element = document.getElementById(element_id);
    element.innerHTML = element.innerHTML + text.substring(text.indexOf('<!--BEGIN-->'), text.indexOf('<!--END-->'));
    Update_href_first(element);
    
    // Cogemos la relación de aspecto de la CAPA que contiene el MAPA
    // Si no hay información asumimos 1.6
    var e = element.getElementsByClassName("maplinks")[0];
    var imageratio = e.style.width.replace("vh", "") / e.style.height.replace("vh", "");
    if (isNaN(imageratio))
        CenterMap(size,element_id, showlayer);
    else 
        CenterMap(size,element_id, showlayer, imageratio);
    
}

function CenterMap(size,element_id, showlayer, imageratio) {
    
    console.log("Ratio:" + imageratio)
    var element = document.getElementById(element_id);
    var e = element.getElementsByClassName("maplinks")[0];
    
    if (imageratio !== undefined) {
        
    var aspect = screen.width / screen.height;
    if (aspect < 1) {
        aspect = 1 / aspect;
    }

    // Esto es para los nuevos botones dinámicos
    // Se reutiliza la antigua capa para meter los nuevos botones y centrarlos bien. 
    var butonlayer = document.getElementById(element_id).getElementsByClassName("index-icon-close")[0];
    if (butonlayer !== undefined) {
        butonlayer.setAttribute("style", "pointer-events:none");
        butonlayer.removeAttribute("onclick");
        butonlayer.style.left = 0;
        butonlayer.style.top = 0;
        butonlayer.style.backgroundImage = "";

        var bclose = document.createElement("img");
        butonlayer.appendChild(bclose);
        bclose.src = '../core/images/icons/icon-index-7.png';
        bclose.className = "icon-close";

        if (compartir) {

            var bshare = document.createElement("img");
            butonlayer.appendChild(bshare);
            bshare.src = '../core/images/icons/share.png';
            bshare.className = "icon-share";

            bshare.onclick = function () {
                ShareButton()
            };
        }
        bclose.onclick = function () {
            CloseImage()
        };
    }
    /* Ajustamos toda la altura y el ancho para centrar */
    if ((aspect * 100 - imageratio * size) > 0) {

        e.style.height = size + "vh";
        e.style.top = (100 - size) / 2 + "vh";
        e.style.width = size * imageratio + "vh";
        e.style.left = (aspect * 100 - imageratio * size) / 2 + "vh";

        if (butonlayer !== undefined) {
            butonlayer.style.height = size + "vh";
            butonlayer.style.top = (100 - size) / 2 + "vh";
            butonlayer.style.width = size * imageratio + "vh";
            butonlayer.style.left = (aspect * 100 - imageratio * size) / 2 + "vh";
        }

    } else {

        e.style.width = size + "vw";
        e.style.left = (100 - size) / 2 + "vw";
        e.style.top = (100 / aspect - size / imageratio) / 2 + "vw";
        e.style.height = size / imageratio + "vw";

        if (butonlayer !== undefined) {
            butonlayer.style.width = size + "vw";
            butonlayer.style.left = (100 - size) / 2 + "vw";
            butonlayer.style.top = (100 / aspect - size / imageratio) / 2 + "vw";
            butonlayer.style.height = size / imageratio + "vw";
        }

    }

    /* Estamos cargando el mapa denimageratiotro de un encuentro */
    if (size < 100) {

        /* Es de los que tienen una imagen dentro */
        if (e.children[0].tagName !== "IMG") {
            e.style.boxShadow = "0 0 50px 50px rgba(0, 0, 0, .5)";
        }

        QuitaEnlaceMapas(element);
        if (showlayer > -1) {
            Show(showlayer);
        }
    }
    } else {

        var theImage = new Image();
        console.log(e.style.backgroundImage);
            theImage.src = e.style.backgroundImage.replace('url("','').replace('")','');
            theImage.onload = function() {
                
                console.log("Ratio:" + theImage.width/theImage.height)
                CenterMap(size,element_id,showlayer, theImage.width/theImage.height)                                
        };

    }
}

function QuitaEnlaceMapas(element) {
    elements = element.getElementsByTagName('a');
    for (i = 0; i < elements.length; i++) {
        if (elements[i].className.indexOf("bigclickable") > -1) {
            elements[i].style.display = "none";
        }

    }
}

function restorePurchase() {

    var nada = "";
    var message = {
        "nada": nada
    }

    try {
        window.webkit.messageHandlers.restorePurchases.postMessage(message);
    } catch (error) {
        console.log("no estamos en iOS");
    }
    try {
        Android.restorePurchases("");
    } catch (error) {
        console.log("no estamos en Android");
    }
    Log("restore purchases...")
    hide_menu();
}


/*

function LoadLeyenda(leyenda, element) {

    content_file = getContentFile();
     if (arguments.length > 1) {
        var e = element.getElementsByClassName("leyenda")[0];
     } else {
        var e = document.getElementById('leyenda');        
     }

    LoadPassage(content_file, leyenda, e); 
    
}
*/
/*

function LoadPassage(file, id, element_id) {
    
    var element = document.getElementById(element_id);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", file);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            var text = xmlhttp.responseText;
            LoadPassage_back(text, file, id, element);                        
        }
    }
    xmlhttp.send(null);
}
*/

function LoadPassage_back(text, file, id, element) {
    text = text.replace(/<n>/g, '\n');
    text = RepairLinks(text);
    passage = getPassage(text, id);
    text = passage[0];
    title = passage[1];
    text = enmarked(text);
    element.innerHTML = text;
    Update_href(element);
}

function getMainIndex(Sindex) {

    for (var i = 0; i < index[0].length; i++) {

        if (index[2][i] == Sindex)
            return i + 1;
    }
    return -1;
}

function LoadPassageNPC(file, id, dest_div) {
    var message = {
        "file": file,
        "id": id,
        "dest_div": dest_div
    }

    try {
        window.webkit.messageHandlers.LoadPassageNPC.postMessage(message);

    } catch (error) {
        console.log("no estamos en iOS")


        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", file);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                var text = xmlhttp.responseText;
                LoadPassageNPC_back(text, file, id, dest_div);
            }
        }
        xmlhttp.send(null);
    }
}

function LoadPassageNPC_back(text, file, id, dest_div) {
    text = text.replace(/<n>/g, '\n');
    var element = document.getElementById(dest_div);

    text = RepairLinks(text);
    passage = getPassage(text, id);
    text = passage[0];
    title = passage[1];
    text = enmarked(text);
    text = CreateDivs(text);

    element.innerHTML = text;
    Update_href_first(element);
    ShowNPC(1);
}


function LoadPassageIndex(file, id, dest_div, locationhash, tag) {

    var message = {
        "file": file,
        "id": id,
        "dest_div": dest_div,
        "locationhash": locationhash,
        "tag": tag
    }

    try {
        window.webkit.messageHandlers.LoadPassageIndex.postMessage(message);

    } catch (error) {
        console.log("no estamos en iOS")

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", file);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                // Firs the lef side
                var text = xmlhttp.responseText;
                LoadPassageIndex_back(text, file, id, dest_div, locationhash, tag);
            }
        }
        xmlhttp.send(null);
    }

}

function PlayerIndexFilter(element) {

    var gamestate = localStorage.getItem('gamestate');
    if (null === gamestate)
        gamestate = default_game_state;
    document.getElementById("gamestatus").value = gamestate;

    var perception = localStorage.getItem('perception');
    if (null === perception)
        perception = 0;
    document.getElementById("perception").value = perception;

    var arcana = localStorage.getItem('arcana');
    if (null === arcana)
        arcana = 0;
    document.getElementById("arcana").value = arcana;

    var historia = localStorage.getItem('historia');
    if (null === historia)
        historia = 0;
    document.getElementById("historia").value = historia;


    letra = gamestate.substr(gamestate.length - 2, 2);
    gamestate = gamestate.substring(0, gamestate.length - 2);
    entero = parseInt(gamestate, 36);

    nletra = ((entero + salt) % 1296).toString(36);
    Log("letra: " + letra + ", " + nletra);

    if (letra == nletra)
        codigo_correcto = true;
    else codigo_correcto = false;

    bin = entero.toString(2);
    while (bin.length < 64) {
        bin = "0" + bin;
    }
    bin = reverseString(bin);

    /*    
    for (var i = 0; i < bin.length; i = i + 2) {
        n = parseInt(bin.charAt(i)+bin.charAt(i+1),2);
        Log( i/2 + "," + n);
    }
    */

    elements = element.getElementsByTagName('a');
    for (i = 0; i < elements.length; i++) {
        tag = elements[i].href;
        tag = tag.substring(tag.indexOf("param=") + 6);
        n = parseInt(bin.charAt(i * 2) + bin.charAt(i * 2 + 1), 2);
        Log(tag + "," + n)
        if (n > 0 && codigo_correcto) {

            elements[i].parentElement.style.display = "";
            elements[i].href = elements[i].href.replace("index.html", "index-player.html").replace("encounter.html", "index-player.html") + "&room=" + n;
        } else if (isInArray(tag, minindex)) {
            elements[i].parentElement.style.display = "";
            elements[i].href = elements[i].href.replace("index.html", "index-player.html").replace("encounter.html", "index-player.html") + "&room=1";
        } else elements[i].parentElement.style.display = "none";
    }

}

function UpdatePlayerData() {
    gamestate = document.getElementById("gamestatus").value;
    localStorage.setItem('gamestate', gamestate);

    perception = document.getElementById("perception").value;
    localStorage.setItem('perception', perception);

    arcana = document.getElementById("arcana").value;
    localStorage.setItem('arcana', arcana);

    historia = document.getElementById("historia").value;
    localStorage.setItem('historia', historia);

    location.reload();
    //PlayerIndexFilter(document.getElementById("main-index"));
}

function LoadPassageIndex_back(text, file, id, dest_div, locationhash, tag) {

    if (id.indexOf("&") > -1) {
        room = id.substring(id.indexOf("&") + 6);
        id = id.substring(0, id.indexOf("&"));
    } else {
        room = 1;
    }

    if (document.readyState !== "loading") {
        
        	if (typeof aversion !== 'undefined') 
        	if (aversion > 1) {
				Quicklinks(text); 
			}


        text = text.replace(/<n>/g, '\n');
        var index_id = '@index-main';
        var index_div = 'main-index';
        var element = document.getElementById(index_div);
        var element2 = document.getElementById(dest_div);
        text = RepairLinks(text);

        passage = getPassage(text, index_id);
        text_ = passage[0];
        title = passage[1];
        text_ = enmarked(text_);
        element.innerHTML = text_;
        Update_href(element);

        if (tag == "player") {
            PlayerIndexFilter(element);
        }

        // Then the rigth side
        if (tag == "rd") {

        } else {
            
            passage = getPassage(text, id);
            text = passage[0];
            title = passage[1];
            text = enmarked(text);
            
            
                    if (typeof aversion !== 'undefined') 
        	if (aversion > 1) {
        try {    
                        var reg = new RegExp("<img src=\"([^\"]*)\" alt=\"audio\">", "gi");
                    
                    text.match(reg).forEach((element, index) => {						
						var url = element.replace(reg, "$1").trim();
                        console.log(url)
				        text = "<audio controls src='"+url+"'></audio><br>  \n" + text;
					});
                    text = text.replace(reg,"");
                } catch (e) {
                    console.log("No hay audio en el índice!")
                }
            }
            
            element2.innerHTML = text;

            /* Only for tutorial, not good idea but few time to code */
            if (locationhash !== "") {
                setTimeout(function () {

                    location.hash = locationhash + "k";
                    location.hash = locationhash;
                    if (locationhash == "#personajes") {
                        var element = document.getElementById('layertext');
                        var elements = element.getElementsByTagName('a');
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].style.textDecoration = "underline";
                        }
                        elements[2].style.boxShadow = "0 0 0 5000px rgba(0, 0, 0, .4)";
                        elements[2].style.padding = "2vh";

                        var element = document.getElementById('main-index');
                        var elements = element.getElementsByTagName('a');
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].style.textDecoration = "underline";
                        }
                        elements[2].style.boxShadow = "0 0 0 5000px rgba(0, 0, 0, .4)";
                        elements[2].style.padding = "2vh";
                        Hole('0', '0', '100%', '100vh');
                        document.getElementById("indexgroup-over").style.visibility = "visible";
                    }
                }, 250);
            }

            Update_href_first(element2);
            if (tag == "player") {
                FilterPlayerContent(element2, text, room);
            } else if (tag == "config")
                CalculatePlayersTag(element);
            after_load_index();
        }

    } else {
        setTimeout(function () {
            LoadPassageIndex_back(text, file, id, dest_div, locationhash, tag)
        }, 500);
    }
}

function FilterPlayerContent(element, text, room) {

    var forplayers;

    var perception = localStorage.getItem('perception');
    if (null === perception)
        perception = 0;
    document.getElementById("perception").value = perception;

    var arcana = localStorage.getItem('arcana');
    if (null === arcana)
        arcana = 0;
    document.getElementById("arcana").value = arcana;

    var historia = localStorage.getItem('historia');
    if (null === historia)
        historia = 0;
    document.getElementById("historia").value = historia;

    search = text.indexOf('<h2 id="for-players', 0);
    search_final = text.indexOf("images {", search + 1);
    if (search_final < 0)
        search_final = text.length;
    forplayers = text.substring(search, search_final);

    // general info
    var start = forplayers.indexOf("<h1", 0);
    var end = forplayers.indexOf("<h1", start + 3);
    if (end < 0)
        end = forplayers.length;
    var general = forplayers.substring(start, end);

    // only general info 
    if (end == forplayers.length) {
        forplayers = general;
        general = "";
        Log("only general");
    } else {
        // specific info
        var start = 0;
        for (var i = 0; i < parseInt(room) + 1; i++)
            start = forplayers.indexOf("<h1", start + 3);
        var end = forplayers.indexOf("<h1", start + 3);
        if (end < 0)
            end = forplayers.length;

        forplayers = forplayers.substring(start, end);
    }

    var inicio = 0;
    var fin = 0;
    while (true) {
        inicio = forplayers.indexOf("<h3", inicio + 1);
        if (inicio < 0)
            break;
        inicio = forplayers.indexOf(">", inicio + 1) + 1;
        fin = forplayers.indexOf("</h3>", inicio + 3);
        fin2 = forplayers.indexOf("<h3", fin + 1);
        if (fin2 < 0)
            fin2 = forplayers.length;

        titulo = forplayers.substring(inicio, fin);
        skill = titulo.substring(0, titulo.indexOf("-"));
        nivel = parseInt(titulo.substring(titulo.indexOf("-") + 1));

        if ((skill.indexOf("Arcana") > -1) && (arcana > nivel)) {
            Log("lo mantenemos" + skill + nivel);
        } else if ((skill.indexOf("History") > -1) && (historia > nivel)) {
            Log("lo mantenemos" + skill + nivel);
        } else if ((skill.indexOf("Perception") > -1) && (perception > nivel)) {
            Log("lo mantenemos" + skill + nivel);
        } else {
            Log("lo borramos" + skill + nivel);
            forplayers = forplayers.substring(0, inicio) + forplayers.substring(fin2);
        }
    }

    element.innerHTML = general + forplayers;

}

/*
function CreateDivs(text) {

    var search_out = 0;
    var search = 0;

    var search_out2 = 0;
    var search2 = 0;
    var n = 1;
    var last = text.lastIndexOf("<h2");

    text = text.substring(text.indexOf("<h2"), text.length);
    while (search > -1) {
        search = text.indexOf("<h2", search_out);
        if (search == -1) break;
        search_out = text.indexOf("<p><BR><BR></p>", search);

        // Look for title
        search_out2 = text.indexOf("</h2>", search);
        search2 = text.indexOf(">", search);
        document.getElementById('pnpc' + n).innerHTML = text.substring(search2 + 1, search_out2);

        var inside = "<div id='npc" + n + "'>" + text.substring(search, search_out + 15) + "</div>";
        text = text.substring(0, search) + inside + text.substring(search_out + 15, text.length);
        search_out = search_out + 15;
        n++;
    }

    return text;

}

*/
function CreateDivs(text) {

    var newtext = "";
    var search_out = 0;
    var search = 0;

    var search_out2 = 0;
    var search2 = 0;
    var n = 1;

    //Para lo nuevo
    var e = document.getElementsByClassName("npcs")[0];
    //e.innerHTML = "";
    //Log(text);

    // Si hay titulos de primer nivel usamos los de primer nivel con el sistema nuevo
    var t2 = "h2";
    if (MaxNpcs < 0) 
    if (text.indexOf("<h1") > -1) 
        t2 = "h1";
    
    while (search > -1) {

        search = text.indexOf("<"+t2, search_out);
        if (search == -1)
            break;
        search2 = text.indexOf('">', search + 1);
        search_out = text.indexOf("</"+t2+">", search_out + 1);
        search_out2 = text.indexOf("<"+t2, search_out + 1);
        if (search_out2 < 0) search_out2 = text.length;

        var title = text.substring(search2 + 2, search_out);
        var content = text.substring(search, search_out2);
        var inside = "<div id='npc" + n + "'>" + content + "</div>";

        if (MaxNpcs < 0) {
            Log("Nuevo sistema!")
            var s1 = text.indexOf('<img src="', search + 1);
            var s2 = text.indexOf('"', s1 + 11);
            var imagen = text.substring(s1 + 10, s2);
            Log("imagen: " + imagen);
            // Habria que generar la capa pnpc y añadirle el título
            // Después averiguarl el nombre de la imagen del npc y añadirla. 
            // Podría ser la <img> que haya dentro del titulo
            // Podemos usar la variable Nnpcs para determinar si usar el nuevo o el viejo algoritmo
            var v = document.createElement("div");
            var i = document.createElement("img");
            var v2 = document.createElement("div");
            i.classList.add('npc-portrait');
            i.src = imagen;
            v2.id = "pnpc" + n;
            v2.innerHTML = title;
            Log("n: " + n);
            v.addEventListener("click", ShowNPC.bind(null, n));
            v.classList.add('button');
            v.classList.add('npc');
            v.appendChild(i);
            v.appendChild(v2);
            e.appendChild(v);
            MaxNpcs = 0 - n;
        } else {
            document.getElementById('pnpc' + n).innerHTML = title;
        }


        newtext = newtext + inside;

        n++;
    }

    return newtext;
}

function getRules(text) {

    var version = localStorage.getItem("version" + aventura);
    var rulesversion = "v5";

    if (version === null) {
        version = "5";
        localStorage.setItem('version' + aventura, version);
    }

    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("getRules: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }
    localStorage.setItem('lang', lang);

    if (lang == "es") {
        if (version == "3.5") {
            rulesversion = "v3es";
        } else {
            rulesversion = "v5es";
        }
    } else {
        if (version == "3.5") {
            rulesversion = "v3";
        } else {
            rulesversion = "v5";
        }
    }

    return getRulesVersion(text, rulesversion);
}

function getRulesVersion(text, version) {

    if (version == "v3es") {

        for (var i = 0; i < aventuralinks_3a_es.length; i++) {
            reg = new RegExp("\\*" + aventuralinks_3a_es[i][0] + "\\*", "gi");
            text = text.replace(reg, "[" + aventuralinks_3a_es[i][0] + "](" + aventuralinks_3a_es[i][1] + ")");
        }
        for (var i = 0; i < aventuralinks_3a_en.length; i++) {
            reg = new RegExp("\\*" + aventuralinks_3a_en[i][0] + "\\*", "gi");
            text = text.replace(reg, "[" + aventuralinks_3a_en[i][0] + "](" + aventuralinks_3a_en[i][1] + ")");
        }
        for (var i = 0; i < biblioteca_3a_en.length; i++) {
            reg = new RegExp("\\*" + biblioteca_3a_en[i][0] + "\\*", "gi");
            text = text.replace(reg, "[" + biblioteca_3a_en[i][0] + "](" + biblioteca_3a_en[i][1] + ")");
        }
        for (var i = 0; i < biblioteca_3a_aux_en.length; i++) {
            reg = new RegExp("\\*" + biblioteca_3a_aux_en[i][0] + "\\*", "gi");
            text = text.replace(reg, "[" + biblioteca_3a_aux_en[i][0] + "](" + biblioteca_3a_aux_en[i][1] + ")");
        }

    } else if (version == "v3") {

        for (var i = 0; i < aventuralinks_3a_en.length; i++) {
            reg = new RegExp("\\*" + aventuralinks_3a_en[i][0] + "\\*", "gi");
            text = text.replace(reg, "[" + aventuralinks_3a_en[i][0] + "](" + aventuralinks_3a_en[i][1] + ")");
        }
        for (var i = 0; i < biblioteca_3a_en.length; i++) {
            reg = new RegExp("\\*" + biblioteca_3a_en[i][0] + "\\*", "gi");
            text = text.replace(reg, "[" + biblioteca_3a_en[i][0] + "](" + biblioteca_3a_en[i][1] + ")");
        }
        for (var i = 0; i < biblioteca_3a_aux_en.length; i++) {
            reg = new RegExp("\\*" + biblioteca_3a_aux_en[i][0] + "\\*", "gi");
            text = text.replace(reg, "[" + biblioteca_3a_aux_en[i][0] + "](" + biblioteca_3a_aux_en[i][1] + ")");
        }

    } else if (version == "v5es") {

        for (var i = 0; i < aventuralinks_5a_es.length; i++) {
            reg = new RegExp("\\*" + aventuralinks_5a_es[i][0] + "\\*", "gi");
            text = text.replace(reg, "[" + aventuralinks_5a_es[i][0] + "](" + aventuralinks_5a_es[i][1] + ")");
        }
        for (var i = 0; i < biblioteca_5a_es.length; i++) {
            reg = new RegExp("\\*" + biblioteca_5a_es[i][0] + "\\*", "gi");
            text = text.replace(reg, "[" + biblioteca_5a_es[i][0] + "](" + biblioteca_5a_es[i][1] + ")");
        }

    } else if (version == "v5") {

        for (var i = 0; i < aventuralinks_5a_en.length; i++) {
            reg = new RegExp("\\*" + aventuralinks_5a_en[i][0] + "\\*", "gi");
            text = text.replace(reg, "[" + aventuralinks_5a_en[i][0] + "](" + aventuralinks_5a_en[i][1] + ")");
        }
        for (var i = 0; i < biblioteca_5a_en.length; i++) {
            reg = new RegExp("\\*" + biblioteca_5a_en[i][0] + "\\*", "gi");
            text = text.replace(reg, "[" + biblioteca_5a_en[i][0] + "](" + biblioteca_5a_en[i][1] + ")");
        }

    }

    return text;
}

function RepairLinks(text) {

    if (debug == "on") {

        text = text.replace("<!DOCTYPE html>", "");
        text = getRules(text);
        var element = document.createElement("div");
        element.innerHTML = text;

        if (index[0].length < 1) {
            index = CreateIndex(element);
        }

        // Aqui enlazamos los títulos que estén entre '*'       
        for (var i = 0; i < index[0].length; i++) {
            reg  = new RegExp("\\*" + index[0][i] + "\\*", "gi");
            //reg2 = new RegExp("\\*" + index[0][i] + "\\*([+|-]?[0-9]*)", "gi");
            
            /*if (index[2][i].indexOf("lugares") > -1) {
                text = text.replace(reg2, "[" + index[0][i] + "](" + index[1][i].replace("(","").replace(")","") + "&room="+"$1"+")");
                if (reg2.test(text))
                console.log("[" + index[0][i] + "](" + index[1][i].replace("(","").replace(")","") + "&room="+"$1"+")")
            } else {
             */   
                text = text.replace(reg, "[" + index[0][i] + "]" + index[1][i] + "");   
             /*   
                if (reg.test(text))
                console.log("[" + index[0][i] + "]" + index[1][i] + "")
            }*/
        }
        
        var end = text.lastIndexOf("[[");
        var search_out = 0;
        do {
            search = text.indexOf("[[", search_out);
            search_out = text.indexOf("]]", search);
            var link = text.substring(search + 2, search_out);

            for (var i = 0; i < index[0].length; i++) {
                if (link == index[0][i]) {
                    text = text.substring(0, search) + text.substring(search + 1, search_out + 1) + index[1][i] + text.substring(search_out + 2, text.length);
                }
            }

        } while (search < end);

        return text;
    } else return text;
}

function enmarked(text) {
    if (debug == "on") {
        text = unescapef(text);
        return marked(text);
    } else return text;
}

function Quicklinks(text) {
    
if (debug == "on") {
    
try {
    
var passage = getPassage(text, "@links")[0];
var reg = new RegExp("\\[([^\\]]*)\\]\\((.*)\\)", "gi");
			
	passage.match(reg).forEach((element, index) => {
        
	   var qlink = element.replace(reg, "$1").trim();
	   var url = element.replace(reg, "$2").trim();
        
        
        for (var i = 0; i < biblioteca_5a_en.length; i++) {
            var reg2  = new RegExp(url, "i");
            if (reg2.test(biblioteca_5a_en[i][0])) {
                url = biblioteca_5a_en[i][1]
                break;    
            }
        }
        
        for (var i = 0; i < biblioteca_5a_es.length; i++) {
            var reg2  = new RegExp(url, "i");
            if (reg2.test(biblioteca_5a_es[i][0])) {
                url = biblioteca_5a_es[i][1]
                break;    
            }
        }
         
	   aventuralinks_5a_en.push([qlink,url]);
       aventuralinks_5a_es.push([qlink,url]);
	});
} catch (e) {console.log("No hay passage @links")}
    
    var reg = /^# (.*)/gim;
try {
var passage = getPassage(text, "@monsters")[0];
  
    
	passage.match(reg).forEach((element, index) => {
        console.log(element + " " + index)
        var qlink = element.replace(reg, "$1").trim();
        var url = "lugares.html?param=@monsters&room=-" + (index+1);
        aventuralinks_5a_en.push([qlink,url]);
        aventuralinks_5a_es.push([qlink,url]);
    });
} catch (e) {console.log("No hay passage monsters")}
    
try {
var passage = getPassage(text, "@main-npcs")[0];
   
			
	passage.match(reg).forEach((element, index) => {
        console.log(element + " " + index)
        var qlink = element.replace(reg, "$1").trim();
        var url = "lugares.html?param=@main-npcs&room=-" + (index+1);
        aventuralinks_5a_en.push([qlink,url]);
        aventuralinks_5a_es.push([qlink,url]);
    });
} catch (e) {console.log("No hay passage npcs")}

try {
var passage = getPassage(text, "@items")[0];
   
			
	passage.match(reg).forEach((element, index) => {
        var qlink = element.replace(reg, "$1").trim();
        var url = "lugares.html?param=@rules&room=-" + (index+1);
        aventuralinks_5a_en.push([qlink,url]);
        aventuralinks_5a_es.push([qlink,url]);
    });
} catch (e) {console.log("No hay passage items")}

try {
var passage = getPassage(text, "@notes")[0];

 
	passage.match(reg).forEach((element, index) => {
        var qlink = element.replace(reg, "$1").trim();
        var url = "lugares.html?param=@notes&room=" + (index+1);
        aventuralinks_5a_en.push([qlink,url]);
        aventuralinks_5a_es.push([qlink,url]);
    });
} catch (e) {console.log("No hay passage notes")}

    }
}


function CreateIndex(element) {

    var elements = element.getElementsByTagName('tw-passagedata');
    for (var i = 0; i < elements.length; i++) {
        pid = elements[i].getAttribute("pid");
        tag = elements[i].getAttribute("tags");
        
        var tags = tag.split(" ");
        var tag = "index";
        tags.forEach(e => {
            
           if (e.indexOf("encounter") > -1) 
               tag = e
            if (e.indexOf("lugares") > -1) 
               tag = e            
        });
        //var tag = tag.split(" ")[0];
        //console.log("-->" + tag)
        name = elements[i].getAttribute("name");
        index[0][i] = "" + name;
        index[1][i] = "(" + tag + ".html?param=" + pid + ")";
        index[2][i] = "" + tag;
    }
    
    return index;
}

function Update_href(element) {


    var elements = element.getElementsByTagName('a');
    for (var i = 0; i < elements.length; i++) {

        var destino = elements[i].getAttribute('href');
        if (destino === null) {

        } else {
            if (destino.indexOf('player.html') > -1) {
                Log("player.html");
                elements[i].setAttribute('href', "#");
                elements[i].className = elements[i].className + "blog";
                elements[i].onclick = (function (opt) {
                    return function () {
                        AddtoPlayerBlog(opt);
                    };
                })(destino);
            }

            if ((destino.indexOf('lugares.html') > -1) || (destino.indexOf('npcs') > -1) || (destino.indexOf('dndwiki') > -1) || (destino.indexOf('SRD') > -1)) {
                elements[i].setAttribute('href', "#");

                var old_dest = destino;
                destino = UpdateTarget(destino);
                elements[i].onclick = (function (opt) {
                    return function () {
                        LoadWiki(opt);
                    };
                })(destino);
            }
        }
    }

}

function Update_href_first(element) {

    var elements = element.getElementsByTagName('a');

    for (var i = 0; i < elements.length; i++) {

        var destino = elements[i].getAttribute('href');
        if (destino.indexOf('player.html') > -1) {
            elements[i].setAttribute('href', "#");
            elements[i].className = elements[i].className + "blog";
            elements[i].onclick = (function (opt) {
                return function () {
                    AddtoPlayerBlog(opt);
                };
            })(destino);
        }
        if ((destino.indexOf('lugares.html') > -1) || (destino.indexOf('npcs') > -1) || (destino.indexOf('dndwiki') > -1) || (destino.indexOf('SRD') > -1)) {
            if (destino.indexOf('SRD') > -1) {
                elements[i].className = elements[i].className + " dndwiki";
            } else {
                if (destino.indexOf('lugares') > -1) {
                    elements[i].className = elements[i].className + " lugares";
                }
            }
            elements[i].setAttribute('href', "#");
            var old_dest = destino;
            destino = UpdateTarget(destino);
            elements[i].onclick = (function (opt) {
                return function () {
                    LoadWikiFirst(opt);
                };
            })(destino);
        }
    }

}

function AddtoPlayerBlog(destino) {

    var id = destino.substring(destino.indexOf("param=") + 6, destino.indexOf("&", destino.indexOf("param=")));
    var room = destino.substring(destino.indexOf("room=") + 5, destino.length);
    Log("player: " + id + "," + room);

    var lplayer = localStorage.getItem('player');

    if (null === lplayer)
        lplayer = "{}";
    player = JSON.parse(lplayer);
    delete player[id];

    if (event.target.className == "checkedblog")
        event.target.className = "blog";

    else {
        player[id] = room;
        elements = document.getElementsByClassName("checkedblog");
        for (i = 0; i < elements.length; i++)
            elements[i].className = "blog";
        event.target.className = "checkedblog";
    }
    localStorage.setItem("player", JSON.stringify(player));
}

function LoadWikiFirst(fragment_url) {
    visitas = window.history.length;
    LoadWiki(fragment_url);
}

function LoadTextonMap(fragment_url) {
	
	var customcontent = localStorage.getItem("customcontent" + aventura);
	if (customcontent === null) {
    
	var url = getContentFile();
    var message = {
        "fragment_url": fragment_url,
        "url": url
    }

    try {
        window.webkit.messageHandlers.LoadTextonMap.postMessage(message);

    } catch (error) {
        console.log("no estamos en iOS")

        var url = getContentFile();
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                text = xmlhttp.responseText;
                LoadTextonMap_back(text, fragment_url);
            }
        }
        xmlhttp.send(null);
    }
	} else {
		LoadTextonMap_back(customcontent, fragment_url);
	}
	
}

function LoadTextonMap_back(text, fragment_url) {
    
    text = text.replace(/<n>/g, '\n');
    var id = "";
    var room = 0;
    if (fragment_url.indexOf("&") > -1) {
        id = fragment_url.substring(fragment_url.indexOf("param=") + 6, fragment_url.indexOf("&", fragment_url.indexOf("param=")));
        room = fragment_url.substring(fragment_url.indexOf("room=") + 5, fragment_url.length);
    }
    else { 
        id = fragment_url.substring(fragment_url.indexOf("param=") + 6);
        }
    
    var element = document.getElementById('infolayer-text-map');

    
    // AddLastinfo(fragment_url);
    text = RepairLinks(text);
    passage = getPassage(text, id);
    text = passage[0];

    if (room < 0 || (room == "-0")) {
        room2 = Math.abs(room);
        element = document.getElementById('infolayer-text');
    } else room2 = room;

    if (room[0] == "*") {
        room2 = Math.abs(room.substr(1, room.length));
    }

    if (room2 != 0) {
        if (debug == "on") {
            var start = 0;
            for (var i = 0; i < room2; i++) {
                start = text.indexOf("\n# ", start + 3);
            }
            var end = text.indexOf("\n# ", start + 3);
            if (end < 0) {
                end = text.length;
            }
        } else {
            var start = 0;
            for (var i = 0; i < room2; i++) {
                start = text.indexOf("<h1", start + 3);
            }
            var end = text.indexOf("<h1", start + 3);
            if (end < 0) {
                end = text.length;
            }
        }
    }

    text = text.substring(start, end);
    text = enmarked(text);
    element.innerHTML = text;
    Update_href(element);

    if ((room >= 0) && (room != "-0")) {
        document.getElementById("infolayer-map").style.opacity = '1';
        document.getElementById("infolayer-map").style.zIndex = '25';
        document.getElementById("infolayer-map").focus();
        showinginfo = true;
    } else if (room[0] == "*") {
        Show(room2);
    } else {
        document.getElementById("infolayer").style.opacity = '1';
        document.getElementById("infolayer").style.zIndex = '25';
        document.getElementById("infolayer").focus();
        showinginfo = true;
    }
}

function LoadWiki(fragment_url) {

    
    console.log("LoadWiki, entramos con " + fragment_url + " y acorta nos da:" + Acorta(fragment_url));
    //Primero ocultamos el menú de la hamburguesa
    document.getElementById("menu").style.display = "none";

    Log("LoadWiki: " + fragment_url);
    Acorta(fragment_url);

    AddLastinfo(fragment_url);
    if (fragment_url.indexOf('lugares.html') > -1) {
        LoadTextonMap(fragment_url);
        return;
    }
    var url = fragment_url;
    if (fragment_url.indexOf("#") > -1) {
        if (fragment_url.indexOf("#") > 0) {
            url = fragment_url.substring(0, fragment_url.indexOf("#"));
        } else {
            location.hash = fragment_url;
            return;
        }
    }

    var falloAndroid = false;
    var falloiOS = false;
    try {
        //Para solventar un error anterior, cargamos la url completa pasamos solo el archivo a la funcion nativa
        url_completa_wiki = fragment_url;
        Android.loadWiki(Acorta(url));
    } catch (error) {
        falloAndroid = true;
    }

    try {
        var message = {
            "fragment_url": fragment_url,
            "url": url
        }
        window.webkit.messageHandlers.LoadWiki.postMessage(message);
    } catch (error) {
        falloiOS = true;
    }
    if (falloAndroid && falloiOS) {
        Log("LoadWiki: No la version adecuada");
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                text = xmlhttp.responseText;
                LoadWiki_back(text, fragment_url);
            }
        }
        xmlhttp.send(null);
    }
	
    //Al finalizar, ponemos el foco en la nueva capa mostrada (para que se quite de la caja de texto, si estamos en una)
    //document.getElementById('infolayer').focus();
    //Habría que hacer blur en el elemento que ha invocado el LoadWiki, pero como no lo tenemos, hacemos focus en la capa y blur en la capa
    //document.getElementById('infolayer').blur();
    //event.currentTarget.blur();
    //document.activeElement.blur();
    setTimeout(function () {
        document.activeElement.blur();
    }, 3000);
}

function Acorta(urlstring) {
    var url2 = urlstring.replace("../core", "baja/core");
    url2 = Acorta2(url2);
    url2 = url2.replace("/baja/core", "../core");
    return url2;
}

function Acorta2(urlstring) {
    var URL2 = new URL(urlstring, "http://localhost");
    return URL2.pathname;
}

function LoadWiki_back(text, fragment_url) {
		
	console.log(fragment_url + "\n\n\n " + text)
	//Si url_completa_wiki no está en blanco será el que usaremos, y lo reiniciamos para la siguiente
    if (url_completa_wiki != "") {
        fragment_url = url_completa_wiki;
        url_completa_wiki = "";
    }
    text = text.replace(/<n>/g, '\n');
    text = colorReplace(text);

    var element = document.getElementById('infolayer-text');
    // Si hay sección que extraer...
    if (text.indexOf('<!--BEGIN-->') > -1) {
        element.innerHTML = text.substring(text.indexOf('<!--BEGIN-->'), text.indexOf('<!--END-->'));
    } else {
        element.innerHTML = text;
    }
    Update_href_wiki(element, fragment_url);

    if (fragment_url.indexOf("#") > 0)
        setTimeout(function () {
            location.hash = fragment_url.substring(fragment_url.indexOf("#"));
        }, 250);

    document.getElementById("infolayer").style.opacity = '1';
    document.getElementById("infolayer").style.zIndex = '25';
    document.getElementById("infolayer").focus();
    showinginfo = true;
	
}

//Convierte los enlaces en llamadas a la funcion loadWiki
function Update_href_wiki(element, fragment_url) {

    var elements = element.getElementsByTagName('a');
    for (var i = 0; i < elements.length; i++) {

        var destino = elements[i].getAttribute('href');
        if (destino === null) {

        } else {

            if ((destino.indexOf('#')) != 0) {
                elements[i].setAttribute('href', "#");

                last = fragment_url.substring(0, fragment_url.lastIndexOf("/") + 1);
                var old_dest = destino;
                destino = last + old_dest;
                destino = destino.replace("android_asset/book/", "");
                destino = destino.replace("book/", "");
                // Log("destino: " + destino + "\n");
                elements[i].onclick = (function (opt) {
                    return function () {
                        LoadWiki(opt);
                    };
                })(destino);
            }
        }
    }

}

//Reconvertimos las URL para la Wiki
function UpdateTarget(str) {
    //Si es un enlace de 3ª que ya tiene la URL completa
    if (str.indexOf('../core/dndwiki/') > -1) {
        return str;
    }
    //Si es un enlace de 3ª que NO tiene la URL completa
    if (str.indexOf('SRD_') == 0) {
        return "../core/dndwiki/" + str;
    }

    if (str.indexOf('./npcs/') > -1) {
        return str;
    }
    //Si es un enlace de 5ª que NO tiene la URL completa
    if (str.indexOf('SRD5e') == 0) {
        return "../" + str;
    }
    //Si es un enlace de 5ª que ya tiene la URL completa
    if (str.indexOf('../core/SRD5e') == 0) {
        return str;
    }

    if (str.indexOf('#') == 0)
        return str;

    if (str.indexOf('lugares.html') > -1)
        return str;


    return "#";

}

function CloseLateralInfo() {

    document.getElementById("infolayer").style.opacity = 0;
    document.getElementById("infolayer").style.zIndex = 1;

    var delta = visitas - window.history.length;

    //alert(delta +"\n"+window.location.href + "\n" + document.referrer + "\n" + lasturl);

    if (window.location.href.substring(0, window.location.href.length - 1) == document.referrer) {
        delta--;
    } else if (lateral_closed) {
        delta--;
    }
    lateral_closed = true;
    if (delta > 0) {
        window.history.go(delta);
    }
    showinginfo = false;

}

function CloseLateralMap() {

    document.getElementById("infolayer-map").style.opacity = 0;
    document.getElementById("infolayer-map").style.zIndex = 1;

    var delta = visitas - window.history.length;

    //alert(delta +"\n"+window.location.href + "\n" + document.referrer + "\n" + lasturl);

    if (window.location.href.substring(0, window.location.href.length - 1) == document.referrer) {
        delta--;
    } else if (lateral_closed) {
        delta--;
    }
    lateral_closed = true;
    window.history.go(delta);
    showinginfo = false;
}

function Back() {
    if ((lastinfo[1].indexOf("../core/SRD5es/index.htm") == 0) || (lastinfo[1].indexOf("../core/SRD5en/index.htm") == 0)) {
        to_main();
    }
    if (lastinfo[2] != "") {
        LoadWiki(lastinfo[2]);
        for (i = 1; i < 7; i++)
            lastinfo[i] = lastinfo[i + 1];
    }
}

function AddLastinfo(info) {
    if (lastinfo[2] != info) {
        for (i = 7; i > 1; i--)
            lastinfo[i] = lastinfo[i - 1];
        lastinfo[1] = info;
    }
}

function MusicButton() {
    if (musicpause) {
        document.getElementById('music').play();
        musicpause = false;
    } else {
        document.getElementById('music').pause();
        musicpause = true;
    }
}

function Select(id) {

    var oldselect = select;
    select = id;

    if (select == 1 && oldselect != 1) {
        //       load_div_into_div('encounter-text.html','atglance','gamethrough');
        document.getElementById("select1").style.opacity = 1;
        document.getElementById("select2").style.opacity = 0;
        document.getElementById("select3").style.opacity = 0;
        document.getElementById("gamethroughbase").style.opacity = 0;
        document.getElementById("gamethroughbase").style.zIndex = 1;
        document.getElementById("gamethrough-3").style.opacity = 0;
        document.getElementById("gamethrough-3").style.zIndex = 1;
        document.getElementById("gamethrough-1").style.opacity = 1;
        document.getElementById("gamethrough-1").style.zIndex = 5;
    }
    if (select == 3 && oldselect != 3) {
        //       load_div_into_div('encounter-text.html','conclusion','gamethrough');        
        document.getElementById("select1").style.opacity = 0;
        document.getElementById("select2").style.opacity = 0;
        document.getElementById("select3").style.opacity = 1;
        document.getElementById("gamethroughbase").style.opacity = 0;
        document.getElementById("gamethroughbase").style.zIndex = 1;
        document.getElementById("gamethrough-3").style.opacity = 1;
        document.getElementById("gamethrough-3").style.zIndex = 5;
        document.getElementById("gamethrough-1").style.opacity = 0;
        document.getElementById("gamethrough-1").style.zIndex = 1;

    }

    if (id == 2 && oldselect != 2) {
        document.getElementById("select1").style.opacity = 0;
        document.getElementById("select2").style.opacity = 1;
        document.getElementById("select3").style.opacity = 0;
        document.getElementById("gamethroughbase").style.opacity = 1;
        document.getElementById("gamethroughbase").style.zIndex = 5;
        document.getElementById("gamethrough-1").style.opacity = 0;
        document.getElementById("gamethrough-1").style.zIndex = 1;
        document.getElementById("gamethrough-3").style.opacity = 0;
        document.getElementById("gamethrough-3").style.zIndex = 1;

    }
}

function Show(id) {

    for (i = 0; i < 6; i++)
        document.getElementById("layer" + i).style.opacity = 0;

    document.getElementById("layer" + id).style.opacity = 1;
    document.getElementById("layer" + id).style.zIndex = 20;
    document.getElementById("layer" + id).addEventListener("click", OnfocusOut);

    if (image_controls == false) {
        document.getElementById("image-list-left").style.display = "none";
        document.getElementById("image-list-rigth").style.display = "none";
    }
}

function ImageControl(event, control) {

    event.stopPropagation();

    if (control.indexOf('left') > -1) {
        imageN--;
        if (imageN == 0) imageN = 1;
    } else {
        imageN++;
        if (imageN == (image_controls_N + 1)) imageN = image_controls_N;
    }
    var img = imageName.substring(0, imageName.indexOf('N1-')) + 'N' + imageN +
        "-" + imageName.substring(imageName.indexOf('N1-') + 3, imageName.length);

    element = document.getElementById('layer1').getElementsByClassName('imagelinks');
    element[0].src = img;

}

function OnfocusOut(ev) {
    //if (ev.target.id == '') return;
    //CloseImage();
}

function ShareButton() {

    var elements = event.target.parentElement.parentElement.getElementsByClassName("maplinks");
    var element = "";

    if (elements.length > 0) {
        element = elements[0].style.backgroundImage;
        //reg = new RegExp("(.*)/([^/]*.jpg)..", "gi");
        reg = new RegExp("(url\\(\")(.*)\"\\)", "gi");
        element = element.replace(reg, aventura + "/$2");
    } else {
        element = event.target.parentElement.parentElement.getElementsByClassName("imagelinks")[0].src;
        //reg = new RegExp("(.*/)([^/]*)", "gi");
        //element = element.replace(reg, "$2");
        reg = new RegExp("(.*/)" + aventura + "/(.*)", "gi");
        element = element.replace(reg, aventura + "/$2");
    }
    element = Acorta2(element);

    var fios = false;
    var fand = false;

    try {
        var message = {
            "id": element
        }
        window.webkit.messageHandlers.Share.postMessage(message);
    } catch (error) {
        console.log("no estamos en iOS");
        sios = true;
    }
    try {
        Android.Share(element);
    } catch (error) {
        console.log("no estamos en Android");
        sand = true;
    }
    if (sios && sand) {
        alert(element);
    }

}

function CloseImage() {

    for (i = 0; i < 6; i++) {
        document.getElementById("layer" + i).style.opacity = 0;
        document.getElementById("layer" + i).style.zIndex = 1;
    }

}

function alterString(str) {

    for (i = 0; i < enlaces_externos.length; i++) {
        if (str.indexOf(enlaces_externos[i][0]) > -1)
            return enlaces_externos[i][1];
    }
    return null;
}


function EscondeMuestra(element) {

    if (document.getElementById(element).style.visibility == "hidden") {
        document.getElementById(element).style.visibility = "visible";
        document.getElementById(element).style.display = "inline";
    } else {
        document.getElementById(element).style.visibility = "hidden";
        document.getElementById(element).style.display = "none";
    }
}

function config(parametro, valor) {

    if (parametro == "tutorial") {
        var element = document.getElementById(parametro);
        if (element.checked)
            localStorage.setItem('tutorial', 'on');
        else
            localStorage.setItem('tutorial', 'off');
    } else if (parametro == "version")
        localStorage.setItem('version' + aventura, valor);

    else if (parametro == "lang")
        localStorage.setItem('lang', valor);

    var tutorial = localStorage.getItem('tutorial');
    try {
        SaveSettings(getContentFile(), tutorial);
    } catch (error) {
        Log(error)
    }

}

//Funciones de tutorial
function NextTutorial() {
    tutorial_page++;
    LoadTutorial();
}

function BackTutorial() {
    tutorial_page--;
    if (tutorial_page == 0) tutorial_page++;

    var url = "" + window.location;
    if (url.indexOf('page=3') > -1) {
        window.location.href = "./tutorial.html?page=2&tutorial=on" + addurl;
    }
    if (url.indexOf('encounter') > -1) {
        if (tutorial_page == 3) {
            window.location.href = "./tutorial.html?page=3&tutorial=on" + addurl;
        }
    }

    LoadTutorial();
}

function ExitTutorial() {

    if (document.getElementById('notutorial').checked) {
        localStorage.setItem('tutorial', 'off');
    }

    if (addurl !== "") {
        window.location.href = "../" + addurl.substr(6) + "/index.html";
    } else {
        window.location.href = "../index-gate.html";
    }
}

function LoadTutorial() {

    /* Reset everthing */
    document.getElementById('guitutorial').style.display = "";
    document.getElementById('btnback').style.backgroundColor = "rgba(170, 180, 179, 0.5)";

    document.getElementById('indexgroup').style.backgroundColor = "rgba(255,255,255,0)";
    document.getElementById('indexgroup').style.zIndex = 50;

    Hole('50%', '50%', 1, 1);
    CloseLateralInfo();


    if (tutorial_page == 1) {

        content_file = getContentFile();
        LoadContentTutorial(content_file, 'guitexttutorial', '0');

        if ((screen.width / screen.height) < 1.5) {
            Hole('3%', '87%', '35%', '10%'); //iPAD
        } else if (innerWidth < 668) {
            Hole('2%', '87%', '31%', '10%'); //Movil
        } else {
            Hole('2%', '87%', '38%', '10%'); //Normal
        }

        document.getElementById('btnback').style.backgroundColor = "rgba(170, 180, 179, 0.2)";

    }

    if (tutorial_page == 2) {

        var x, w;
        if ((screen.width / screen.height) < 1.5) {
            x = '40%'; //IPAD
            w = '60%';
        } else if (innerWidth < 668) {
            x = '34.5%'; //Movil
            w = '65.5%';
        } else { //Normal
            x = '41.7%';
            w = '59.3%';
        }

        LoadContentTutorial(content_file, 'guitexttutorial', '1');
        Hole(0, 0, x, "100vh");

        animate_scroll(1000, 20, 1, 'parent-index');
        setTimeout(function () {
            Hole(x, 0, w, "100vh");
            animate_scroll(1000, 20, 0.2, 'layertext');
        }, 1000);

    }

    if (tutorial_page == 3) {

        var url = "" + window.location;
        if (url.indexOf('page=3') <= -1)
            window.location.href = "./tutorial.html?page=3&tutorial=on" + addurl;

        LoadContentTutorial(content_file, 'guitexttutorial', '2');

    }

    if (tutorial_page == 4) {

        var url = "" + window.location;
        if (url.indexOf('encounter') <= -1)
            window.location.href = "./tutorial-encounter.html?page=4" + addurl;

        LoadContentTutorial(content_file, 'guitexttutorial', '3');
        Hole('3%', '9%', '37%', '10%');

        if ((screen.width / screen.height) < 1.5) {
            Hole('1%', '9%', '32%', '10%');
        } else if (innerWidth < 667) {
            Hole('1%', '14%', '32%', '10%');
        } else {
            Hole('3%', '9%', '37%', '10%');
        }

    }

    if (tutorial_page == 5) {

        LoadContentTutorial(content_file, 'guitexttutorial', '4');
        LoadWiki("./npcs/wardogs.html");
        document.getElementById('next-tutorial').innerHTML = "Fin Tutorial";


        if ((screen.width / screen.height) < 1.5) {
            Hole('0', '0', '36%', '100vh');
        } else if (innerWidth < 667) {
            Hole('0', '0', '34.5%', '100vh');
        } else {
            Hole('0', '0', '41.7%', '100vh');
        }
    }

    if (tutorial_page == 6) {
        ExitTutorial();
    }

}

function Hole(x, y, w, h) {
    var element = document.getElementById('hole');
    element.style.left = x;
    element.style.top = y;
    element.style.width = w;
    element.style.height = h;
}

function animate_scroll(time, steps, percent, div) {

    var count = 0;
    var element = document.getElementById(div);
    var altura = element.scrollHeight;

    var scroller = setInterval(function () {
        count++;
        element.scrollTop = count * altura / steps;
        if (count > steps * percent) {
            clearInterval(scroller);
        }
    }, time / steps);
}

function LoadContentTutorial(file, dest_div, id) {
    var message = {
        "file": file,
        "dest_div": dest_div,
        "id": id
    }
    try {
        window.webkit.messageHandlers.LoadContentTutorial.postMessage(message);

    } catch (error) {
        console.log("no estamos en iOS")

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", file);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                var text = xmlhttp.responseText;
                LoadContentTutorial_back(text, file, dest_div, id)
            }
        }
        xmlhttp.send(null);
    }
}

function LoadContentTutorial_back(text, file, dest_div, id) {
    text = text.replace(/<n>/g, '\n');
    var element = document.getElementById(dest_div);
    var search = text.indexOf('tags="tutorial"');
    search = 1 + text.indexOf('>', search);
    var search_out = text.indexOf('</tw-passagedata>', search);
    var texts = text.substring(search, search_out).split('$');
    text = texts[parseInt(id)];
    text = enmarked(text);
    element.innerHTML = text;
    Update_href(element);
}

function getlanguage() {
    // PhoneGap on Android would always return EN in navigator.*language.
    // Parse userAgent instead
    // Mozilla/5.0 (Linux; U; Android 2.2; de-ch; HTC Desire Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
    if (navigator && navigator.userAgent && (lang = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
        lang = lang[1];
        Log("getlanguage 1: idioma detectado: " + lang);
        if (lang != "en" && lang != "es") {
            Log("getlanguage 1: Detectado idioma: " + lang + ". Fijamos idioma a: en");
            lang = "en";
        }
        return lang;
    }
    if (!lang && navigator) {
        if (navigator.language) {
            lang = navigator.language;
        } else if (navigator.browserLanguage) {
            lang = navigator.browserLanguage;
        } else if (navigator.systemLanguage) {
            lang = navigator.systemLanguage;
        } else if (navigator.userLanguage) {
            lang = navigator.userLanguage;
        }
        lang = lang.substr(0, 2);
        Log("getlanguage 2: idioma detectado: " + lang);
        if (lang != "en" && lang != "es") {
            Log("getlanguage 3: Detectado idioma: " + lang + ". Fijamos idioma a: en");
            lang = "en";
        }
        return lang;
    }
    if (lang === null) {
        lang = "en";
        Log("getlanguage 3: No se detecta idioma. Fijamos idioma a " + lang);
        return lang;
    }
}

function getMusicDir() {
    //Android
    //    return "/mnt/sdcard/dd20/music/";
    //    return "/storage/emulated/0/com.dd20/music/";

    //PC
    return "../core/music/";

}

/*
function showlogin() {    
    if (document.getElementById("login").style.display !== "none") {
        document.getElementById("login").style.display = "none";
    } 
    else document.getElementById("login").style.display = "block";
}


function Login() {
    passwd = document.getElementsByName("psw")[0].value;
    name = document.getElementsByName("uname")[0].value;
    document.getElementById("login").style.display = "none";
    document.getElementById("loader").style.display = "block";
    Android.login(name,passwd);
    //alert("Login:" + name + " Passwd: " + passwd);
}
*/

function loadAdventure(name, id) {
    masteron = true;


    Log("Cargando aventura");
    //var masteron = document.getElementById("masteron").checked;

    var play = document.getElementById("ahidden").innerHTML;
    var download = document.getElementById("dhidden").innerHTML;
    var downloading = document.getElementById("dinghidden").innerHTML;

    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es")
        lang = "en";

    localStorage.setItem('lang', lang);

    if (lang != "en") {
        play = document.getElementById("ahidden-" + lang).innerHTML;
        download = document.getElementById("dhidden-" + lang).innerHTML;
        downloading = document.getElementById("dinghidden-" + lang).innerHTML;
    }

    //FIJAMOS MASTER
    localStorage.setItem('masteron', 'true');

    //Si somos master
    if (masteron) {
        if (document.getElementById("a-" + id).innerHTML == play)
            location.href = name;
        else if (document.getElementById("a-" + id).innerHTML == download) {
            document.getElementById("a-" + id).innerHTML = downloading;
            document.getElementById("d-" + id).style.display = "block";
            Download(id);
        } else {
            if (noandroid && noios) {
                show_warning_comprar_aventura();
            } else
                Buy(id);
        }
    }
    //Si somos player
    else {
        Log("Somos player");
        if (document.getElementById("a-" + id).innerHTML == play)
            location.href = name.replace("index.html", "index-player.html").replace("tutorial.html", "index-player.html");
    }

}

function okButton() {

    if (update_delete.localeCompare("delete") == 0) {

        var download = document.getElementById("dhidden").innerHTML;
        var lang = localStorage.getItem("lang");
        if (lang != "en")
            download = document.getElementById("dhidden-" + lang).innerHTML;

        document.getElementById("a-" + update_id).innerHTML = download;
        AdvDelete(update_id);

    } else if (update_delete.localeCompare("update") == 0) {

        var downloading = document.getElementById("dinghidden").innerHTML;
        var lang = localStorage.getItem("lang");
        if (lang != "en")
            downloading = document.getElementById("dinghidden-" + lang).innerHTML;

        document.getElementById("a-" + update_id).innerHTML = downloading;
        document.getElementById("d-" + update_id).style.display = "block";
        document.getElementById("u-" + update_id).style.display = "none";
        Download(update_id);

    }

    hide_ask();
}

/*************************************************/
/* FUNCIONES PARA COMPONER EL ARRAY DE AVENTURAS */
/*************************************************/

function getCol(matrix, col) {
    var column = matrix[0][col];
    for (var i = 1; i < matrix.length; i++) {
        column = column + "," + matrix[i][col];
    }
    return column;
}

function getBuy(matrix, colcheck, col) {
    var column = matrix[0][colcheck];
    for (var i = 1; i < matrix.length; i++) {
        if (matrix[i][colcheck])
            column = column + "," + matrix[i][col];
    }
    return column;
}

/***************************************************/
/* FUNCIONES PARA CARGA/DESCARGA DE AVENTURAS, ETC */
/***************************************************/

function updateAdventure(id) {
    SetTextFor("update");
    update_delete = "update";
    update_id = id;
    document.getElementById("ask").style.display = "";
}

function deleteAdventure(id) {
    SetTextFor("delete");
    update_delete = "delete";
    update_id = id;
    document.getElementById("ask").style.display = "";
}

function SetTextFor(paraque) {
    // Ponemos el texto en la pregunta
    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es")
        lang = "en";

    if (lang == "es") {
        try {
            if (paraque.indexOf("update") > -1)
                document.getElementById("lbl_update").innerHTML = "¿Actualizar la versión de la Aventura?";
            if (paraque.indexOf("delete") > -1)
                document.getElementById("lbl_update").innerHTML = "¿Desea Borrar la Aventura?";
            document.getElementById("lbl_ok").innerHTML = "Aceptar";
            document.getElementById("lbl_cancel").innerHTML = "Cancelar";
        } catch (err) {}
    } else {
        try {
            if (paraque.indexOf("update") > -1)
                document.getElementById("lbl_update").innerHTML = "Update Adventure?";
            if (paraque.indexOf("delete") > -1)
                document.getElementById("lbl_update").innerHTML = "Delete Adventure?";
            document.getElementById("lbl_ok").innerHTML = "Ok";
            document.getElementById("lbl_cancel").innerHTML = "Cancel";
        } catch (err) {}
    }
}

function Download(id) {
    Log("Vamos a descargar la aventura: " + id);
    // Guardamos la versión de la Aventura Descargada
    localStorage.setItem('ver' + id, versionesAventuras[aventuras.split(",").indexOf(id)]);
    //console.log('ver'+ id + ": " +  localStorage.getItem('ver' + id));

    try {
        var message = {
            "id": id
        }
        window.webkit.messageHandlers.Download.postMessage(message);
    } catch (error) {
        console.log("no estamos en iOS");
    }
    try {
        Android.Download(id);
    } catch (error) {
        console.log("no estamos en Android");
    }
    Log("Fin de la descarga de la aventura " + id);
}

function AdvDelete(id) {
    try {
        var message = {
            "id": id
        }
        window.webkit.messageHandlers.Delete.postMessage(message);
    } catch (error) {
        console.log("no estamos en iOS");
    }
    try {
        Android.Delete(id);
    } catch (error) {
        console.log("no estamos en Android");
    }
    document.getElementById("del-" + id).style.display = "none";
}

function Buy(id) {
    try {
        var message = {
            "id": id
        }
        window.webkit.messageHandlers.Buy.postMessage(message);
    } catch (error) {
        console.log("no estamos en iOS");
    }
    try {
        Android.Buy(id);
    } catch (error) {
        console.log("no estamos en Android");
    }
}

function loadCupon() {

    code = document.getElementsByName("cupon")[0].value;

    try {
        var message = {
            "code": code
        }
        window.webkit.messageHandlers.getCupon.postMessage(message);
    } catch (error) {
        console.log("no estamos en iOS");
    }
    try {
        Android.checkCupon(code);
    } catch (error) {
        console.log("no estamos en Android");
    }

}

function getBuyedItems() {

    try {
        var message = {
            "aventuras": aventuras,
            "descargas": descargas,
            "compras": compras
        }

        try {
            window.webkit.messageHandlers.getBuyed.postMessage(message);
        } catch (error) {
            console.log("no estamos en iOS");
            noandroid = true;
        }
        try {
            Android.getbuyeditems(aventuras + ";" + descargas + ";" + compras);
        } catch (error) {
            console.log("no estamos en Android");
            noios = true;
        }
    } catch (error) {
        console.log("No hay variables en getBuyedItems");
    }
}

function downloadedAdventure(id) {
    play = document.getElementById("ahidden").innerHTML;

    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("downloadedAdventure: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }
    localStorage.setItem('lang', lang);

    if (lang != "en") {
        play = document.getElementById("ahidden-" + lang).innerHTML;
    }

    document.getElementById("a-" + id).innerHTML = play;
    document.getElementById("d-" + id).style.display = "none";
}

function errordownloadedAdventure(id) {
    play = document.getElementById("ahidden").innerHTML;
    document.getElementById("a-" + id).innerHTML = download;
    document.getElementById("d-" + id).style.display = "none";
}


function buyedAdventure(tags, tagsd) {

    if ((("" + window.location).indexOf("index-gate") > -1) || (("" + window.location).indexOf("index-develop") > -1)) {
        Log("buyedAdventure: NO lanzado desde un encuentro");
        Log("buyed adventures: " + tags);
        Log("Not downloaded: " + tagsd);
        // 1ero las que están compradas más las gratuitas cambian de comprar -> jugar
        // 2nd las que pone jugar pasan a descargar si no están disponibles

        play = document.getElementById("ahidden").innerHTML;
        download = document.getElementById("dhidden").innerHTML;
        buy = document.getElementById("bhidden").innerHTML;
        warning = document.getElementById("chidden").innerHTML;

        var lang = localStorage.getItem("lang");
        if (lang === null)
            lang = getlanguage();
        if (lang != "en" && lang != "es") {
            Log("buyedAdventure: Detectado idioma: " + lang + ". Fijamos idioma a: en");
            lang = "en";
        }
        localStorage.setItem('lang', lang);

        if (lang != "en") {
            play = document.getElementById("ahidden-" + lang).innerHTML;
            download = document.getElementById("dhidden-" + lang).innerHTML;
            buy = document.getElementById("bhidden-" + lang).innerHTML;
            warning = document.getElementById("chidden-" + lang).innerHTML;
        }

        // Ponemos el texto warning en el idioma adecuado. 
        listado = compras.split(",");
        for (id in listado) {
            try {
                document.getElementById("c-" + listado[id]).innerHTML = warning;
            } catch (err) {}
        }

        // Todas las aventuras compradas pasan a ser jugables. 
        if (tags.indexOf(",") > -1) {
            listado = tags.split(",");
            for (id in listado) {
                try {
                    document.getElementById("a-" + listado[id]).innerHTML = play;
                    document.getElementById("b-" + listado[id]).style.display = "none";
                    document.getElementById("c-" + listado[id]).style.display = "none";

                } catch (err) {}
            }
        } else if (tags.length > 0) {
            document.getElementById("a-" + tags).innerHTML = play;
            document.getElementById("b-" + tags).style.display = "none";
            document.getElementById("b-" + tags).style.display = "none";
        }

        // Todas las aventuras NO descargadas se ponen para descargar
        if (tagsd !== undefined) {
            if (tagsd.indexOf(",") > -1) {
                listado = tagsd.split(",");
                for (id in listado) {
                    try {
                        if (document.getElementById("a-" + listado[id]).innerHTML == play) {
                            document.getElementById("a-" + listado[id]).innerHTML = download;
                            document.getElementById("b-" + listado[id]).style.display = "none";
                        }

                    } catch (err) {}
                }
            } else if (tagsd.length > 0) {
                if (document.getElementById("a-" + tagsd).innerHTML == play) {
                    document.getElementById("a-" + tagsd).innerHTML = download;
                    document.getElementById("b-" + tagsd).style.display = "none";

                }
            }
        }

        // Miramos si hay que actualizar todas las que pone Play
        listado = aventuras.split(",");
        for (id in listado) {
            //Log("Bucle. Iteración: "+id);
            try {
                if (document.getElementById("a-" + listado[id]).innerHTML == play) {

                    // Si podemos jugar podemos borrar
                    var old = localStorage.getItem('ver' + listado[id]);
                    if (old === null) {
                        old = 1;
                    } else {
                        old = parseInt(old);
                    }
                    var nue = versionesAventuras[aventuras.split(",").indexOf(listado[id])];
                    Log("Aventura: " + listado[id] + ". old = " + old + " nue =" + nue);
                    if (nue > old) {
                        document.getElementById("u-" + listado[id]).style.display = "";
                        Log("nue > old");
                    }
                }

            } catch (err) {
                Log(err + ": " + listado[id]);
            }
        }
        checkVersion("borrar");
        Log("Fin de buyedAdventure");
    } else {
        Log("buyedAdventure: Lanzado desde un encuentro");

        listado = tagsd.split(",");
        var elements = document.getElementsByTagName('a');
        for (var i = 0; i < elements.length; i++) {
            var destino = elements[i].getAttribute('href');
            if (destino === null) {

            } else {
                for (id in listado) {
                    if ((destino.indexOf(listado[id]) > -1)) {

                        elements[i].setAttribute('href', "#");
                        destino = "./lugares.html?param=@aventurafuera&room=1";
                        elements[i].onclick = (function (opt) {
                            return function () {
                                LoadWiki(opt);
                            };
                        })(destino);
                    }
                }
            }
        }
    }

}

//Mostrar / ocultar descripción de la aventura en la portada
function showonoff(id) {
    if (document.getElementById(id).style.display == "block") {
        document.getElementById(id).style.display = "none";

    } else {
        lista = document.getElementsByClassName("adventure-rigth");
        for (i = 0; i < lista.length; i++)
            lista[i].style.display = "";
        document.getElementById(id).style.display = "block";
    }

}

//Ocultar la caja de descripción de aventura
function hide_aventura_dch() {
    //Log(event.target.className)
    //Log(event.target.tagName)

    // Es un poco lio saber cuando nos interesa ocultar la capa y cuando no. 
    if (((event.target.tagName == "IMG") && !(event.target.id == "img_fondo_portada")) | (event.target.className == "main-gate-button brigth")) {
        //   | (event.target.className == "main-gate-description") | (event.target.tagName == "P") | (event.target.tagName == "HR") | (event.target.tagName == "H1") | (event.target.tagName == "STRONG") | (event.target.tagName == "SPAN")
    } else {
        lista = document.getElementsByClassName("adventure-rigth");
        for (i = 0; i < lista.length; i++)
            lista[i].style.display = "";
    }
}

function hide_warning() {
    document.getElementById("warning").style.display = "none";
}

function hide_ask() {
    document.getElementById("ask").style.display = "none";
}

function show_warning_nuevas_aventuras() {

    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es")
        lang = "en";

    if (lang == "es") {
        try {
            var e = document.getElementById("warning");
            e.innerHTML = "Se ha actualizado la aplicación<br>¡Tienes aventuras nuevas!";
            e.style.display = "block";
            e.style.visibility = "visible";
            e.addEventListener('click', hide_warning, false);
        } catch (err) {}
    } else {
        try {
            var e = document.getElementById("warning");
            e.innerHTML = "App updated<br>New adventures available!";
            e.style.display = "block";
            e.style.visibility = "visible";
            e.addEventListener('click', hide_warning, false);
        } catch (err) {}
    }
}

function show_warning_comprar_aventura() {

    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es")
        lang = "en";

    if (lang == "es") {
        try {
            var e = document.getElementById("warning");
            e.innerHTML = "<br/>Para poder comprar esta aventura tienes que usar nuestra App ¿Quieres disfrutar de esta y otras muchas más?<br/><br/><a href='https://play.google.com/store/apps/details?id=com.dd20'>Descárgala aquí para Andoid.</a><br/><a href='https://apps.apple.com/es/app/digital-d20-adventures/id983241097'>Descárgal aquí para iOS.</a>";
            e.style.display = "block";
            e.style.visibility = "visible";
            e.addEventListener('click', hide_warning, false);
        } catch (err) {}
    } else {
        try {
            var e = document.getElementById("warning");
            e.innerHTML = "<br/>In order to buy this adventure you have to use our App. Do you want to enjoy this one an others?<br/><br/><a href='https://play.google.com/store/apps/details?id=com.dd20'>Download it here for Android.</a><br/><a href='https://apps.apple.com/es/app/digital-d20-adventures/id983241097'>Download it here for iOS.</a>";
            e.style.display = "block";
            e.style.visibility = "visible";
            e.addEventListener('click', hide_warning, false);
        } catch (err) {}
    }
}

function checkupdate() {

    //Checkeamos si hay que mostrar el cartel de "Hemos actualizado, necesitas reiniciar"
    var jsversion = localStorage.getItem("jsversion");
    if (jsversion === null) {
        jsversion = "0";
        localStorage.setItem('jsversion', jsversion);
    }

    if (parseInt(jsversion) < currentjsversion) {
        localStorage.setItem('jsversion', currentjsversion);
        show_warning_nuevas_aventuras();
    }

    //Chequeamos si se es una version vieja de la App
    checkVersion("VersionVieja");

}

function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
}

function GetSettings() {

    var message = {}

    try {
        window.webkit.messageHandlers.GetSettings.postMessage(message);

    } catch (error) {
        console.log("no estamos en iOS")


        var tutorial = localStorage.getItem("tutorial");

        if (tutorial === null)
            tutorial = "on";

        if (document.URL.indexOf('tutorial=off') > -1)
            tutorial = "off";

        GetSettings_back(tutorial, getContentFile());
    }
}


function GetSettings_back(tutorial, jcontent_file, compras) {

    page = location.href;
    page = page.split("/");
    book = page[page.length - 2];
    page = page[page.length - 1];


    if (tutorial == 'off') {
        localStorage.setItem('tutorial', 'off');
    } else {
        localStorage.setItem('tutorial', 'on');
    }

    if (page == "config.html") {

        if (tutorial == 'off') {
            try {
                document.getElementById("tutorial").value = "off";
            } catch (e) {}
        } else {
            try {
                document.getElementById("tutorial").value = "on";
            } catch (e) {}
        }

        if (jcontent_file.indexOf("-5") > -1) {
            try {
                var element = document.getElementById("dnd5");
                element.checked = true;
            } catch (e) {}
        }
    }

    translation(jcontent_file, page)

    if (compras !== undefined) {
        listado = compras.split("-");
        for (id in listado) {
            try {
                if (jcontent_file.indexOf("-es") > -1)
                    document.getElementById("a" + listado[id]).innerHTML = "JUGAR";
                else document.getElementById("a" + listado[id]).innerHTML = "PLAY";
                document.getElementById("b-" + listado[id]).style.display = "none";
            } catch (err) {}
        }
    }
}

function translation(content_file, page) {
    return;
}

function ShowDice() {

    if (!showDiceclick) {
        if (Detector.webgl) {
            dice_initialize(document.body);
            Show(5);
        } else {
            var warning = Detector.getWebGLErrorMessage();
            //document.getElementById('nowebgl').appendChild(warning);
            document.getElementById('nowebgl').style.display = "block";
            Show(5);
            document.getElementById("layer5").style.zIndex = 30;
        }
        showDiceclick = true;
    } else {
        if (document.getElementById("layer5").style.zIndex == 30) {
            CloseImage();
        } else {
            Show(5);
            document.getElementById("layer5").style.zIndex = 30;
        }
    }
}

function hidetranslate() {
    try {
        document.getElementsByClassName("skiptranslate")[0].style.display = "none";
        document.body.style.top = "0";
    } catch (e) {
        console.log(e);
    }
}

function ShowTranslate() {

    if (document.getElementById("google").style.display == "block") {
        document.getElementById("google").style.display = "none";
        document.getElementById("google_alert").style.display = "none";
        document.getElementsByClassName("skiptranslate")[0].style.display = "none";
        document.body.style.top = "0";
    } else {
        document.getElementById("google_alert").style.display = "block";
        document.getElementById("google").style.display = "block";
        document.getElementsByClassName("skiptranslate")[0].style.display = "block";
    }

}

function after_load_index() {

    Log("finishing loading the page....");
    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("after_load_index: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }
    localStorage.setItem('lang', lang);

    if (lang == "es") {
        document.getElementById('google_alert').innerHTML = "1. Seleccione idioma en el menú superior <br> 2. Para ocultar este mensaje haga click sobre el icono de traducción. <br> 3. Para deshabilitar la traducción cierre la barra de google.";
    }
    document.body.style.top = "0";
    try {
        document.getElementsByClassName("skiptranslate")[0].style.display = "none";
    } catch (e) {
        Log("No hay skiptranslate");
    }
    window.setTimeout(function () {
        hidetranslate
    }, 250, null, null);
}

function after_load() {

    Log("finishing loading the page....");
    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("after_load: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }
    localStorage.setItem('lang', lang);

    if (lang == "es") {
        document.getElementById('google_alert').innerHTML = "1. Seleccione idioma en el menú superior <br> 2. Para ocultar este mensaje haga click sobre el icono de traducción. <br> 3. Para deshabilitar la traducción cierre la barra de google.";
        document.getElementById('sethelp').innerHTML = "Seleccione su juego de dados haciendo click sobre los mismos<br/> golpe y arrastre con el dedo para lanzar u ocultar los dados";
        document.getElementById('nowebglinside').innerHTML = "WebGL no soportado, no se pueden ver los dados animados!";
        document.getElementById('labelhelp').innerHTML = "haga clic para continuar o golpee o arrastre para volver a tirar";
        document.getElementById('exit').innerHTML = "Salir";
        document.getElementById('exit2').innerHTML = "Salir";
        document.getElementById('clear').innerHTML = "Limpiar";
        document.getElementById('throw').innerHTML = "Lanzar";
    }

    document.body.style.top = "0";
    try {
        document.getElementsByClassName("skiptranslate")[0].style.display = "none";
    } catch (e) {
        Log("No hay skiptranslate");
    }
    window.setTimeout(function () {
        hidetranslate
    }, 500, null, null);
}

function LoadDD20() {

    try {
        var message = {}
        window.webkit.messageHandlers.OpenApp.postMessage(message);

    } catch (error) {
        console.log("no estamos en iOS");
    }
    try {
        Android.OpenMarket();
    } catch (error) {
        console.log("no estamos en Android");
    }

}

//Funciones para cargar y mostrar/ocultar menú
function cargarMenu() {

    //Cargamos idioma
    var lang = localStorage.getItem("lang");
    if (lang === null)
        lang = getlanguage();
    if (lang != "en" && lang != "es") {
        Log("cargarMenu: Detectado idioma: " + lang + ". Fijamos idioma a: en");
        lang = "en";
    }
    localStorage.setItem('lang', lang);

    // Miramos si estamos en la portada
    if ((("" + window.location).indexOf("index-gate") > -1) || (("" + window.location).indexOf("index-develop") > -1)) {
        url = "menu-" + lang + ".html";
    } else {
        url = "../" + "menu-" + lang + ".html";
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            try {
                var res = xmlhttp.responseText;
                document.getElementById('menu').innerHTML = res;

                //Marcamos seleccionado el idioma en que estemos
                if (lang == "es")
                    document.getElementById('spanish').className = "langcheck";
                else
                    document.getElementById('english').className = "langcheck";

                // Estamos en una portada
                if (("" + window.location).indexOf("index-gate") > -1) {
                    document.getElementById("tocover").style.display = "none";
                    document.getElementsByClassName("dnd5-menu")[0].addEventListener("click", hide_menu, false);
                    document.getElementsByClassName("index-gate-image")[0].addEventListener("click", hide_menu, false);
                    //document.getElementsByClassName("dnd5-menu")[0].addEventListener("click", hide_ask, false);
                    //document.getElementsByClassName("index-gate-image")[0].addEventListener("click", hide_ask, false);
                    //document.getElementById("exitapp").style.display = "";
                }

                // Estamos en desarrollo
                if (("" + window.location).indexOf("-develop") > -1) {
                    document.getElementById("coreupdate").style.display = "";
                    document.getElementById("showlog").style.display = "";
                    document.getElementById("clearlog").style.display = "";
                }

                // Estamos en Index.html  
                if (("" + window.location).indexOf("index.html") > -1) {
                    document.getElementById("layertext").addEventListener("click", hide_menu, false);
                    document.getElementsByClassName("mini-index-left")[0].addEventListener("click", hide_menu, false);
                    document.getElementsByClassName("index-left")[0].addEventListener("click", hide_menu, false);
                }

                // Estamos en Encounter.html
                if (("" + window.location).indexOf("encounter.html") > -1) {
                    document.getElementById("layertext").addEventListener("click", hide_menu, false);
                    document.getElementById("layermenu").addEventListener("click", hide_menu, false);
                }

                // Estamos en Index-map.html
                if (("" + window.location).indexOf("index-map.html") > -1) {
                    document.getElementById("mapindex").addEventListener("click", hide_menu, false);
                }

                // Estamos en Index-npcs.html
                if (("" + window.location).indexOf("index-npcs.html") > -1) {
                    document.getElementById("layertext").addEventListener("click", hide_menu, false);
                    document.getElementById("main-index").addEventListener("click", hide_menu, false);
                }

                // Estamos en Index-flow.html
                if (("" + window.location).indexOf("index-flow.html") > -1) {
                    document.getElementById("index-flow-background").addEventListener("click", hide_menu, false);
                }

                // Estamos en la hoja de personaje
                if (("" + window.location).indexOf("sheet") > -1) {
                    document.getElementById("save").style.display = "";
                    document.getElementById("delete").style.display = "";
                    document.getElementById("pregen").style.display = "";
                    document.getElementById("totutorial").style.display = "none";
                    document.getElementById("english").style.display = "none";
                    document.getElementById("spanish").style.display = "none";

                    cargarMenu_back();
                    document.getElementsByClassName("charsheet")[0].addEventListener("click", hide_menu, false);
                }

                // Estamos en manual.html
                if (("" + window.location).indexOf("manual.html") > -1) {
                    document.getElementById("infolayer").addEventListener("click", hide_menu, false);
                    document.getElementById("totutorial").style.display = "none";

                }

            } catch (e) {
                console.log("Cargar Menu: " + e);
            }
        }
    }
    xmlhttp.send();
}

//Comprueba versión de la App
function checkVersion(paraque) {

    var exito = 0;
    var message = {
        "paraque": paraque
    }

    try {
        window.webkit.messageHandlers.checkV.postMessage(message);
        exito = 1;
    } catch (error) {
        console.log("no estamos en iOS")
    }
    try {
        Android.checkV(paraque);
        exito = 1;
    } catch (error) {
        console.log("no estamos en Android")
    }
    //Si es una version tan vieja que ni tiene esta funcionalidad, devuelve esto
    if (exito == 0) {
        Log("Llamamos a checkversionback");
        checkversionback("", 150, paraque);
    }
}

//Se ejecuta A LA VUELTA de checkVersion
function checkversionback(sistema, codigo, paraque) {
    //Si es una versión de la App vieja, no dejamos descargar los unicorn ni corvendark
    Log("Arrancamos checkversionback");
    // Mensaje de Actualizaicón en versiones muy viejas de la App
    if (paraque.indexOf("VersionVieja") > -1) {
        if (sistema == "" && codigo == 150) {
            var cajas_aventuras = document.getElementsByClassName("noplayer");
            //Para cada aventura
            for (var i = 0; i < cajas_aventuras.length; i++) {
                //Sacamos el nombre
                var linea_nombre = cajas_aventuras[i].getElementsByClassName("adventure-rigth");
                //Si es unicorn o corvendark
                if (linea_nombre[0].id == "corvendark" || linea_nombre[0].id == "unicorn") {
                    //Ocultamos botón comprar
                    var linea_boton = cajas_aventuras[i].getElementsByClassName("main-gate-button");
                    linea_boton[0].style.display = "none";
                    //Mostramos mensaje de no disponible
                    var linea_mensaje_e = cajas_aventuras[i].getElementsByClassName("mensaje-mostrable");
                    if (localStorage.getItem("lang") == "es")
                        linea_mensaje_e[0].innerHTML = "Necesitas actualizar la aplicación para jugar esta aventura.";
                    else
                        linea_mensaje_e[0].innerHTML = "You need to update the App to play this adventure.";
                }
            }
        }
    }
    // BORRAR
    if (paraque.indexOf("borrar") > -1) {
        Log("Sistema:" + sistema + ", Versión: " + codigo + ", Para que: " + paraque);
        try {
            if ((sistema == "android" && parseInt(codigo) > 182) || (sistema == "ios" && getiOSVersion(codigo) > 2.35)) {
                Log("La versión " + parseInt(codigo) + " es mayor que 179. Mostramos nueva funcionalidad");
                listado = aventuras.split(",");
                var play = document.getElementById("ahidden").innerHTML;
                var lang = localStorage.getItem("lang");
                if (lang != "en")
                    play = document.getElementById("ahidden-" + lang).innerHTML;
                for (id in listado) {
                    try {
                        if (document.getElementById("a-" + listado[id]).innerHTML == play)
                            document.getElementById("del-" + listado[id]).style.display = "";
                    } catch (err) {
                        console.log(err + ": " + listado[id]);
                    }
                }
            }
        } catch (err) {
            Log("Error en parseInt(codigo). Error:" + err);
        }
    }
    // COMPARTIR
    if (paraque.indexOf("compartir") > -1) {
        if ((sistema == "android" && parseInt(codigo) > 182) || (sistema == "ios" && getiOSVersion(codigo) > 2.35))
            if (true) {
                Log("Version adecuada para compartir");
                compartir = true;
            }
        else {
            Log("Version NO adecuada para compartir");
            compartir = false;
        }

    }
    Log("Finaliza checkversionback");
    //checkversionback("android", 201, "VersionVieja");


    /*
    //Si es una versión de la App NO COMPATIBLE con 3.5 no dejamos descargarla y mostramos advertencia en las aventuras de 3.5
    if(sistema == "" && codigo == 150 && "compatible3.5"){
        //Recorremos todas las aventuras
        var cajas_aventuras = document.getElementsByClassName("noplayer");
        //console.log(cajas_aventuras);
        //Para cada aventura
        for(var i = 0; i < cajas_aventuras.length; i++){
            //Sacamos el sistema que utiliza
            var linea_sistema = cajas_aventuras[i].getElementsByClassName("sistema");
            //Si no es quinta edición
            if(linea_sistema[0].value != "5"){
                //Ocultamos botón comprar
                var linea_boton = cajas_aventuras[i].getElementsByClassName("main-gate-button");
                linea_boton[0].style.display = "none";
                //Mostramos mensaje de no disponible
                var linea_mensaje_e = cajas_aventuras[i].getElementsByClassName("mensaje-mostrable");
                if (localStorage.getItem("lang") == "es")
                    linea_mensaje_e[0].innerHTML  = "Necesitas actualizar la aplicación para jugar esta aventura.";
                else
                    linea_mensaje_e[0].innerHTML  = "To play this adventure you need to update the App.";
            }
        }
    }
    */

}

function getiOSVersion(codigo) {
    reg = new RegExp("Optional\\(\"(.*)\"\\)", "gi");
    codigo = codigo.replace(reg, "$1");
    console.log(codigo);
    return parseFloat(codigo);
}

function exitApp() {
    var nada = "";
    var message = {
        "nada": nada
    }

    try {
        window.webkit.messageHandlers.exitAppNow.postMessage(message);
    } catch (error) {
        console.log("no estamos en iOS");
    }
    try {
        Android.exitAppNow("");
    } catch (error) {
        console.log("no estamos en Android");
    }
    hide_menu();
}

function updateCore() {

    var message = {
        "none": "none"
    }

    try {
        window.webkit.messageHandlers.updateCore.postMessage(message);
    } catch (error) {
        Log("no estamos en iOS")
    }
    try {
        Android.updateCore("");
    } catch (error) {
        Log("no estamos en Android")
    }
}

function hide_show_menu() {
    //Mostramos/ocultamos el menú
    if (document.getElementById("menu").style.display == "none")
        show_menu();
    else
        hide_menu();
}

function show_menu() {
    document.getElementById("menu").style.display = "";
    //document.getElementById("hamburguesa").style.display = "none";
    if (("" + window.location).indexOf("index-gate") > -1) {
        document.getElementById("hamburguesa").classList.remove("inverted");
    }
}

function hide_menu() {
    document.getElementById("menu").style.display = "none";
    if (("" + window.location).indexOf("index-gate") > -1) {
        document.getElementById("hamburguesa").classList.add("inverted");
    }
    if (("" + window.location).indexOf("sheet") > -1) {
        document.getElementById("dd20chars").style.display = "none";
    }

    //document.getElementById("hamburguesa").style.display = "";
}

function to_main() {
    window.location = '../index-gate.html';
}

function to_tutorial() {
    // Calculamos la vuelta
    pagina = "" + window.location;
    var n1 = pagina.lastIndexOf("/");
    var n2 = pagina.lastIndexOf("/", n1 - 1);
    pagina = pagina.substring(n2 + 1, n1);

    if (("" + window.location).indexOf("index-gate") > -1) {
        var url = './salorium/tutorial.html';
    } else {
        var url = '../salorium/tutorial.html?param=&from=' + pagina;
    }
    window.location = url;
}

/*
function ajustar_idioma_menu(){
    var lang = localStorage.getItem("lang");
    
    if (lang === null) {
        lang = getlanguage();
        if(lang != "en" && lang != "es"){
            Log("ajustar_idioma_menu: Detectado idioma: "+lang+". Fijamos idioma a: en");
            lang = "en";
        }
        localStorage.setItem('lang', lang);
    }
    
    if (lang == "es") {
            document.getElementById('spanish').className = "langcheck";  
            if (!isInArray('es',languages)) 
                document.getElementById('spanish').className = "grayedlangcheck";        
            document.getElementById('tocover').innerHTML = "Ir a Portada";
            document.getElementById('totutorial').innerHTML = "Ir a Tutorial";
            document.getElementById('spanish').innerHTML = "Español";
            document.getElementById('english').innerHTML = "Inglés";
            document.getElementById('menutitle').innerHTML = "Configuración";
        
        
    } else {
        document.getElementById('english').className = "langcheck";        
         if (!isInArray('en',languages)) 
                document.getElementById('english').className = "grayedlangcheck";        

    }
}
*/



/**************************/
/* FUNCIONES PARA FILTROS */
/**************************/

function setonlyenglishfilter() {
    var e = document.getElementById("spanish-check");
    e.checked = false;
    applyfilters()
}

function applyfilters() {

    var visible = true;
    var lvisible = true;

    var aventuras = document.getElementsByClassName("adventure");
    for (var i = 0; i < aventuras.length; i++) {

        // Con la ficha y el manual no hacemos nada
        if (aventuras[i].id == "charactersheet")
            continue;

        // De momento ESTA aventura es visible, Necesitamos un true en cada columna
        visible = true;

        // Comprobamos Idioma
        lvisible = false;
        if (document.getElementById("english-check").checked) {
            if (hasClass(aventuras[i], "en"))
                lvisible = true;
        }
        if (document.getElementById("spanish-check").checked) {
            if (hasClass(aventuras[i], "es"))
                lvisible = true;
        }
        visible = lvisible && visible;

        // Comprobamos el Nivel
        lvisible = false;
        if (document.getElementById("low").checked) {
            if (hasClass(aventuras[i], "low"))
                lvisible = true;
        }
        if (document.getElementById("mid").checked) {
            if (hasClass(aventuras[i], "mid"))
                lvisible = true;
        }
        if (document.getElementById("high").checked) {
            if (hasClass(aventuras[i], "high"))
                lvisible = true;
        }
        if (document.getElementById("vhigh").checked) {
            if (hasClass(aventuras[i], "vhigh"))
                lvisible = true;
        }
        visible = lvisible && visible;

        // Asignamos visibilidad
        if (visible)
            aventuras[i].style.display = "block"
        else
            aventuras[i].style.display = "none"

    }
    // Si falta cualquier checkbox es que hemos filtrado

    if (document.getElementById("english-check").checked &&
        document.getElementById("spanish-check").checked &&
        document.getElementById("low").checked &&
        document.getElementById("mid").checked &&
        document.getElementById("high").checked &&
        document.getElementById("vhigh").checked
    ) {
        console.log("No hay nada filtrado");
        var e = document.getElementById("filteron");
        e.checked = false;
    } else {
        console.log("Hay filtros activados")
        var e = document.getElementById("filteron");
        e.checked = true;
    }

    hidefilters();
}

function clearfilters() {
    document.getElementById("english-check").checked = true;
    document.getElementById("spanish-check").checked = true;
    document.getElementById("low").checked = true;
    document.getElementById("mid").checked = true;
    document.getElementById("high").checked = true;
    document.getElementById("vhigh").checked = true;
}

function show_hide_filters() {
    var e = document.getElementById("filters");
    if (e.style.display == "none") {
        showfilters();
    } else {
        hidefilters();
    }
}

function showfilters() {
    document.getElementById("filteron").checked = true;
    document.getElementById("filters").style.display = "block";
}

function hidefilters() {
    document.getElementById("filters").style.display = "none";
}









/********************/
/* FUNCIONES DE LOG */
/********************/
function Log(text) {
    var loghistory = localStorage.getItem('loghistory');
    if (loghistory === null) {
        loghistory = "";
    }

    if (loghistory.length > 6000)
        clearLog();

    loghistory = loghistory + "<br>" + text;
    localStorage.setItem('loghistory', loghistory);

    console.log(text);
}

function showLog() {

    var loghistory = localStorage.getItem('loghistory');
    if (loghistory === null) {
        loghistory = "";
    }
    var e = document.getElementById("warning");
    e.innerHTML = loghistory;
    e.style.display = "block";
    e.style.visibility = "visible";
}

function clearLog() {
    console.log("Clear log..");
    var loghistory = "Iniciando...<br>"
    localStorage.setItem('loghistory', loghistory);
}

// Funciones de iOS
//----------------------------------------------------------------------
function SaveSettings(content_file, tutorial) {

    var message = {
        "content_file": content_file,
        "tutorial": tutorial
    }

    try {
        window.webkit.messageHandlers.SaveSettings.postMessage(message);
    } catch (error) {
        console.log("no estamos en iOS")
    }

}

function GetSettings(content_file, tutorial) {
    var message = {}

    try {
        window.webkit.messageHandlers.GetSettings.postMessage(message);

    } catch (error) {
        console.log("no estamos en iOS")
    }

}

function resetBuyedItems() {
    var message = {
        "none": "none"
    }
    window.webkit.messageHandlers.resetBuyed.postMessage(message);
}
//------------------------------------------------------------------------------

//Funciones para fijar idioma
function spanish() {	
    config("lang", "es");
    location.reload();
}

function english() {
    config("lang", "en");
    location.reload();
}

function UpdatedCore() {
    window.location.reload(true);
}

function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
}

var MD5 = function (d) {
    result = M(V(Y(X(d), 8 * d.length)));
    return result.toLowerCase()
};

function M(d) {
    for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++) _ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _);
    return f
}

function X(d) {
    for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++) _[m] = 0;
    for (m = 0; m < 8 * d.length; m += 8) _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
    return _
}

function V(d) {
    for (var _ = "", m = 0; m < 32 * d.length; m += 8) _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
    return _
}

function Y(d, _) {
    d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;
    for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
        var h = m,
            t = f,
            g = r,
            e = i;
        f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e)
    }
    return Array(m, f, r, i)
}

function md5_cmn(d, _, m, f, r, i) {
    return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m)
}

function md5_ff(d, _, m, f, r, i, n) {
    return md5_cmn(_ & m | ~_ & f, d, _, r, i, n)
}

function md5_gg(d, _, m, f, r, i, n) {
    return md5_cmn(_ & f | m & ~f, d, _, r, i, n)
}

function md5_hh(d, _, m, f, r, i, n) {
    return md5_cmn(_ ^ m ^ f, d, _, r, i, n)
}

function md5_ii(d, _, m, f, r, i, n) {
    return md5_cmn(m ^ (_ | ~f), d, _, r, i, n)
}

function safe_add(d, _) {
    var m = (65535 & d) + (65535 & _);
    return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m
}

function bit_rol(d, _) {
    return d << _ | d >>> 32 - _
}
