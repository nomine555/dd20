var debug = "on";

function colorReplace(text) {
    text = text.replace(/background-color:rgb\(216,226,234\)/g, "background-color:rgb(255,255,255)");   
    text = text.replace(/background-color:rgb\(60,106,169\)/g, "background-color:rgb(24, 34, 20)");
    text = text.replace(/margin:.*px?;/g, "");
    text = text.replace(/padding:.*px?;/g, "");  
    return text;
}

/*jslint devel: true */
/*jslint plusplus: true, vars: true, browser: true */

var selected = "";
var showDiceclick = false;

function salta(valor) {
    console.log("../core/SRD5es/" + valor)
    LoadWiki("../core/SRD5es/" + valor);
}

function start() {
    var url = window.location.href;
    
    var lang = localStorage.getItem("lang");
    if (lang === null) {
        lang = getlanguage();
        localStorage.setItem('lang', lang);
    }
    
    cargarMenu();
    
    if (lang == "es") {
        document.getElementById('sethelp').innerHTML = "Seleccione su juego de dados haciendo click sobre los mismos<br/> golpe y arrastre con el dedo para lanzar u ocultar los dados";
        document.getElementById('nowebglinside').innerHTML = "WebGL no soportado, no se pueden ver los dados animados!";
        document.getElementById('labelhelp').innerHTML = "haga clic para continuar o golpee o arrastre para volver a tirar";
        document.getElementById('exit').innerHTML = "Salir";
        document.getElementById('exit2').innerHTML = "Salir";
        document.getElementById('clear').innerHTML = "Limpiar";
        document.getElementById('throw').innerHTML = "Lanzar";

        document.getElementById("lbl_create").innerHTML = "¿Desea crear un nuevo personaje o actualizar el existente?";
        document.getElementById('lbl_update').innerHTML = "Actualizar";
        document.getElementById('lbl_delete').innerHTML = "¿Desea borrar el personaje?";
        document.getElementById('lbl_new').innerHTML = "Nuevo";
        document.getElementById('lbl_yes').innerHTML = "Si";
        document.getElementById('lbl_cancel').innerHTML = "Cancelar";
   
     }
    
    traducir_pj(lang);
            
}

function cargarMenu_back() {
        if (url.indexOf("character=") > -1) {       
        param = url.substring(url.indexOf("character=")+10,url.length);        
    }
    else param = null;
    
        personajes = localStorage.getItem('personajes');
        if (personajes === null) {
            personajes = "Ignotus";
            localStorage.setItem("personajes",personajes);
        }
    
function hasClass(element, className) {
	return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
}
    
    
        update_personajes();
    
        if (param !== null) {          
            if (personajes.indexOf(param) >= 0){
                load(param);
            }

        }
        else 
            load(personajes.split(',')[0]);       

}

function traducir_pj(idioma){
    //Si no es inglés, hay que traducir
    if(idioma != "en"){
        list = eval("ficha_"+idioma);

        for (i = 0 ; i < list.length ; i++){
            var name = list[i][0];
            var att  = list[i][1];
            //console.log("-> " + name + ";" + att);
            document.getElementById(name).innerHTML = att;
        }
    }
    //Es ingles, no hacemos nada
    else{
        
    }
    
}

function update_personajes() {
    var element = document.getElementById("opciones");
    personajes = localStorage.getItem('personajes');
    console.log(personajes)
    var listado = personajes.split(',');
    for (i = 0 ; i < listado.length ; i++) {
        list = document.createElement("li");
        list.innerHTML = listado[i];   
        list.style.fontStyle = "italic";
        element.appendChild(list);
        list.onclick = (function (param) { return function () {
                        load(param);}
                        ;}) (listado[i]);
    }
}

function reload(param) {
    
    var url = window.location.href; 
    url = url.substring(0,url.indexOf('?'));
    if (param !== "")
        window.location.href = url + "?character=" + param;
    else window.location.href = url;
}

function add(lista, new_e) {    
    return lista + "," + new_e;
}

function remove(lista, old_e) {
    nueva = lista;   
    if (lista.indexOf(","+old_e) > 0){
        nueva = lista.replace(","+old_e,"");        
    }        
    else if(lista.indexOf(old_e+",") >= 0)
        nueva = lista.replace(old_e+",","");
    return nueva;
}

function update(lista, old_e, new_e) {
    nueva = lista;
    if (lista.indexOf(old_e + ",") >= 0) {
        nueva = lista.replace(old_e+",",new_e+",");       
    }        
    else if(lista.indexOf(","+old_e) > 0)
        nueva = lista.replace(","+old_e,","+new_e);
    else if(lista.indexOf(old_e) == 0)
        nueva = lista.replace(old_e,new_e);
    return nueva;
}

function askfornew () {
    document.getElementById('ask').style.display="block";    
}

function askfordelete () {
    document.getElementById('ask_del').style.display="block";
    document.getElementById('dd20chars').style.display="none";
}

function close_delete() {
    document.getElementById('ask_del').style.display='none';
}

function delete_char() {
    selected = document.getElementById('charactername').value;    
    personajes = localStorage.getItem('personajes');  
    personajes = remove(personajes, selected);    
    localStorage.setItem("personajes",personajes);    
    document.getElementById('ask_del').style.display='none';    
    reload("");
}

function crear() {
    selected = document.getElementById('charactername').value;    
    personajes = localStorage.getItem('personajes');  
    personajes = add(personajes, selected);    
    localStorage.setItem("personajes",personajes);    
    document.getElementById('ask').style.display='none';
    save();
    reload(selected);
}

function actualizar() { 
    old = selected;
    selected = document.getElementById('charactername').value;
    personajes = localStorage.getItem('personajes');    
    personajes = update(personajes, old, selected);
    localStorage.setItem("personajes",personajes);       
    document.getElementById('ask').style.display='none';
    save();    
    reload(selected);
}

function save() {
    document.getElementById('dd20chars').style.display='none';
    if (document.getElementById('charactername').value != selected)
        return askfornew();
    
    var lista = "[";
    
    var list = document.getElementsByTagName("input");
    for (i = 0 ; i < list.length ; i++)
    {
        var name  = list[i].getAttribute("name");
        if (list[i].type == "checkbox") {
                var value = list[i].checked;
        }
        else {
        var value = list[i].value ;
        }
        lista = lista + "['" + name + "','" + value + "'],";
        localStorage.setItem(name+selected, value);
    }
    
    //var list = document.getElementsByTagName("textarea");
    var list = document.getElementsByClassName("textarea");
    
    for (j = 0 ; j < list.length ; j++)
    {
        var name  = list[j].getAttribute("name");
        var value = list[j].innerHTML;

		var reg = new RegExp("<em[^>]*>", "gi");   
			value = value.replace(reg, "*");
		var reg = new RegExp("</em>", "gi");   
			value = value.replace(reg, "*");
		
        console.log("->" + name + selected + "= " + value);
        lista = lista + "['" + name + "','" + value + "'],";
        localStorage.setItem(name+selected, value);
    }
    
    lista = lista + "]";
    console.log(lista);
    document.getElementById("menu").style.display = "none";  
}


function load(personaje) {

    document.getElementById('dd20chars').style.display='none';
    
    selected = personaje;
    
    var list = document.getElementsByTagName("input");
    for (i = 0 ; i < list.length ; i++)
    {
        var name  = list[i].getAttribute("name");
        if (name == "savebutton" || name == "loadbutton" || name == "resetbutton" || name == "mas" || name == "menos" ) 
        {
            
        }
        else {
            if (list[i].type == "checkbox") {
                var isTrueSet = (localStorage.getItem(name+personaje) == 'true');
                list[i].checked = isTrueSet;
            }
            else {
            list[i].value = localStorage.getItem(name+personaje);
            }
        }
    }
    
    //var list = document.getElementsByTagName("textarea");
    var list = document.getElementsByClassName("textarea");
  
    for (i = 0 ; i < list.length ; i++)
    {
        var name  = list[i].getAttribute("name");
        var pagina  = localStorage.getItem(name+personaje);
		console.log(name + " " + pagina);
		
		if (pagina !== null) {
		try {
    // Añadimos las reglas
		for (var j = 0; j < biblioteca_5a_en.length; j++) {
			reg = new RegExp("\\*" + biblioteca_5a_en[j][0] +"\\*", "gi");   
			pagina = pagina.replace(reg, "<em onclick=\"LoadWiki('"+biblioteca_5a_en[j][1]+"');\">" + biblioteca_5a_en[j][0]+ "</em>&nbsp;");
		}
		for (var j = 0; j < biblioteca_5a_es.length; j++) {
			reg = new RegExp("\\*" + biblioteca_5a_es[j][0] + "\\*", "gi");   
			pagina = pagina.replace(reg, "<em onclick=\"LoadWiki('"+biblioteca_5a_es[j][1]+"');\">" + biblioteca_5a_es[j][0]+ "</em>&nbsp;");
		}

			} catch (err) {
				console.log(err + " " + name)
			}
		}
		
        list[i].innerHTML = pagina;
    }    
    
    document.getElementById('charactername').value = personaje;
    document.getElementById("menu").style.display = "none";
}

