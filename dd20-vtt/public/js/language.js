
function translateweb(lang) {
    
      if(lang == 'es') {
        console.log("Traducimos al español!!!")
        document.getElementById("circle").innerText = "Añadir Token"   //Add Token
        document.getElementById("into-track").innerText = "Al Track"   //Into  Track
        document.getElementById("bshowasset").innerText = "Mostrar ayudas de juego"   //Show Player's Assets
        document.getElementById("baddasset").innerText = "Añadir ayudas de juego"   //Add asset
        document.getElementById("change").innerText = "Establecer fondo"   //Set Background Image
        document.getElementById("bchangetilesize").innerText = "Establecer tamaño de token"   //Set Tile Size
        document.getElementById("bsavescene").innerText = "Salvar escena"   //Save Scene
        document.getElementById("bloadscene").innerText = "Cargar Escena"   //Load Scene
        document.getElementById("chat-button").innerText = "Enviar"   //Send            
        document.getElementById("bshare").innerText = "Compartir tablero"   //Share
        document.getElementById("boptions").innerText = "Mas opciones"   //Options
        document.getElementById("enable-fog").innerText = "Activar Niebla"   //Enable Fog
        document.getElementById("add-fog").innerText = "Revelar Zona"   //Reveal Area
        document.getElementById("clear-fog").innerText = "Resetear Niebla"   //Reset Fog
        document.getElementById("undo-fog").innerText = "Deshacer"   //Undo Fog
        document.getElementById("into-music").innerText = "Añadir Canción"   //Add Song
        document.getElementById("new-roll").innerText = "Configurar nueva tirada"   //Configure New Roll
        document.getElementById("new-roll").innerText = "Nueva tirada"   //New Roll
        document.getElementById("hidden-roll").innerText = "Esconder la tirada"   //Hide Dice
        document.getElementById("bcombineroll").innerText = "Combinar tirada"   //Combine Roll
        document.getElementById("combine-dice-ok").innerText = "Aceptar"   //Ok
        document.getElementById("bdicerender").innerText = "Calidad de los dados"   //Dice Render Quality
        document.getElementById("bcombine").innerText = "Calidad de los dados"   //Dice Render Quality
        document.getElementById("bcopysceneurl").innerText = "Copiar Escena"   //Copy Scene
        document.getElementById("bexporscene").innerText = "Exportar a archivo"   //Export File...
        document.getElementById("bfixproblems").innerText = "Borrar todo"   //Delete all Data
        document.getElementById("bcloseconfig").innerText = "Cerrar"   //Close
        document.getElementById("bprevisupage").innerText = "Previo"   //Previous
        document.getElementById("bnextpage").innerText = "Anterior"   //Next
        document.getElementById("bloadimagespdf").innerText = "Cargar Imagenes"   //Load Images
        document.getElementById("bloadallimagespdf").innerText = "Cargar Todas las imagenes"   //Load All Images
        document.getElementById("bclose2").innerText = "Cerrar"   //Close
        document.getElementById("bdonotshow").innerText = "No mostrar más"   //Don't show it again 

        document.getElementById("ploadscenesetc").innerText = "Cargar escenas, ayudas y múscia desde archivo"   //Load scenes, assets and music from file
        document.getElementById("psavescenesetc").innerText = "Salvar escenas, ayudas y múscia en archivo"   //Save scenes, assets and music to file
    
        document.getElementById("mTokens").innerText = "Tokens"   //Tokens
        document.getElementById("mAssets").innerText = "Ayudas"   //Assets
        document.getElementById("mMaps").innerText = "Mapas"   //Maps
        document.getElementById("mFog").innerText = "Niebla"   //Fog
        document.getElementById("mChat").innerText = "Chat"   //Chat
        document.getElementById("mDice").innerText = "Dados"   //Dice
        document.getElementById("mMusic").innerText = "Musica"   //Music
        document.getElementById("mOptions").innerText = "Opciones"   //Options
        document.getElementById("pdefaultokens").innerText = "Tokens por defecto"   //Default Tokens
        document.getElementById("psizeoftoken").innerText = "Selecciona el tamaño del token"   //Select size of token
        document.getElementById("puloadcopyorbrowse").innerText = "Carga archivo, pega URL o buscan en tu PC"   //Upload, copy URL or browse used images
        document.getElementById("puloadcopyorbrowse2").innerText = "Carga archivo, pega URL o buscan en tu PC"   //Upload, copy URL or browse used images
        document.getElementById("pdefaultvisibility").innerText = "Visible por defecto"   //Default Visibility
        document.getElementById("puloadcopyorbrowse3").innerText = "Carga archivo, pega URL o buscan en tu PC"   //Upload, copy URL or browse used images
        document.getElementById("pscenescontains").innerText = "Las escenas contienen el fondo así como también los tokens"   //Scenes contain background and also all the tokens
        document.getElementById("pcharactersname").innerText = "Nombre de personaje"   //Character's Name
        document.getElementById("ppasteURLformusic").innerText = "Pega la URL del archivo de música (dropbox también funciona)"   //Paste URL to your music file (dropbox included)
        document.getElementById("pselectmenu").innerText = "Selecciona las funciones <br>que quieres mostrar u ocultar"   //Select the menu functions<br> you want to Show or Hide
        document.getElementById("pclickanddrag").innerText = "Clica y arrastra para definir el tamaña del token estándar, depués todo se ajustará perfecto"   //Click and drag in order to setup the tile size, then all your tokens will fit perfect on your map.
        document.getElementById("pfileisloading").innerText = `El archivo se está cargando...
        Por favor Espera`   // File is loading...  Please wait!                        
        document.getElementById("pcontrolV").innerText = "Puedes hacer CTRL + V, para pegar una imagen simplemente"   //You can just CTRL + V, to paste from the clipboard on the board. 
        document.getElementById("puploadfullpdf").innerText = "Puedes cargar un PDF completo con todas sus imágenes"   //You can also upload a full PDF with many images. 
        document.getElementById("pusemousewhell").innerText = "Usa la rueda del ratón para hacer zoom"   //Use mouse wheel to zoom into the board. 
        document.getElementById("puserigthclick").innerText = "Usa el botón derecho para mover el fondo"   //Use mouse rigth click and pan to move the board. 
        document.getElementById("pdraganddroptokens").innerText = "Arrastra los tokens directamente en el mapa"   //Drag and drop tokens into <br>the board / Initiative bar.
        document.getElementById("pdraghitpoints").innerText = "Arrastra las tiradas directamente como puntos de vida sobre los tokens"   //Drag Hit points from the chat area onto any token. 
        document.getElementById("paltclick").innerText = "Pulsa ALT sobre un token para ver sus estadísticas de dndbeyond"   //Alt + Click to see dndbeyond stats of any monster.
        document.getElementById("pchromeextension").innerText = "Siempre que utilices la extensión de chrome"   //While using chrome extension and visiting monster webpage. 
    
        document.getElementById("pswitchtoold").innerText = "Volver a interfaz antigua"   //Switch to old interface
    
        document.getElementById("lassetsoptions").innerText = "Opciones de ayudas de juego"   //Assets options
        document.getElementById("lhidetools").innerText = "Esconder herramientas"   //Hide tools
        document.getElementById("lmedium").innerText = "Mediano"   //Medium
        document.getElementById("llarge").innerText = "Grande"   //Large
        document.getElementById("lhuge").innerText = "Gigante"   //Huge
        document.getElementById("lfree").innerText = "Libre"   //Free
        document.getElementById("ldicebar").innerText = "Barra de dados"   //Dice bar
        document.getElementById("linittracker").innerText = "Control de iniciativa"   //Initiative tracker
        document.getElementById("lassetsbar").innerText = "Barra de ayudas de juego"   //Assets bar
        document.getElementById("laddtokenbar").innerText = "Añadir la barra de tokens"   //Add token bar
        document.getElementById("lurltokenbar").innerText = "URL de la barra de tokens"   //URL token bar
        document.getElementById("ltokensbar").innerText = "Menu de tokens"   //Tokens bar
        document.getElementById("lstandardtokensbar").innerText = "Menu de tokens estandar"   //Standard tokens bar
        document.getElementById("lfogbar").innerText = "Menu de niebla"   //Fog bar
        document.getElementById("lsetbackground").innerText = "Establecer fondo"   //Set Background
        document.getElementById("lmusicbar").innerText = "Menu de música"   //Music bar
        document.getElementById("lscenebar").innerText = "Menu de escenas"   //Scene bar
        document.getElementById("lassetsbar2").innerText = "Menu de ayudas de juego"   //Asset Bar
        document.getElementById("lmenubackground").innerText = "Menu de fondos"   //Menu Background
        document.getElementById("lhitpointsontokens").innerText = "Puntos de vida en los tokens"   //Hit points on tokens
        document.getElementById("ldistancebar").innerText = "Medidor de distancia"   //Distance Bar
        document.getElementById("linmersivemode").innerText = "Modo inmersivo"   //Player Inmersive mode
        document.getElementById("ldicerolling").innerText = "Lanzar dados"   //Dice Rolling
        document.getElementById("lchatview").innerText = "Chat"   //Chat
        document.getElementById("lassetslistview").innerText = "Lista de ayudas"   //Assets List
        document.getElementById("lplotview").innerText = "Modo investigación"   //Plot View
        document.getElementById("ldistancetool2").innerText = "Herramienta de distancia"   //Distance Tool
        document.getElementById("linitracker2").innerText = "Control de iniciativa"   //Initiative track
        document.getElementById("lblackback").innerText = "Fondo negro"   //Black Background
        document.getElementById("lnamesoninittrack").innerText = "Nombres en la iniciativa"   //Write names on Initiative Tracker
        document.getElementById("lpasteasasset").innerText = "Pegar como ayuda de juego por defecto"   //Paste Asset by default
        document.getElementById("lseeplayerasset").innerText = "Ver las ayudas de juego de jugadores"   //See player Assets
        document.getElementById("lpantwofingers").innerText = "Usar dos dedos para arrastrar"   //Tow finger to pan
        document.getElementById("lleftckclickpan").innerText = "Usar un dedo para arrastrar"   //left click to pan
        document.getElementById("lallowplayermusic").innerText = "Permitir que los jugadores pongan musica"   //Allow all players to put music
        document.getElementById("lmayfix").innerText = "Borrar todo (puede arreglar problemas)"   //(may fix problems)
    
        document.getElementById("token-map").placeholder = "... url a tu archivo de imagen ..." // ... url to your image file ... token or backgroound ...
        document.getElementById("asset-url").placeholder = "... url a tu archivo de imagen ..." // ... url to your image file ... token or backgroound ...
        document.getElementById("map-url").placeholder = "... url a tu archivo de imagen ..." // ... url to your image file ... token or backgroound ...
        document.getElementById("music-url").placeholder = "... url a tu archivo de audio ..." // ... url to your mp3 file ...
    
      }
        
    }

    
