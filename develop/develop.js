var flowtag = "@index-main";
var monstertag = "@monsters";
var tag = "beginning-the-adventure";

var nclick = 0;

var N   = 1;
var X = 12.8;
var Y = 8;
var xoff = -2.5;
var yoff = -2;

var Cx = [0,0,0,0];
var Cy = [0,0,0,0];

var url = "..\\..\\Twine\\horns.html";

//loadflow();
//loadmonster();

// ------
// Hay que añadir esto al mapa en cuestión que se quiere etiquetar!!!!!
// onclick="clickOnmap(event);" ondblclick="dblclickOnmap(event);" -> En el div del mapa
// 
// <script type="text/javascript" src="../../develop/develop.js"></script>
// ----

window.addEventListener('DOMContentLoaded', init, false);

function init() {
    console.log("Init!");
    var mapa = document.getElementById("loadedmap");
    //mapa.addEventListener('click', clickOnmap, false);
    mapa.addEventListener('click', dblclickOnmap, false);
    
    //mapa.addEventListener('dblclick', dblclickOnmap, false);
}

function dblclickOnmap(event) {
    var mapa = document.getElementById("loadedmap");
    var X = mapa.clientWidth / 100;
    var Y = mapa.clientHeight / 100;
    
        nclick = 0;
        console.log('<a href="./lugares.html?param='+tag+'&room='+N+'" style="left: '+ ((event.clientX/X) + xoff) +'%; top: '+((event.clientY/Y)+yoff)+'%;" class="clickable">'+'</a>');   
        N++;
    var element = document.createElement("div");
        element.classList.add("clickable");
        element.style.left =  ((event.clientX/X) + xoff) + "%";
        element.style.top = ((event.clientY/Y)+yoff) + "%";
        document.getElementById('loadedmap').appendChild(element);
}

function clickOnmap(event) {
    
    Cx[nclick] = (event.clientX/X);
    Cy[nclick] = (event.clientY/Y);
    nclick = nclick + 1;
    
    if (nclick == 4) {
        nclick = 0;
        lleft = min(Cx);
        ttop  = min(Cy);
        width = max(Cx) - min(Cx);
        heigth = max(Cy) - min(Cy);    
        console.log('<a href="./lugares.html?param='+tag+'&room='+N+'" style="left: '+ lleft +'%; top: '+ ttop +'%; width: "'+width+'"%; height: "'+heigth+'"%;" class="clickable">'+'</a>');   
        N++;
        
        var element = document.createElement("div");
        element.classList.add("clickable");
        element.style.left = lleft + "%";
        element.style.top = ttop + "%";
        element.style.width = width + "%";
        element.style.height = heigth + "%";
        document.getElementById('loadedmap').appendChild(element);
    }
}

function settag(id) {
    console.log(id);
    tag = id;
    element  = document.getElementById("loadedmap");
    elements = element.getElementsByTagName('a');
    for (i = 0 ; i < elements.length; i++) {        
        elements[i].href = "#";
    }
}
function Indexflow() {
    url = document.getElementById("url").value;
    loadflow();
}

function Monsters() {
    url = document.getElementById("url").value;
    monstertag  = document.getElementById("tag").value;
    loadmonster();
}




function min(numbers) {
    var aux = numbers[0];
    for (i = 1 ; i < numbers.length ; i ++) {        
        if (aux > numbers[i])
            aux = numbers[i]
    }
    return aux;
}
function max(numbers) {
    var aux = numbers[0];
    for (i = 1 ; i < numbers.length ; i ++) {
        if (aux < numbers[i])
            aux = numbers[i]
    }
    return aux;
}