function load_pre(personaje) {
    document.getElementById('dd20chars').style.display='none';
    document.getElementById('menu').style.display='none';
    CloseLateralInfo(event);
    
    var lang = localStorage.getItem("lang");
    personaje = personaje+'_'+lang;

    list = eval(personaje);
    for (i = 0 ; i < list.length ; i++){
        var name = list[i][0];
        var att  = list[i][1];
        console.log("-> " + name + ":" + att);
        var Nname = document.getElementsByName(name)[0];
        
        
        //Si es un input
        if (Nname.tagName == "input") {
            //Si es un input checkbox
            if (Nname.type == "checkbox"){
                var isTrueSet = (att == 'true');
                Nname.checked = isTrueSet;
            }
            //Si es un input no-checkbox
            else
                Nname.value = att;
        }
        else if (hasClass(Nname, "textarea")) {
          
            if (att !== null) {
                try {
                    var pagina = att;
                    //Añadimos las reglas
                    if (name == "otherprofs" || name == "features" || name == "equipment") {
                        console.log("Reglas en " + name);
                       	for (var j = 0; j < biblioteca_5a_en.length; j++) {
			             reg = new RegExp("\\*" + biblioteca_5a_en[j][0] +"\\*", "gi");   
			             pagina = pagina.replace(reg, "<em onclick=\"LoadWiki('"+biblioteca_5a_en[j][1]+"');\">" + biblioteca_5a_en[j][0]+ "</em>&nbsp;");
		              }
		              for (var j = 0; j < biblioteca_5a_es.length; j++) {
			             reg = new RegExp("\\*" + biblioteca_5a_es[j][0] + "\\*", "gi");   
			             pagina = pagina.replace(reg, "<em onclick=\"LoadWiki('"+biblioteca_5a_es[j][1]+"');\">" + biblioteca_5a_es[j][0]+ "</em>&nbsp;");
		              }

                    }
                    att = pagina;
                }
                catch (err) {
                    console.log(err + " " + name)
                }
            }
            Nname.innerHTML = att;   
                 
        }
        //Si no es input (¿textarea?)
        else {
            Nname.value = att;
        }
    }
    document.getElementById("menu").style.display = "none";
}

function updateRules(capa) {
    
    console.log("updateRules!")
    //var texto = document.getElementById(capa).innerHTML;
    var texto = event.target.innerHTML;
    
    var reg = new RegExp("<em[^>]*>", "gi");   
        texto = texto.replace(reg, "*");
    var reg = new RegExp("</em>", "gi");   
        texto = texto.replace(reg, "*");
    
    try {
	       for (var j = 0; j < biblioteca_5a_en.length; j++) {
             reg = new RegExp("\\*" + biblioteca_5a_en[j][0] +"\\*", "gi");   
             texto = texto.replace(reg, "<em onclick=\"LoadWiki('"+biblioteca_5a_en[j][1]+"');\">" + biblioteca_5a_en[j][0]+ "</em>&nbsp;");
         }
        for (var j = 0; j < biblioteca_5a_es.length; j++) {
            if (biblioteca_5a_es[j][0].indexOf("Mano")>-1) {
                console.log(biblioteca_5a_es[j][0])
            }
            reg = new RegExp("\\*" + biblioteca_5a_es[j][0] + "\\*", "gi");   
            texto = texto.replace(reg, "<em onclick=\"LoadWiki('"+biblioteca_5a_es[j][1]+"');\">" + biblioteca_5a_es[j][0]+ "</em>&nbsp;");
        }
    } catch (err) {
        console.log(err)
    }
    console.log(texto)
    event.target.innerHTML = texto;
}


function loaddd20() {       
    
    if (document.getElementById('dd20chars').style.display == "none")
        document.getElementById('dd20chars').style.display = "block";
    else
        document.getElementById('dd20chars').style.display = "none"; 
}

function reset() {
     reload("character="+selected);
 /*   
    personaje = 'Namor';
    list = Namor;
     for (i = 0 ; i < list.length ; i++)
    {
        var name = list[i][0];
        var att  = list[i][1];
        console.log("-> " + name + ";" + att);
        document.getElementsByName(name)[0].value = att;
    }
   */ 
//  if (window.location.href.indexOf("reset") > 0) {        
//        location.reload(true);    
//    } else {
//    window.location.href = window.location.href + "?reset";
//        }

}

function suma(id) {
    element = document.getElementById(id);
    if (element.value !== "" )
        element.value = parseInt(element.value) + 1;
    else element.value = 0;
}

function resta(id) {
    element = document.getElementById(id);
    if (element.value !== "" )
        element.value = parseInt(element.value) - 1;
    else element.value = 0;
}

/*
function ShowDice() {

    if (!showDiceclick) {
        if (Detector.webgl) {
            dice_initialize(document.body);
            Show('dice-area');
        } else {
            var warning = Detector.getWebGLErrorMessage();
            //document.getElementById('nowebgl').appendChild(warning);
            document.getElementById('nowebgl').style.display = "block";
            Show('dice-area');
            document.getElementById("dice-area").style.zIndex = 30;
            }
            showDiceclick = true;
    } 
    else {
         if (document.getElementById("dice-area").style.zIndex == 30) {
             CloseImage();
         }
        else {
        Show('dice-area');
        document.getElementById("dice-area").style.zIndex = 30;
        }
    }
}

function Show(id) {
    document.getElementById(id).style.opacity = 1;
    document.getElementById(id).style.zIndex = 20;
 //   document.getElementById(id).addEventListener("click", OnfocusOut);
}

function CloseImage() {    
        document.getElementById('dice-area').style.opacity = 0;
        document.getElementById('dice-area').style.zIndex = 1;    
}
*/

