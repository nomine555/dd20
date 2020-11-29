// Main var that sets 'At Glance' - 'Body' - 'Conclusion'
// Indica estado, si estamos en el menu de monstruos

var MaxNpcs = 3;
var aventura = "beastmasters-daughter"
var mainmap = "centre";
var debug = "on";
var debug_content_file = "..\\twine\\beastmasters-daughter.html";
var languages = ['en'];

function DrawLines() { 
    
new LeaderLine(document.getElementById('n3'),document.getElementById('n4'), {color: 'black', size: 3, path: 'straight'});
new LeaderLine(document.getElementById('n4'),document.getElementById('n5'), {color: 'black', size: 3, path: 'straight'});
new LeaderLine(document.getElementById('n5'),document.getElementById('n6'), {color: 'black', size: 3, path: 'straight'});

new LeaderLine(document.getElementById('n6'),document.getElementById('n7'), {color: 'black', size: 3, path: 'straight'});
new LeaderLine(document.getElementById('n7'),document.getElementById('n8'), {color: 'black', size: 3, path: 'straight'});

new LeaderLine(document.getElementById('n11'),document.getElementById('n13'), {color: 'black', size: 3, path: 'magnet'}); 
new LeaderLine(document.getElementById('n11'),document.getElementById('n12'), {color: 'black', size: 3, path: 'magnet'}); 

new LeaderLine(document.getElementById('n8'),document.getElementById('n9'), {color: 'black', size: 3, path: 'straight'});
new LeaderLine(document.getElementById('n9'),document.getElementById('n10'), {color: 'black', size: 3, path: 'magnet'}); 
new LeaderLine(document.getElementById('n10'),document.getElementById('n9'), {color: 'black', size: 3, path: 'magnet'}); 
new LeaderLine(document.getElementById('n10'),document.getElementById('n11'), {color: 'black', size: 3, path: 'magnet'});     

new LeaderLine(document.getElementById('n12'),document.getElementById('n14'), {color: 'black', size: 3, path: 'magnet'}); 
new LeaderLine(document.getElementById('n13'),document.getElementById('n7'), {color: 'black', size: 3, path: 'straight'}); 

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
    ["Constrictor Snake", "./lugares.html?param=@monsters&room=-1"],
    ["Larder", "./lugares.html?param=@research-centre-map&room=16"],
    ["the safe", "./lugares.html?param=@research-centre-map&room=17"],
    ["Red Shields", "./lugares.html?param=@research-centre-map&room=5"],
    ["Ghoul", "./lugares.html?param=@monsters&room=-2"],
    ["Giant Poisonous Snake", "./lugares.html?param=@monsters&room=-3"],
    ["Gibbering Mouther", "./lugares.html?param=@monsters&room=-4"],
    ["Mouther", "./lugares.html?param=@monsters&room=-4"],
    ["Mouthers", "./lugares.html?param=@monsters&room=-4"],
    ["Gray Ooze", "./lugares.html?param=@monsters&room=-5"],
    ["Hydra", "./lugares.html?param=@monsters&room=-6"],
    ["Owlbear", "./lugares.html?param=@monsters&room=-7"],
    ["Phase Spider", "./lugares.html?param=@monsters&room=-8"],
    ["Skeleton", "./lugares.html?param=@monsters&room=-9"],
    ["Zombie", "./lugares.html?param=@monsters&room=-10"],
    ["Commoner", "./lugares.html?param=@monsters&room=-11"],
    ["Guard", "./lugares.html?param=@monsters&room=-12"],
    ["Guards", "./lugares.html?param=@monsters&room=-12"],
    ["Lash", "./lugares.html?param=@monsters&room=-13"],
    ["Raven", "./lugares.html?param=@monsters&room=-14"],
    ["Raven Aldritch", "./lugares.html?param=@monsters&room=-14"],
    ["Wizard Aldritch", "./lugares.html?param=@monsters&room=-15"],
    ["Circlet of Blasting", "./lugares.html?param=@magic-items&room=-1"],
    ["Cloak of Protection", "./lugares.html?param=@magic-items&room=-2"],
    ["Dust of Disappearance", "./lugares.html?param=@magic-items&room=-3"],
    ["Eyes of Minute Seeing", "./lugares.html?param=@magic-items&room=-4"],
    ["Gloves of Missile Snaring", "./lugares.html?param=@magic-items&room=-5"],
    ["Headband of Wisdom", "./lugares.html?param=@magic-items&room=-6"],
    ["Javelin of Lightning", "./lugares.html?param=@magic-items&room=-7"],
    ["How this Room Works", "./lugares.html?param=@monsters&room=-16"],
    ["How the Shields Work", "./lugares.html?param=@notas&room=-1"],
    ["The Safe", "./lugares.html?param=@research-centre-map&room=17"],
    ["Safe Room", "./lugares.html?param=@research-centre-map&room=17"],
    ["Specimen Enclosures", "./lugares.html?param=@research-centre-map&room=10"],
    ["Specimen Enclosures Entrance", "./lugares.html?param=@research-centre-map&room=10"],
    ["Other Side of the Quarantine Exit Door", "./lugares.html?param=@research-centre-map&room=3"],
    ["Owlbea", "./lugares.html?param=@research-centre-map&room=11"],
    ["Chimera", "./lugares.html?param=@research-centre-map&room=14"],
    ["Handler", "./lugares.html?param=@research-centre-map&room=15"],
    ["Shield Control", "./lugares.html?param=@research-centre-map&room=9"]
    
];

