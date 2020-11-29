// Main var that sets 'At Glance' - 'Body' - 'Conclusion'
// Indica estado, si estamos en el menu de monstruos

// Version de la Eventura
var aversion = 2;
var MaxNpcs = -1;

// Aventura y mapa inicial
var aventura = "custom-adventure"
var mainmap = "main-map";

// La versión por defecto es 5a edición
var languages = ['es','en'];
var customfile = true;
var debug = "on";
var debug_content_file = "custom-adventure.html";

// Para player
var default_game_state = "0006";
var salt = 34587757654943352;
var minindex = ["@resumen","@bienvenido","@licencia","@pioneros"];

var aventuralinks_3a_es = [ ];
var aventuralinks_3a_en = [ ];
var aventuralinks_5a_en = [ ];
var aventuralinks_5a_es = [ ];

function colorReplace(text) {
	return text;
}