var erendur_es = [['classlevel','Clérigo 1'],['background','Charlatan'],['playername','Erendur'],['race','Alto elfo'],['alignment','Caótico Bueno'],['experiencepoints',''],['Strengthscore','13'],['Strengthmod','2'],['Dexterityscore','12'],['Dexteritymod','1'],['Constitutionscore','10'],['Constitutionmod','0'],['Intelligencescore','10'],['Intelligencemod','0'],['Wisdomscore','15'],['Wisdommod','2'],['Charismascore','12'],['Charismamod','1'],['ac','18'],['initiative','1'],['speed','30'],['pwisndowm','14'],['profbonus','2'],['inspiration','1'],['Strength-save','2'],['Strength-save-prof','false'],['Dexterity-save','1'],['Dexterity-save-prof','false'],['Constitution-save','0'],['Constitution-save-prof','false'],['Intelligence-save','0'],['Intelligence-save-prof','false'],['Wisdom-save','4'],['Wisdom-save-prof','true'],['Charisma-save','3'],['Charisma-save-prof','true'],['maxhp','8'],['menos','-'],['currenthp',''],['mas','+'],['menos','-'],['temphp',''],['mas','+'],['atkname1','Espada larga'],['atkbonus1','3'],['atkdamage1','1d8+2'],['atkname2','Arco corto'],['atkbonus2','1'],['atkdamage2','1d6+2'],['atkname3',''],['atkbonus3',''],['atkdamage3',''],['Acrobatics','1'],['Acrobatics-prof','false'],['Animal_Handling','0'],['Animal_Handling-prof','false'],['Arcana','0'],['Arcana-prof','false'],['Athletics','1'],['Athletics-prof','false'],['Deception','1'],['Deception-prof','false'],['History','2'],['History-prof','true'],['Insight','4'],['Insight-prof','true'],['Intimidation','1'],['Intimidation-prof','false'],['Investigation','0'],['Investigation-prof','false'],['Medicine','4'],['Medicine-prof','true'],['Nature','0'],['Nature-prof','false'],['Perception','2'],['Perception-prof','false'],['Performance','1'],['Performance-prof','true'],['Persuasion','2'],['Persuasion-prof','true'],['Religion','0'],['Religion-prof','false'],['Sleight of Hand','1'],['Sleight_of_Hand-prof','false'],['Stealth','1'],['Stealth-prof','false'],['Survival','2'],['Survival-prof','false'],['cp',''],['sp','20'],['ep',''],['gp',''],['pp',''],['otherprofs','Visión en la oscuridad: 60 pies.<br><br>Ancestro feérico. Tienes ventaja en las tiradas de salvación para no quedar hechizado y no puedes quedarte dormido por ningún efecto mágico.<br><br>Trance: Los elfos no necesitan dormir, en lugar de ello meditan profundamente y permanecen semiinconscientes durante cuatro horas al día.<br><br>Discípulo de la vida<br>Cuando usas un conjuro de nivel 1 o superior para hacer que una criatura recupere puntos de golpe, esta recupera un número de puntos de golpe adicionales igual a 2 + el nivel del conjuro.'],['equipment','Símbolo sagrado'],['personality','Veo augurios en todas partes. Los dioses nos hablan constantemente solo hay que escucharles.'],['ideals','Los dioses esperan que hagamos de este mundo un mundo mejor.'],['bonds','Todo lo que hago lo hago por los dioses.'],['flaws','Una vez fijado el objetivo, me obsesiono hasta lograrlo.'],['features','*Llama sagrada* (Truco) 60 pies<br>Una criatura dentro del alcance debe superar una TS de Destreza o recibir 1d8 puntos de daño radiante. No hay ventaja por cubrirse del ataque. El daño aumenta a nivel 5 (2d8), a nivel 11 (3d8) y a nivel 17 (4d8).<br><br>*Luz* (Truco) 1 hora. Toque<br>Un objeto de no más de 10 pies emite luz brillante del color que quieras en un radio de 20 pies y luz tenue en 20 pies adicionales. Si el portador del objeto es hostil, debe superar una TS de Destreza para evitar el conjuro.<br><br>*Mensaje* (Truco) 120 pies<br>Señalas con el dedo a una criatura dentro del alcance y susurras un mensaje. El objetivo (y solo el objetivo) escucha el mensaje y puede responder con un susurro que solo tú puedes escuchar. Puede atravesar objetos sólidos si conoces al objetivo y su posición.<br><br>*Piedad con los moribundos* (Truco) Toque<br>Tocas a una criatura viva que tenga 0 puntos de golpe. La criatura se estabiliza. Este conjuro no tiene efecto sobre no muertos ni constructos.<br><br>*Bendecir* (Nv. 1) Concentración 1 minuto. 30 pies<br>Bendices hasta a tres criaturas de tu elección dentro del alcance. Cuando un objetivo haga una tirada de ataque o de salvación antes de que termine el conjuro, puede tirar 1d4 y sumar el resultado a su tirada. Afecta a una criatura más por cada nivel de conjuro por encima de 1.<br><br>*Curar heridas* (Nv. 1) Toque<br>Una criatura que tocas recupera un número de puntos de golpe igual a 1d8/nivel de conjuro + tu modificador por característica para lanzar conjuros. Este conjuro no tiene efecto ni en no muertos ni en constructos.<br><br>*Escudo de la fe* (Nv. 1) Concentración 10 minutos. 60 pies<br>Un campo brillante rodea a la criatura que elijas dentro del alcance y le concede un bonificador de +2 a la CA mientras dura el conjuro.<br><br>*Protección contra el mal y el bien* (Nv. 1) Concentración 10 minutos<br>Proteges a una criatura voluntaria contra aberraciones, celestiales, elementales, fatas, infernales y no muertos, las cuales tienen desventaja en los ataques contra el objetivo, y no le pueden hechizar, asustar o poseer. Si ya se encontraba en uno de estos estados, puede volver a tirar la TS.<br><br>*Santuario* (Nv. 1) 1 acción adicional. 1 minuto. 30 pies<br>Proteges de un ataque a una criatura. Cualquier criatura que le ataque debe superar una TS de Sabiduría. Si falla, debe elegir un nuevo objetivo o perder el ataque o conjuro. Si la criatura protegida ataca, el conjuro termina.'],];

var erendur_en = [['classlevel','Cleric 1'],['background','Charlatan'],['playername','Erendur'],['race','High elf'],['alignment','Chaotic Good'],['experiencepoints',''],['Strengthscore','13'],['Strengthmod','2'],['Dexterityscore','12'],['Dexteritymod','1'],['Constitutionscore','10'],['Constitutionmod','0'],['Intelligencescore','10'],['Intelligencemod','0'],['Wisdomscore','15'],['Wisdommod','2'],['Charismascore','12'],['Charismamod','1'],['ac','18'],['initiative','1'],['speed','30'],['pwisndowm','14'],['profbonus','2'],['inspiration','1'],['Strength-save','2'],['Strength-save-prof','false'],['Dexterity-save','1'],['Dexterity-save-prof','false'],['Constitution-save','0'],['Constitution-save-prof','false'],['Intelligence-save','0'],['Intelligence-save-prof','false'],['Wisdom-save','4'],['Wisdom-save-prof','true'],['Charisma-save','3'],['Charisma-save-prof','true'],['maxhp','8'],['menos','-'],['currenthp',''],['mas','+'],['menos','-'],['temphp',''],['mas','+'],['atkname1','Longsword'],['atkbonus1','3'],['atkdamage1','1d8+2'],['atkname2','Short Bow'],['atkbonus2','1'],['atkdamage2','1d6+2'],['atkname3',''],['atkbonus3',''],['atkdamage3',''],['Acrobatics','1'],['Acrobatics-prof','false'],['Animal_Handling','0'],['Animal_Handling-prof','false'],['Arcana','0'],['Arcana-prof','false'],['Athletics','1'],['Athletics-prof','false'],['Deception','1'],['Deception-prof','false'],['History','2'],['History-prof','true'],['Insight','4'],['Insight-prof','true'],['Intimidation','1'],['Intimidation-prof','false'],['Investigation','0'],['Investigation-prof','false'],['Medicine','4'],['Medicine-prof','true'],['Nature','0'],['Nature-prof','false'],['Perception','2'],['Perception-prof','false'],['Performance','1'],['Performance-prof','true'],['Persuasion','2'],['Persuasion-prof','true'],['Religion','0'],['Religion-prof','false'],['Sleight of Hand','1'],['Sleight_of_Hand-prof','false'],['Stealth','1'],['Stealth-prof','false'],['Survival','2'],['Survival-prof','false'],['cp',''],['sp','20'],['ep',''],['gp',''],['pp',''],['otherprofs','Darkvision: 60 feet.<br><br>Fey Ancestry: You have advantage on saving throws against being charmed, and magic can’t put you to sleep.<br><br>Trance: Elves don’t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day<br><br>Disciple of Life: Also starting at 1st level, your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell’s level.'],['equipment','Holy Symbol'],['personality','I see omens in every event and action. The gods try to speak to us, we just need to listen.'],['ideals','Change. We must help bring about the changes '],['bonds','Everything I do is for the greater good fot the gods.'],['flaws','Once I pick a goal, I become obsessed with it to the detriment of everything else in my life.'],['features','*Sacred Flame* (Cantrip) 60 feet<br>Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw.<br><br>*Light* (Cantrip) 1 hour. Touch<br>You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet. The light can be colored as you like. Completely covering the object with something opaque blocks the light. The spell ends if you cast it again or dismiss it as an action.<br><br>*Message* (Cantrip) 120 feet<br><br>*Spare the Dying* (Cantrip)<br><br>*Bless* (Lvl. 1) You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.<br><br>*Cure Wounds* (Lvl. 1)<br>A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.<br><br>*Shield of Faith* (Lvl. 1) A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.<br><br>*Protection from Poison* (Lvl. 1) You touch a creature. If it is poisoned, you neutralize the poison. If more than one poison afflicts the target, you neutralize one poison that you know is present, or you neutralize one at random.<br><br>*Sanctuary* (Lvl. 1) You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell.'],];