function translateweb_index(lang) {

    if(lang == 'es') {
      document.getElementById('peasiest').innerHTML = "El tablero virtual mas sencillo del mundo"; // Simplest, easiest and fastest Virtual Tabletop
      document.getElementById('feedback').innerHTML = "Comentarios aquí"; // Feedback Here
      document.getElementById("bnewroom").innerHTML = "Nueva Sala"    // New Room
      document.getElementById("bcontinue").innerHTML = "Continuar"   // Continue last game
      document.getElementById("bexample").innerHTML = "Ejemplos de tableros"    // Board Examples
      document.getElementById("bnewold").innerHTML = "Nueva sala (interfaz antigua)"      // New Room (Old interface)
      document.getElementById("bcontinueold").innerHTML = "Continuar (interfaz antigua)" // Continue (Old interface)
      document.getElementById("alltext").innerHTML = `<p>
                  <ul>
                      <li>Para entrar como jugador, el master debe compartir su enlace contigo
                      </li>
                 
                          <li>
                              Puedes conectar tu ficha de dndbeyond utilizando <a href="https://chrome.google.com/webstore/detail/beyond-digital-d20/jodofclnfifmpeopfjppbicljjnjjnmo">la extensión de navegador</a>
                          </li>
                          <li>
                              Esa misma extensión te permitirá:
                               Hacer tiradas con los monstruos y ver sus estádisticas dentro del tablero y 
                               cargar todas las imágenes automáticamente de la aventura que tengas abierta.
                          </li>
                      
                      <li>
                          Si quieres enlazar videos hechos por tí debes subirlos a <a href="https://www.dropbox.com">dropbox</a>
                      </li>
                      <li>
                          Para la videoconferencía te recomendamos zoom o skype.  
                          <li>
                          Si quieres manejar la música y los sonidos desde aquí puedes!!!, pero piensa que esto es web y que puedes usar una aplicación externa como <a href="https://tabletopaudio.com/">TableTopAudio</a> 
                      </li>
                          <li>
                          Los tokens se crean con cualquier imagen pero si quieres dejarlos bonitos utiliza una aplicación online como <a href="https://thefatefulforce.com/battle-resources/token-creator/">thefatefulforce</a>
                      </li>
                      </li>
                      <li>
                          Gracias por patrocinarnos <a target="_blank" href="https://www.patreon.com/dd20" class="patreon">PATREON</a>! (con esto pagamos el servidor nada más)
                      </li>
                      <li>
                          Descárgate el código y colabora con el proyecto <span class="github-button" onclick="window.open('https://github.com/nomine555/dd20','_blank')"><img src="https://digitald20.com/vtt/img/GitHub-Mark-Light-120px-plus.png"><img src="https://digitald20.com/vtt/img/GitHub_Logo.png" style="filter: invert(100%);"></span> 
                      </li>
                      <li>Los estupendos dados son obra de <a href="http://www.teall.info/2014/01/online-3d-dice-roller.html">Anton Natarov</a></li>
                  </ul>
        </p>`
    }
      
  }

  