// Main var that sets 'At Glance' - 'Body' - 'Conclusion'
// Indica estado, si estamos en el menu de monstruos

var MaxNpcs = 5;
var aventura = "burning-goblins"
var mainmap = "village";
var debug = "on";
var debug_content_file = "..\\twine\\burning-goblins.html";
var languages = ['en'];

function DrawLines() { 
    new LeaderLine(document.getElementById('greenfolk'),document.getElementById('greenwood'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('greenwood'),document.getElementById('caves'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('caves'),document.getElementById('gate'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('gate'),document.getElementById('storage'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('storage'),document.getElementById('gambling'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('gambling'),document.getElementById('sleeping'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('sleeping'),document.getElementById('misty'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('sleeping'),document.getElementById('central'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('central'),document.getElementById('continued'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('continued'),document.getElementById('keep'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('keep'),document.getElementById('grounds'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('grounds'),document.getElementById('kitchen'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('kitchen'),document.getElementById('temple'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('temple'),document.getElementById('chamber'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('chamber'),document.getElementById('research'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('research'),document.getElementById('mosaic'), {color: 'black', size: 3, path: 'magnet'});
    new LeaderLine(document.getElementById('research'),document.getElementById('tower'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('research'),document.getElementById('basement'), {color: 'black', size: 3, path: 'straight'});
    new LeaderLine(document.getElementById('tower'),document.getElementById('conclusion'), {color: 'black', size: 3, path: 'straight'});
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
    ["Mistsnake", "./lugares.html?param=@monsters&room=-1"],
    ["Owlbear", "./lugares.html?param=@monsters&room=-2"],
    ["White Hurin", "./lugares.html?param=@monsters&room=-3"],
    ["Thorne", "./lugares.html?param=@monsters&room=-4"],
    ["Elroth", "./lugares.html?param=@monsters&room=-5"],
    ["Burning goblin", "./lugares.html?param=@monsters&room=-6"],
    ["Burning goblins", "./lugares.html?param=@monsters&room=-6"],
    ["Haycrisp", "./lugares.html?param=@monsters&room=-7"],
    ["Dibbles", "./lugares.html?param=@monsters&room=-8"],
    ["Blightwyrm", "./lugares.html?param=@monsters&room=-9"],
    ["Chief Rotnose", "./lugares.html?param=@monsters&room=-10"],
    ["Rotnose", "./lugares.html?param=@monsters&room=-10"],
    ["Goblin rider", "./lugares.html?param=@monsters&room=-11"],
    ["Goblin riders", "./lugares.html?param=@monsters&room=-11"],
    ["Herk & Stomps", "./lugares.html?param=@monsters&room=-12"],
    ["Herk and Stomps", "./lugares.html?param=@monsters&room=-12"],
    ["Hog mother", "./lugares.html?param=@monsters&room=-13"],
    ["Spell construct", "./lugares.html?param=@monsters&room=-14"],
    ["Spell constructs", "./lugares.html?param=@monsters&room=-14"],
    ["The shadow", "./lugares.html?param=@monsters&room=-15"],
    ["Ragmaw", "./lugares.html?param=@monsters&room=-16"],
    ["Glowing shards", "./lugares.html?param=@items&room=-1"],
    ["Breath of embers", "./lugares.html?param=@items&room=-2"],
    ["Blood oil", "./lugares.html?param=@items&room=-3"],
    ["Mantle of mist", "./lugares.html?param=@items&room=-4"]
    
];

