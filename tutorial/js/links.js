var MaxNpcs = 8;
var aventura = "salorium"
var mainmap = "salorium";
var debug = "off";

 // 32 x 4
var default_game_state = "0000";
var salt = 34587757654943352;
var minindex = ["@resumen","@bienvenido","@licencia"];
var languages = ['es','en'];

function colorReplace(text) {

    return text;
}

function translation(content_file, page) {
 
    if (page == "index-flow.html") {      
        if (content_file.indexOf("-es") > -1) {
            try {
 document.getElementsByTagName('a')[0].innerHTML  = "Comienza la Aventura";        
 document.getElementsByTagName('a')[1].innerHTML  = "Ataque a la Escuela";           
 document.getElementsByTagName('a')[2].innerHTML  = "La Torre de Vigilancia";             
 document.getElementsByTagName('a')[3].innerHTML  = "Buscando a los Culpables";      
 document.getElementsByTagName('a')[4].innerHTML  = "Aposentos de Glaucom";           
 document.getElementsByTagName('a')[5].innerHTML  = "Hab. Maestro Nizgul";  
 document.getElementsByTagName('a')[6].innerHTML  = "Buscando a Doris";        
 document.getElementsByTagName('a')[7].innerHTML  = "Violencia en la Plaza";
 document.getElementsByTagName('a')[8].innerHTML  = "La Ballena Blanca";   
 document.getElementsByTagName('a')[9].innerHTML  = "El Prisionero";  
 document.getElementsByTagName('a')[10].innerHTML = "Cámara del Tesoro";       
 document.getElementsByTagName('a')[11].innerHTML = "<br>Buscando Huesos";    
 document.getElementsByTagName('a')[12].innerHTML = "El Cementerio"; 
 document.getElementsByTagName('a')[13].innerHTML = "<br>Conclusión";  
 document.getElementsByTagName('a')[14].innerHTML = "La Biblioteca";      
 document.getElementsByTagName('a')[15].innerHTML = "El Patio Sur";              
 document.getElementsByTagName('a')[16].innerHTML = "Alumnos Encerrados"; 
        } catch(e) {}
        }
    }
    return;
}

    
var aventuralinks_3a_es = [
 ["Buscar","SRD_Search_Skill.html#Search_.28Int.29"],
 ["buscan","SRD_Search_Skill.html#Search_.28Int.29"],
 ["Avistar","SRD_Spot_Skill.html#Spot_.28Wis.29"],
 ["Escuchar","SRD_Listen_Skill.html#Listen_.28Wis.29"],
 ["Conocimiento Arcano","SRD_Knowledge_Skill.html#Knowledge_.28Int.3B_Trained_Only.29"],
 ["Recabar Información","SRD_Gather_Information_Skill.html#Gather_Information_.28Cha.29"],    
 ["Historia","SRD_Knowledge_Skill.html#Knowledge_.28Int.3B_Trained_Only.29"],
 ["Conocimiento de la Naturaleza","SRD_Knowledge_Skill.html#Knowledge_.28Int.3B_Trained_Only.29"],    
 ["conocimiento","SRD_Knowledge_Skill.html#Knowledge_.28Int.3B_Trained_Only.29"],
 ["Detectar Magia","SRD_Detect_Magic.html#bodyContent"],
 ["Detectar el Mal","SRD_Detect_Evil.html#bodyContent"], 
 ["Detectar el Mal","SRD_Detect_Evil.html#bodyContent"], 
 ["Detectar Veneno","SRD_Detect_Poison.html"], 
 ["Detectar el mal/caos","SRD_Detect_Evil.html#bodyContent"], 
 ["Religión","SRD_Knowledge_Skill.html#Knowledge_.28Int.3B_Trained_Only.29"],
 ["Diplomacia","SRD_Diplomacy_Skill.html#Diplomacy_.28Cha.29"],
 ["Intimidación","SRD_Intimidate_Skill.html#Intimidate_.28Cha.29"],
 ["intimidarle","SRD_Intimidate_Skill.html#Intimidate_.28Cha.29"],
 ["Recabar Información","SRD_Gather_Information_Skill.html#Gather_Information_.28Cha.29"],
 ["Averiguar Intenciones","SRD_Sense_Motive_Skill.html#Sense_Motive_.28Wis.29"],
 ["Supervivencia","SRD_Survival_Skill.html#Survival_.28Wis.29"],
 ["Historia Local","SRD_Knowledge_Skill.html#Knowledge_.28Int.3B_Trained_Only.29"],
 ["escapismo","SRD_Escape_Artist_Skill.html#Escape_Artist_.28Dex.3B_Armor_Check_Penalty.29"],    
 ["Escalar","SRD_Climb_Skill.html#Climb_.28Str.3B_Armor_Check_Penalty.29"],    
 ["Fuerza","SRD_Ability_Check.html#Ability_Checks"], 
 ["oscuridades","SRD_Vision_and_Light.html#bodyContent"],
 ["oscuridad total","SRD_Vision_and_Light.html#bodyContent"],
 ["Esconderse","SRD_Hide_Skill.html#Hide_.28Dex.3B_Armor_Check_Penalty.29"], 
 ["Liderazgo","SRD_Leadership.html#Leadership_.5BGeneral.5D"], 
 ["esprinten","SRD_Movement.html#Evasion_and_Pursuit"], 
 ["tumbado","SRD_Prone.html"], 
 ["Abrir Cerraduras","SRD_Open_Lock_Skill.html#bodyContent"],
 ["cerradura","SRD_Open_Lock_Skill.html#bodyContent"],
 ["Curar","SRD_Heal_Skill.html#Heal_.28Wis.29"],
 ["sorprender","SRD_Initiative.html#Surprise"],
 ["escombros menores","SRD_Difficult_Terrain.html#Difficult_Terrain"],
 ["escombros densos","SRD_Difficult_Terrain.html#Difficult_Terrain"],
 ["libros de conjuros","SRD_Wizard's_Spellbook.html"],    
 ["hechizar","SRD_Charm_Person.html"],         
 ["Desmontar Trampas","SRD_Disable_Device_Skill.html"],            
 ["romper la puerta","SRD_Breaking_and_Entering.html#Breaking_and_Entering"],         
 ["romper una puerta","SRD_Breaking_and_Entering.html#Breaking_and_Entering"],         
 ["forzar la puerta","SRD_Breaking_and_Entering.html#Breaking_and_Entering"],         
 ["Sabiduría","SRD_Ability_Check.html#Ability_Checks"], 
 ["Inteligencia","SRD_Ability_Check.html#Ability_Checks"],
 ["habilidad de bardo","SRD_Bard.html#Bardic_Knowledge"],
 ["Identificar","SRD_Identify.html"],
 ["nado","SRD_Swim_Skill.html#bodyContent"],
 ["Nadar","SRD_Swim_Skill.html#bodyContent"],
 ["equilibrio","SRD_Balance_Skill.html#bodyContent"],
 ["trepar","SRD_Climb_Skill.html#Climb_.28Str.3B_Armor_Check_Penalty.29"],
 ["Pergaminos Menores","SRD_Scrolls.html#Table:_Scroll_Types"],
 ["Desintegrar","SRD_Disintegrate.html"],
 ["Pergaminos Medios","SRD_Scrolls.html#Table:_Scroll_Types"]
    
 ];