var monak_es = [['classlevel','Guerrero 1'],['background','Salvaje'],['playername','Monak'],['race','Humano'],['alignment','Caótico Bueno'],['experiencepoints',''],['Strengthscore','15'],['Strengthmod','2'],['Dexterityscore','12'],['Dexteritymod','1'],['Constitutionscore','13'],['Constitutionmod','1'],['Intelligencescore','10'],['Intelligencemod','0'],['Wisdomscore','12'],['Wisdommod','1'],['Charismascore','10'],['Charismamod','0'],['ac','18'],['initiative','1'],['speed','30'],['pwisndowm','13'],['profbonus','2'],['inspiration','1'],['Strength-save','4'],['Strength-save-prof','true'],['Dexterity-save','1'],['Dexterity-save-prof','false'],['Constitution-save','3'],['Constitution-save-prof','true'],['Intelligence-save','0'],['Intelligence-save-prof','false'],['Wisdom-save','1'],['Wisdom-save-prof','false'],['Charisma-save','0'],['Charisma-save-prof','false'],['maxhp','11'],['menos','-'],['currenthp',''],['mas','+'],['menos','-'],['temphp',''],['mas','+'],['atkname1','Espada larga'],['atkbonus1','4'],['atkdamage1','1d8+4'],['atkname2','Ballesta'],['atkbonus2','3'],['atkdamage2','1d8+1'],['atkname3',''],['atkbonus3',''],['atkdamage3',''],['Acrobatics','1'],['Acrobatics-prof','false'],['Animal_Handling','0'],['Animal_Handling-prof','false'],['Arcana','0'],['Arcana-prof','false'],['Athletics','4'],['Athletics-prof','true'],['Deception','0'],['Deception-prof','false'],['History','0'],['History-prof','false'],['Insight','1'],['Insight-prof','false'],['Intimidation','2'],['Intimidation-prof','true'],['Investigation','0'],['Investigation-prof','false'],['Medicine','1'],['Medicine-prof','false'],['Nature','0'],['Nature-prof','false'],['Perception','3'],['Perception-prof','true'],['Performance','0'],['Performance-prof','false'],['Persuasion','0'],['Persuasion-prof','false'],['Religion','0'],['Religion-prof','false'],['Sleight of Hand','1'],['Sleight_of_Hand-prof','false'],['Stealth','1'],['Stealth-prof','false'],['Survival','3'],['Survival-prof','true'],['cp',''],['sp','20'],['ep',''],['gp',''],['pp',''],['otherprofs','Vagabundo:<br>Tienes una excelente memoria para los mapas y la geografía y siempre puedes recordar la disposición general del terreno, los asentamientos y otras circunstancias de entorno que te rodea. Además, puedes encontrar comida y agua fresca para ti y para otras cinco personas cada día, siempre y cuando la tierra tenga bayas, algo de caza menor, agua y cosas por el estilo.<br><br>Duelista:<br>Cuando solo empuñas un arma cuerpo a cuerpo en una mano, ganas un bonificador de +2 a las tiradas de daño que hagas con ella.<br><br>Nuevas energías:<br>Dispones de una fuente ilimitada de vitalidad a la que puedes recurrir para protegerte del daño. Durante tu turno, puedes usar una acción adicional para recuperar un número de puntos de golpe igual a 1d10 + tu nivel de guerrero. Una vez usas este rasgo, debes terminar un descanso prolongado o breve antes de poder usarlo otra vez.'],['equipment','Símbolo sagrado'],['personality','Me impulsa la sed de aventura'],['ideals','Gloria, debo ganar batallas y traer gloria para mí mismo'],['bonds','Mi familia es lo más importante, incluso por encima de mí mismo'],['flaws','No hay lugar para la preocupación en una vida vivida al máximo'],['features',''],];

var monak_en = [['classlevel','Fighter 1'],['background','Outlander'],['playername','Monak'],['race','Human'],['alignment','Chaotic Good'],['experiencepoints',''],['Strengthscore','15'],['Strengthmod','2'],['Dexterityscore','12'],['Dexteritymod','1'],['Constitutionscore','13'],['Constitutionmod','1'],['Intelligencescore','10'],['Intelligencemod','0'],['Wisdomscore','12'],['Wisdommod','1'],['Charismascore','10'],['Charismamod','0'],['ac','18'],['initiative','1'],['speed','30'],['pwisndowm','13'],['profbonus','2'],['inspiration','1'],['Strength-save','4'],['Strength-save-prof','true'],['Dexterity-save','1'],['Dexterity-save-prof','false'],['Constitution-save','3'],['Constitution-save-prof','true'],['Intelligence-save','0'],['Intelligence-save-prof','false'],['Wisdom-save','1'],['Wisdom-save-prof','false'],['Charisma-save','0'],['Charisma-save-prof','false'],['maxhp','11'],['menos','-'],['currenthp',''],['mas','+'],['menos','-'],['temphp',''],['mas','+'],['atkname1','Longsword'],['atkbonus1','4'],['atkdamage1','1d8+4'],['atkname2','Crossbow'],['atkbonus2','3'],['atkdamage2','1d8+1'],['atkname3',''],['atkbonus3',''],['atkdamage3',''],['Acrobatics','1'],['Acrobatics-prof','false'],['Animal_Handling','0'],['Animal_Handling-prof','false'],['Arcana','0'],['Arcana-prof','false'],['Athletics','4'],['Athletics-prof','true'],['Deception','0'],['Deception-prof','false'],['History','0'],['History-prof','false'],['Insight','1'],['Insight-prof','false'],['Intimidation','2'],['Intimidation-prof','true'],['Investigation','0'],['Investigation-prof','false'],['Medicine','1'],['Medicine-prof','false'],['Nature','0'],['Nature-prof','false'],['Perception','3'],['Perception-prof','true'],['Performance','0'],['Performance-prof','false'],['Persuasion','0'],['Persuasion-prof','false'],['Religion','0'],['Religion-prof','false'],['Sleight of Hand','1'],['Sleight_of_Hand-prof','false'],['Stealth','1'],['Stealth-prof','false'],['Survival','3'],['Survival-prof','true'],['cp',''],['sp','20'],['ep',''],['gp',''],['pp',''],['otherprofs','Wanderer<br>Fighting style: Duelist<br>Second Wind.'],['equipment','Guards Chainmail <br>Guards shield<br>Heirloom longsword<br>20 silver coins'],['personality','Im driven by a wanderlust that led me away from home'],['ideals','Glory. I must earn glory in battle, for myself and my familiy'],['bonds','My family is the most important thing in my life, even when they are far from me.'],['flaws','There is no room for caution in a life lived to the fullest'],['features',''],];

