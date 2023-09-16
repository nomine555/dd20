// ------------------------------------------------------------------- // 
// This function is call form login page

  function init() {

    if(location.href.indexOf('?') > 0)
    {

      var resturl = location.href.substring(location.href.indexOf('?')+1);
      console.log(resturl);

      // http://localhost/adventures/isla.txt
      // http://localhost/load?adventures/isla.txt
      
      fetch(resturl)
      .then(response => response.json())      
      .then( data => load_all_data(data) )
      .then(load_page())                                        

    }
  }

  function load_page() {
    const id = Date.now() + "" + Math.floor(Math.random() * 1000000000);
    localStorage.setItem('dd20room', "/room/" + id);
    localStorage.setItem('dd20user', 'dm')
    localStorage.setItem('lastdd20room',id);
    window.location.assign("/newroom/" + id + "?scene=1");       
  }
  
  function load_all_data(obj) {
  
    console.log(obj)

    var scenes = obj.scenes;
    var names = obj.names;
    var assets = obj.assets;
    var music = obj.music;
    var all   = obj.all;
  
    lista        = JSON.parse(localStorage.getItem('allscenes')) || [];
    lista_names  = JSON.parse(localStorage.getItem('allscenesnames')) || [];
    lista_all    = JSON.parse(localStorage.getItem('allassets')) || [];
    
    for (var i = 0; i < names.length; i++) {      
      if (!checklistvalue(names[i],lista_names)) {
        lista.push(scenes[i]);
        lista_names.push(names[i]);
      }
    }

    for (var i = 0; i < all.length; i++) {          
      if (!checklistvalue(all[i],lista_all))
        lista_all.push(all[i]);    
    }
  
    localStorage.setItem('allscenes', JSON.stringify(lista));
    localStorage.setItem('allscenesnames', JSON.stringify(lista_names));
    localStorage.setItem('allassets', JSON.stringify(lista_all));
  
    
      for (i = 0; i < assets[0].assets.length; i++) {    
        addtoplayerAssets(assets[0].assets[i])
        localStorage.setItem("asset" + i, assets[0].assets[i])    
        }
        localStorage.setItem("assetN", assets[0].assets.length)
    
      for (i = 0; i < music[0].music.length; i++) {
        add_music(music[0].music[i])
        }  
    
        //console.log(localStorage.getItem("assetN"))

    savetoplugin() 
  }

  function checklistvalue(id, lista) {
    if (lista !== undefined) {
    for (var i = 0; i < lista.length; i++) {
      if(lista[i] == id) return true;
    }
    return false;
  } else return false;
  }


  function add_music(link) {

    console.log(link)
      
    musicN = localStorage.getItem("musicN")
    if (musicN !== null)
      n = parseInt(musicN)
    else n = 1

      localStorage.setItem("musicN", n+1)
      localStorage.setItem("music" + (n-1), link)
  
  }

  function addtoplayerAssets(asset) {

    var lista = [];  
    lista = JSON.parse(localStorage.getItem('allassets')) || [];
  
    if (!checklistvalue(asset,lista)) {
      lista.push(asset);
      localStorage.setItem('allassets', JSON.stringify(lista));      
    }
    
  }

  function savetoplugin() {
  
    try {
      chrome.runtime.sendMessage(chromeid, {data: geteverything()}, function(response) {
        if (!response.success)
          console.log("Error con los mensajes con plugin");
      });
      } catch(error) {
        console.log("No plugin loaded");
      }
    }