function loadmap() {    
       
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url);
    
    xmlhttp.onreadystatechange = function () { 
        if (xmlhttp.readyState === 4) {           
            text = xmlhttp.responseText;  
            text = text.replace(/<n>/g, '\n');
            text = RepairLinks(text);             
            passage = getPassage(text, maptag);
            text = passage[0];        
       
            n = 1;
            textin = text;
            textout = "";            
            charin  = textin.indexOf("# ");
            charout = textin.indexOf("\n# ",charin);            
            if (charout == -1) {charout = textin.length;}                        
            while (charin > 0) {                
                charout = textin.indexOf("\n# ",charin+1);
                if (charout == -1) {charout = textin.length;}                
                titulo  = textin.substring(charin+2,textin.indexOf('\n',charin + 3)-1);                  
                textout = textout + "<li><a href='./lugares.html?param="+maptag+"&room="+n+"'>"+titulo+"</a></li>\n";
                charin  = charout + 1;
                n++;
                if (charout == textin.length) {break;}    
                
            }
            console.log(textout);            
        }
    } 
    xmlhttp.send(null);   
    
}

function loadmonster() {    
       
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url);
    
    xmlhttp.onreadystatechange = function () { 
        if (xmlhttp.readyState === 4) {           
            text = xmlhttp.responseText;  
            text = text.replace(/<n>/g, '\n');
            text = RepairLinks(text);             
            passage = getPassage(text, monstertag);
            text = passage[0];        
       
            n = 1;
            textin = text;
            textout = "";            
            charin  = textin.indexOf("# ");
            charout = textin.indexOf("\n# ",charin);            
            if (charout == -1) {charout = textin.length;}                        
            while (charin > 0) {                
                charout = textin.indexOf("\n# ",charin+1);
                if (charout == -1) {charout = textin.length;}                
                titulo  = textin.substring(charin+2,textin.indexOf('\n',charin + 3)-1);    
                link = "./lugares.html?param=" + titulo + "&room=" + n;
                textout = textout + "['"+titulo+"'],['"+link+"'],\n";
                charin  = charout + 1;
                n++;
                if (charout == textin.length) {break;}    
                
            }
            console.log(textout);    
            document.getElementById("textout").innerHTML = textout;
        }
    } 
    xmlhttp.send(null);   
    
}

function loadflow() {
       
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url);
    
    xmlhttp.onreadystatechange = function () { 
        if (xmlhttp.readyState === 4) {           
            text = xmlhttp.responseText;  
            text = text.replace(/<n>/g, '\n');
            text = RepairLinks(text);             
            passage = getPassage(text, flowtag);
            text = passage[0];        
       
            n = 1;
            x = 10; y = 10;
            textin = text;
            textout = "";            
            textout2 = ""; 
            id = "";
            charin  = textin.indexOf("* ");
            charout  = textin.indexOf("\n* ",charin);  
            charout2 = textin.indexOf("\n  * ",charin);  
            
            if (charout  == -1) {charout  = textin.length;}            
            if (charout2 == -1) {charout2 = textin.length;}            
            if (charout > charout2) charout = charout2

            console.log("---"+textin+"----");
            
            while (charin > 0) {                
                charout = textin.indexOf("\n* ",charin+1);
                charout2 = textin.indexOf("\n  * ",charin+1);  
        
                if (charout == -1) {charout = textin.length;}          
                if (charout2 == -1) {charout2 = textin.length;}            
                if (charout > charout2) charout = charout2
                
                titulo  = textin.substring(charin+2,textin.indexOf('\n',charin + 3));                 
                link = titulo.substring(titulo.indexOf('(')+1, titulo.indexOf(')'));                                
                titulo = titulo.substring(titulo.indexOf('[')+1, titulo.indexOf(']'));
                oldid = id;
                id = titulo.replace(/[ |:|\<b.]/g,'-').toLocaleLowerCase();
                textout = textout + "<a id='" + id + "' href='"+link+"' class='image-map-flow text strong-tint button' style=' left: "+x+"%; top: "+y+"%;'>"+titulo+"</a>\n";
                textout2 = textout2 + "new LeaderLine(document.getElementById('"+oldid+"'),document.getElementById('"+id+"'), {color: 'black', size: 3, path: 'magnet'});\n";
                
                
                charin  = charout + 1;
                n++;
                if (charout == textin.length) {break;}    
                                
                x = x + 10;
                if (x > 100) {
                x = 0; y = y + 10;
                    
                }
                
            }
            console.log(textout);    
            console.log("##########################\n\n");
            console.log(textout2);    
            document.getElementById("textout").innerHTML = textout;
        }
    } 
    xmlhttp.send(null);        
}