var mrpirs_es = [['classlevel','Hechicero 1'],['background','Charlatan'],['playername','Mr. Pirs '],['race','Halfling'],['alignment','Neutral Malvado'],['experiencepoints',''],['Strengthscore','8'],['Strengthmod','-1'],['Dexterityscore','16'],['Dexteritymod','3'],['Constitutionscore','14'],['Constitutionmod','2'],['Intelligencescore','10'],['Intelligencemod','0'],['Wisdomscore','10'],['Wisdommod','0'],['Charismascore','16'],['Charismamod','3'],['ac','13'],['initiative','3'],['speed','25'],['pwisndowm','10'],['profbonus','2'],['inspiration','1'],['Strength-save','-1'],['Strength-save-prof','false'],['Dexterity-save','3'],['Dexterity-save-prof','false'],['Constitution-save','4'],['Constitution-save-prof','true'],['Intelligence-save','0'],['Intelligence-save-prof','false'],['Wisdom-save','0'],['Wisdom-save-prof','false'],['Charisma-save','5'],['Charisma-save-prof','true'],['maxhp','8'],['menos','-'],['currenthp',''],['mas','+'],['menos','-'],['temphp',''],['mas','+'],['atkname1','Salpicadura de ácido'],['atkbonus1','5'],['atkdamage1','1d6'],['atkname2',''],['atkbonus2',''],['atkdamage2',''],['atkname3',''],['atkbonus3',''],['atkdamage3',''],['Acrobatics','3'],['Acrobatics-prof','false'],['Animal_Handling','0'],['Animal_Handling-prof','false'],['Arcana','2'],['Arcana-prof','true'],['Athletics','-1'],['Athletics-prof','false'],['Deception','5'],['Deception-prof','true'],['History','0'],['History-prof','false'],['Insight','0'],['Insight-prof','false'],['Intimidation','3'],['Intimidation-prof','false'],['Investigation','0'],['Investigation-prof','false'],['Medicine','4'],['Medicine-prof','false'],['Nature','0'],['Nature-prof','false'],['Perception','0'],['Perception-prof','false'],['Performance','3'],['Performance-prof','false'],['Persuasion','5'],['Persuasion-prof','true'],['Religion','0'],['Religion-prof','false'],['Sleight of Hand','5'],['Sleight_of_Hand-prof','true'],['Stealth','3'],['Stealth-prof','false'],['Survival','0'],['Survival-prof','false'],['cp',''],['sp',''],['ep',''],['gp',''],['pp',''],['otherprofs','Suerte: cuando obtienes un 1 en una tirada de ataque, prueba de característica o tirada de salvación puedes volver a tirar el dado y debes usar la puntuación obtenida en la nueva tirada.<br>Valiente: tienes ventaja en tiradas de salvación en contra de ser asustado.<br>Sigiloso por naturaleza: puedes intentar esconderte incluso cuando solamente estás escondido tras una criatura que es al menos un tamaño más grande que tú. <br>Identidad falsa: Te has creado una segunda identidad que incluye documentación, citas establecidas y disfraces que te permiten asumir ese personaje.<br><br>Mareas de caos:<br>A partir del nivel 1 puedes manipular las fuerzas de la probabilidad y del caos para ganar ventaja en una tirada de ataque, prueba de habilidad o tirada de salvación. Una vez hecho esto, necesitas finalizar un descanso prolongado antes de usar este rasgo otra vez. En cualquier momento, antes de recuperar el uso de este rasgo, el DM puede hacerte tirar en la tabla de oleada de magia salvaje inmediatamente después de que lances un conjuro de hechicero de nivel 1 o superior. Después de esto, recuperas el uso de este rasgo.'],['equipment',''],['personality','Mr. Pirs es sin duda el señor con la mente máss clara y aguda de toda su raza, es... sublime...'],['ideals','Mostrar al mundo lo increíble que es el Sr. Pirs'],['bonds','Mr. Pirs no necesita a nadie'],['flaws','Mr. Pirs no tiene defectos, salvo quizá la modestia.'],['features','*Mano del mago* (Truco)<br>Alcance: 30 pies. Duración: 1 minuto<br>Una mano espectral aparece flotando en un punto que elijas dentro del alcance. La mano dura mientras lo haga el conjuro o hasta que la disipes como acción. La mano se desvanece si está a más de 30 pies de ti o si vuelves a lanzar este conjuro.<br><br>*Prestidigitación* (Truco)<br>Alcance: 10 pies. Duración: 1 hora<br>· Creas un efecto sensorial instantáneo e inofensivo, como una lluvia de chispas, una ráfaga de viento, notas musicales suaves o un olor raro.<br>· Enciendes o apagas una vela, una antorcha o una pequeña hoguera instantáneamente.<br>· Limpias o ensucias un objeto que no sea mayor que 1 pie cúbico instantáneamente.<br>· Enfrías, calientas o das sabor a 1 pie cúbico de material inerte durante 1 hora.<br>· Haces que aparezca un color, una marca o un símbolo en un objeto o en una superficie durante una hora.<br>· Creas una baratija no mágica o una imagen ilusoria que cabe en tu mano y que dura hasta el final de tu siguiente turno.<br><br>*Reparar* (Truco)<br>Alcance: Toque. Duración: Instantáneo<br>Este conjuro repara una única rotura o rasgadura de un objeto que tocas, como una malla metálica rota, las dos mitades de una llave, una capa rasgada o una bota de vino que gotea. Mientras la rotura o rasgadura no sea mayor de 1 pie en cualquier dimensión, la remiendas y no dejas ningún rastro del daño anterior.<br><br>*Salpicadura de ácido* (Truco)<br>Alcance: 60 pies. Tirada de salvación: Destreza niega. Ataque: Contra salvación 1d6 ácido<br>Lanzas un orbe de ácido. Elige una criatura o dos criaturas dentro del alcance que se encuentren a 5 pies o menos entre sí. El objetivo debe superar una tirada de salvación de Destreza para no recibir 1d6 puntos de daño por ácido.<br><br>*Proyectil mágico* (Nivel 1)<br>Alcance: 120 pies. Duración: Instantáneo<br>Creas tres dardos brillantes de fuerza mágica. Cada dardo alcanza a una criatura de tu elección que puedas ver dentro del alcance. Cada dardo inflige 1d4 + 1 puntos de daño por fuerza. Todos los dardos se disparan al mismo tiempo y puedes dirigirlos a una criatura o a varias.<br><br>*Rociada de color* (Nivel 1)<br>Alcance: Personal (15 pies)<br>Un cegador haz de luz intermitente y colorido surge de tu mano. Tira 6d10: el resultado indica cuántos puntos de golpe de criaturas puede afectar este conjuro. Las criaturas que se encuentren dentro de un cono de 15 pies cuyo origen seas tú quedan afectadas en orden ascendente de acuerdo a sus puntos de golpe actuales (ignora a las criatura inconscientes y a las que no pueden ver).<br>A partir de la criatura que tiene menos puntos de golpe actuales, cada criatura afectada por este conjuro queda cegada hasta que termina el conjuro. Réstale al total los puntos de golpe de cada criatura antes de pasar a la siguiente criatura con menos puntos de golpe. Para afectar a una criatura, su número de puntos de golpe debe ser igual o menor que el total restante.'],];

var mrpirs_en = [['classlevel','Sorcerer 1'],['background','Charlatan'],['playername','Mr. Pirs '],['race','Halfling'],['alignment','Neutral Evil'],['experiencepoints',''],['Strengthscore','8'],['Strengthmod','-1'],['Dexterityscore','16'],['Dexteritymod','3'],['Constitutionscore','14'],['Constitutionmod','2'],['Intelligencescore','10'],['Intelligencemod','0'],['Wisdomscore','10'],['Wisdommod','0'],['Charismascore','16'],['Charismamod','3'],['ac','13'],['initiative','3'],['speed','25'],['pwisndowm','10'],['profbonus','2'],['inspiration','1'],['Strength-save','-1'],['Strength-save-prof','false'],['Dexterity-save','3'],['Dexterity-save-prof','false'],['Constitution-save','4'],['Constitution-save-prof','true'],['Intelligence-save','0'],['Intelligence-save-prof','false'],['Wisdom-save','0'],['Wisdom-save-prof','false'],['Charisma-save','5'],['Charisma-save-prof','true'],['maxhp','8'],['menos','-'],['currenthp',''],['mas','+'],['menos','-'],['temphp',''],['mas','+'],['atkname1','Acid Splash'],['atkbonus1','5'],['atkdamage1','1d5'],['atkname2',''],['atkbonus2',''],['atkdamage2',''],['atkname3',''],['atkbonus3',''],['atkdamage3',''],['Acrobatics','3'],['Acrobatics-prof','false'],['Animal_Handling','0'],['Animal_Handling-prof','false'],['Arcana','2'],['Arcana-prof','true'],['Athletics','-1'],['Athletics-prof','false'],['Deception','5'],['Deception-prof','true'],['History','0'],['History-prof','false'],['Insight','0'],['Insight-prof','false'],['Intimidation','3'],['Intimidation-prof','false'],['Investigation','0'],['Investigation-prof','false'],['Medicine','4'],['Medicine-prof','false'],['Nature','0'],['Nature-prof','false'],['Perception','0'],['Perception-prof','false'],['Performance','3'],['Performance-prof','false'],['Persuasion','5'],['Persuasion-prof','true'],['Religion','0'],['Religion-prof','false'],['Sleight of Hand','5'],['Sleight_of_Hand-prof','true'],['Stealth','3'],['Stealth-prof','false'],['Survival','0'],['Survival-prof','false'],['cp',''],['sp',''],['ep',''],['gp',''],['pp',''],['otherprofs','Lucky<br>Brave<br>Halfling Nimbleness<br>Naturally Stealth<br>False Identity<br>Spellcasting<br>Sorcerous Origin: Wild Magic<br>-Wild Magic Surge<br>Tides of Chaos.'],['equipment','Begins as prisoner'],['personality','Mr. Pirs is the most delightfull, eminent, clear minded, of all Halflinghood'],['ideals','Showing the world how awesome Mr. Pirs is.'],['bonds','Mr. Pirs, what else!'],['flaws','Flaws? Mr. Pirs is flawless!'],['features','Cantrips:<br>*Acid Splash*<br>*Mage Hand*<br>*Mending*<br>*Prestidigitation*<br><br>Level 1 (2 slots)<br>*Color Spray*<br>*Magic Missile*'],];