var aventuralinks_3a_en = [ 

["Autohypnosis","SRD_Autohypnosis_Skill.html"],
["Balance","SRD_Balance_Skill.html"],
["Bluff","SRD_Bluff_Skill.html"],
["Climb","SRD_Climb_Skill.html"],
["Concentration","SRD_Concentration_Skill.html"],
["Control Shape","SRD_Control_Shape_Skill.html"],
["Craft","SRD_Craft_Skill.html"],
["Decipher Script","SRD_Decipher_Script_Skill.html"],
["Diplomacy","SRD_Diplomacy_Skill.html"],
["Disable Device","SRD_Disable_Device_Skill.html"],
["Disguise","SRD_Disguise_Skill.html"],
["Escape Artist","SRD_Escape_Artist_Skill.html"],
["Forgery","SRD_Forgery_Skill.html"],
["Gather Information","SRD_Gather_Information_Skill.html"],
["Handle Animal","SRD_Handle_Animal_Skill.html"],
["Heal","SRD_Heal_Skill.html"],
["Hide","SRD_Hide_Skill.html"],
["Intimidate","SRD_Intimidate_Skill.html"],
["Jump","SRD_Jump_Skill.html"],
["Knowledge","SRD_Knowledge_Skill.html"],
["Local History","SRD_Knowledge_Skill.html"],
["Nature Knowledge","SRD_Knowledge_Skill.html#Knowledge_.28Int.3B_Trained_Only.29"],
["Listen","SRD_Listen_Skill.html"],
["Move Silently","SRD_Move_Silently_Skill.html"],
["Open Lock","SRD_Open_Lock_Skill.html"],
["Perform","SRD_Perform_Skill.html"],
["Psicraft","SRD_Psicraft_Skill.html"],
["Profession","SRD_Profession_Skill.html"],
["Knowledge Arcana","SRD_Knowledge_Skill.html#Knowledge_.28Int.3B_Trained_Only.29"],
["History","SRD_Knowledge_Skill.html#Knowledge_.28Int.3B_Trained_Only.29"],
["Ride","SRD_Ride_Skill.html"],
["Search","SRD_Search_Skill.html"],
["Sense Motive","SRD_Sense_Motive_Skill.html"],
["Sleight of Hand","SRD_Sleight_of_Hand_Skill.html"],
["Speak Language","SRD_Speak_Language_Skill.html"],
["Spellcraft","SRD_Spellcraft_Skill.html"],
["Spot","SRD_Spot_Skill.html"],
["Survival","SRD_Survival_Skill.html"],
["Swim","SRD_Swim_Skill.html"],
["Tumble","SRD_Tumble_Skill.html"],
["Use Magic Device","SRD_Use_Magic_Device_Skill.html"],
["Use Psionic Device","SRD_Use_Psionic_Device_Skill.html"],
["Use Rope","SRD_Use_Rope_Skill.html"],
["Darkness","SRD_Vision_and_Light.html#bodyContent"],
["Total Darkness","SRD_Vision_and_Light.html#bodyContent"],
["sprint","SRD_Movement.html#Evasion_and_Pursuit"],
["lock","SRD_Open_Lock_Skill.html#bodyContent"],
["Heal","SRD_Heal_Skill.html#Heal_.28Wis.29"],
["surprise","SRD_Initiative.html#Surprise"],
["Difficult Terrain","SRD_Difficult_Terrain.html#Difficult_Terrain"],
["Spell Books","SRD_Wizard's_Spellbook.html"],
["Charm","SRD_Charm_Person.html"],
["Disable Device","SRD_Disable_Device_Skill.html"],
["Break the Door","SRD_Breaking_and_Entering.html#Breaking_and_Entering"],
["Wisdom","SRD_Ability_Check.html#Ability_Checks"],
["Strength","SRD_Ability_Check.html#Ability_Checks"],
["Dexterity","SRD_Ability_Check.html#Ability_Checks"],
["Constitution","SRD_Ability_Check.html#Ability_Checks"],
["Intelligence","SRD_Ability_Check.html#Ability_Checks"],
["Charisma","SRD_Ability_Check.html#Ability_Checks"],
["Bardic Knowledge","SRD_Bard.html#Bardic_Knowledge"],
["swimming","SRD_Swim_Skill.html#bodyContent"],
["Swim","SRD_Swim_Skill.html#bodyContent"],
["Balance","SRD_Balance_Skill.html#bodyContent"],
["Climb","SRD_Climb_Skill.html#Climb_.28Str.3B_Armor_Check_Penalty.29"],
["Minor Scrolls","SRD_Scrolls.html#Table:_Scroll_Types"],
["Medium Scrolls","SRD_Scrolls.html#Table:_Scroll_Types"],
["Religion", "SRD_Knowledge_Skill.html#Knowledge_.28Int.3B_Trained_Only.29"],
["Detect Evil / Chaos", "SRD_Detect_Evil.html"] 
]; 

