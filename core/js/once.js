/*   */
/* Pre process all the text in order to execute less javascript */
/*   */

function toread() {
    
    var dest_div = "texto";
    var file_in  = "content-debug.html"        
    
     if (window.location.href.indexOf("version") > -1)
        { 
            version = 5;
            file_in  = "content-5-debug.html";
        }
    
    var element = document.getElementById(dest_div);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", file_in);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var text = xmlhttp.responseText;                       
            text = Repair(text);
            text = unescapef(text);
            text = marked(text);                                   
            var search = 0;
            var search_out = 0;
            var end = text.lastIndexOf("<tw-passagedata");
                   
            do {
                search = text.indexOf("<tw-passagedata", search_out);                
                search_out = text.indexOf(">", search);                
                var passage = text.substring(search, search_out);
                var title = gettitle(passage); 
                
                var inside = "<h5>" + title + "</h5>";
                //var inside = "<h4 style='page-break-before: always;text-align: center;'><br>" + title + "</h4>";
                text = text.substring(0, search_out + 5) + inside + text.substring(search_out + 5, text.length);
                //end = end + inside.length + 9;                
                
            } while (search < end);            
            
            // Replace h3 -> h4
            reg = new RegExp("h3", "g");                       
            text = text.replace(reg, "h4");
            
            // Replace h2 -> h3
            reg = new RegExp("h2", "g");                       
            text = text.replace(reg, "h3");
            
            // Replace h3 -> h4
            reg = new RegExp("h1", "g");                       
            text = text.replace(reg, "h2");
            
            // Replace h3 -> h4
            reg = new RegExp("h5", "g");                       
            text = text.replace(reg, "h1");
            
            element.innerHTML = text; 
            document.getElementById('downloadlink').style = "display:none";
        } 
    }
    xmlhttp.send(null);    
}

function starting() {   
    
     createlink('texto','content-debug.html','downloadlink',"v3");
     createlink('texto-5','content-5-debug.html','downloadlink-5',"v5");
     createlink('texto-es','content-es-debug.html','downloadlink-es',"v3es");
     createlink('texto-es-5','content-es-5-debug.html','downloadlink-es-5', "v5es");
    
    }

function createlink(dest_div,file_in,link,version) {
    
    var element = document.getElementById(dest_div);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", file_in);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {             
            var text = xmlhttp.responseText;  
            text = getRules(text,version);
            text = Repair(text);            
            text = unescapef(text);
            text = marked(text);            
            element.innerHTML = text; 
            UpdateLinkForFile(link, text);
        }
    }
    xmlhttp.send(null);
    
   // toread();
}


function UpdateLinkForFile(id, text) {
    
    var link  = document.getElementById(id);
    link.href = makeTextFile(text);    
    
}

makeTextFile = function (text) {
      
    var data = new Blob([text], {type: 'text/plain'});
    var textFile = window.URL.createObjectURL(data);

    return textFile;
}


/* Tools for Repairing Links */

function Repair(text) {

    var element = document.createElement("div");
    element.innerHTML = text;

    var index = Index(element);

    var end = text.lastIndexOf("[[");
    var search_out = 0;
    do {
        search = text.indexOf("[[", search_out);
        search_out = text.indexOf("]]", search);
        var link = text.substring(search + 2, search_out);

        for (var i = 0; i < index[0].length; i++) {
            if (link == index[0][i]) {
                text = text.substring(0, search) + text.substring(search + 1, search_out + 1) + index[1][i] + text.substring(search_out + 2, text.length);
            }
        }

    } while (search < end);

    return text;
    
}
/*
function Index(element) {

    var elements = element.getElementsByTagName('tw-passagedata');
    for (var i = 0; i < elements.length; i++) {
        pid = elements[i].getAttribute("pid");
        tag = elements[i].getAttribute("tags");
        name = elements[i].getAttribute("name");
        index[0][i] = "" + name;
        index[1][i] = "(" + tag + ".html?param=" + pid + ")";
        index[2][i] = "" + tag;
    }
    return index;
}
*/

function Index(element) {

    var elements = element.getElementsByTagName('tw-passagedata');
    for (var i = 0; i < elements.length; i++) {
        pid = elements[i].getAttribute("pid");
        tag = elements[i].getAttribute("tags");
        var tag = tag.split(" ")[0];
        name = elements[i].getAttribute("name");
        index[0][i] = "" + name;
        index[1][i] = "(" + tag + ".html?param=" + pid + ")";
        index[2][i] = "" + tag;
    }
    return index;
}