var raghar_es = [['classlevel','Explorador 1'],['background','Salvaje'],['playername','Raghar'],['race','Semielfo'],['alignment','Neutral Bueno'],['experiencepoints',''],['Strengthscore','14'],['Strengthmod','2'],['Dexterityscore','16'],['Dexteritymod','3'],['Constitutionscore','12'],['Constitutionmod','1'],['Intelligencescore','10'],['Intelligencemod',''],['Wisdomscore','13'],['Wisdommod','1'],['Charismascore','12'],['Charismamod','1'],['ac','13'],['initiative','3'],['speed','30'],['pwisndowm','13'],['profbonus','2'],['inspiration','1'],['Strength-save','4'],['Strength-save-prof','true'],['Dexterity-save','5'],['Dexterity-save-prof','true'],['Constitution-save','1'],['Constitution-save-prof','false'],['Intelligence-save','0'],['Intelligence-save-prof','false'],['Wisdom-save','1'],['Wisdom-save-prof','false'],['Charisma-save','1'],['Charisma-save-prof','false'],['maxhp','11'],['menos','-'],['currenthp',''],['mas','+'],['menos','-'],['temphp',''],['mas','+'],['atkname1','Espada larga'],['atkbonus1','4'],['atkdamage1','1d8+2'],['atkname2','Arco largo'],['atkbonus2','5'],['atkdamage2','1d8+3'],['atkname3',''],['atkbonus3',''],['atkdamage3',''],['Acrobatics','5'],['Acrobatics-prof','true'],['Animal_Handling','3'],['Animal_Handling-prof','true'],['Arcana','0'],['Arcana-prof','false'],['Athletics','4'],['Athletics-prof','true'],['Deception','1'],['Deception-prof','false'],['History','0'],['History-prof','false'],['Insight','3'],['Insight-prof','false'],['Intimidation','0'],['Intimidation-prof','false'],['Investigation','0'],['Investigation-prof','false'],['Medicine','1'],['Medicine-prof','false'],['Nature','2'],['Nature-prof','true'],['Perception','3'],['Perception-prof','true'],['Performance','1'],['Performance-prof','false'],['Persuasion','0'],['Persuasion-prof','false'],['Religion','0'],['Religion-prof','false'],['Sleight of Hand','1'],['Sleight_of_Hand-prof','false'],['Stealth','5'],['Stealth-prof','true'],['Survival','3'],['Survival-prof','true'],['cp',''],['sp','20'],['ep',''],['gp',''],['pp',''],['otherprofs','Vagabundo:<br>Tienes una excelente memoria para los mapas y la geografía y siempre puedes recordar la disposición general del terreno, los asentamientos y otras circunstancias de entorno que te rodea. Además, puedes encontrar comida y agua fresca para ti y para otras cinco personas cada día, siempre y cuando la tierra tenga bayas, algo de caza menor, agua y cosas por el estilo.<br><br>Enemigo predilecto: Humanos, elfos<br>A partir del nivel 1, tienes una experiencia notable estudiando, rastreando, cazando e incluso hablando con un cierto tipo de enemigo. Elige un tipo de enemigo predilecto: aberraciones, bestias, celestiales, constructos, fatas, gigantes, infernales, limos, monstruosidades, no muertos o plantas. Como alternativa, puedes seleccionar dos razas de humanoides (como gnolls u orcos) como enemigos predilectos. Tienes ventaja en las pruebas de Sabiduría (Supervivencia) para rastrear a tus enemigos predilectos, así como en las pruebas de Inteligencia para recordar información sobre ellos.'],['equipment',''],['personality','Me siento más a gusto con animales que con personas'],['ideals','Cambio. El mundo está en constante cambio y nosotros debemos movernos a su son'],['bonds','Soy un bastardo, debo asegurarme de que mi nombre cree su propia leyenda.'],['flaws','Recuerdo cada insulto recibido y espero poder resarcirme.'],['features','Explorador de la naturaleza<br>Estás especialmente familiarizado con un tipo de entorno natural y eres experto viajando y sobreviviendo en tales regiones. Elige un tipo de terreno predilecto: ártico, bosque, costa, desierto, montaña, pantano o pradera. Cuando hagas una prueba de Inteligencia o de Sabiduría relacionada con tu terreno predilecto, tu bonificador por competencia se multiplica por 2 si estás usando una habilidad con la que tienes competencia.<br><br>Si viajas durante una hora o más por tu terreno predilecto, consigues los siguientes beneficios:<br><br>El terreno difícil no reduce la velocidad de tu grupo de viaje.<br>Tu grupo no puede perderse, salvo por medios mágicos.<br>Incluso si estás haciendo otra actividad mientras viajas (como buscar comida, navegar o rastrear), sigues estando alerta ante el peligro.<br>Si viajas solo, puedes moverte con sigilo a un ritmo normal.<br>Cuando buscas comida, encuentras el doble de la comida que encontrarías normalmente.<br>Mientras rastreas a otras criaturas, también puedes saber su número exacto, su tamaño y cuánto tiempo hace que pasaron por la zona.'],];

var raghar_en = [['classlevel','Ranger 1'],['background','Outlander'],['playername','Raghar'],['race','Half-elf'],['alignment','Neutral Good'],['experiencepoints',''],['Strengthscore','14'],['Strengthmod','2'],['Dexterityscore','16'],['Dexteritymod','3'],['Constitutionscore','12'],['Constitutionmod','1'],['Intelligencescore','10'],['Intelligencemod','0'],['Wisdomscore','13'],['Wisdommod','1'],['Charismascore','12'],['Charismamod','1'],['ac','13'],['initiative','3'],['speed','30'],['pwisndowm','13'],['profbonus','2'],['inspiration','1'],['Strength-save','4'],['Strength-save-prof','true'],['Dexterity-save','5'],['Dexterity-save-prof','true'],['Constitution-save','1'],['Constitution-save-prof','false'],['Intelligence-save','0'],['Intelligence-save-prof','false'],['Wisdom-save','1'],['Wisdom-save-prof','false'],['Charisma-save','1'],['Charisma-save-prof','false'],['maxhp','11'],['menos','-'],['currenthp',''],['mas','+'],['menos','-'],['temphp',''],['mas','+'],['atkname1','Longsword'],['atkbonus1','4'],['atkdamage1','1d8+2'],['atkname2','Longbow'],['atkbonus2','5'],['atkdamage2','1d8+3'],['atkname3',''],['atkbonus3',''],['atkdamage3',''],['Acrobatics','5'],['Acrobatics-prof','true'],['Animal_Handling','3'],['Animal_Handling-prof','true'],['Arcana','0'],['Arcana-prof','false'],['Athletics','4'],['Athletics-prof','true'],['Deception','1'],['Deception-prof','false'],['History','0'],['History-prof','false'],['Insight','3'],['Insight-prof','false'],['Intimidation','0'],['Intimidation-prof','false'],['Investigation','0'],['Investigation-prof','false'],['Medicine','1'],['Medicine-prof','false'],['Nature','2'],['Nature-prof','true'],['Perception','3'],['Perception-prof','true'],['Performance','1'],['Performance-prof','false'],['Persuasion','0'],['Persuasion-prof','false'],['Religion','0'],['Religion-prof','false'],['Sleight of Hand','1'],['Sleight_of_Hand-prof','false'],['Stealth','5'],['Stealth-prof','true'],['Survival','3'],['Survival-prof','true'],['cp',''],['sp','20'],['ep',''],['gp',''],['pp',''],['otherprofs','Darkvision<br>Fey ancestry<br>Skill versatility (Acrobatics, Insight)<br>Favored enemy (Humans, Elves)<br>Natural explorer (mountain)'],['equipment','Begins as prisioner'],['personality','I feel far more comfortable around animals than people'],['ideals','Change. Life is like the seasons, in constant change, and we must change with it'],['bonds','I am a bastard, and its up to me to ensure my name enter legend.'],['flaws','I remember every insult I have received and nurse a silent resentment toward anyone whos ever wrong me.'],['features',''],];

var wilbur_es = [['classlevel','Pícaro 1'],['background','Criminal'],['playername','Wilbur'],['race','Humano'],['alignment','Neutral Malvado'],['experiencepoints','0'],['Strengthscore','12'],['Strengthmod','1'],['Dexterityscore','16'],['Dexteritymod','3'],['Constitutionscore','14'],['Constitutionmod','2'],['Intelligencescore','15'],['Intelligencemod','2'],['Wisdomscore','12'],['Wisdommod','1'],['Charismascore','9'],['Charismamod','-1'],['ac','14'],['initiative','3'],['speed','30'],['pwisndowm','13'],['profbonus',''],['inspiration','1'],['Strength-save','1'],['Strength-save-prof','false'],['Dexterity-save','5'],['Dexterity-save-prof','true'],['Constitution-save','2'],['Constitution-save-prof','false'],['Intelligence-save','4'],['Intelligence-save-prof','true'],['Wisdom-save','1'],['Wisdom-save-prof','false'],['Charisma-save','-1'],['Charisma-save-prof','false'],['maxhp','10'],['menos','-'],['currenthp',''],['mas','+'],['menos','-'],['temphp',''],['mas','+'],['atkname1','Espada ropera'],['atkbonus1','5'],['atkdamage1','1d8+3'],['atkname2','Arco corto'],['atkbonus2','5'],['atkdamage2','1d6+3'],['atkname3','Daga'],['atkbonus3','5'],['atkdamage3','1d6+3'],['Acrobatics','7'],['Acrobatics-prof','true'],['Animal_Handling','1'],['Animal_Handling-prof','false'],['Arcana','2'],['Arcana-prof','false'],['Athletics','3'],['Athletics-prof','true'],['Deception','1'],['Deception-prof','true'],['History','1'],['History-prof','false'],['Insight','1'],['Insight-prof','false'],['Intimidation','-1'],['Intimidation-prof','false'],['Investigation','4'],['Investigation-prof','true'],['Medicine','1'],['Medicine-prof','false'],['Nature','2'],['Nature-prof','false'],['Perception','3'],['Perception-prof','true'],['Performance','-1'],['Performance-prof','false'],['Persuasion','-1'],['Persuasion-prof','false'],['Religion','2'],['Religion-prof','false'],['Sleight of Hand','3'],['Sleight_of_Hand-prof','false'],['Stealth','7'],['Stealth-prof','true'],['Survival','2'],['Survival-prof','false'],['cp',''],['sp','20'],['ep',''],['gp',''],['pp',''],['otherprofs','Sabes aprovechar la distracción de un enemigo para atacarlo por la espalda. Una vez por turno, puedes infligir daño adicional a una criatura a la que impactes con un ataque si tienes ventaja en la tirada de ataque. El ataque debe usar un arma sutil o a distancia. Este rasgo funciona aunque no tengas ventaja en la tirada de ataque si otro enemigo del objetivo no incapacitado está a menos de 5 pies de él y si tú no tienes desventaja en la tirada de ataque.<br><br>La cantidad de daño adicional aumenta conforme subes de nivel en esta clase. Nivel 1: Daño adicional: 1d6<br><br>Germanía<br>Durante tu entrenamiento como pícaro, aprendes la germanía, una mezcla de dialecto, jerga y código secretos que te permite enviar mensajes en una conversación aparentemente normal. Solo otra criatura que conozca la germanía puede entender tales mensajes. Transmitir un mensaje de este tipo cuesta cuatro veces más que decir la misma idea directamente. Además, entiendes una serie de signos y símbolos que se usan para esconder mensajes cortos y sencillos, como si un área es peligrosa o es territorio de un gremio de ladrones, si hay un botín cerca o si las gentes que viven en la zona son presas fáciles u ofrecerán cobijo a un ladrón a la fuga.'],['equipment','Herramientas de ladrón'],['personality','No me gusta el riesgo, no me molestes con las probabilidades.'],['ideals','Haré lo que sea necesario para lograr ser rico.'],['bonds','Lograré ser el mejor ladrón que ha conocido este mundo.'],['flaws','Cuando veo algo valioso no puedo evitar ir a por ello.'],['features',''],];

