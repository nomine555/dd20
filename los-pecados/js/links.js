// Main var that sets 'At Glance' - 'Body' - 'Conclusion'
// Indica estado, si estamos en el menu de monstruos

var MaxNpcs = 3;
var aventura = "los-pecados"
var mainmap = "vadania";
var debug = "on";
var debug_content_file = "..\\twine\\los-pecados.html";
// La versión por defecto es 5a edición
var languages = ['es'];

function DrawLines() { 
    new LeaderLine(document.getElementById('el-rapto'),document.getElementById('el-camino-hasta-el-juez'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('el-camino-hasta-el-juez'),document.getElementById('el-juicio'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('el-juicio'),document.getElementById('la-prision-de-bastion-ultimo'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('la-prision-de-bastion-ultimo'),document.getElementById('el-extrano-mercader'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('la-prision-de-bastion-ultimo'),document.getElementById('rescatando-a-tyrtareo-y-micohuani'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('la-biblioteca-de-vartlas'),document.getElementById('la-sala-del-trono-de-vartlas'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('la-prision-de-bastion-ultimo'),document.getElementById('en-busca-de-nyethorn'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('en-busca-de-nyethorn'),document.getElementById('nyethorn-liberado'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('nyethorn-liberado'),document.getElementById('la-biblioteca-de-vartlas'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('nyethorn-liberado'),document.getElementById('la-sala-del-trono-de-vartlas'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('la-sala-del-trono-de-vartlas'),document.getElementById('conclusiones'), {color: 'black', size: 3, path: 'magnet'});
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
    /* Monsters */
        ["defensor astral", "./lugares.html?param=@monsters&room=-1"],
        ["defensores astrales", "./lugares.html?param=@monsters&room=-1"],
        ["Nyethorn", "./lugares.html?param=@monsters&room=-2"],
        ["Kya", "./lugares.html?param=@monsters&room=-3"],
        ["Kya Drovash", "./lugares.html?param=@monsters&room=-3"],
        ["Kya Drovash de Craexhin", "./lugares.html?param=@monsters&room=-3"],
        ["Edfraya", "./lugares.html?param=@monsters&room=-4"],
        ["Edfraya, señora del clan Rocasangrienta", "./lugares.html?param=@monsters&room=-4"],
        ["Edfraya Ojoabismo", "./lugares.html?param=@monsters&room=-4"],
        ["Edfraya Ojoabismo, señora del clan Rocasangrienta", "./lugares.html?param=@monsters&room=-4"],
        ["Tyrtareo", "./lugares.html?param=@monsters&room=-5"],
        ["Tyrtareo Gelon", "./lugares.html?param=@monsters&room=-5"],
        ["Tyrtareo Gelon, líder de las Lanzas de Lantamar", "./lugares.html?param=@monsters&room=-5"],
        ["Tyrtareo Gelon, líder de las Lanzas de Lantamar", "./lugares.html?param=@monsters&room=-5"],
        ["Micohuani", "./lugares.html?param=@monsters&room=-6"],
        ["Micohuani, general de la Orden de Saurania", "./lugares.html?param=@monsters&room=-6"],
        ["soldado veterano", "./lugares.html?param=@monsters&room=-7"],
        ["soldados veteranos", "./lugares.html?param=@monsters&room=-7"],
        ["veteranos", "./lugares.html?param=@monsters&room=-7"],
        ["Vartlas","../core/SRD5es/monstruos/solar.html"],
        ["Vartlas el juicioso","../core/SRD5es/monstruos/solar.html"],
        ["Vartlas, el juicioso","../core/SRD5es/monstruos/solar.html"],
    /* Tesoros */
        ["Marca de Nyethorn", "./lugares.html?param=@tesoros&room=-1"],
        ["Grilletes dimensionales", "./lugares.html?param=@tesoros&room=-2"],
        ["Bolsa de contención", "./lugares.html?param=@tesoros&room=-3"]
];


