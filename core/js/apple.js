
/*function SaveSettings(content_file, tutorial) {  
	
 var message = { "content_file":content_file , "tutorial": tutorial }
 
 	try {
	window.webkit.messageHandlers.SaveSettings.postMessage(message);
	} catch (error) {
		console.log("no estamos en iOS")
	}
    
}    

function GetSettings(content_file, tutorial) {  
 var message = { }
 
 try {
	window.webkit.messageHandlers.GetSettings.postMessage(message);

} catch (error) {
		console.log("no estamos en iOS")
	}

}

function LoadPassageIndex(file, id, dest_div, locationhash, tag) {  
 var message = { "file":file , "id": id, "dest_div": dest_div, "locationhash":locationhash , "tag":tag}

try {
 window.webkit.messageHandlers.LoadPassageIndex.postMessage(message);

} catch (error) {
		console.log("no estamos en iOS")
	}
 
}

function LoadPassageEncounter(file, id, title_div, main_div, glance_div, conclusion_div) {
    var message = { "file":file , "id": id, "title_div": title_div, "main_div":main_div, 
                    "glance_div":glance_div, "conclusion_div":conclusion_div }

try {
	window.webkit.messageHandlers.LoadPassageEncounter.postMessage(message); 

} catch (error) {
		console.log("no estamos en iOS")
	}
	
}

function LoadWiki(fragment_url) {
    
    if (fragment_url.indexOf('lugares.html') > -1) {        
        LoadTextonMap(fragment_url);
        return;        
    }

    AddLastinfo(fragment_url);

    var url = fragment_url;
    if (fragment_url.indexOf("#") > -1){
        if (fragment_url.indexOf("#") > 0)
            url = fragment_url.substring(0, fragment_url.indexOf("#"));
        else {
            location.hash = fragment_url;
            return;
        }}
    
    var message = { "fragment_url":fragment_url, "url":url }
    window.webkit.messageHandlers.LoadWiki.postMessage(message);    
}

function LoadPassageNPC(file, id, dest_div) {
    var message = { "file":file , "id": id, "dest_div": dest_div }

	try {
	window.webkit.messageHandlers.LoadPassageNPC.postMessage(message);        

} catch (error) {
		console.log("no estamos en iOS")
	}

}

function LoadContentTutorial(file, dest_div, id) {
    var message = { "file":file , "dest_div": dest_div, "id": id }
	try {
	window.webkit.messageHandlers.LoadContentTutorial.postMessage(message);  

} catch (error) {
		console.log("no estamos en iOS")
	}

}

function LoadTextonMap(fragment_url) {  
    var url = getContentFile();
    var message = { "fragment_url":fragment_url , "url": url }

	try {
	window.webkit.messageHandlers.LoadTextonMap.postMessage(message);  

} catch (error) {
		console.log("no estamos en iOS")
	}

}

function LoadMap(fragment_url, element_id, leyenda, size, show) {
    
    var showlayer = 0;
    if (arguments.length > 4) {
        
        showlayer = show;
        if (maps[show] > 0) {
            Show(showlayer);
            return;
        }
        else maps[show] = 1;
    }
    showlayer = "" + showlayer;
    leyenda   = "" + leyenda;
    var message = { "fragment_url":fragment_url , "element_id": element_id,
                   "leyenda": leyenda, "size":size, "showlayer":showlayer }
    window.webkit.messageHandlers.LoadMap.postMessage(message);
}

/*
function loadAdventure(name, id) {
    
        console.log("loading..."+name+" "+id);
        var masteron = document.getElementById("masteron").checked;
        
        var play        = document.getElementById("ahidden").innerHTML;
        var download    = document.getElementById("dhidden").innerHTML;
        var downloading = document.getElementById("dinghidden").innerHTML;
        
        if (masteron) {
            
            if (document.getElementById("a-" + id).innerHTML == play)
                location.href=name;
            else if (document.getElementById("a-" + id).innerHTML == download)
            {
                document.getElementById("a-"+id).innerHTML = downloading;
                document.getElementById("d-"+id).style.display = "block";
                var message = { "id":id }
                window.webkit.messageHandlers.Download.postMessage(message);
            }
            else{
                var message = { "id":id }
            window.webkit.messageHandlers.Buy.postMessage(message);
            }
        } else {
            if (document.getElementById("a-" + id).innerHTML == play)
                location.href=name.replace("index.html","index-player.html").replace("tutorial.html","index-player.html");
        }
        
    

}


function loadCupon() {
    code = document.getElementsByName("cupon")[0].value;
    var message = { "code":code }
    window.webkit.messageHandlers.getCupon.postMessage(message);
}

/*
function getBuyedItems() {
    var aventuras = "salorium,fragmentos,casa-embajador,vestigio-hundido,costa-bruma,los-pecados,preceptos,beastmasters-daughter,burning-goblins"
    var descargas ="9x4lk3mr4kfw0wl,3juwwyuwdj05abz,l7dbewtgawo9y6t,uz7ao2en1mk3hxe,5iwzqovqmaoh8mp,ntgk45ubbo90d6c,dyi3n0o8x8jia75,xmqpkuc6tl7manq,4dnwljk31ce2d6f"
    var compras ="costa-bruma"
    var message = { "aventuras":aventuras , "descargas":descargas , "compras":compras }
    window.webkit.messageHandlers.getBuyed.postMessage(message);
}


function resetBuyedItems() {
    var message = { "none":"none" }
    window.webkit.messageHandlers.resetBuyed.postMessage(message);
}

function LoadDD20() {
	
		try {
		 var message = { }
    window.webkit.messageHandlers.OpenApp.postMessage(message);
			
	} catch (error) {
		console.log("no estamos en iOS");
	}
	try {
		Android.OpenMarket();
	} catch (error) {
		console.log("no estamos en Android");
	}

}
*/