var wilbur_en = [["classlevel","Rogue 1"],["background","Criminal"],["playername","Wilbur"],["race","Human"],["alignment","Neutral Evil"],["experiencepoints","0"],["Strengthscore","12"],["Strengthmod","1"],["Dexterityscore","16"],["Dexteritymod","3"],["Constitutionscore","14"],["Constitutionmod","2"],["Intelligencescore","15"],["Intelligencemod","2"],["Wisdomscore","12"],["Wisdommod","1"],["Charismascore","9"],["Charismamod","-1"],["ac","14"],["initiative","3"],["speed","30"],["pwisndowm","13"],["profbonus",""],["inspiration","1"],["Strength-save","1"],["Strength-save-prof","false"],["Dexterity-save","5"],["Dexterity-save-prof","true"],["Constitution-save","2"],["Constitution-save-prof","false"],["Intelligence-save","4"],["Intelligence-save-prof","true"],["Wisdom-save","1"],["Wisdom-save-prof","false"],["Charisma-save","-1"],["Charisma-save-prof","false"],["maxhp","10"],["menos","-"],["currenthp",""],["mas","+"],["menos","-"],["temphp",""],["mas","+"],["atkname1","Rapier"],["atkbonus1","5"],["atkdamage1","1d8+3"],["atkname2","Short bow"],["atkbonus2","5"],["atkdamage2","1d6+3"],["atkname3","Dagger"],["atkbonus3","5"],["atkdamage3","1d6+3"],["Acrobatics","7"],["Acrobatics-prof","true"],["Animal_Handling","1"],["Animal_Handling-prof","false"],["Arcana","2"],["Arcana-prof","false"],["Athletics","3"],["Athletics-prof","true"],["Deception","1"],["Deception-prof","true"],["History","1"],["History-prof","false"],["Insight","1"],["Insight-prof","false"],["Intimidation","-1"],["Intimidation-prof","false"],["Investigation","4"],["Investigation-prof","true"],["Medicine","1"],["Medicine-prof","false"],["Nature","2"],["Nature-prof","false"],["Perception","3"],["Perception-prof","true"],["Performance","-1"],["Performance-prof","false"],["Persuasion","-1"],["Persuasion-prof","false"],["Religion","2"],["Religion-prof","false"],["Sleight of Hand","3"],["Sleight_of_Hand-prof","false"],["Stealth","7"],["Stealth-prof","true"],["Survival","2"],["Survival-prof","false"],["cp",""],["sp","20"],["ep",""],["gp",""],["pp",""],["otherprofs","Criminal contact<br>Expertise (Stealth, Thieve's tools)."],["equipment","Thieve's tools"],["personality","I don't pay atention to the risks in a situation. Never tell me the odds."],["ideals","Greed. I will do whatever it takes to became walthy."],["bonds","I will became the greatest thief that ever lived."],["flaws","When I see something valuable, I can't think about anything but how to steal it."],["features",""],];

var yonsee_es = [['classlevel','Mago 1'],['background','Erudito'],['playername','Yonsee'],['race','Humano'],['alignment','Caótico Bueno'],['experiencepoints',''],['Strengthscore','10'],['Strengthmod','-1'],['Dexterityscore','14'],['Dexteritymod','2'],['Constitutionscore','16'],['Constitutionmod','3'],['Intelligencescore','16'],['Intelligencemod','3'],['Wisdomscore','12'],['Wisdommod','1'],['Charismascore','9'],['Charismamod','-1'],['ac','15'],['initiative','2'],['speed','30'],['pwisndowm','11'],['profbonus','2'],['inspiration','1'],['Strength-save','-1'],['Strength-save-prof','false'],['Dexterity-save','2'],['Dexterity-save-prof','false'],['Constitution-save','3'],['Constitution-save-prof','false'],['Intelligence-save','5'],['Intelligence-save-prof','true'],['Wisdom-save','3'],['Wisdom-save-prof','true'],['Charisma-save','-1'],['Charisma-save-prof','false'],['maxhp','9'],['menos','-'],['currenthp',''],['mas','+'],['menos','-'],['temphp',''],['mas','+'],['atkname1','Bastón'],['atkbonus1','2'],['atkdamage1','1d6+2'],['atkname2','Descarga de fuego'],['atkbonus2','5'],['atkdamage2','1d10 / Fuego'],['atkname3',''],['atkbonus3',''],['atkdamage3',''],['Acrobatics','2'],['Acrobatics-prof','false'],['Animal_Handling','3'],['Animal_Handling-prof','false'],['Arcana','5'],['Arcana-prof','true'],['Athletics','0'],['Athletics-prof','false'],['Deception','-1'],['Deception-prof','false'],['History','5'],['History-prof','true'],['Insight','3'],['Insight-prof','false'],['Intimidation','-1'],['Intimidation-prof','false'],['Investigation','5'],['Investigation-prof','true'],['Medicine','3'],['Medicine-prof','false'],['Nature','1'],['Nature-prof','false'],['Perception','3'],['Perception-prof','false'],['Performance','-1'],['Performance-prof','false'],['Persuasion','-1'],['Persuasion-prof','false'],['Religion','5'],['Religion-prof','true'],['Sleight of Hand','2'],['Sleight_of_Hand-prof','false'],['Stealth','2'],['Stealth-prof','false'],['Survival','3'],['Survival-prof','false'],['cp',''],['sp','20'],['ep',''],['gp',''],['pp',''],['otherprofs','Recuperación arcana:<br>Has aprendido a recuperar parte de tu energía arcana estudiando tu libro de conjuros. Una vez por día, cuando hagas un descanso breve, puedes recuperar espacios de conjuro. Los espacios de conjuro pueden tener un nivel combinado igual o menor que la mitad de tu nivel de mago (redondeando hacia arriba) y, como máximo, nivel 5.'],['equipment',''],['personality','He leído cada libro de la biblioteca que se me ha permitido.'],['ideals','No hay límites.'],['bonds','Vendí mi alma al conocimiento y espero obtener algo a cambio.'],['flaws','Desatar el poder de un antiguo misterio merece la pena por encima de todo.'],['features','*Descarga de fuego* (Truco) 120 pies<br>Tras acertar un ataque de conjuro a distancia a una criatura u objeto, éste recibe 1d10 puntos de daño por fuego. Incinera objetos inflamables si nadie lo lleva o transporta.<br><br>*Luz* (Truco) 1 hora<br>Un objeto de no más de 10 pies emite luz brillante del color que quieras en un radio de 20 pies y luz tenue en 20 pies adicionales. Si el portador del objeto es hostil, debe superar una TS de Destreza para evitar el conjuro.<br><br>*Mano del mago* (Truco) 1 minuto. 30 pies<br>Una mano espectral aparece flotando. Puedes usar tu acción para controlarla, manipular un objeto, abrir una puerta. etc. Puedes moverla 30 pies cada vez que la usas. No puede atacar, activar objetos mágicos ni transportar más de 10 libras.<br><br>*Armadura de mago* (Nv. 1) 8 horas<br>Tocas a una criatura voluntaria que no lleve armadura y una fuerza protectora mágica la rodea hasta que el conjuro termina. Su CA base pasa a ser 13 + su modificador por Destreza. El conjuro termina si el objetivo se pone una armadura o si, como acción, disipas el conjuro.<br><br>*Detectar magia* (Nv. 1) Concentración 10 minutos<br>Sientes la presencia de la magia hasta a 30 pies de ti. Si sientes alguna magia, puedes usar tu acción para ver una débil aura alrededor de cualquier criatura u objeto visible dentro del área que la tenga, y puedes averiguar de qué escuela es, si la tiene.<br><br>*Dormir* (Nv. 1) 90 pies<br>Este conjuro sume a las criaturas en un sueño ligero. Duerme 5d8 (+2d8/nivel de conjuro por encima de 1) puntos de golpe de criaturas que se encuentren a 20 pies o menos de un punto que elijas, por orden ascendente de sus puntos de golpe (ignorando inconscientes).<br><br>*Encontrar familiar* (Nv. 1)<br>Consigues el servicio de un familiar, un espíritu con la forma animal que elijas. Actúa de manera independiente, pero obedece tus órdenes. No puede atacar, pero puede realizar otras acciones. Como acción si está a menos de 100 pies, puedes ver a través de sus ojos y comunicarte telepáticamente.<br><br>*Identificar* (Nv. 1)<br>Tocas un objeto mágico para aprender sus propiedades, modo de uso, necesidad de sintonización para usarlo y cargas restantes, si las tiene. También descubres el conjuro que le afecte o que lo ha creado. Si tocas una criatura, aprendes qué conjuros le afectan en ese momento.<br><br>*Manos ardientes* (Nv. 1)<br>Creas una lámina de fuego en un cono de 15 pies. Las criaturas afectadas deben superar una TS de salvación de Destreza. Si fallan, reciben 3d6 (+1d6 por nivel de conjuro por encima de 1) puntos de daño por fuego y, si tienen éxito, la mitad.'],];