var aventuralinks_5a_es = [    
    
    ["Detectar Veneno","../core/SRD5es/magia/conjuros/detectar_veneno_y_enfermedad.html"],     
    ["Invocar elemental menor","../core/SRD5es/magia/conjuros/conjurar_elementales_menores.html"],
    ["Confusion", "../core/SRD5es/magia/conjuros/confusion.html"],
    ["Luz de día", "../core/SRD5es/magia/conjuros/luz_del_dia.html"],
    
    ["hechizar","../core/SRD5es/magia/conjuros/hechizar_persona.html"],   
    ["derribado","../core/SRD5e/gamemastering/conditions.html#TOC-Prone"],
    ["aturdido","../core/SRD5e/gamemastering/conditions.html#TOC-Prone"],
    ["oscuridades","../core/SRD5e/gamemastering/combat.html#TOC-Unseen-Attackers-and-Targets"],    
    ["oscuridad total","../core/SRD5e/spellcasting/all-spells/d/darkness.html"],          
    ["tumbado","../core/SRD5e/gamemastering/combat.html#TOC-Being-Prone"],
    ["Desmontar Trampas","../core/SRD5e/gamemastering/traps.html#TOC-Poison-Darts"],              
    ["sorprender","../core/SRD5e/gamemastering/combat.html#TOC-Surprise"],
    ["escombros menores","../core/SRD5e/gamemastering/combat.html#TOC-Difficult-Terrain"],
    ["escombros densos","../core/SRD5e/gamemastering/combat.html#TOC-Difficult-Terrain"],     
    ["Pergaminos Menores","../core/SRD5e/gamemastering/magic-items/wondrous-items.html#TOC-Spell-Scroll"],   
    ["Pergaminos Medios","../core/SRD5e/gamemastering/magic-items/wondrous-items.html#TOC-Spell-Scroll"],
    ["libros de conjuros","../core/SRD5e/equipment/adventuring-gear.html"]
             
];

