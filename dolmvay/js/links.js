// Main var that sets 'At Glance' - 'Body' - 'Conclusion'
// Indica estado, si estamos en el menu de monstruos

var MaxNpcs = -1;
var aventura = "dolmvay";
var mainmap = "dolmvay";
var debug = "on";
var debug_content_file = "..\\twine\\dolmvay.html";
var languages = ['en'];

function DrawLines() { 
    new LeaderLine(document.getElementById('guide-ook-to-the-city-of-dolmvay'),document.getElementById('adventuring-in-dolmvay'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('adventuring-in-dolmvay'),document.getElementById('ancient-history'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('ancient-history'),document.getElementById('calendar'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('calendar'),document.getElementById('citizens-of-dolmvay'), {color: 'black', size: 3, path: 'magnet'});
    
    new LeaderLine(document.getElementById('guide-ook-to-the-city-of-dolmvay'),document.getElementById('city-of-dolmvay'), {color: 'black', size: 3, path: 'magnet'});

    new LeaderLine(document.getElementById('city-of-dolmvay'),document.getElementById('city-layout'), {color: 'black', size: 3, path: 'magnet'});
    
    new LeaderLine(document.getElementById('city-layout'),document.getElementById('north-ward'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('north-ward'),document.getElementById('palatial-district'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('north-ward'),document.getElementById('city-center-district'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('north-ward'),document.getElementById('district-of-no-les'), {color: 'black', size: 3, path: 'magnet'});
    
    new LeaderLine(document.getElementById('city-layout'),document.getElementById('south-ward'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('south-ward'),document.getElementById('baytown'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('south-ward'),document.getElementById('warf-district'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('south-ward'),document.getElementById('guild-district'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('south-ward'),document.getElementById('oldcastle-district'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('south-ward'),document.getElementById('market-district'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('south-ward'),document.getElementById('district-of-commons'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('south-ward'),document.getElementById('river-district'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('south-ward'),document.getElementById('district-of-scholars'), {color: 'black', size: 3, path: 'magnet'});
    
    new LeaderLine(document.getElementById('city-layout'),document.getElementById('isle-of-heroes'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('isle-of-heroes'),document.getElementById('inner-courtyard'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('isle-of-heroes'),document.getElementById('level-one'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('level-one'),document.getElementById('level-two'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('level-two'),document.getElementById('level-three'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('level-three'),document.getElementById('dungeon-level'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('isle-of-heroes'),document.getElementById('roof-level'), {color: 'black', size: 3, path: 'magnet'});
    
    new LeaderLine(document.getElementById('city-layout'),document.getElementById('the-valenon'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('city-layout'),document.getElementById('sewers-of-dolmvay'), {color: 'black', size: 3, path: 'magnet'});
    
    new LeaderLine(document.getElementById('other-features'),document.getElementById('random-ta-le--city-encounters'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('other-features'),document.getElementById('common-shops-and-businesses'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('other-features'),document.getElementById('new-flora-and-fauna'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('other-features'),document.getElementById('appendix--npc-generation'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('other-features'),document.getElementById('appendix--treasures'), {color: 'black', size: 3, path: 'magnet'});
}

function colorReplace(text) {
    text = text.replace(/background-color:rgb\(216,226,234\)/g, "background-color:rgb(255,255,255)");   
    text = text.replace(/background-color:rgb\(60,106,169\)/g, "background-color:rgb(24, 34, 20)");
    text = text.replace(/margin:.*px?;/g, "");
    text = text.replace(/padding:.*px?;/g, "");  
    return text;
}

function translation(content_file, page) {
    return;
}

var aventuralinks_3a_es = [ ];
var aventuralinks_3a_en = [ ];
var aventuralinks_5a_es = [ ];

var aventuralinks_5a_en = [
    /* Monsters */
    ["Monster", "./lugares.html?param=@monsters&room=-1"],
    
    /* Extra info */
    ["Exztra info 1", "./lugares.html?param=@extra-info&room=-1"]
];