var yonsee_en = [['classlevel','Wizard 1'],['background','Sage'],['playername','Yonsee'],['race','Human'],['alignment','Chaotic Good'],['experiencepoints',''],['Strengthscore','10'],['Strengthmod','-1'],['Dexterityscore','14'],['Dexteritymod','2'],['Constitutionscore','16'],['Constitutionmod','3'],['Intelligencescore','16'],['Intelligencemod','3'],['Wisdomscore','12'],['Wisdommod','1'],['Charismascore','9'],['Charismamod','-1'],['ac','15'],['initiative','2'],['speed','30'],['pwisndowm','11'],['profbonus','2'],['inspiration','1'],['Strength-save','-1'],['Strength-save-prof','false'],['Dexterity-save','2'],['Dexterity-save-prof','false'],['Constitution-save','3'],['Constitution-save-prof','false'],['Intelligence-save','5'],['Intelligence-save-prof','true'],['Wisdom-save','3'],['Wisdom-save-prof','true'],['Charisma-save','-1'],['Charisma-save-prof','false'],['maxhp','9'],['menos','-'],['currenthp',''],['mas','+'],['menos','-'],['temphp',''],['mas','+'],['atkname1','Staff'],['atkbonus1','2'],['atkdamage1','1d6+2'],['atkname2','Flame Strike'],['atkbonus2','5'],['atkdamage2','1d10 / Fuego'],['atkname3',''],['atkbonus3',''],['atkdamage3',''],['Acrobatics','2'],['Acrobatics-prof','false'],['Animal_Handling','3'],['Animal_Handling-prof','false'],['Arcana','5'],['Arcana-prof','true'],['Athletics','0'],['Athletics-prof','false'],['Deception','-1'],['Deception-prof','false'],['History','5'],['History-prof','true'],['Insight','3'],['Insight-prof','false'],['Intimidation','-1'],['Intimidation-prof','false'],['Investigation','5'],['Investigation-prof','true'],['Medicine','3'],['Medicine-prof','false'],['Nature','1'],['Nature-prof','false'],['Perception','3'],['Perception-prof','false'],['Performance','-1'],['Performance-prof','false'],['Persuasion','-1'],['Persuasion-prof','false'],['Religion','5'],['Religion-prof','true'],['Sleight of Hand','2'],['Sleight_of_Hand-prof','false'],['Stealth','2'],['Stealth-prof','false'],['Survival','3'],['Survival-prof','false'],['cp',''],['sp','20'],['ep',''],['gp',''],['pp',''],['otherprofs','Researcher<br>Spellcasting<br>Arcane Recovery'],['equipment','Spellbook<br>Staff'],['personality','I have read every book in the school of magic of Salorium.'],['ideals','No limits. Nothing should fetter the infinite possibility inherent in all existence.'],['bonds','I sold my soul for knowledge. I hope to do great deeds and win in back'],['flaws','Unlocking an ancient mystery is worth the price of a civilization.'],['features','Cantrips:<br>*Fire Bolt*<br>*Light*<br>*Mage Hand*<br><br>Level 1 (2 slots)<br>*Burning Hands*<br>*Detect Magic*<br>*Find Familiar*<br>*Identify*<br>*Mage Armor*<br>*Sleep*'],];

var ficha_es = [['labelhelp','pulsa para continuar o arrastra de nuevo o'],['exit','salir'],['nowebglinside','WebGL no soportado, no puede realizarse la animación de dados'],['sethelp','Elige uno o más dados pulsando en él.<br>Pulsa y arrastra hacia un espacio libre o pulsa lanzar para tirar de nuevo.'],['clear','limpiar'],['throw','lanzar'],['exit2','salir'],['lbl_create','¿Crear un nuevo personaje o sobreescribir el existente?'],['lbl_update','ACTUALIZAR'],['lbl_new','NUEVO'],['lbl_delete','¿Borrar el personaje actual?'],['lbl_yes','SÍ'],['lbl_cancel','CANCELAR'],['lbl_classlevel','Clase y nivel'],['lbl_background','Trasfondo'],['lbl_charactername','Nombre'],['lbl_race','Raza'],['lbl_alignment','Alineamiento'],['lbl_experiencepoints','PX'],['lbl_Strengthscore','FUE'],['lbl_Dexterityscore','DES'],['lbl_Constitutionscore','CON'],['lbl_Intelligencescore','INT'],['lbl_Wisdomscore','SAB'],['lbl_Charismascore','CAR'],['lbl_ac','CA'],['lbl_initiative','Iniciat.'],['lbl_speed','Veloc.'],['lbl_pwisndowm','Per. pasiva'],['lbl_profbonus','Bono de compet.'],['lbl_inspiration','Inspirac.'],['lbl_savingthrows','Tiradas de salvación'],['lbl_Strength-save','Fuerza'],['lbl_Dexterity-save','Destreza'],['lbl_Constitution-save','Constitución'],['lbl_Intelligence-save','Inteligencia'],['lbl_Wisdom-save','Sabiduría'],['lbl_Charisma-save','Carisma'],['lbl_maxhp','P.G. Máximos'],['lbl_currenthp','P.G. Actuales'],['lbl_temphp','P.G.Temporales'],['lbl_attacks','Ataques'],['lbl_nameatk','Nombre'],['lbl_atkbonus','Bono de ataque'],['lbl_dmgtype','Daño / Tipo'],['lbl_Acrobatics','Acrobacias'],['lbl_Animal_Handling','Manejo de animales'],['lbl_Arcana','Conoc. Arcano'],['lbl_Athletics','Atletismo'],['lbl_Deception','Engaño'],['lbl_History','Historia'],['lbl_Insight','Perspicacia'],['lbl_Intimidation','Intimidación'],['lbl_Investigation','Investigación'],['lbl_Medicine','Medicina'],['lbl_Nature','Naturaleza'],['lbl_Perception','Percepción'],['lbl_Performance','Interpretación'],['lbl_Persuasion','Persuasión'],['lbl_Religion','Religión'],['lbl_Sleight_of_Hand','Juego de manos'],['lbl_Stealth','Sigilo'],['lbl_Survival','Supervivencia'],['lbl_featTraits','Otros aspectos'],['lbl_equipment','Equipo'],['lbl_cp','mc'],['lbl_sp','mp'],['lbl_ep','me'],['lbl_gp','mo'],['lbl_pp','mpt'],['lbl_personality','PERSONALIDAD'],['lbl_ideals','IDEALES'],['lbl_bonds','VÍNCULOS'],['lbl_flaws','DEFECTOS'],['lbl_features','HECHIZOS Y OTRAS COMPETENCIAS'],];