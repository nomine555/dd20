// Main var that sets 'At Glance' - 'Body' - 'Conclusion'
// Indica estado, si estamos en el menu de monstruos

var MaxNpcs = 2;
var aventura = "preceptos"
var mainmap = "vadania";
var debug = "on";
var debug_content_file = "..\\twine\\preceptos.html";
 // 32 x 4
var default_game_state = "0006";
var salt = 34587757654943352;
var minindex = ["@resumen","@bienvenido","@licencia","@pioneros"];
// La versión por defecto es 5a edición
var languages = ['es'];
var soloen = 0

function DrawLines() { 
    
new LeaderLine(document.getElementById('la-llegada'),document.getElementById('sala-capitular'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('la-llegada'),document.getElementById('cocina'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('la-llegada'),document.getElementById('refectorio'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('la-llegada'),document.getElementById('celdas'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('la-llegada'),document.getElementById('biblioteca-y-escritorio'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('la-llegada'),document.getElementById('caballerizas'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('la-llegada'),document.getElementById('acceso-a-la-torre'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('la-llegada'),document.getElementById('la-cena'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('la-llegada'),document.getElementById('templo'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('la-cena'),document.getElementById('la-lucha'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('la-lucha'),document.getElementById('acceso-a-la-torre'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('acceso-a-la-torre'),document.getElementById('la-torre'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('la-torre'),document.getElementById('templo'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('templo'),document.getElementById('el-laberinto'), {color: 'black', size: 3, path: 'magnet'});
new LeaderLine(document.getElementById('el-laberinto'),document.getElementById('conclusiones'), {color: 'black', size: 3, path: 'magnet'});

    
}

function colorReplace(text) {
    text = text.replace(/background-color:rgb\(216,226,234\)/g, "background-color:rgb(255,255,255)");   
    text = text.replace(/background-color:rgb\(60,106,169\)/g, "background-color:rgb(24, 34, 20)");
    text = text.replace(/margin:.*px?;/g, "");
    text = text.replace(/padding:.*px?;/g, "");  
    return text;
}

function translation(content_file, page) {
    if (page == "index-flow.html") {      
        if (content_file.indexOf("-es") > -1) {
            try {
                //document.getElementsByTagName('a')[0].innerHTML  = "Comienza la Aventura";                                      
        } catch(e) {}
        }
    }
    return;
}

var aventuralinks_3a_es = [ ];
var aventuralinks_3a_en = [ ];
var aventuralinks_5a_en = [ ];

var aventuralinks_5a_es = [    
    
    ["Detectar Veneno","../core/SRD5es/magia/conjuros/detectar_veneno_y_enfermedad.html"],     
    ["Invocar elemental menor","../core/SRD5es/magia/conjuros/conjurar_elementales_menores.html"],
    ["Confusion", "../core/SRD5es/magia/conjuros/confusion.html"],
    ["Luz de día", "../core/SRD5es/magia/conjuros/luz_del_dia.html"],
    ["hechizar","../core/SRD5es/magia/conjuros/hechizar_persona.html"], 
    
    ["daño necrótico","../core/SRD5es/combate/dano_y_curacion.html#Tok_5"],
    ["descanso largo","../core/SRD5e/gamemastering/combat.html#TOC-Healing"],
    ["derribado","../core/SRD5e/gamemastering/conditions.html#TOC-Prone"],
    ["aturdido","../core/SRD5e/gamemastering/conditions.html#TOC-Prone"],
    
    ["oscuridades","../core/SRD5e/gamemastering/combat.html#TOC-Unseen-Attackers-and-Targets"],    
    ["oscuridad total","../core/SRD5e/spellcasting/all-spells/d/darkness.html"],          
    ["tumbado","../core/SRD5e/gamemastering/combat.html#TOC-Being-Prone"],
    
    ["Desmontar Trampas","../core/SRD5e/gamemastering/traps.html#TOC-Poison-Darts"],
    ["Desmontar Trampas","../core/SRD5e/gamemastering/traps.html#TOC-Detecting-and-Disabling-a-Trap"],
    ["Detectar trampas","../core/SRD5e/gamemastering/traps.html#TOC-Detecting-and-Disabling-a-Trap"],
    ["trampa mágica","../core/SRD5e/gamemastering/traps.html#TOC-Detecting-and-Disabling-a-Trap"], 
    ["sorprender","../core/SRD5e/gamemastering/combat.html#TOC-Surprise"],
    
    ["escombros menores","../core/SRD5e/gamemastering/combat.html#TOC-Difficult-Terrain"],
    ["escombros densos","../core/SRD5e/gamemastering/combat.html#TOC-Difficult-Terrain"],                    
    
    ["piedra de Ioun","../core/SRD5e/gamemastering/magic-items/wondrous-items.html#TOC-Ioun-Stone"],
    ["pociones de curación mayor","../core/SRD5e/gamemastering/magic-items/potions-oils.html#TOC-Potion-of-Healing"],
    ["poción de resistencia","../core/SRD5e/gamemastering/magic-items/potions-oils.html#TOC-Potion-of-Resistance"],
    ["Pergaminos Menores","../core/SRD5e/gamemastering/magic-items/wondrous-items.html#TOC-Spell-Scroll"],
    ["Pergaminos Medios","../core/SRD5e/gamemastering/magic-items/wondrous-items.html#TOC-Spell-Scroll"],
    ["libros de conjuros","../core/SRD5e/equipment/adventuring-gear.html"],
        
    ["Monje decrépito", "./lugares.html?param=@monsters&room=-1"],
    ["Hambriento", "./lugares.html?param=@monsters&room=-2"],
    ["Hambrientos", "./lugares.html?param=@monsters&room=-2"],
    ["La abadesa", "./lugares.html?param=@monsters&room=-3"],
    ["Zeeva", "./lugares.html?param=@monsters&room=-4"],
    
    ["Cilindro del albor solar", "./lugares.html?param=@objetos&room=-1"],
    ["Cilindro del albor", "./lugares.html?param=@objetos&room=-1"],
    ["La piedra negra", "./lugares.html?param=@objetos&room=-2"],
    ["caracteristicas generales del monasterio", "./lugares.html?param=@objetos&room=3"],
    ["Características del laberinto", "./lugares.html?param=@objetos&room=4"]
    
];