function gettitle(text) {
    var search     = text.indexOf('name="');
    var search_out = text.indexOf('"',search + 7);   
    return text.substring(search + 6,search_out);    
}

function getRules(text, version) {
    
if (version == "v3es") {
    
for (var i = 0; i < aventuralinks_3a_es.length; i++) {   
        reg = new RegExp("\\*" + aventuralinks_3a_es[i][0] + "\\*", "gi");                       
        text = text.replace(reg, "[" + aventuralinks_3a_es[i][0] + "](" + aventuralinks_3a_es[i][1] +")");
}
    
for (var i = 0; i < aventuralinks_3a_en.length; i++) {      
        reg = new RegExp("\\*" + aventuralinks_3a_en[i][1] + "\\*", "gi");                       
        text = text.replace(reg, "[" + aventuralinks_3a_en[i][1] + "](" + aventuralinks_3a_en[i][0] +")");
    }
for (var i = 0; i < biblioteca_3a_en.length; i++) {   
        reg = new RegExp("\\*" + biblioteca_3a_en[i][1] + "\\*", "gi");                       
        text = text.replace(reg, "[" + biblioteca_3a_en[i][1] + "](" + biblioteca_3a_en[i][0] +")");
    }
for (var i = 0; i < biblioteca_3a_aux_en.length; i++) {   
        reg = new RegExp("\\*" + biblioteca_3a_aux_en[i][1] + "\\*", "gi");                       
        text = text.replace(reg, "[" + biblioteca_3a_aux_en[i][1] + "](" + biblioteca_3a_aux_en[i][0] +")");
    }
    
    }
else if (version == "v3")
    {
    
for (var i = 0; i < aventuralinks_3a_en.length; i++) {      
        reg = new RegExp("\\*" + aventuralinks_3a_en[i][1] + "\\*", "gi");                       
        text = text.replace(reg, "[" + aventuralinks_3a_en[i][1] + "](" + aventuralinks_3a_en[i][0] +")");
    }
for (var i = 0; i < biblioteca_3a_en.length; i++) {   
        reg = new RegExp("\\*" + biblioteca_3a_en[i][1] + "\\*", "gi");                       
        text = text.replace(reg, "[" + biblioteca_3a_en[i][1] + "](" + biblioteca_3a_en[i][0] +")");
    }
for (var i = 0; i < biblioteca_3a_aux_en.length; i++) {   
        reg = new RegExp("\\*" + biblioteca_3a_aux_en[i][1] + "\\*", "gi");                       
        text = text.replace(reg, "[" + biblioteca_3a_aux_en[i][1] + "](" + biblioteca_3a_aux_en[i][0] +")");
    }
        
    }
    
else if (version == "v5es") {
    
for (var i = 0; i < aventuralinks_5a_es.length; i++) {   
        reg = new RegExp("\\*" + aventuralinks_5a_es[i][0] + "\\*", "gi");                        
        text = text.replace(reg, "[" + aventuralinks_5a_es[i][0] + "](" + aventuralinks_5a_es[i][1] +")");
 }
for (var i = 0; i < biblioteca_5a_en.length; i++) {   
        reg = new RegExp("\\*" + biblioteca_5a_en[i][1] + "\\*", "gi");                       
        text = text.replace(reg, "[" + biblioteca_5a_en[i][1] + "](" + biblioteca_5a_en[i][0] +")");
    }

}
    
else if (version == "v5") {
    
for (var i = 0; i < aventuralinks_5a_en.length; i++) {   
        reg = new RegExp("\\*" + aventuralinks_5a_en[i][0] + "\\*", "gi");                        
        text = text.replace(reg, "[" + aventuralinks_5a_en[i][0] + "](" + aventuralinks_5a_en[i][1] +")");
 }
for (var i = 0; i < biblioteca_5a_en.length; i++) {   
        reg = new RegExp("\\*" + biblioteca_5a_en[i][1] + "\\*", "gi");                       
        text = text.replace(reg, "[" + biblioteca_5a_en[i][1] + "](" + biblioteca_5a_en[i][0] +")");
    }
    
}
    
    return text;
}
