// Main var that sets 'At Glance' - 'Body' - 'Conclusion'
// Indica estado, si estamos en el menu de monstruos

var MaxNpcs = 2;
var aventura = "demon-stones"
var mainmap = "gravencross";
var debug = "on";
var debug_content_file = "..\\twine\\demon-stones.html";
var languages = ['en'];

function DrawLines() { 
    new LeaderLine(document.getElementById('beginning-the-adventure'),document.getElementById('wolf-attack'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('wolf-attack'),document.getElementById('gravencross'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('gravencross'),document.getElementById('questioning-the-villagers'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('questioning-the-villagers'),document.getElementById('the-felled-oak'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('questioning-the-villagers'),document.getElementById('the-church'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('questioning-the-villagers'),document.getElementById('sheriff-yakkermere'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('questioning-the-villagers'),document.getElementById('skerril-greyhope'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('questioning-the-villagers'),document.getElementById('the-farms'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('gravencross'),document.getElementById('hoarwych-valley'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('hoarwych-valley'),document.getElementById('dead-tree-hill'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('hoarwych-valley'),document.getElementById('attack-by-the-black-company'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('hoarwych-valley'),document.getElementById('redmidge-marsh'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('hoarwych-valley'),document.getElementById('myrken-lake'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('hoarwych-valley'),document.getElementById('the-grey-druid'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('hoarwych-valley'),document.getElementById('wardcroft-ruins'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('wardcroft-ruins'),document.getElementById('cellar-level'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('cellar-level'),document.getElementById('the-crypt-level'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('the-crypt-level'),document.getElementById('southern-corridor'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('southern-corridor'),document.getElementById('lord-vedderen-wardcrofts-crypt'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('lord-vedderen-wardcrofts-crypt'),document.getElementById('the-deep-level'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('the-deep-level'),document.getElementById('guardroom'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('the-deep-level'),document.getElementById('sanctum-of-the-unhallowed'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('the-deep-level'),document.getElementById('guard-hall'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('the-deep-level'),document.getElementById('kitchen'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('the-deep-level'),document.getElementById('elite-guard-room'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('the-deep-level'),document.getElementById('false-private-chamber'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('the-deep-level'),document.getElementById('the-underlords-private-chamber'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('the-deep-level'),document.getElementById('the-great-chamber'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('the-great-chamber'),document.getElementById('the-curse-lifted'), {color: 'black', size: 3, path: 'magnet'});
    
    /*
    new LeaderLine(document.getElementById('gravencross'),document.getElementById('hoarwych-valley'), {color: 'black', size: 3});
    new LeaderLine(document.getElementById('hoarwych-valley'),document.getElementById('wardcroft-ruins'), {color: 'black', size: 3});
    new LeaderLine(document.getElementById('wardcroft-ruins'),document.getElementById('monsters'), {color: 'black', size: 3});
    new LeaderLine(document.getElementById('monsters'),document.getElementById('adventure-synopsis'), {color: 'black', size: 3});
    */
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
    ["Wychblighted wolf", "./lugares.html?param=@monsters&room=-1"],
    ["Wychblighted wolves", "./lugares.html?param=@monsters&room=-1"],
    ["Wolf", "./lugares.html?param=@monsters&room=-1"],
    ["Wolves", "./lugares.html?param=@monsters&room=-1"],
    ["Werecrocodile", "./lugares.html?param=@monsters&room=-2"],
    ["Werecrocodiles", "./lugares.html?param=@monsters&room=-2"],
    ["Giant bee", "./lugares.html?param=@monsters&room=-3"],
    ["Giant bees", "./lugares.html?param=@monsters&room=-3"],
    ["Black company fighter", "./lugares.html?param=@monsters&room=-4"],
    ["Black company fighters", "./lugares.html?param=@monsters&room=-4"],
    ["Captain Hogarn Bloodfist", "./lugares.html?param=@monsters&room=-5"],
    ["Captain Hogarn", "./lugares.html?param=@monsters&room=-5"],
    ["Hogarn Bloodfist", "./lugares.html?param=@monsters&room=-5"],
    ["Hogarn", "./lugares.html?param=@monsters&room=-5"],
    ["Gorth Blackhand", "./lugares.html?param=@monsters&room=-6"],
    ["Gorth", "./lugares.html?param=@monsters&room=-6"],
    ["Tassara Hexallapon", "./lugares.html?param=@monsters&room=-7"],
    ["Tassara", "./lugares.html?param=@monsters&room=-7"],
    ["Fyr", "./lugares.html?param=@monsters&room=-8"],
    ["Wyvern", "./lugares.html?param=@monsters&room=-9"],
    ["Ogre", "./lugares.html?param=@monsters&room=-10"],
    ["Ogres", "./lugares.html?param=@monsters&room=-10"],
    ["Giant ant", "./lugares.html?param=@monsters&room=-11"],
    ["Giant ants", "./lugares.html?param=@monsters&room=-11"],
    ["Gray Ooze", "./lugares.html?param=@monsters&room=-12"],
    ["Iron cobra", "./lugares.html?param=@monsters&room=-13"],
    ["Iron cobras", "./lugares.html?param=@monsters&room=-13"],
    ["Swarm of spiders", "./lugares.html?param=@monsters&room=-14"],
    ["Wardcroft Wight", "./lugares.html?param=@monsters&room=-15"],
    ["Wight", "./lugares.html?param=@monsters&room=-15"],
    ["Lord Vedderen", "./lugares.html?param=@monsters&room=-16"],
    ["Zombie Hulk", "./lugares.html?param=@monsters&room=-17"],
    ["Guard", "./lugares.html?param=@monsters&room=-18"],
    ["Guards", "./lugares.html?param=@monsters&room=-18"],
    ["Guard Officer", "./lugares.html?param=@monsters&room=-19"],
    ["Officer", "./lugares.html?param=@monsters&room=-19"],
    ["Ghoul", "./lugares.html?param=@monsters&room=-20"],
    ["Ghouls", "./lugares.html?param=@monsters&room=-20"],
    ["Elleron", "./lugares.html?param=@monsters&room=-21"],
    ["The torturess", "./lugares.html?param=@monsters&room=-21"],
    ["Skeletal Champion", "./lugares.html?param=@monsters&room=-22"],
    ["Skeletal Champions", "./lugares.html?param=@monsters&room=-22"],
    ["Olaf & Bulla", "./lugares.html?param=@monsters&room=-23"],
    ["Olaf and Bulla", "./lugares.html?param=@monsters&room=-23"],
    ["Olaf or Bulla", "./lugares.html?param=@monsters&room=-23"],
    ["Violet Fungus", "./lugares.html?param=@monsters&room=-24"],
    ["Elite Guard", "./lugares.html?param=@monsters&room=-25"],
    ["Basilisk", "./lugares.html?param=@monsters&room=-26"],
    ["Lacedon", "./lugares.html?param=@monsters&room=-27"],
    ["The Underlord", "./lugares.html?param=@monsters&room=-28"],
    ["The Grey Druid", "./lugares.html?param=@monsters&room=-29"],
    ["Hobb the Frog", "./lugares.html?param=@monsters&room=-30"],
    ["Hobb", "./lugares.html?param=@monsters&room=-30"],
    ["Ostopheles", "./lugares.html?param=@monsters&room=-31"],
    ["Lesser basalt elemental", "./lugares.html?param=@monsters&room=-32"],
    ["Lesser basalt elementals", "./lugares.html?param=@monsters&room=-32"],
    ["Elementals", "./lugares.html?param=@monsters&room=-32"],
    ["The Elementals", "./lugares.html?param=@monsters&room=-32"],
    ["Spider swarms", "../core/SRD5en/gamemaster_rules/monsters/swarm_of_insects/index.html"],
    
    ["+1 Keen Longsword","../core/SRD5en/gamemaster_rules/magic_items/weapon_1_2_or_3/index.html"],
    ["+1 dagger","../core/SRD5en/gamemaster_rules/magic_items/weapon_1_2_or_3/index.html"],
    ["+1 defending mace","../core/SRD5en/gamemaster_rules/magic_items/weapon_1_2_or_3/index.html"],
    ["+1 ghost touch scimitar","../core/SRD5en/gamemaster_rules/magic_items/weapon_1_2_or_3/index.html"],
    ["+1 large shield","../core/SRD5en/gamemaster_rules/magic_items/shield_1_2_or_3/index.html"],
    
    
    /* Locations */
    ["Wychblight", "./lugares.html?param=@wychblight&room=-1"]
];