var aventuralinks_5a_en = [  
    
    ["darkness","../core/SRD5e/gamemastering/combat.html#TOC-Unseen-Attackers-and-Targets"],   
    ["Total Darkness","../core/SRD5e/gamemastering/combat.html#TOC-Unseen-Attackers-and-Targets"],   
    ["lock","../core/SRD5e/locks.html"],
    ["Open locks","../core/SRD5e/locks.html"],
    ["Thieves' Tools","../core/SRD5e/locks.html"], 
    ["Thieves&#x27; Tools","../core/SRD5e/locks.html"], 
    ["Break the Door","../core/SRD5e/gamemastering/objects.html"],
    ["Climb","../core/SRD5e/climb.html"],
    ["Disable Device","../core/SRD5e/disarm.html"],
    ["surprise","../core/SRD5e/gamemastering/combat.html#TOC-Surprise"],
    ["difficult terrain","../core/SRD5e/gamemastering/combat.html#TOC-Difficult-Terrain"],
    ["Knowledge", "../core/SRD5e/using-ability-scores.html#TOC-Intelligence-Checks"],
    ["spell books","/SRD5e/equipment/adventuring-gear.html"],
    ["search", "../core/SRD5e/using-ability-scores.html#TOC-Intelligence-Checks"],
    ["Minor Scrolls","../core/SRD5e/gamemastering/magic-items/wondrous-items.html#TOC-Spell-Scroll"],   
    ["Medium Scrolls","../core/SRD5e/gamemastering/magic-items/wondrous-items.html#TOC-Spell-Scroll"],
 ];
