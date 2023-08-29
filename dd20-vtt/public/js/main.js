
// Set up socket.io
const socket = io(window.location.origin);

// Initialize a Feathers app
const app = feathers();
const channel = window.location.pathname;

// Language
var browserLanguage = navigator.language || navigator.userLanguage;
console.log("Browser Language: " + browserLanguage);
translateweb(browserLanguage)

// Register socket.io to talk to our server
app.configure(feathers.socketio(socket));

// Fast Canvas
fabric.fastCanvas = function(_super){
  var __hasProp = {}.hasOwnProperty;
  var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  return (function(_super) {
    __extends(fastCanvas, _super);
    function fastCanvas() {
      this.frame;
      fastCanvas.__super__.constructor.apply(this, arguments);
    }
    fastCanvas.prototype.renderAll = function() {
      var args = arguments;
      var that = this;
      window.cancelAnimationFrame(this.frame);
      this.frame = window.requestAnimationFrame(function(){
        fastCanvas.__super__.renderAll.apply(that, args);
      });
    };
    return fastCanvas;
  })(_super || fabric.Canvas);
};

var fastCanvas = fabric.fastCanvas(fabric.CanvasWithViewport)

var startingapp = true
setTimeout(() => {
  startingapp = false
}, 10000);

// Canvas
//var canvas =  new fabric.Canvas("c", {
var canvas =  new fastCanvas("c", {

  hoverCursor: "pointer",
  fireRightClick: true
});

canvas.justDeleted = 0;
canvas.touchenable = false;
canvas.lastscale = 1;
var retrycount = 0;
var fog;
var square;
var fogHoles = [];
var rollN = 1;
var combineDice;
var NRolls = 0;
var dice_enabled = true;
var mc = new Hammer.Manager(document.getElementById("cw"));
var pinch = new Hammer.Pinch();

mc.add(pinch);
// Dice box
var box;
// Global Variables
var user = "";
var room = "";
var connected = false;
var tileSize = 60;
var plottileSize = 60;
var plotBackground = "https://digitald20.com/core/images/index/index-map-1920.jpg";
var mainBackground = ""; 
let mintileSize = 24;
var waittime = 500;
let animationtime = 500;
var tokenN = 1;
var fogrunning = false;
//var tokenS = 0;
var MaxTokens = 5;
var videobackground = false;
var lasthp;
var generalid = Math.floor(Math.random() * (5000));
let maxItems = 30;
let IconVideo = "../img/video.jpg";
let shadowblur = 15;
let shadowoff = 0;
let shadowopacity = 1;

// ImageKit
var imagekit = new ImageKit({
  
  publicKey: "public_DYilnmhVRFXigmTUrGtuCcGZpok=",
  urlEndpoint: "https://ik.imagekit.io/fiade", 
  authenticationEndpoint: "https://board.digitald20.com/signature"
  //authenticationEndpoint: "http://localhost/signature"
});

// Chrome                
let chromeid = "jodofclnfifmpeopfjppbicljjnjjnmo" // PUBLICO
//let chromeid = "fhmfkllihjefkdbppineegdmgknjahif" // DESARROLLO

// PDF
var pdfDoc = null,
    pageRendering = false,
    pageNumPending = null,
    pageNum = 1;

    
// ----------------------------------------------------------------- //

function setViewDM() {

    var slides = document.getElementsByClassName("for-admin");
    for(var i = 0; i < slides.length; i++)
      {
        slides[i].style.display = "inherit";
        if (slides[i].classList.contains("over-audio"))
          slides[i].style.display = "flex";
      }

    document.getElementById("player-name").value = "Dungeon Master";
    document.getElementById("player-name").disabled = true;
    document.getElementById("player-name").style.display = "none";
}

function setViewPlayer() {
  document.getElementById("player-name").value = user;

  var slides = document.getElementsByClassName("for-player");
  for(var i = 0; i < slides.length; i++)  
    slides[i].style.display = "inherit";
  
  var slides = document.getElementsByClassName("only-admin");
  for(var i = 0; i < slides.length; i++)  
    slides[i].style.display = "none";
    
}

//checking if user is an admin
const checkAdmin = () => {
  if ((user === "dm") & (room === window.location.pathname.replaceAll('new',''))) {
    return true;
  } else {
    return false;
  }
  };


  function starting() {

    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var pdfjsLib = window['pdfjs-dist/build/pdf'];
    
    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js';
    
    // Start networking
      main();
      dice_color_load();
    
    // Check room and user name
      if (localStorage.getItem("dd20room") !== null)
        room = localStorage.getItem("dd20room");
    
      if (localStorage.getItem("dd20user") !== null)
        user = localStorage.getItem("dd20user");
      else
        user = "u" + getRandomInt(9999); 
    
      if((user === "dm") & !checkAdmin()) {
          user = "u" + getRandomInt(9999);
      }    

    // Para poder ocultar las ayudas
      document.getElementById("ontop").addEventListener('click', hide_menus);
    
    // Cargamos las imágenes de los Tokens
      if (localStorage.getItem("tokenN")  !== null) {
    
        tokenN = parseInt(localStorage.getItem("tokenN"));
        for (var i = 1; i < tokenN + 1 ; i++) {
          try {
            document.getElementById("t" + i).addEventListener('error',changeSrc);
            document.getElementById("t" + i).src = localStorage.getItem("tokenurl" + i).replaceAll(" ","%20");
          } catch (error) {
            console.log(error)
          }     
        }
      }

    
    // Cargamos los colores de los dados
    if (localStorage.getItem("dd20_fontcolor")  !== null) {
      fontColor  =  localStorage.getItem("dd20_fontcolor");
      backColor  =  localStorage.getItem("dd20_backcolor");
      document.getElementById("fontcolor").value = fontColor;
      document.getElementById("backcolor").value = backColor;      
    }

    namedmode  =  localStorage.getItem("named_mode");   
    if (namedmode == "false")   
      set_namemode(false);
    else
      set_namemode(true);
    
    musicmode  =  localStorage.getItem("music_mode");   
    if (musicmode == "false")   
      set_musicmode(false);
    else
      set_musicmode(true);
    
      if (checkAdmin()) {
        connected = true;
    
        setViewDM();
        var pboard = new URL(location.href).searchParams.get('b');
        var ptile = new URL(location.href).searchParams.get('t');
        var ex = new URL(location.href).searchParams.get('e');
        // Estamos cargando algo?
        var scene = new URL(location.href).searchParams.get('scene');      
        if (scene == 1)
          console.log("Estamos cargando una Aventura")
        
        // ----------------------------------------------------
        // Comprobamos que tenemos guardado algo room + data y que no nos pasan "ex" ni scene
        // -----------------------------------------------------
        if (localStorage.getItem(room + 'data') !== null && ex == null && scene == null) {
    
          var myboard = JSON.parse(localStorage.getItem(room + 'data'));
        
          // Cargamos el background o el TileSize por URL
          if (pboard !== null) {
            myboard.backgroundImage = "https://" + pboard;
          }
          if (ptile !== null) {
            tileSize =  checkminTile(parseInt(ptile));
          }

        // Cargamos la Niebla 
          try {                    
            if (localStorage.getItem(room + 'fogenabled') == 'true')  {
              console.log("activamos la niebla")
              canvas.fogEnabled = true;
              fogHoles       = JSON.parse(localStorage.getItem(room + 'fogholes')) || [];
              document.getElementById("add-fog").disabled = false;
              document.getElementById("clear-fog").disabled = false;
              document.getElementById("enable-fog").innerHTML = "Disable Fog";
              document.getElementById("undo-fog").style.display = "";
            }
            else  {
              console.log("desaactivamos la niebla")
              canvas.fogEnabled = false;
            }

           } catch (error) {console.log(error)}
    
        // Cargamos el Tablero
          window.setTimeout(function() {
             
            tileSize = checkminTile(myboard.tileSize);
            reDrawAll(myboard,addFog('update'));
            AddURLTokens();       

          }, waittime);
    
        // Cargamos la barra de iniciativa y demás después del Tablero
          window.setTimeout(function() {
            
            for (var i = 1 ; i < 9; i++) {
              try {
                //console.log(localStorage.getItem("tracksrc" + i))
                document.getElementById('track'+i).style.backgroundImage = localStorage.getItem("tracksrc" + i);
              if(document.getElementById('track'+i).style.backgroundImage !== "") {
                document.getElementById('track'+i).style.order = localStorage.getItem("trackorder" + i);
                if (namedmode)
                  document.getElementById('track'+i).firstElementChild.value = localStorage.getItem("trackhp" + i);
                else
                  document.getElementById('track'+i).firstElementChild.value = parseInt(localStorage.getItem("trackhp" + i));
                document.getElementById('track'+i).firstElementChild.style.display = "";
              }
              } catch (e) {
              }
           }            
    
        // Cargamos el chat       
           try {        
            if (localStorage.getItem(room + 'chat-log') !== null)  {
              document.getElementById("chat-log").innerHTML = localStorage.getItem(room + 'chat-log');                              
            }
           } catch (error) {console.log(error)}
    
        // Cargamos los Backgrounds
           try {
            var backgroundN = parseInt(localStorage.getItem("backgroundN"));
            var list = document.getElementById("background-list");
            for (i = 0; i< backgroundN; i++) {
              var img = document.createElement("img");
              img.src = localStorage.getItem("background" + i).replaceAll(" ","%20");
              img.tile = localStorage.getItem("backgroundTileSize" + i);
              img.className="bglist";
              img.id = "bckimg" + i;
              img.loading = "lazy";
              img.addEventListener('dragstart',  drag_scene_start, true);
              img.addEventListener('error',brokenlink);
              list.appendChild(img);
            }
          } catch (e) {console.log(e)}
    
        // Cargamos los Assets
          try {
            var assetN = parseInt(localStorage.getItem("assetN"));
            var list = document.getElementById("asset-list");
            for (i = 0; i< assetN; i++) {
            
              var img = document.createElement("img");
              var item = localStorage.getItem("asset" + i).replaceAll(" ","%20");
              if (IsVideo(item)) {
                img.src = IconVideo;
                img.setAttribute('video', item)
              } else {
                img.src = item;
              }
              
              img.classList.add("bglist");
              img.classList.add("grayed");
              img.loading = "lazy";
              img.id = "assett" + i;
              img.addEventListener('dragstart',  drag_scene_start, true);
              list.appendChild(img);
            }
          } catch (e) {console.log(e)}
        
          // Cargamos la Música
          try{
            
            var musicN = parseInt(localStorage.getItem("musicN"));
            var list = document.getElementById("music-list");
            //console.log(musicN)
            for (i = 0; i < musicN; i++) {          
              var item = localStorage.getItem("music" + i).replaceAll(" ","%20");
              //console.log("music" + i)
              //console.log(item)          
              if (item !== "undefined") {
                var div = document.createElement("div");             
                div.setAttribute("src", item);  
                div.innerHTML = crea_nombre(item);
                div.classList.add("musiclist");            
                div.id = "music" + i;      
                div.draggable = true;
                div.addEventListener('dragstart',  drag_scene_start, true);    
                list.appendChild(div);          
              }                              
            }
          } catch (e) {console.log(e)}     
          }, 2*waittime);
    
        }
        // ---------------------------------------------------------
        // No hay nada guardado es una sala nueva
        // ----------------------------------------------------------
        else if (scene == null) {
    
          
          if (ex == null)
            var myboard = JSON.parse('{"plotBackground":"https://digitald20.com/core/images/index/index-map-1920.jpg","backgroundImage":"https://digitald20.com/vtt/img/graveyard-map.jpg","background_width":1920,"background_heigth":960,"tileSize":60,"playerid":"dm","tokens":[{"src":"https://digitald20.com/vtt/img/thief.jpg","dd20size":1,"scaleX":0.10416666666666667,"scaleY":0.10416666666666667,"angle":0,"uprange":1,"zoomrange":1,"top":595,"left":537,"id":"dm50535"},{"src":"https://digitald20.com/vtt/img/mage.jpg","dd20size":1,"scaleX":0.10416666666666667,"scaleY":0.10416666666666667,"angle":0,"uprange":1,"zoomrange":1,"top":714,"left":240,"id":"dm241239"},{"src":"https://digitald20.com/vtt/img/fighter.jpg","dd20size":0.9999999999999999,"scaleX":0.10416666666666666,"scaleY":0.10416666666666666,"angle":0,"uprange":1,"zoomrange":1,"top":477.046439628483,"left":420.953560371517,"id":"dm261770"},{"src":"https://digitald20.com/vtt/img/ranger.jpg","dd20size":1,"scaleX":0.10416666666666667,"scaleY":0.10416666666666667,"angle":0,"uprange":1,"zoomrange":1,"top":475,"left":606,"id":"dm493210"},{"src":"https://digitald20.com/vtt/img/spectre.jpg","dd20size":2,"scaleX":0.20833333333333334,"scaleY":0.20833333333333334,"angle":0,"uprange":1,"zoomrange":1,"top":472,"left":483,"id":"dm281858"},{"src":"https://digitald20.com/vtt/img/halfling.jpg","dd20size":1,"scaleX":0.10416666666666667,"scaleY":0.10416666666666667,"angle":0,"uprange":1,"zoomrange":1,"top":231.6656346749225,"left":669.4148606811145,"id":"dm297252"},{"src":"https://digitald20.com/vtt/img/fire-ball.png","dd20size":-1,"scaleX":0.85,"scaleY":0.85,"angle":0,"leftrange":1,"uprange":1,"zoomrange":1,"top":420.0307406766989,"left":666.8785085506915,"id":"dm124446"}],"request":false,"squares":[],"roll":false}')
          else      
            var myboard = JSON.parse('{"plotBackground":"https://digitald20.com/core/images/index/index-map-1920.jpg","backgroundImage":"","background_width":1920,"background_heigth":960,"tileSize":60,"playerid":"dm","tokens":[],"request":false,"squares":[],"roll":false}')
                              
          // Cargamos por URL
          if (pboard !== null) {
            myboard.backgroundImage = "https://" + pboard;
          }
          if (ptile !== null) {
            tileSize =  checkminTile(parseInt(ptile));
          }    
          
          mainBackground = myboard.backgroundImage;
          canvas.fogEnabled = false;

          // Cargamos el Track de iniciativa por defecto. 
          // new-game
          /*
          if (ex == null ) {
            var j = 0;
              for (var i = 1 ; i < 7; i++) {
                j = i + 1;
                document.getElementById('track'+j).style.backgroundImage = "url('"+ document.getElementById('t'+i).src + "')";
                document.getElementById('track'+j).firstElementChild.style.display = "";
            }
          }
          */

          // Añadimos los nombres
          document.getElementById('track6').firstElementChild.value = "Yonsee";
          document.getElementById('track6').firstElementChild.style.display = "";
          document.getElementById('track6').style.backgroundImage = "url('https://digitald20.com/vtt/img/mage.jpg')";

          document.getElementById('track2').firstElementChild.value = "Monak";
          document.getElementById('track2').firstElementChild.style.display = "";
          document.getElementById('track2').style.backgroundImage = "url('https://digitald20.com/vtt/img/fighter.jpg')";

          document.getElementById('track3').firstElementChild.value = "Raghar";
          document.getElementById('track3').firstElementChild.style.display = "";
          document.getElementById('track3').style.backgroundImage = "url('https://digitald20.com/vtt/img/ranger.jpg')";

          document.getElementById('track4').firstElementChild.value = "Mr. Pirs";
          document.getElementById('track4').firstElementChild.style.display = "";
          document.getElementById('track4').style.backgroundImage = "url('https://digitald20.com/vtt/img/halfling.jpg')";

          document.getElementById('track5').firstElementChild.value = "Wilbur";
          document.getElementById('track5').firstElementChild.style.display = "";
          document.getElementById('track5').style.backgroundImage = "url('https://digitald20.com/vtt/img/thief.jpg')";
          

          // Dibujamos el tablero
          window.setTimeout(function() {
            reDrawAll(myboard);
            AddURLTokens();
            add_music("https://digitald20.com/core/music/just-adventuring.mp3")
          }, 2*waittime);
         
        } 
        else {          
          console.log("cargamos una escena")

          for (var i = 1 ; i < 9; i++) {
            try {              
                document.getElementById('track'+i).style.backgroundImage = localStorage.getItem("tracksrc" + i);
                if(document.getElementById('track'+i).style.backgroundImage !== "") {
                  document.getElementById('track'+i).style.order = localStorage.getItem("trackorder" + i);
                  if (namedmode)
                    document.getElementById('track'+i).firstElementChild.value = localStorage.getItem("trackhp" + i);
                  else
                    document.getElementById('track'+i).firstElementChild.value = parseInt(localStorage.getItem("trackhp" + i));
                document.getElementById('track'+i).firstElementChild.style.display = "";
            }
            } catch (e) {
            }
         }  

          load_scene_start()
        }

        keepAliveBoard.startTimer(10000);          
          
      }
      // ------------------------------------------------------------------
      // No somos dungeon masters
      // ------------------------------------------------------------------
      
      else {
    
        setViewPlayer();
        connected = false;
        window.setTimeout(function() {
          sendMessage(getrequest());
        }, 2*waittime);
    
      }
    
      // Creamos el canvas
      var canvasWrapper = document.getElementById('cw');
      canvasWrapper.tabIndex = 1000;
      //canvasWrapper.addEventListener("keydown", onKey, false);
    
      var canvasContainer = document.getElementById('dice-canvas');
      //canvaContainer.addEventListener("keydown", onKey, false);
      box = new DiceBox(canvasContainer);
    
      document.addEventListener("keydown", onKey, false);
      window.addEventListener('resize', viewportResize, false);

      viewportResize(); 
    
      window.setTimeout(function() {
        CleanURL();
      }, 4*waittime);
    
      if (localStorage.getItem("notshowagain") == null) {
        document.getElementById("hello").style.display = "";
      }
    
    }
    

function CleanURL() {
  console.log("cleanurl")
  window.history.replaceState(null, null, window.location.pathname);
}

function AddURLTokens() {

  //console.log(location.href)
  
  var Ntokens = new URL(location.href).searchParams.get('nt');
  var Nassets = new URL(location.href).searchParams.get('na');
  var bck     = new URL(location.href).searchParams.get('b');

  //console.log(Ntokens +" "+ Nassets + " " + bck)

  if (bck !== null) {
    if (Ntokens == null)
    Ntokens = 7
  if (Nassets == null)
    Nassets = 7
  }
  else {
    Ntokens = 0;
    Nassets = 0;
  }
    
  
  for (var j = 1 ; j < Ntokens ; j++) {

  var ptoken = new URL(location.href).searchParams.get('t' + j);
  console.log(j + " " + ptoken)
  if (ptoken !== null) {
    
    var pn = new URL(location.href).searchParams.get('n'+j);
    var Nt = 1
    if (pn !== null) 
      Nt = parseInt(pn);
    
    var ps = new URL(location.href).searchParams.get('s'+j);
    if (ps !== null) {
      if (ps == -1)
      document.getElementById('free').checked = true;
      else
        document.getElementById('s'+ ps).checked = true;
    }
      
    
    if(ptoken.indexOf("http://") > -1) {
      document.getElementById("token-map").value = ptoken;
    } else
      document.getElementById("token-map").value = "https://" + ptoken;
    var pcoor = new URL(location.href).searchParams.get('c'+j);
      if (pcoor !== null) {
        var listacoor = pcoor.split(",");
        for (var i = 0; i < listacoor.length; i = i + 2)
            {
              if ( j < 7)
                addToken(listacoor[i],listacoor[i+1],j);
              else
                addToken(listacoor[i],listacoor[i+1]);
            }
          }
      else            
      for (var i = 0; i < Nt; i++) {
          if (j < 7)
            addToken(null, null, j)
          else 
            addToken(null, null)
         }
  }
}
for (var j = 1 ; j < Nassets ; j++) {

  var ptoken = new URL(location.href).searchParams.get('a' + j);
  if (ptoken !== null) {
    if (ptoken.indexOf("http://") > -1)
      document.getElementById("token-map").value = ptoken;
    else 
    document.getElementById("token-map").value = "https://" + ptoken;
    sendLink();
  }
}

var narrative = new URL(location.href).searchParams.get('n');
if (narrative !== null) {
  document.getElementById("dice-bar").style.display = 'none';
  document.getElementById("track-bar").style.display = 'none';
  document.getElementById("add-token-bar").style.display = 'none';
  document.getElementById("tokenbar").style.display = 'none';
  document.getElementById("stokenbar").style.display = 'none';
  document.getElementById("setbg").style.display = 'none';
  document.getElementById("fog-bar").style.display = 'none';
  document.getElementById("for-name").style.display = 'none';
  document.getElementById("player-asset-list").style.display = 'flex';
  document.getElementById("main-menu").classList.remove("superbox");
}

setTimeout(() => {
  get_track();

  setTimeout(() => {
  if(checkAdmin()) 
    localStorage.setItem(room + 'data', JSON.stringify(getboard()));    
  }, 2*waittime);

}, 2*waittime);

}

function tokenChange() {

  var zoomrange = document.getElementById("zoomRange").value /100;
  var leftrange = document.getElementById("leftRange").value /100;
  var uprange = document.getElementById("upRange").value/100;
  var bgrange = document.getElementById("bgRange").value/100;
  
  var oImg = canvas.getActiveObject();  
  var size = oImg.dd20size;
  var shadow = {color: oImg.color,  blur: shadowblur, offsetX: shadowoff, offsetY: shadowoff, opacity: shadowopacity, fillShadow: true,  strokeShadow: true, nonScaling:true }

  if (oImg._element.naturalWidth > oImg._element.naturalHeight) {
    var scale = size * tileSize / oImg._element.naturalWidth;
    var clipPath = new fabric.Circle({ radius: oImg._element.naturalWidth/2, top: -oImg._element.naturalWidth*uprange/2, left: -oImg._element.naturalWidth*leftrange/2 });
  }
  else {
    var scale = size * tileSize / oImg._element.naturalHeight;
    var clipPath = new fabric.Circle({ radius: oImg._element.naturalHeight/(2), top: -oImg._element.naturalHeight*uprange/(2), left: -oImg._element.naturalHeight*leftrange/2 });
  }

  oImg.set({
    width: oImg._element.naturalWidth * zoomrange,
    height: oImg._element.naturalHeight * zoomrange,
  });

  oImg.zoomrange = zoomrange;
  oImg.leftrange = leftrange;
  oImg.uprange = uprange;
  
  oImg.clipPath = clipPath;
  oImg.dirty = true;
  //oImg.setShadow(shadow);
  oImg.set('shadow', shadow)
  oImg.scale(scale);
  canvas.requestRenderAll();
  updateBoardQuick();
  
/*
  try { 
    var filter = new fabric.Image.filters.RemoveColor({threshold: 0.5,});
    oImg.filters.push(filter);
    oImg.applyFilters()
  } catch(e) {console.log(e)}
*/
  
}

function adjustToken(oImg, zoomrange, leftrange, uprange) {

  if ((oImg.zoomrange !== zoomrange) || (oImg.leftrange !== leftrange) || (oImg.uprange !== uprange)) {

  if (oImg._element.naturalWidth > oImg._element.naturalHeight) 
    var clipPath = new fabric.Circle({ radius: oImg._element.naturalWidth/2, top: -oImg._element.naturalWidth*uprange/2, left: -oImg._element.naturalWidth*leftrange/2 });
  else 
    var clipPath = new fabric.Circle({ radius: oImg._element.naturalHeight/(2), top: -oImg._element.naturalHeight*uprange/(2), left: -oImg._element.naturalHeight*leftrange/2 });

  oImg.set({
    width: oImg._element.naturalWidth * zoomrange,
    height: oImg._element.naturalHeight * zoomrange,
  });

  oImg.zoomrange = zoomrange;
  oImg.leftrange = leftrange;
  oImg.clipPath = clipPath;
  oImg.dirty = true;
}

}

function editToken() {
  var e = document.getElementById("token-edit");
  if (e.style.display == "none") {
    e.style.display = "";
    document.getElementById("bedit-token").innerHTML = "Close Edit";
  }
  else {
    e.style.display = "none";
    document.getElementById("bedit-token").innerHTML = "Edit Token";
  }
}

function changeSrc(event) {
  console.log('image not found!')
  var urls = [
    "https://digitald20.com/vtt/img/mage.jpg", 
    "https://digitald20.com/vtt/img/fighter.jpg", 
    "https://digitald20.com/vtt/img/ranger.jpg", 
    "https://digitald20.com/vtt/img/spectre.jpg", 
    "https://digitald20.com/vtt/img/thief.jpg",
    "https://digitald20.com/vtt/img/spectre.jpg"
  ];
  var n = parseInt(this.id.replace('t',''));
    document.getElementById(this.id).removeEventListener('error',changeSrc);
    document.getElementById(this.id).src = urls[n-1];
}

function viewportResize() {
  var viewportWidth = window.innerWidth;
  var viewportHeigth = window.innerHeight;

  canvas.setWidth( viewportWidth );
  canvas.setHeight( viewportHeigth );
  canvas.calcOffset();
}

function reDrawAll(board, callback) {
 
  canvas.forEachObject(function(o) {
    if(o.fill !== '#c710875')
    canvas.remove(o);
  });

  mainBackground = board.backgroundImage;
  plotBackground = board.plotBackground;

  if (document.getElementById("plotmode").checked) {
    console.log("Plot mode image:" + board.plotBackground)
    createBg(board.plotBackground)  
  } else {
    console.log("Normal mode image:" + board.backgroundImage)
    createBg(board.backgroundImage)  
  }
  
  var tokens = board.tokens;
  tokens.forEach((item) => {
    createToken(item);
  });  
          
  if (callback !== undefined) 
  callback();

}

function reDrawTokens(board) {
  
  canvas.forEachObject(function(o) {
    if(o.fill !== '#c710875')
    canvas.remove(o);
  });

  var tokens = board.tokens;
  tokens.forEach((item) => {
    createToken(item);
  });

}


function setBg() {

  var bg = checkurl(document.getElementById("map-url").value);
  if (bg == "")
    var bg = checkurl(document.getElementById("token-map").value);

  try {
    var srcbackground = canvas.backgroundImage._element.src;
    if ((bg !== "") && (bg !== srcbackground)) {
      addtoAllAssets(bg)
    }      
  } catch (e) {console.log(e)}

  
  if (document.getElementById("plotmode").checked) {
    plotBackground = bg;  
  } else {
    console.log(mainBackground)
    mainBackground = bg;
  }

  createBg(bg);
  addBackgroundtoList(bg)   
  clearFogbutton();

  setTimeout(() => {
    clearFogbutton();    
    setTile();    

    setTimeout(() => {      
      check_outside_tokens();
    }, 3*waittime);

  }, waittime);

  //canvas.setZoom(getmaxZoom())
  /*
  window.setTimeout(function() {

    console.log("-----------------------------------")
    console.log(oldzoom + "-" + zoom)
    /*
    if (srcbackground !== canvas.backgroundImage._element.src)
      addtokentolist(bg.value);
    

    if (connected)
      sendMessage(getboard());

    if(checkAdmin()) 
      localStorage.setItem(room + 'data', JSON.stringify(getboard()));

      try {
        var nbackground_width  = canvas.backgroundImage._element.width;
        var nbackground_heigth = canvas.backgroundImage._element.height;
    
        if ( (nbackground_width < ibackground_width) || (nbackground_heigth < ibackground_heigth) )
          {
            var scalex = nbackground_width / ibackground_width;
            var scaley = nbackground_heigth / ibackground_heigth;

            canvas.forEachObject(function(o) {
              var newx = o.left * scalex - tileSize;
              var newy = o.top * scaley - tileSize;
              if (newx < 0)
                newx = tileSize;
              if (newy < 0)
                newy = tileSize;
                  o.set('left', newx).set('top', newy);
            });

            canvas.forEachObject(function(o) {
              o.selectable = true;
              o.setCoords();
            });

            canvas.viewportTransform[4] = 0;
            canvas.viewportTransform[5] = 0;
            canvas.setZoom(getmaxZoom())
            canvas.requestRenderAll();
          }

          setTile();
      } catch (e) {console.log(e)}

      clearFogbutton();
  }, waittime);
  */
}



function createNewBg(imgurl) {
  console.log("new background")

  /*
  try {
    var ibackground_width  = canvas.backgroundImage._element.width;
    var ibackground_heigth = canvas.backgroundImage._element.height;
  } catch (e) {console.log(e)}
*/

  createBg(imgurl);

  window.setTimeout(function() {

    if(checkAdmin()) 
      localStorage.setItem(room + 'data', JSON.stringify(getboard()));
      check_outside_tokens();

    }, 3*waittime);
/*
      try {
        var nbackground_width  = canvas.backgroundImage._element.width;
        var nbackground_heigth = canvas.backgroundImage._element.height;
    
        if ( (nbackground_width < ibackground_width) || (nbackground_heigth < ibackground_heigth) )
          {
            var scalex = nbackground_width / ibackground_width;
            var scaley = nbackground_heigth / ibackground_heigth;

            canvas.forEachObject(function(o) {
              var newx = o.left * scalex - tileSize;
              var newy = o.top * scaley - tileSize;
              if (newx < 0)
                newx = tileSize;
              if (newy < 0)
                newy = tileSize;
                  o.set('left', newx).set('top', newy);
            });


           

       //   }

      } catch (e) {console.log(e)}
*/
  
  
}

function createBg(imgurl, callback) {
  
  var srcbackground = null;
  try {
    srcbackground = canvas.backgroundImage._element.src;
  } catch (error) {}
  
  imgurl = checkurl(imgurl);

  if (imgurl !== srcbackground) {

  if ((imgurl.indexOf(".webm") > 0) || (imgurl.indexOf(".m4v") > 0 || (imgurl.indexOf(".mp4") > 0))) {
    
    var cvideo = document.getElementById('cvideo');
    if (cvideo.firstChild.src == imgurl)
      {
        var video1 = new fabric.Image(cvideo, { left: 0,  top: 0,  angle: 0, originX: 'left', originY: 'top',
        objectCaching: false,
        });
        canvas.setBackgroundImage(video1, canvas.renderAll.bind(canvas), {
          backgroundImageStretch: false,
        });
        startvideo();
      }
      else {
        cvideo.innerHTML = "";
        var source = document.createElement('source');
        source.src = imgurl;
        //source.type = type;
        cvideo.appendChild(source);
    
        cvideo.addEventListener('loadeddata', (e) => {
          cvideo.width = cvideo.videoWidth;
          cvideo.height = cvideo.videoHeight;
          var video1 = new fabric.Image(cvideo, { left: 0,  top: 0,  angle: 0, originX: 'left', originY: 'top',
        objectCaching: false,
        });        
        canvas.setBackgroundImage(video1, canvas.renderAll.bind(canvas), {
          backgroundImageStretch: false,
        });        
        video1.getElement().play();
        startvideo();       
       });
       
      } 
      // No es video
    } else {
      stopvideo();
      canvas.setBackgroundImage(imgurl, canvas.renderAll.bind(canvas), {
        backgroundImageStretch: false,
    });
    }
    setTimeout(() => {
      try {
        setmaxHzoom()
      } catch (e) {
        setTimeout(() => {
          setmaxHzoom()
        }, 3*waittime);
      }      
  }, 3*waittime);

}
}

function setmaxHzoom() {  
  canvas.setZoom(canvas.getWidth() / canvas.backgroundImage._element.width);
}

function check_outside_tokens() {

  console.log("Check outside!!!!")

  try {
    var width  = canvas.backgroundImage._element.width;
    var height = canvas.backgroundImage._element.height;
    var cambios = false;

    canvas.forEachObject(function(o) {

      if(o.fill !== '#c710875') {
  
        var x = getRandomInt(((canvas.getWidth() / canvas.getZoom()) / 4)) - canvas.viewportTransform[4] / canvas.getZoom() + (canvas.getWidth() / canvas.getZoom()) / 10;
        var y = (getRandomInt(((canvas.getHeight() / canvas.getZoom()) / 4)) + ((canvas.getHeight() / canvas.getZoom()) / 8)) - canvas.viewportTransform[5] / canvas.getZoom();
       
        if ((o.left > width) || (o.top > height)) {
          //console.log( o.top + "," + o.left)
          //console.log(x + "," + y);
          o.set('left', x);
          o.set('top', y);
          cambios = true;
        }
        o.selectable = true;
        o.setCoords();
  
      }
      canvas.viewportTransform[4] = 0;
            canvas.viewportTransform[5] = 0;
            canvas.setZoom(getmaxZoom())
            canvas.requestRenderAll();
  
    });
  

    } catch (error) {
      console.log(error)
    }
    if (cambios) {
      console.log("Objetos movidos por el cambio de fondo!")
      updateBoardQuick();
    }

  /*
  if (typeof old !== 'undefined') {
  
    var news = canvas.backgroundImage._element.width;
  if (old !== news)
  canvas.forEachObject(function(o) {
    if(o.fill !== '#c710875') {
      var newx = o.left * news / old;
      var newy = o.top * news / old;
      o.set('left', newx).set('top', newy);
    }
  });
  
}
*/

}

function setUrl(free) {
  if (free !== undefined) {
    document.getElementById("free").checked = true;
  }
 var texto = document.getElementById(event.srcElement.id).src;
 document.getElementById("token-map").value = texto;
 url_token_input_change();
}


function addtokentolist(src,n) {
 /*
  if (n == null) {
  // Es diferente
  var repetido = false;
  for (var i = 1; i < 11; i++) {
    if (document.getElementById("t"+i).src == src)
    repetido = true;
  }
  
  if (!repetido) {
  // Lo añadimos en el hueco que toca
  document.getElementById("t"+tokenN).src = src;
  localStorage.setItem("tokenurl" + tokenN, src);
  tokenN++;
  if (tokenN > MaxTokens)
    tokenN = 1;
    //tokenS = MaxTokens;
  }
  localStorage.setItem("tokenN", tokenN);
  //localStorage.setItem("tokenS", tokenS);
} else {
  if (n < 6)
    document.getElementById("t"+n).src = src;
  localStorage.setItem("tokenurl" + n, src);
  
}
*/
}

function toTrack() {
  var tokenimg = checkurl(document.getElementById("token-map").value);  
  document.getElementById("s1").checked = true;
  document.getElementById("free").checked = false;
  if (tokenimg !== "") {
    addtrackwhentoken(tokenimg);
  }
  if (!checkAdmin())
    hide_menus();
}

function addText() {

  var XX = getRandomInt(((canvas.getWidth() / canvas.getZoom()) / 4)) - canvas.viewportTransform[4] / canvas.getZoom() + (canvas.getWidth() / canvas.getZoom()) / 10;
  var YY = (getRandomInt(((canvas.getHeight() / canvas.getZoom()) / 4)) + ((canvas.getHeight() / canvas.getZoom()) / 8)) - canvas.viewportTransform[5] / canvas.getZoom();

  var text = new fabric.Textbox('Lorem ipsum dolor sit amet',
  {
      width: 300,
      backgroundColor: "white",
      //padding: 20,
      left: XX,
      top: YY
  });
  
  var shadow = {color: 'rgba(0, 0, 0, 1)',blur: shadowblur, offsetX: shadowoff, offsetY: shadowoff, opacity: shadowopacity, fillShadow: true,  strokeShadow: true, nonScaling:true }  
  text.dd20size = -1;
  text.id = user + getRandomInt(999999);
  text.set('shadow', shadow)
  text.plot = document.getElementById("plotmode").checked;
  text.newtoken = true;
      setTimeout(() => {
          text.newtoken = false;
      }, 5*waittime);

  // Render the Textbox on Canvas
  canvas.add(text);

  setTimeout(() => {
    updateBoardQuick();
  }, waittime);


}

// Functions to add token
const addToken = (x,y,n) => {

  //event.stopPropagation();

  var tileS = tileSize;
  if (document.getElementById("plotmode").checked) 
    tileS = plottileSize;

  if (x !== undefined) {
    var XX = parseInt(x);
    var YY = parseInt(y);
  } else {
    var XX = getRandomInt(((canvas.getWidth() / canvas.getZoom()) / 4)) - canvas.viewportTransform[4] / canvas.getZoom() + (canvas.getWidth() / canvas.getZoom()) / 10;
    var YY = (getRandomInt(((canvas.getHeight() / canvas.getZoom()) / 4)) + ((canvas.getHeight() / canvas.getZoom()) / 8)) - canvas.viewportTransform[5] / canvas.getZoom();
  }

  var tokenimg = checkurl(document.getElementById("token-map").value);

  if (tokenimg == "https://digitald20.com/vtt/img/text.jpg") {
    addText();  
    return;
  }

if (tokenimg !== "") {
  addtoAllAssets(tokenimg)
  canvas.justCreated = true;
  var tokensize = parseInt(document.querySelector('input[name="gender"]:checked').value)

  fabric.Image.fromURL(tokenimg, function (oImg) {
    oImg.set({
      id: user + getRandomInt(999999),
      left: XX,
      top: YY,
      hasControls: false,
      //crossOrigin: "Anonymous",
    });

    //oImg.setCrossOrigin("anonymous");
    if (oImg._element !== null) {
      addtokentolist(oImg._element.src,n);
      if (!document.getElementById("free").checked) 
        addtrackwhentoken(oImg._element.src,n);

    if (oImg._element.naturalWidth > oImg._element.naturalHeight)
      var scale = tokensize * tileS / oImg._element.naturalWidth;
    else 
      var scale = tokensize * tileS / oImg._element.naturalHeight;

    /*
    oImg.set({
        clipTo: function (ctx) {
        ctx.arc(0, 0, oImg._element.naturalWidth/2, 0, Math.PI * 2, true);
      },
    })
*/
var shadow = {color: 'rgba(0, 0, 0, 1)',blur: shadowblur, offsetX: shadowoff, offsetY: shadowoff, opacity: shadowopacity, fillShadow: true,  strokeShadow: true, nonScaling:true }

if (oImg._element.naturalWidth > oImg._element.naturalHeight)
    var clipPath = new fabric.Circle({ radius: oImg._element.naturalWidth/2, top: -oImg._element.naturalWidth/2, left: -oImg._element.naturalWidth/2 });
else
  var clipPath = new fabric.Circle({ radius: oImg._element.naturalHeight/2, top: -oImg._element.naturalHeight/2, left: -oImg._element.naturalHeight/2 });

 /* var filter = new fabric.Image.filters.RemoveColor({
    threshold: 0.5,
  });
      oImg.filters.push(filter);
    oImg.applyFilters()*/
  
    if (tokensize < 0) {
      oImg.set({
        width: oImg._element.naturalWidth,
        height: oImg._element.naturalHeight,
        hasControls: true
      });
      oImg.scale(-scale);
      console.log(scale)
    } else {
      oImg.clipPath = clipPath;
      //oImg.setShadow(shadow);
      oImg.set('shadow', shadow)
      oImg.scale(scale);
    }

    oImg.dd20size = tokensize;
    oImg.zoomrange = 1;
    oImg.leftrange = 1;
    oImg.uprange = 1;
    oImg.hp = 0;
    oImg.plot = document.getElementById("plotmode").checked;
    oImg.color = "rgba(200, 100, 100, 0.5)";  
    oImg.newtoken = true;
    setTimeout(() => {
        oImg.newtoken = false;
    }, 5*waittime);
    canvas.add(oImg);
  } else alert("Could not load the selected image!")
  }
  //,{ crossOrigin: 'anonymous' }
  );
  setTimeout(() => {
    updateBoardQuick();
  }, waittime);
}

  if (!checkAdmin())
    hide_menus();
};

function plotvisible(item) {
  
  if (document.getElementById("plotmode").checked) {
    return item;
  }else {
    return !item;
  }
}

function createText(item) {

  var text = new fabric.Textbox(item.text,
  {
      width: item.width,
      backgroundColor: item.backgroundColor,
      
  });
  
  var shadow = {color: 'rgba(0, 0, 0, 1)',blur: shadowblur, offsetX: shadowoff, offsetY: shadowoff, opacity: shadowopacity, fillShadow: true,  strokeShadow: true, nonScaling:true }  
  text.dd20size = item.dd20size;
  text.id = item.id;
  text.left = item.left,
  text.top = item.top,
  text.set('shadow', shadow)
  text.plot = item.plot;
  text.set({hasControls: true, scaleX:item.scaleX,scaleY:item.scaleY,angle:item.angle }); 
  
  text.visible = plotvisible(item.plot);
  canvas.add(text);
}

//createToken
const createToken = (item) => {
  // Check if Token is in list of images
  // Add to the list of images

  if (item.src == undefined)
    return(createText(item));

  var tileS = tileSize;
  if (document.getElementById("plotmode").checked) 
    tileS = plottileSize;
  
  addtokentolist(item.src);
  addtoAllAssets(item.src);
  
  fabric.Image.fromURL(item.src, function (oImg) {
    oImg.set({
      id: item.id,
      left: item.left,
      top: item.top,
      hasControls: false,
      visible: plotvisible(item.plot)
    });

  if (oImg._element.naturalWidth > oImg._element.naturalHeight) {
    var scale = item.dd20size * tileS / oImg._element.naturalWidth;
    var clipPath = new fabric.Circle({ radius: oImg._element.naturalWidth/2, top: -oImg._element.naturalWidth*item.uprange/2, left: -oImg._element.naturalWidth*item.leftrange/2 });
  }
  else {
    var scale = item.dd20size * tileS / oImg._element.naturalHeight;
    var clipPath = new fabric.Circle({ radius: oImg._element.naturalHeight/(2), top: -oImg._element.naturalHeight*item.uprange/(2), left: -oImg._element.naturalHeight*item.leftrange/2 });
  }

  if (item.color == undefined)
    item.color = "rgba(0, 0, 0, 1)";
    if (item.plot == undefined)
      item.plot = false;    
  

    var shadow = {color: item.color,  blur: shadowblur, offsetX: shadowoff, offsetY: shadowoff, opacity: shadowopacity, fillShadow: true,  strokeShadow: true, nonScaling:true }

    oImg.set({
      width: oImg._element.naturalWidth * item.zoomrange,
      height: oImg._element.naturalHeight * item.zoomrange,
    });

    if (item.dd20size < 0) {
      //oImg.scale(-scale);
        oImg.set({hasControls: true, scaleX:item.scaleX,scaleY:item.scaleY,angle:item.angle }); 
    } else {
      oImg.scale(scale);
      oImg.clipPath = clipPath;
      oImg.set('shadow', shadow)
      //oImg.setShadow(shadow);
    }
    oImg.dd20size = item.dd20size;
    oImg.zoomrange = item.zoomrange;
    oImg.leftrange = item.leftrange;
    oImg.uprange = item.uprange;
    oImg.hp = item.hp;
    oImg.plot = item.plot;
    oImg.color = item.color;  
    canvas.add(oImg);
  });
};
// -------------------------------------------------------
// Dice

function newRoll() {
  event.stopPropagation();
  document.getElementById("dice-select").style.display = "flex";
}

function diceSelect() {
  event.stopPropagation();
  var dice = event.srcElement.innerHTML;   
  
  if (event.srcElement.id == "") {
    document.getElementById("d" + rollN).innerHTML = dice;    
    rollN ++;
    if (rollN > 3)
      rollN = 1;
  } else {
    var text = document.getElementById(("" + event.srcElement.id).replace("d","dh")).innerHTML;
    document.getElementById(("" + event.srcElement.id).replace("d","dh")).innerHTML = "";
  }

  if (combineDice) {
    document.getElementById("combine-dice").value = document.getElementById("combine-dice").value + " + " + dice;
  } else {
    document.getElementById("dice-select").style.display = "none";
    if (document.getElementById("hidden-roll").className == "button-pressed")
     {
      console.log("local")
      printdice(localDices(dice.replace("1d100", "1d100 + 1d10"), text))
    }
    else    
    sendDices(dice.replace("1d100", "1d100 + 1d10"), text);
  }
}

function startCombinedice() {
  event.stopPropagation();
  document.getElementById("combine-dice").disabled = false;
  document.getElementById("combine-dice-ok").disabled = false;
  combineDice = true;
}

function okDicecombine() {
  event.stopPropagation();
  document.getElementById("combine-dice").disabled = true;
  document.getElementById("combine-dice-ok").disabled = true;
  combineDice = false;
  dice = document.getElementById("combine-dice").value;
  dice = dice.substring(0,3).replaceAll("+","") + dice.substring(3);
  
  dice = dice.replaceAll("-","+ -");
  dice = dice.replaceAll(" +","+");
  dice = dice.replaceAll("+"," +");

  ds = dice.split('+')
  if (ds.length == 2) {
    if (parseInt(ds[0].split('d')[1]) == parseInt(ds[1].split('d')[1]))
      dice = (parseInt(ds[0].split('d')[0]) + parseInt(ds[1].split('d')[0])) + "d" + ds[1].split('d')[1];
  }

  document.getElementById("combine-dice").value = "";
  document.getElementById("dice-select").style.display = "none";
  document.getElementById("d" + rollN).innerHTML = dice;
  
  if (document.getElementById("hidden-roll").className == "button-pressed")
     {
      console.log("local")
      printdice(localDices(dice))
    }
    else    
    sendDices(dice);
    
    rollN ++;
    if (rollN > 3)
      rollN = 1;
  
}

function addtoAllAssets(asset) {

  var lista = [];  
  lista = JSON.parse(localStorage.getItem('allassets')) || [];

  if (!checklistvalue(asset,lista)) {
    lista.push(asset);
    localStorage.setItem('allassets', JSON.stringify(lista));
    savetoplugin() 
  }
  
}

function show_all_assets(event) {
  event.stopPropagation();
  var lista = [];
  lista = JSON.parse(localStorage.getItem('allassets')) || [];
  var tabla = document.getElementById("allassets");
  tabla.innerHTML = "" 
  for (var i = 0; i < lista.length; i++) {
    try{
    var img = document.createElement("img");
    img.classList.add("bglist");
    img.src = lista[i].replaceAll(" ","%20");
    img.id = "all" + i;
    img.addEventListener('error',deleteItem);
    img.addEventListener('dragstart',  drag_scene_start, true);
    img.draggable = true;    
    tabla.appendChild(img);
    } catch {console.log("error with token list")}
  
  }

  document.getElementById("allassets").style.display = "";
  document.getElementById("trash").style.display = "";

}

function getLink() {

  var link = document.getElementById("token-map").value;

  var obj = new Object();
  obj.roll = false;
  obj.link = true;
  obj.playerid          = user; 
  obj.request           = false;
  obj.links = link;
  obj.assets = [];

  var alist = document.getElementById("asset-list").getElementsByTagName("img");
  for (i = 0; i < alist.length; i++) {

    var item = ""
    if (alist[i].getAttribute('src') == IconVideo)
      item = alist[i].getAttribute('video')
    else 
      item = alist[i].getAttribute('src')

    localStorage.setItem("asset" + i, item)
    if (!alist[i].classList.contains("grayed"))
    {
      var dobj = new Object();
      dobj.src = item;
      obj.assets.push(dobj);  
    }
  }
      
  localStorage.setItem("assetN", alist.length)

  return(obj);

} 

function getForcedLink(link) {

  var obj = new Object();
  obj.roll = false;
  obj.link = true;
  obj.playerid          = user; 
  obj.request           = false;
  obj.links = link;
  obj.forced = true;

  return(obj);

} 

function sendDices(dice, text) {

  if (text == undefined)
   text = "";

  var obj = new Object();
  obj.roll = true;
  obj.playerid          = user; 
  obj.request           = false;
  obj.text = text;
  obj.dices = getdices(dice);
  sendMessage(obj);

}


function localDices(dice) {

  var obj = new Object();
  obj.roll = true;
  obj.playerid          = user; 
  obj.request           = false;
  obj.text = "hidden: ";
  obj.dices = getdices(dice);
  return obj;

}

function getdicesfrombeyond(dice, results) {

  var lista = [];
  var obj = new Object();
  obj.dices = [];
  var fontColor = document.getElementById("fontcolor").value;
  var backColor = document.getElementById("backcolor").value;
  var last20 = 0;
  var last10 = 0;

  dice = dice.replaceAll("-","+ -");
  
  //const re = /[\+-]/
  var g = dice.split("+");
  var r = results.split("+")
  var c = 0
  //var g = dice.split(re);

console.log(g)
  for(i = 0; i < g.length; i++) {
    var d = g[i].trim().split("d");
      var n = parseInt(d[0])
      if (d[1]===undefined) {
        obj.bonus = n;
        lista.push(obj);
       
        obj = new Object();
        obj.dices = [];
        obj.roll = true;
        obj.playerid          = user; 
        obj.request           = false;

      } else {  
      for (j = 0; j < n; j++) {
        
        var dobj = new Object();
        dobj.sides = parseInt(d[1])
        dobj.type = "d" + d[1];
        dobj.fontColor = fontColor;
        dobj.backColor = backColor;        
        dobj.result = parseInt(r[c]);
        c = c + 1
        obj.dices.push(dobj);  
      }
    }
  }
  if (obj.dices.length > 0)
    lista.push(obj)
  return lista;
}



function getdices(dice) {

  var lista = [];
  var obj = new Object();
  obj.dices = [];
  /*obj.roll = true;
  obj.playerid          = user; 
  obj.request           = false;*/
  var fontColor = document.getElementById("fontcolor").value;
  var backColor = document.getElementById("backcolor").value;
  var last20 = 0;
  var last10 = 0;

  
  dice = dice.replaceAll("-","+ -");
  
  //const re = /[\+-]/
  var g = dice.split("+");
  //var g = dice.split(re);

console.log(g)
  for(i = 0; i < g.length; i++) {
    var d = g[i].trim().split("d");
      var n = parseInt(d[0])
      if (d[1]===undefined) {
        obj.bonus = n;
        lista.push(obj);
       
        obj = new Object();
        obj.dices = [];
        obj.roll = true;
        obj.playerid          = user; 
        obj.request           = false;
      } else {  
      for (j = 0; j < n; j++) {
        
        if (last20 > 0 && last20 < 5 && parseInt(d[1]) == 20) // Ha habido algún dado de 20 y este es de 20. 
          backColor = lighten(backColor,0.15);

        if (last10 == 1 && parseInt(d[1]) == 10 && n == 2) // Ha habido algún dado de 10 y este es de 10. 
          backColor = lighten(backColor,0.25);

        if(parseInt(d[1]) == 20)
          last20 = last20 + 1;

        if(parseInt(d[1]) == 10)
          last10 = last10 + 1;

        var dobj = new Object();
        dobj.sides = parseInt(d[1])
        dobj.type = "d" + d[1];
        dobj.fontColor = fontColor;
        dobj.backColor = backColor;        
        dobj.result = rollDie(parseInt(d[1]));
        obj.dices.push(dobj);  
      }
    }
  }
  if (obj.dices.length > 0)
    lista.push(obj)
  return lista;
}

function renderChange() {
  event.stopPropagation();
  var range = document.getElementById("diceRange").value /100;
  box.pixelRatio = range;
  box.reInit();
}

var tiradas = [];
function diceroll(dices) {
  if (box.simulationRunning == false) {    
      box.throwDice(dices, diceroll_back);
  } else {
    tiradas.push(dices);
  }
}

function diceroll_back() {
  if (tiradas.length > 0) {
    var nuevosdados = [];
    while(tiradas.length > 0)
      {
        let dados = tiradas.pop();
        for (i = 0; i < dados.length;i++)
          nuevosdados.push(dados[i]);
      }    
      box.throwDice(nuevosdados,diceroll_back)
  }
  else {
    box.simulationRunning = false;
  }
}

function printdice(dice) {
  
var dados = [];
for(var k = 0; k < dice.dices.length; k++) {
  for (var h = 0; h < dice.dices[k].dices.length;h++)
    dados.push(dice.dices[k].dices[h])
}
console.log(dados)
diceroll(dados);

for(var k = 0; k < dice.dices.length; k++) {

  let dados = dice.dices[k].dices;
  let bonus = dice.dices[k].bonus;
  //var text = dice.playerid + " rolled: ";
  var text = "";
  var total = 0;
  var N;
  var subtext;

  console.log(dados)
  if(dados.length == 1) {
    let item = dados[0];
    if (item.sides == 100)
      text = text + "1d" + item.sides + " (" + item.result*10 + ")    ";
    else 
      text = text + "1d" + item.sides + " (" + item.result + ")    ";
    total = total + item.result;
  } else {
    Ndice = dados[0].sides;
    N = 0;
    var subtext = "(";
    for (i = 0; i < dados.length; i++) {
      let item = dados[i];
      
      if ((item.sides !== Ndice)) { //Nuevo dado
        if (i == (dados.length - 1)) // Y último
        {
          text = text + N + "d" + Ndice + subtext.substring(0,subtext.length-1) + ") ";
          N = 1;
          Ndice = item.sides;
          if (item.sides == 100)
            subtext = "(" + item.result*10 + ",";
          else
            subtext = "(" + item.result + ",";
        } 
        text = text + N + "d" + Ndice + subtext.substring(0,subtext.length-1) + ") ";
        N = 1;
        Ndice = item.sides;
        if (item.sides == 100)
            subtext = "(" + item.result*10 + ",";
          else
            subtext = "(" + item.result + ",";
        total = total + item.result;
      } 
      else if (i == (dados.length - 1)) {   // Ultimo dado
        N++;    
        if (item.sides == 100) {
          total = total + item.result * 10;
          subtext = subtext + item.result * 10 + ",";}
        else {
          total = total + item.result ;
          subtext = subtext + item.result + ",";}
        text = text + N + "d" + Ndice + subtext.substring(0,subtext.length-1) + ") ";
      
      } else {
        N++;    // Otro dado igual
        if (item.sides == 100) {
          total = total + item.result * 10;
          subtext = subtext + item.result * 10 + ",";}
        else {
          total = total + item.result ;
          subtext = subtext + item.result + ",";}
      }    
  }
}
  if (bonus !== undefined) {
    total = total + bonus;
    text = "<div class='dlog'><div class='ddice_result'>" + text + "+" + bonus + "=</div><span class='ddice_result_total'><div class='dice_result__total-result'>" + total + "</div></span></div>";  
  } else {
    total = total;
    text = "<div class='dlog'><div class='ddice_result'>" + text + "=</div><span class='ddice_result_total'><div class='dice_result__total-result'>" + total + "</div></span></div>";  
    /*
    text = "<br><div class='dice_result'><div class='dice_result__info'><div class='dice_result__info__results'><div class='dice_result__info__breakdown'>" 
            + text + "</div></div></div><span class='dice_result__divider' style='margin-top: -9px;'></span><div class='dice_result__total-container'><div class='dice_result__total-result'>" 
            + total + "</div></div><div>";    
    */
          }
  document.getElementById("log").innerHTML = text + document.getElementById("log").innerHTML;
  obj2 = new Object();
  obj2.text = text;//.replaceAll(dice.playerid,"");
  obj2.playerid = dice.playerid;
  obj2.pretext = dice.text;
  printchat(obj2)
}

}

/*
function printdice(dice) {

  NRolls++;
  if(dice_enabled)
  box.throwDice(dice.dices, function () {
    NRolls--;
    if (NRolls < 1)
      box.simulationRunning = false;
  });
  var text = dice.playerid + " rolled: ";
  var blank = '.'.repeat(text.length);
  var subtext = "";
  var total = 0;
  var N = 0;
  var Ndice = "";
  var filas = 0;

  for (i = 0; i < dice.dices.length; i++) {
    let item = dice.dices[i];
    if (item.sides !== Ndice) {
      if (i==0) {
      Ndice = item.sides;
      subtext = " (" + item.result + ",";
      total = total + item.result;
      N++;
      if(dice.dices.length == 1) {
        console.log("y ultima");
        text = text + "1d" + item.sides + "= "+ total + "<br>";
      }
      } else {
        if (filas > 0)
          text = text + "<br>" + blank + N + "d" + Ndice + subtext.substring(0,subtext.length-1) + ") = " + total;
        else 
          text = text + N + "d" + Ndice + subtext.substring(0,subtext.length-1) + ") = " + total;
        total = total + item.result;
        N = 1;
        subtext = subtext + item.result + ",";
        filas++;
        Ndice = item.sides; 
        subtext = " (" + item.result + ",";
      }
    } else {
      if (i == dice.dices.length-1) {
        total = total + item.result;
        N++;
        subtext = subtext + item.result + ",";
        if(filas > 0)
          text = text + "<br>" + blank + N + "d" + Ndice + subtext.substring(0,subtext.length-1) + ") = " + total + "<br>";
        else
          text = text + N + "d" + Ndice + subtext.substring(0,subtext.length-1) + ") = " + total+ "<br>";
      } else {
        total = total + item.result;
        N++;
        subtext = subtext + item.result + ",";
      }
    }
  }
  document.getElementById("log").innerHTML = text + document.getElementById("log").innerHTML;
  obj2 = new Object();
  obj2.text = text.replaceAll(dice.playerid,"");
  obj2.playerid = dice.playerid;
  printchat(obj2)
}*/

function clearRoll() {
  NRolls = 0;
  box.clear( function () {
      box.simulationRunning = false;
  });

  /*
  var myboard = getboard();
  canvas.forEachObject(function(o) {
    if(o.fill !== '#c710875')
    canvas.remove(o);
  });

  var tokens = myboard.tokens;
  tokens.forEach((item) => {
    createToken(item);
  }); 
*/

}

function rollDie(sides)
{
  if(!sides) sides = 6;
  if(sides == 100)
    with(Math) return 1 + floor(random() * 10);
  with(Math) return 1 + floor(random() * sides);
}

function rollDice(number, sides)
{
  var total = 0;
  while(number-- > 0) total += rollDie(sides);
  return total;
}
// ---------------------------------------------------------
// Name
function nameChange() {
  user = document.getElementById("player-name").value;
  localStorage.setItem("dd20user", user);
}

// ------------------------------------------------------------- //
// Fog
function startFogbutton() {
  canvas.isDrawingfog = false;
  canvas.selection = true;

  if(canvas.fogEnabled) {
    canvas.fogEnabled = false;
    localStorage.setItem(room + 'fogenabled', false);

    document.getElementById("add-fog").disabled = true;
    document.getElementById("clear-fog").disabled = true;
    document.getElementById("enable-fog").innerHTML = "Enable Fog";
    document.getElementById("add-fog").innerHTML = "Reveal Area";
    document.getElementById("add-fog").className = "button";
    document.getElementById("undo-fog").style.display = "none";
    
    canvas.remove(fog);
    canvas.renderAll();
  }
  else {
  canvas.fogEnabled = true;
  localStorage.setItem(room + 'fogenabled', true);
  document.getElementById("add-fog").disabled = false;
  document.getElementById("clear-fog").disabled = false;
  document.getElementById("enable-fog").innerHTML = "Disable Fog";
  document.getElementById("undo-fog").style.display = "";
    
  addFog();
}
if(checkAdmin()) {
  sendMessage(getboard());
  localStorage.setItem(room + 'data', JSON.stringify(getboard()));
}

}

function addFogbutton() {
  if(canvas.fogEnabled) {
  if(document.getElementById("add-fog").innerHTML == "Reveal Area")
  {
    document.getElementById("add-fog").innerHTML = "Stop Reveal";
    document.getElementById("add-fog").className = "button-pressed";
    canvas.isDrawingfog = true;
    canvas.selection = false;
  }
  else{
    document.getElementById("add-fog").innerHTML = "Reveal Area";
    document.getElementById("add-fog").className = "button";
    canvas.isDrawingfog = false;
    canvas.selection = true;
  }
  }
}

function clearFogbutton() {
  fogHoles = [];
  addFog();
}

function DrawFog(data) {
  // If there is fog, we add fog
  if(data.item.fog) {
    var fogitems = data.item.squares;
    fogHoles = [];
    fogitems.forEach((item) => {
      var left = item.left; var top = item.top; var width = item.width;var height = item.height;
      fogHoles.push({left,top,width,height})
  });
  addFog();
  canvas.fogEnabled = true;
  } else {
    canvas.fogEnabled = false;
    canvas.remove(fog);
  }
}

function addFog(left,top,width,height) {

try {
  if (left == "update")
    var broadcast = false;
  else
    var broadcast = true;

  if (left == "undo")
      fogHoles.pop();
    
  if (canvas.fogEnabled && !document.getElementById("plotmode").checked) {

  if (top !== undefined) {
    fogHoles.push({top,left,width,height});
  }

  var clipPath = [];

fogHoles.forEach((item,index) => {
  clipPath[index] = new fabric.Rect({ top: item.top, left: item.left ,width: item.width, height: item.height });
});

localStorage.setItem(room + 'fogholes', JSON.stringify(fogHoles));
localStorage.setItem(room + 'fogenabled', true);

var g = new fabric.Group(clipPath);
g.inverted = true;
canvas.remove(fog);

var opacity = 1;
if(user == "dm")
  opacity = 0.5;  

fog = new fabric.Rect({ 
  width: canvas.backgroundImage._element.width, 
  height: canvas.backgroundImage._element.height, 
  left:  0, 
  top:   0, 
  opacity: opacity,
  hasControls: false,
  lockMovementX: true,
  lockMovementY: true,
  selectable: false,
  clipPath: g,
  fill: '#c710875',
  evented: false,
  id: "fog"
});

canvas.preserveObjectStacking = true;
canvas.add(fog); 
canvas.remove(square);
if (checkAdmin())
  canvas.sendToBack(fog);
canvas.renderAll();

if(checkAdmin() && broadcast) {
  sendMessage(getboard());
  localStorage.setItem(room + 'data', JSON.stringify(getboard()));
}
  } else {
    canvas.remove(fog);
  }

  fogrunning = false;
} catch (error) {
  setTimeout(function(){ addFog('update'); }, waittime);
}
}

// ----------------------------------------------------------------- //
// Response to canvas events


function setTile() {

  document.getElementById('message').style.display = "block";
  document.getElementById('metabackgrounds').style.display = "none";
  document.getElementById('MapsBar').style.display = "none";
  tileSize = 20
  plottileSize = 20

  canvas.isDrawing = true;
  canvas.selection = false;
}

function onKey(e) {
   
  event.stopPropagation();
  if (46 === e.keyCode) {
    deleteObj();
    // 46 is Delete key
    // do stuff to delete selected elements
}
if (8 === e.keyCode) {
  deleteObj();
  // 46 is Delete key
  // do stuff to delete selected elements
}

}

// Supporting fucntions
function getmaxZoom() {
  var zoomx = canvas.getWidth() / canvas.backgroundImage._element.width;
  var zoomy = canvas.getHeight() / canvas.backgroundImage._element.height;
  if (zoomx < zoomy)
   return(zoomx);
   else
   return(zoomy);
}




function checkBorders() 
{

    let borde = 100;
    var vpt = canvas.viewportTransform;
    let desplazamientoX = vpt[4]
    let desplazamientoY = vpt[5]

    var zoom = canvas.getZoom();
/*
    console.log("Zoom:" + zoom)
    console.log("DesplazmientoX: " + desplazamientoX)
    console.log("DesplazmientoY: " + desplazamientoY)
    console.log("Altura  Background: " + (canvas.backgroundImage._element.height*zoom))
    console.log("Anchura Background: " + (canvas.backgroundImage._element.width*zoom))
    console.log("Altura  Canvas: " + canvas.getHeight() )
    console.log("Anchura Canvas: " + canvas.getWidth() )
*/   
    if (desplazamientoX > borde || isNaN(desplazamientoX)) {
      console.log("1ok. el desplazamientoX es mauyor que el borde")
      canvas.viewportTransform[4] = borde;
      canvas.requestRenderAll();
    } else if ((canvas.getWidth()-desplazamientoX) > (canvas.backgroundImage._element.width*zoom + borde)  ) {
      console.log("2. la anchura de la pantalla menos el desplazamientoX es mayor que la anchura del imagen")
      canvas.viewportTransform[4] = canvas.getWidth() - (canvas.backgroundImage._element.width*zoom) - borde;
      canvas.requestRenderAll();
    }

    if (desplazamientoY > borde || isNaN(desplazamientoY) ) {
      console.log("3ok. El desplazamiento es mayor que el borde")
      canvas.viewportTransform[5] = borde;
      canvas.requestRenderAll();
    }         
    else if (( canvas.getHeight() > (canvas.backgroundImage._element.height*zoom + vpt[5]) ) && (canvas.backgroundImage._element.height*zoom > canvas.getHeight()) ) {         
      console.log("4. La altura de la pantalla es mayor que la altura de la imagen mas el desplazamiento y ademas la imagen es mas alta que la pantalla")
      // Si la altura de la pantalla es mayor que la altura de la imagen más el desplazamiento. 
      canvas.viewportTransform[5] = canvas.getHeight() - canvas.backgroundImage._element.height*zoom - borde;
      //canvas.viewportTransform[5] = canvas.backgroundImage._element.height*zoom - canvas.getHeight();
      //canvas.viewportTransform[5] = borde;
      canvas.requestRenderAll();
    }

canvas.forEachObject(function(o) {

  if (o.id !== "fog") {
    o.selectable = true;
    o.setCoords();
  }
  
});

}

// Colocamos cada objeto en su sitio
function canvas_move() 
{
  /*
  var doomedObj = canvas.getActiveObject();

  if (doomedObj !== null)
    if ( doomedObj.get('type')== "textbox") {
    canvas.requestRenderAll();
    canvas.forEachObject(function(o) {
    o.selectable = true;
    o.setCoords();
  });
  setTimeout(function(){ addFog('update'); }, waittime);
}
*/
}

function updateBoard() {
 
savetilesizeonlist();

if (connected)
  window.setTimeout(function() {
    sendMessage(getboard());
    reDrawAll(getboard());
  }, waittime);

if(checkAdmin()) {
  localStorage.setItem(room + 'data', JSON.stringify(getboard()));
}

if (canvas.fogEnabled)
  if (!fogrunning)
    window.setTimeout(function() {  addFog('update'); }, 2*waittime);
      
}

function updateBoardQuick(redraw) {

  canvas.discardActiveObject().renderAll();
  
  var redraw = redraw || false;

  if (connected) {
    sendMessage(getboard(), redraw);
  }  

  if(checkAdmin()){
    // Put the object into storage
    localStorage.setItem(room + 'data', JSON.stringify(getboard()));
  }

}

// Functions for touch screens
// Touch-enabled
function touchpan (ev) {

  if (document.getElementById("two-finger-pan").checked) {
  if ((ev.deltaX*ev.deltaX + ev.deltaY*ev.deltaY) > 20) {
    canvas.viewportTransform[4] = canvas.lastPosX +ev.deltaX;
    canvas.viewportTransform[5] = canvas.lastPosY +ev.deltaY;
    canvas.requestRenderAll();
  }
}
checkBorders();
}

mc.on("pinchend", function(ev) {
  canvas.selection = true;
  checkBorders() 
});

mc.on("pinchstart", function(ev) {
  console.log("pinchstart")
  canvas.selection = false;
  canvas.lastscale = canvas.getZoom();
  canvas.lastPosX = canvas.viewportTransform[4]
  canvas.lastPosY = canvas.viewportTransform[5]
});

mc.on("pinchin", function(ev) {
if(ev.scale < 0.9) {
  canvas.touchenable = true;

zoom = canvas.lastscale *ev.scale;
if (zoom > 20) zoom = 20;
if (zoom < 0.01) zoom = 0.01;

if (canvas.backgroundImage._element.width*zoom < canvas.getWidth() && canvas.backgroundImage._element.height*zoom < canvas.getHeight()) {
  canvas.viewportTransform[4] = 0;
  canvas.viewportTransform[5] = 0;
  canvas.setZoom(getmaxZoom())
} else {
  canvas.setZoom(zoom)
} 

event.preventDefault();
event.stopPropagation();
checkBorders() 
} else touchpan(ev);
});


mc.on("pinchout", function(ev) {
  if(ev.scale > 1.1) {
  canvas.touchenable = true;

  zoom = canvas.lastscale *ev.scale;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;

    if (canvas.backgroundImage._element.width*zoom < canvas.getWidth() && canvas.backgroundImage._element.height*zoom < canvas.getHeight()) {
      canvas.viewportTransform[4] = 0;
      canvas.viewportTransform[5] = 0;
      canvas.setZoom(getmaxZoom())
    } else {
      canvas.setZoom(zoom)
    } 

  event.preventDefault();
  event.stopPropagation();
  checkBorders() 

} else touchpan(ev);
});

//zoom canvas
canvas.on("mouse:wheel", function (opt) {

  var delta = opt.e.deltaY;
  var zoom = canvas.getZoom();
  zoom = zoom - delta/500;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  
  if (canvas.backgroundImage._element.width*zoom < canvas.getWidth() && canvas.backgroundImage._element.height*zoom < canvas.getHeight()) {
    this.viewportTransform[4] = 0;
    this.viewportTransform[5] = 0;
    canvas.setZoom(getmaxZoom())
  } else {
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  } 
  
  opt.e.preventDefault();
  opt.e.stopPropagation();
  
  checkBorders();
  
  });

  function over_target(opt) {

    if (opt.target == null) 
      return false;
    else if (opt.target.id == "fog")
      return false;
    else 
      return true;
  }

//Mouse down, can be many things
canvas.on("mouse:down", function (opt) {
  
  hide_menus()
  //console.log("mouse down:" + this.isDrawing +" "+ this.isDrawingfog  + " " +  this.Started + " " + this.with2clicks + " " + this.selection );
  this.lastPosX = opt.pointer.x;
  this.lastPosY = opt.pointer.y;
  var hoverTarget = canvas.findTarget(event, false);       
  
  // Dragging the map
  if(event.button == 2) {
      if (!over_target(opt)) {
      this.isDragging = true;
      this.selection = false;
    }
  } 
  // Drawing a poligon
  else if(this.isDrawing || this.isDrawingfog) {
    document.getElementById('message').style.display = "none";

    // Drawing a poligon with two clicks, last click
    if(this.with2clicks) {      
      this.isDrawing = false;
      this.Started = false;
      this.with2clicks =  false;
      canvas.remove(square);

      if(!this.isDrawingfog) {
        if (document.getElementById("plotmode").checked) {
          plottileSize = checkminTile(Math.abs(this.squarewidth));
        } else {
          tileSize = checkminTile(Math.abs(this.squarewidth));
        }
        
        updateBoard()
        
      } else {
        addFog(square.left - canvas.backgroundImage._element.width/2, square.top - canvas.backgroundImage._element.height/2, square.width, square.height);
        canvas.remove(square);
        canvas.isDrawingfog = true;
        canvas.selection = false;
      }

    }
    else {
      if (!over_target(opt)) {
    this.Started = true;
    var zoom = canvas.getZoom();

    square = new fabric.Rect({ 
        width: 0, 
        height: 0, 
        left:  (opt.pointer.x - this.viewportTransform[4])/zoom, 
        top:   (opt.pointer.y - this.viewportTransform[5])/zoom, 
        opacity: 0.5,
        fill: '#c710875'
    });

    canvas.add(square); 
    canvas.renderAll();
    canvas.setActiveObject(square); 
  }
    }
    // Rigth mouse to pan background
  } else if(document.getElementById("left-click-pan").checked) {
      if (!over_target(opt)) {
      this.isDragging = true;
      this.selection = false;
    }
  } 
});

canvas.on('mouse:dblclick', function (opt) {

  var hoverTarget = canvas.findTarget(event, false);  
  if (hoverTarget !== undefined && hoverTarget.dd20size !== -1) {

      var hp = document.getElementById("hp");      

      console.log(hp.style.backgroundColor)      

      if ( hp.style.backgroundColor == "rgba(200, 100, 100, 0.5)") {
        hp.style.backgroundColor = "rgba(0, 255, 255, 0.5)";
        hoverTarget.color = "rgba(0, 255, 255, 1)";
      }
      else if (hp.style.backgroundColor == "rgba(0, 255, 255, 0.5)") {
        hp.style.backgroundColor = "rgba(255, 0, 255, 0.5)";
        hoverTarget.color = "rgba(255, 0, 255, 1)";    
      }
      else if (hp.style.backgroundColor == "rgba(255, 0, 255, 0.5)") {
        hp.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
        hoverTarget.color = "rgba(0, 255, 0, 1)";            
      } 
      else {
        hp.style.backgroundColor = "rgba(200, 100, 100, 0.5)";
        hoverTarget.color = "rgba(0, 0, 0, 1)";  
      }    
      var shadow = {color: hoverTarget.color,  blur: shadowblur, offsetX: shadowoff, offsetY: shadowoff, opacity: shadowopacity, fillShadow: true,  strokeShadow: true, nonScaling:true }
      hoverTarget.set('shadow', shadow)
      canvas.renderAll();

      updateBoardQuick(true);
      //reDrawTokens(getboard());
      
  }

});


canvas.on("mouse:move", function (opt) {

  if (this.Started === undefined) {
    this.Started = false;
    this.isDrawing = false;
  }
 
  var zoom = canvas.getZoom();

  if((this.isDrawing || this.isDrawingfog) && this.Started) {
    //var square = canvas.getActiveObject(); 
    this.squarewidth = square.width;
    this.squareheigth = square.height;
    square.set('width', (opt.pointer.x - this.lastPosX)/zoom).set('height', (opt.pointer.y - this.lastPosY)/zoom);
    canvas.renderAll(); 
  } else if (canvas.isDragging) {
    this.viewportTransform[4] += opt.pointer.x - this.lastPosX;
    this.viewportTransform[5] += opt.pointer.y- this.lastPosY;
    this.requestRenderAll();
    this.lastPosX = opt.pointer.x;
    this.lastPosY = opt.pointer.y;
  } else {
      // Estamos encima de un token
       var hoverTarget = canvas.findTarget(event, false);       
       var hp = document.getElementById("hp");
       if (hoverTarget !== undefined && hoverTarget !== lasthp && hoverTarget.dd20size !== -1) {         
         lasthp = hoverTarget;         
         hp.style.display="";
         
         /*
         if (hoverTarget.color !== undefined) {           
          hp.style.backgroundColor = hoverTarget.color.replace("rgba(0, 0, 0, 1)","rgba(200, 100, 100, 0.5)").replace(", 1)",", 0.5)");
         } else {
          hp.style.backgroundColor="rgba(200, 100, 100, 0.5)";
         }          
        */
         if (hoverTarget.color == undefined)
          hoverTarget.color =  hoverTarget.color = "rgba(0, 0, 0, 1)";  

        hp.style.backgroundColor = hoverTarget.color.replace("rgba(0, 0, 0, 1)","rgba(200, 100, 100, 0.5)").replace(", 1)",", 0.5)");

         hp.childNodes[1].value = hoverTarget.hp;         
         hp.style.left = (hoverTarget.left*zoom + this.viewportTransform[4])  + "px";
         hp.style.top  = (hoverTarget.top*zoom + this.viewportTransform[5])  + "px";
         hp.style.width = tileSize * zoom * lasthp.dd20size+ "px";
         hp.style.height = tileSize * zoom * lasthp.dd20size+ "px";
         hp.style.borderRadius =  tileSize * zoom + "px"; 

         hp.childNodes[1].style.pointerEvents = "";
         if (tileSize * zoom * lasthp.dd20size < 60) {
          hp.childNodes[1].style.fontSize = (tileSize * zoom * lasthp.dd20size / 4) + "px";           
         } else {
          hp.childNodes[1].style.fontSize = "";                  
         }
         if (tileSize * zoom * lasthp.dd20size < 40) {
          hp.childNodes[1].style.pointerEvents = "none";         
         }
         
       } else if (hoverTarget == undefined && lasthp !== undefined) {        
          hp.style.display = "none";
          if (lasthp.hp !== hp.childNodes[1].value) {
            lasthp.hp = hp.childNodes[1].value;
            sendMessage(getboard());
          }          
          lasthp = undefined;
       } else  {
        
       }
  }
  if(opt.e.which == 1) {

    var x = Math.abs(5 * Math.trunc((opt.pointer.x - this.lastPosX)/(zoom*tileSize)));
    var y = Math.abs(5 * Math.trunc((opt.pointer.y - this.lastPosY)/(zoom*tileSize)));   
    try {
      if (lastdx !== x || lastdy !== y )
      document.getElementById("distance-bar").innerHTML = x + "ft<br>" + y + "ft";
    
    } catch(error) {}
       
    lastdx = x;
    lastdy = y;
  
  }

});

canvas.on("mouse:up", function (opt) {

  if (opt.e.altKey) {
    
    var hoverTarget = canvas.findTarget(event, false);       
    
    if (hoverTarget !== undefined  && hoverTarget.dd20size !== -1) {  
      console.log(hoverTarget)
      if (hoverTarget.monster !== undefined) {
        document.getElementById("monsterframe").innerHTML =  monsters_list.get(hoverTarget.monster);    
        setOption(document.getElementById('monster-list'), hoverTarget.monster);
      }
      lastmonstertoken = hoverTarget;
      document.getElementById("url-iframe").style.display = "";
      
  }
}

  //console.log("mouse up:" + this.isDrawing +" "+ this.isDrawingfog  + " " +  this.Started + " " + this.with2clicks + " " + this.selection );
  if (this.isDragging) {
    checkBorders();
    console.log(" fin del dragging!")
    this.isDragging = false;    
  }

  if(!this.touchenable)
    this.selection = true;
          
  if((this.isDrawing || canvas.isDrawingfog) && !this.with2clicks) {
    try{ 
    //var square = canvas.getActiveObject(); 
    if (square.width !== 0) {

        canvas.remove(square);
        this.isDrawing = false;
        this.Started = false;

        if (!canvas.isDrawingfog) {
          if (document.getElementById("plotmode").checked) {
            plottileSize = checkminTile(Math.abs(square.width));
          } else {
            tileSize = checkminTile(Math.abs(square.width));
          }
          
          updateBoard()
        } else {
          addFog(square.left - canvas.backgroundImage._element.width/2, square.top - canvas.backgroundImage._element.height/2, square.width, square.height);
          //this.isDrawingfog = false;
          canvas.remove(square);
          canvas.isDrawingfog = true;
          canvas.selection = false;
        }
          
    } else {
      console.log("hemos hecho solo 1 click")
      this.with2clicks = true;
      this.square = square;
    }
  } catch (error) {
    console.log(error)
  }
  } else {
      //checkBorders();
      canvas_move();      
 }

});

canvas.on('object:modified', function(options) {
  
  var doomedObj = canvas.getActiveObject();
  //console.log("modfied!!!")
  if (doomedObj !== null)
    if ( doomedObj.get('type') !== "textbox") {
    if ((doomedObj.left < (-tileSize/2)) || (doomedObj.top < (-tileSize/2)) )  
      deleteObj();
    else {
      updateBoardQuick();     
      if (canvas.fogEnabled)
        if (!fogrunning) {
          fogrunning = true;
          window.setTimeout(function() {  addFog('update'); }, 2*waittime);
        }
      }        
}

});

canvas.on('object:added', function(options) { 
  if (this.justCreated) {
    //updateBoardQuick();
    this.justCreated = false;
  }
});

canvas.on('object:removed', function(options) { 
  if (this.justDeleted > 0) {
    //updateBoardQuick();
    this.justDeleted--;
}
});

canvas.on('selection:cleared',function(ev) {

  //console.log(ev)
if(ev.deselected !== undefined)
  if(ev.deselected[0].get("type") == "textbox") {
    updateBoardQuick(true);
  }

});


canvas.on('selection:created',function(ev) {

  /*
if (ev.target.get("type") !== "textbox")
setTimeout(() => {
  canvas.discardActiveObject().renderAll();
}, 1500);
*/


/*
if ("#<fabric.Rect>" == ev.target + "") {
  if ((ev.target.left) == 0 && (ev.target.top == 0)) {
    console.log("Its is fog!");
    setTimeout(function(){ addFog('update'); }, 2*waittime);
    canvas.selection = true;
  }
}
else {*/
  
  var f = canvas.getActiveObject();
  if (f.dd20size < 0)
  {    
    ev.target.set({
      lockScalingX: false,
      lockScalingY: false,
      lockRotation: false
  });
  canvas.sendToBack(f);
  }
  else {
    try{
      var src = ev.target._element.src;
      document.getElementById("token-map").value = src;
    } catch (e) {}
    
  ev.target.set({
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true
});
}

//}
    /*
    var f = canvas.getActiveObject();
    console.log(f)
    console.log(f)
    
    canvas.sendToBack(fog);
    fog.set({selectable: false});
    canvas.preserveObjectStacking = true;
    canvas.renderAll();
    
    */
  /*    
  var activeObjects = canvas.getActiveObject();    
    if (activeObjects._objects !== undefined)
      for (i = 0 ; i < activeObjects._objects.length; i++) {        
          if(activeObjects._objects[i].id = "fog") {
            console.log("captured fog")
            ev.target.removeWithUpdate(activeObjects._objects[i]);
            canvas.renderAll();
          }
      }      
  */
 
});

//function for recreating tokens
const DrawItems = (data) => {

  var req_render = false;

  console.log("redibujamos mensaje: ")
  // First time we receive a packet
  if(!connected) {
    console.log("First paquet!")
    createBg(data.item.backgroundImage)
    mainBackground = data.item.backgroundImage;
    plotBackground = data.item.plotBackground;
    connected = true;
    setTimeout(function(){ DrawItems(data) }, waittime); 
    if(data.item.playerid == "dm")
          setTimeout(function(){ DrawFog(data) }, waittime); 
    return;
  }

  if (data.item.redraw == true) {

    tileSize = checkminTile(data.item.tileSize);
    plottileSize = checkminTile(data.item.plottileSize);
    reDrawAll(data.item);
    return;
  }

  try {
    // Get background and TileSize
    var myboard = getboard();    
    if (myboard.backgroundImage !== data.item.backgroundImage) {            
      reDrawAll(data.item);
      retrycount = 0;
      return;
    }
  } catch (e) {    
      console.log("Error getting background!:" + e)    
      if (retrycount > 10) {
        reDrawAll(data.item);
        retrycount = 0;
      }
        
      else {
        setTimeout(function(){ DrawItems(data) }, 2*waittime); 
        retrycount = retrycount + 1;
      }
      
    return;
  }

    // If it is just a move, we just make a move
    var ok = true;
    var selected = "";
    var lista;
    // Check if a group is selected
    try {
      selected = canvas.getActiveObject().id;
    } catch (e) {
    }
    try {
      lista = canvas.getActiveObject()._objects;
    } catch (e) {
    }

    // Just move
    if ((canvas._objects.length == data.item.tokens.length) && (tileSize == data.item.tileSize) && (plottileSize == data.item.plottileSize) ) {
    // If possible, just sequentially
        var i = 0;
        canvas.getObjects().every(function(o) {   

          if (o.id  == data.item.tokens[i].id ) { //&& o.id
            if(o.id !== selected && !checklista(o.id,lista)) {
            
            adjustToken(o, data.item.tokens[i].zoomrange, data.item.tokens[i].leftrange, data.item.tokens[i].uprange)
            if (o.dd20size < 0) {
              o.set({hasControls: true, scaleX:data.item.tokens[i].scaleX,scaleY:data.item.tokens[i].scaleY, angle:data.item.tokens[i].angle });
            } 
            if (o.text !== undefined) {
              o.text = data.item.tokens[i].text;
              req_render = true;
            }
            o.hp = data.item.tokens[i].hp;
            o.color = data.item.tokens[i].color;
            if (o.left !== data.item.tokens[i].left || o.top !== data.item.tokens[i].top )
            o.animate({left: data.item.tokens[i].left, top: data.item.tokens[i].top }, {
              duration: animationtime,
              onChange: canvas.renderAll.bind(canvas),});

          }
          i++;
          return true;
        } else {
            console.log("No esta en secuencia!")
            ok = false;         
            return false;
          }

        });

        if (req_render)
          canvas.renderAll();
  } else 
    ok = false;

/*
Recorremos todos los objetos canvas:
 Si no esta, lo borramos, a no ser que sea recien creado, 1s de vida. 
 Si esta lo moevemos, si no los estamos moviendo

Recorremos todos los objetos mensaje:
 Creamos los nuevos
 No dejar a los jugadores selección de grupo
*/
  if (!ok) {
    if ((tileSize !== data.item.tileSize) || (plottileSize !== data.item.plottileSize) ) {
      plottileSize = checkminTile(data.item.plottileSize);
      tileSize = checkminTile(data.item.tileSize);
      reDrawAll(data.item);
    }
    else {
    console.log("More than move, let's see in detail! " +  data.item.tileSize);
    let tokens = data.item.tokens;

    canvas.forEachObject(function(o) {
      if(o.fill !== '#c710875') {
        let t = getTokenInlist(o.id,tokens);

        if (t > -1) {
          if(o.id !== selected && !checklista(o.id,lista)) {

            adjustToken(o, tokens[t].zoomrange, tokens[t].leftrange, tokens[t].uprange)

            if (tokens[t].dd20size < 0) 
              o.set({hasControls: true, scaleX:tokens[t].scaleX,scaleY:tokens[t].scaleY, angle:tokens[t].angle });
        
            if (o.text !== undefined) {
              o.text = tokens[t].text;
              req_render = true; }

            if (o.left !== tokens[t].left || o.top !== tokens[t].top )
              o.animate({left: tokens[t].left, top: tokens[t].top }, {
              duration: animationtime,
              onChange: canvas.renderAll.bind(canvas),});

            o.hp = tokens[t].hp;
            o.color = tokens[t].color;

        }
        }
        else {
          console.log("No lo tenemos lo borramos, falta comprobar si es nuevo o si esta seleccionado");
          if (!o.newtoken && o.id !== selected)
            canvas.remove(o);
        }
        }});
  
    tokens.forEach((item) => {
      if(getTokenInlist(item.id, myboard.tokens) == -1) {
        console.log("No lo tenemos lo creamos");
        createToken(item);
      }
    });

    if (req_render)
          canvas.requestRenderAll();
  } 
}
   
  // Save the board into local storage
  if(checkAdmin()) {
    localStorage.setItem(room + 'data', JSON.stringify(data.item));
  }

};

function checklista(id, lista) {
  if (lista !== undefined) {
  for (var i = 0; i < lista.length; i++) {
    if(lista[i].id == id) return true;
  }
  return false;
} else return false;
}

function checklistvalue(id, lista) {
  if (lista !== undefined) {
  for (var i = 0; i < lista.length; i++) {
    if(lista[i] == id) return true;
  }
  return false;
} else return false;
}

function getTokenInlist(id, ntokens) {
  var i = 0;
  for ( var i = 0; i < ntokens.length ; i++) {
    if(ntokens[i].id.indexOf(id) > -1) {
      return i;
    }
  }
  return -1;
}

function getrequest() {
  var obj = new Object();
  obj.request         = true;
  obj.playerid        = user;
  return obj;
}

function getfog() {
var obj = new Object();
obj.squares   = [];
obj.playerid  = user;
obj.request   = false;
obj.fog       = true;

fogHoles.forEach((item,index) => {
  var s = new Object();
  s.left = item.left;
  s.top = item.top;
  s.width = item.width;
  s.height = item.height;
  obj.squares.push(s);
});

return obj;
}

function getboard() {
  
  var bg = canvas.backgroundImage._element.src;
  if (bg == "")
    bg = canvas.backgroundImage._element.firstChild.src;

  var obj = new Object();
  if (document.getElementById("plotmode").checked) {
    console.log("plot mode checked - getboard: " + mainBackground)
    obj.backgroundImage   = mainBackground;  
  } else {
    obj.backgroundImage   = bg;  
  }
  obj.plotBackground    = plotBackground;
  obj.background_width  = canvas.backgroundImage._element.width;
  obj.background_heigth = canvas.backgroundImage._element.height;
  obj.tileSize          = tileSize;
  obj.plottileSize      = plottileSize;
  obj.playerid          = user;
  obj.tokens            = [];
  obj.request           = false;
  obj.fog               = canvas.fogEnabled;
  obj.squares   = [];
  obj.roll = false;
  
  if (checkAdmin()) {
      obj.inmersive = document.getElementById("inmersive-on").checked;
      obj.inmersive_track = document.getElementById("inmersive-track").checked;
      obj.inmersive_dice = document.getElementById("inmersive-dice").checked;
      obj.inmersive_chat = document.getElementById("inmersive-chat").checked;
      obj.inmersive_assets = document.getElementById("inmersive-assets").checked;
      obj.inmersive_plot = document.getElementById("inmersive-plot").checked;
      obj.inmersive_background = document.getElementById("inmersive-background").checked;   
      obj.player_audio      = document.getElementById("player-audio").checked;
    
  }

  canvas.forEachObject(function(o) {
    
    if (o._element !== undefined) {      
      var token = new Object();
      token.src  = o._element.src;      
      token.dd20size = o.dd20size;
      token.scaleX = o.scaleX;
      token.scaleY = o.scaleY;
      token.angle = o.angle;
      token.leftrange = o.leftrange;
      token.uprange = o.uprange;
      token.zoomrange = o.zoomrange;
      token.hp = o.hp;
      token.plot = o.plot;
      token.color = o.color;
      if (o.group !== undefined) {
        token.top  = o.top + o.group.top + o.group.height/2;
        token.left = o.left + o.group.left + o.group.width/2;  
        token.id = o.id;
      } else {
        token.top  = o.top;
        token.left = o.left;
        token.id = o.id;
      }
    obj.tokens.push(token);
  } else if(o.text !== undefined) {
    var token = new Object();
      token.text = o.text;
      token.width = o.width;
      token.backgroundColor = o.backgroundColor;
      token.dd20size = o.dd20size;
      token.plot = o.plot;
      token.scaleX = o.scaleX;
      token.scaleY = o.scaleY;
      token.angle = o.angle;
      if (o.group !== undefined) {
        token.top  = o.top + o.group.top + o.group.height/2;
        token.left = o.left + o.group.left + o.group.width/2;  
        token.id = o.id;
      } else {
        token.top  = o.top;
        token.left = o.left;
        token.id = o.id;
      }
    obj.tokens.push(token);   
  }
  });
  
  fogHoles.forEach((item) => {
    var s = new Object();
    s.left = item.left;
    s.top = item.top;
    s.width = item.width;
    s.height = item.height;
    obj.squares.push(s);
  });
  
  return(obj);
}

  function deleteObj() {
    var doomedObj = canvas.getActiveObject();
    if ( (doomedObj.get('type') !== "textbox") || !doomedObj.isEditing) {

    if (doomedObj !== undefined)
      if (doomedObj.type === 'activeSelection') {
          doomedObj.canvas = canvas;
          doomedObj.forEachObject(function(obj) {
          canvas.justDeleted++;
          canvas.remove(obj);
          });
          updateBoardQuick()
     }
      else {
      var activeObject = canvas.getActiveObject();
        if(activeObject !== null ) {
          canvas.justDeleted++;
          canvas.remove(activeObject);
          updateBoardQuick()
        }
      }
    }
  }


// ---------------------------------------------------------- //
// Communication to server 
async function sendMessage(token, redraw) {

  var redraw = redraw || false;
  token.redraw = redraw;
  var messageToSend = { item: token};
  await app.service(channel).create(messageToSend);
  messageToSend = {};
  
}

function sendChat() {

  var text = document.getElementById("chat-text").value;
  text = "<p>" + text + "</p>";
  document.getElementById("chat-text").value = "";
  var obj = new Object();
  obj.playerid          = user;
  obj.request           = false;
  obj.roll = false;
  obj.chat = true;
  obj.text = text;
  sendMessage(obj);
}



function sendChat_5e() {

  console.log("from 5etools")

  var text = document.getElementById("chat-text").value;
  document.getElementById("chat-text").value = "";
  var obj = new Object();
  obj.playerid          = user;
  obj.request           = false;
  obj.roll = false;
  obj.chat = true;
  obj.text = text;
  sendMessage(obj);

 

}

function sendChat_beyond() {

  console.log("from beyond")

  var text = document.getElementById("chat-text").value;
  document.getElementById("chat-text").value = "";

  /*
  var obj = new Object();
  obj.playerid          = user;
  obj.request           = false;
  obj.roll = false;
  obj.chat = true;
  obj.text = text;
  sendMessage(obj);
*/

  var doc = new DOMParser().parseFromString(text, "text/xml");
  var resultados = doc.getElementsByClassName("dice_result__info__breakdown")[0].getAttribute('title')
  var tiradas    = doc.getElementsByClassName("dice_result__info__dicenotation")[0].getAttribute('title')
  var text2      = user + ' ' + doc.getElementsByClassName("dice_result__info__rolldetail")[0].innerHTML + ' ' + doc.getElementsByClassName("dice_result__rolltype")[0].innerHTML

  console.log(tiradas)
  console.log(resultados)
  console.log(text2)

  var obj = new Object();
  obj.roll = true;
  obj.playerid          = user; 
  obj.request           = false;
  obj.text = text2;
  obj.dices = getdicesfrombeyond(tiradas, resultados)
  sendMessage(obj);

}


function checkEnter() {
  var key = window.event.keyCode;
  // If the user has pressed enter
  if (key === 13) {
      sendChat();
      return false;
  } 
  else {
      return true;
  }
}

function printchat(item) {
  var text = urlify(item.text)
  var log = document.getElementById("chat-log");
  if (item.pretext !== undefined && item.pretext !== "") {
    log.innerHTML = log.innerHTML +"<br><span class='playerid'>" + item.pretext + ":</span><div draggable='true' ondragstart='drag_roll_start(event)' ondragend='drag_roll_end(event)' class='dice_result' id='g"+generalid+++"'>" + text + "</div>";  
  }
  else {
    log.innerHTML = log.innerHTML +"<br><span class='playerid'>" + item.playerid + ":</span><div draggable='true' ondragstart='drag_roll_start(event)' ondragend='drag_roll_end(event)' class='dice_result' id='g"+generalid+++"'>" + text + "</div>";  
  }
  
  localStorage.setItem(room + 'chat-log', log.innerHTML);
  document.getElementById("chat-log").scrollTop = document.getElementById("g"+(generalid-1)).offsetTop;  
 
}


// Receive data from server from async function
function addMessage(item) {

  if (checkAdmin()) {
   keepAliveBoard.resetTimer(10000);
  }

  if(item.item.roll) 
    printdice(item.item)

  if(item.item.link) {
    update_assets(item.item)
  }
    
  if(item.item.chat) 
    printchat(item.item)

  if(item.item.music) {
    console.log("music!")
    playmusic(item.item)
  }
    

// If it is our message we do nothing
if (user !== item.item.playerid) {

  set_inmersivemode(item.item.inmersive, item.item.inmersive_track, item.item.inmersive_dice, item.item.inmersive_chat, item.item.inmersive_assets,item.item.inmersive_plot,item.item.inmersive_background);
  set_musicmode(item.item.player_audio);

  if(item.item.track) {
    print_track(item.item.tracks)
    set_namemode(item.item.names);
  }

  if (item.item.request == false) {
    if(!item.item.roll && !item.item.link && !item.item.track && !item.item.chat && !item.item.music) 
    /*{
      printdice(item)
    } else 
    */{
      DrawItems(item);
      if(connected) {
          if(item.item.playerid == "dm")
            DrawFog(item)  
          else addFog('update')  
        }
    }
  }
  // Acaba de entrar un jugador nuevo
  else if (checkAdmin()) {
      
      sendMessage(getboard());
      setTimeout(() => {
        sendMessage(get_track());        
      }, 2*waittime);
      setTimeout(() => {
        sendMessage(getLink());        
      }, 4*waittime);   
       
    }
  }

}
 
const main = async () => {
  // Find all existing messages
  const messages = await app.service(channel).find();

  // Add existing messages to the list
  try {
    messages.forEach(addMessage);
  } catch {}  

  // Add any newly created message to the list in real-time
  try {
  app.service(channel).on("created", addMessage);
  } catch {}  

};

// ------------------------------------------------------------------- // 


//create random
function getRandomInt(max) {
return Math.floor(Math.random() * Math.floor(max));
}


// ------------------------------------------------------------------- // 

function addtrackwhentoken(src, n) {  

if (n == null) {

  // Comprobamos que no sea una bola de fuego
  for (var i = 7 ; i < 12; i++) {
    var tr = document.getElementById("t" + i).src;
    if(tr == src) {     
      return;
    }    
  }
  
    for (var i = 2 ; i < 10; i++) {
      var tr = document.getElementById("track" + i).style.backgroundImage;
      
      if (tr == "") {        
        document.getElementById("track" + i).style.backgroundImage = "url('" + src + "')";
        document.getElementById("track" + i).firstElementChild.style.display = "";
        
        if (document.getElementById("token-map-chk").checked)          
            document.getElementById("track" + i).firstElementChild.value = document.getElementById("player-name").value;          
        else 
          document.getElementById("track" + i).firstElementChild.value = "";

        update_track();
        break;
      }
    
}
} else {
 
    document.getElementById("track" + (n+1)).style.backgroundImage = "url('" + src + "')";
    document.getElementById("track" + (n+1)).firstElementChild.style.display = "";
}
}

function delay(wait) {
  setTimeout(function(){ sendMessage(getboard()); }, wait);
  }

  
  function drag(event) {
    console.log("drag:" + event.target.id)
    event.dataTransfer.setData("text", event.target.id);
  }

  
  function drag_track(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.target.style.opacity = "0.4";
    document.getElementById("left-trash").style.display = "";
  }

  function create_roll_divs() {

    var zoom = canvas.getZoom();
    canvas.forEachObject(function(o) {
      if (o._element !== undefined) {

        var top = "";
        var left = "";
        var hp = document.createElement('div');        
        hp.className = "thp";
        if (o.hp !== undefined)
          hp.innerHTML = o.hp;

        if (o.color !== undefined)
          hp.style.backgroundColor = o.color.replace("rgba(0, 0, 0, 1)","rgba(200, 100, 100, 0.5)").replace(", 1)",", 0.5)");;

        if (o.group !== undefined) {
          top  = o.top + o.group.top + o.group.height/2;
          left = o.left + o.group.left + o.group.width/2;  
        } else {
          top  = o.top;
          left = o.left;
        }        
       
        hp.style.left = (o.left*zoom + canvas.viewportTransform[4])  + "px";
        hp.style.top  = (o.top*zoom + canvas.viewportTransform[5])  + "px";
        hp.style.width = tileSize * zoom * o.dd20size+ "px";
        hp.style.height = tileSize * zoom * o.dd20size+ "px";
        hp.style.borderRadius =  tileSize * zoom + "px";        
        
        document.body.appendChild(hp);
      
    }
    });
  }

  
  function drop(ev) {
      
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var destiny = document.getElementById(data);
    console.log("drop: " + destiny.className)
    var oorigin  = event.target;
    //console.log(oorigin.className)

    if (destiny.className == "bglist") {
      document.getElementById("token-map").value = destiny.src;
      document.getElementById("free").checked = true;
      addToken();
    }
    else if (destiny.className == "token") {
      document.getElementById("token-map").value = destiny.src;
      addToken();
    } 
    else if (destiny.className == "img-show") {
      //document.getElementById("token-map").value = destiny.src;
      addToken();
    } 
    else if (destiny.className == "tokenA") {
      addText();
    } 
    else if (destiny.className == "tokentA") {
      addText();
    }    
    else if (destiny.className == "dice_result") {    
      var hoverTarget = canvas.findTarget(event, false);
      if (hoverTarget !== undefined) {        
        var hp = document.getElementById("hp");
        hp.style.display = "none";        
        console.log(hp)
        hp.childNodes[1].style.display = "";    
        hp.childNodes[2].style.display = "none"; 
        hp.childNodes[3].style.display = "none";    
        
        // Check if 1/2 or x2
        var zoom = canvas.getZoom();        
        var left = (hoverTarget.left*zoom + canvas.viewportTransform[4]);
        var top  = (hoverTarget.top*zoom + canvas.viewportTransform[5]);
        var width =  tileSize * zoom * lasthp.dd20size;
        var heigth = tileSize * zoom * lasthp.dd20size;

        if (ev.clientX < left + width/3 && ev.clientY < top + heigth/3)
          var total = parseInt(document.getElementById(destiny.id).getElementsByClassName("dice_result__total-result")[0].innerHTML) * 0.5;
        else if (ev.clientX > left + 2*width/3 && ev.clientY > top + 2*heigth/3)
          var total = parseInt(document.getElementById(destiny.id).getElementsByClassName("dice_result__total-result")[0].innerHTML) * 2;
        else
          var total = parseInt(document.getElementById(destiny.id).getElementsByClassName("dice_result__total-result")[0].innerHTML);
        
        lasthp = undefined;

        if (hoverTarget.hp == undefined || hoverTarget.hp == "")
          hoverTarget.hp = 0;
        hoverTarget.hp = parseInt(hoverTarget.hp) + total;
        sendMessage(getboard());
      }      
    }

  }
  
  function dragover(event) {

    var zoom = canvas.getZoom();
    var hoverTarget = canvas.findTarget(event, false);
    var hp = document.getElementById("hp");

    if (hoverTarget !== undefined && hoverTarget !== lasthp && hoverTarget.dd20size !== -1) {

      lasthp = hoverTarget;
      hp.style.display="";     
      hp.childNodes[1].style.display = "none";
      hp.childNodes[2].style.display = ""; 
      hp.childNodes[3].style.display = "";    
       
      hp.style.left = (hoverTarget.left*zoom + canvas.viewportTransform[4])  + "px";
      hp.style.top  = (hoverTarget.top*zoom + canvas.viewportTransform[5])  + "px";
      hp.style.width = tileSize * zoom * lasthp.dd20size+ "px";
      hp.style.height = tileSize * zoom * lasthp.dd20size+ "px";
      hp.style.borderRadius =  tileSize * zoom + "px";
    } else if (hoverTarget == undefined && lasthp !== undefined) {
       hp.style.display = "none";
       hp.childNodes[1].style.display = "";    
       hp.childNodes[2].style.display = "none"; 
       hp.childNodes[3].style.display = "none";    
       lasthp = undefined;
    } 

  }

  function drag_roll_start(event) {   
    create_roll_divs();    
    event.dataTransfer.setData("text", event.target.id);
  }  
  
  function drag_scene_start(event) {       
    //console.log(event.target)
    event.dataTransfer.setData("text", event.target.id);
  }  

  function trash_enter(event) {
    event.target.style.filter = "hue-rotate(90deg)";
    event.preventDefault();  
    event.stopPropagation();

  }

  function trash_leave(event) {
    event.target.style.filter = "";
    event.preventDefault();  
    event.stopPropagation();
  }

  function trash_over(event) {
    event.preventDefault();  
    event.stopPropagation();
  }

  function drag_roll_end(event) {
    document.querySelectorAll('.thp').forEach(e => e.remove());
  } 
  
  function drop_left_trash(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var destiny = document.getElementById(data);

    destiny.style.backgroundImage = "";
    destiny.firstElementChild.style.display = "none";
    update_track();
    event.target.style.filter = "";
  }

  function drop_trash(event) {

    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var destiny = document.getElementById(data);
    var parent = destiny.parentNode.id;
     
    if (destiny.nodeName == "DIV") 
      destiny.parentNode.removeChild(destiny);
    else if (destiny.nodeName == "A")
      destiny.parentNode.parentNode.removeChild(destiny.parentNode);
    else if (destiny.nodeName == "IMG")
      destiny.parentNode.removeChild(destiny);

    if ((destiny.className.indexOf("bglisscene") > -1)) {
     
      var lista = [];
      var lista_names = [];
      var lista_assets = [];
      var lista_music = [];
      lista        = JSON.parse(localStorage.getItem('allscenes')) || [];
      lista_names  = JSON.parse(localStorage.getItem('allscenesnames')) || [];
      //lista_assets = JSON.parse(localStorage.getItem('allscnassets')) || [];
      //lista_music  = JSON.parse(localStorage.getItem('allmusic')) || [];
      
      var pos = parseInt(data.replace("sdiv","").replace("slink",""));
      lista.splice(pos, 1);  
      lista_names.splice(pos, 1);
      //lista_assets.splice(pos, 1);
      //lista_music.splice(pos, 1);

      localStorage.setItem('allscenes', JSON.stringify(lista));
      localStorage.setItem('allscenesnames', JSON.stringify(lista_names));
      //localStorage.setItem('allscnassets', JSON.stringify(lista_assets));
      //localStorage.setItem('allmusic', JSON.stringify(lista_music));
    }
    else if (destiny.classList.contains("bglist")) {
      
      if (parent.indexOf("background-list") > -1) {
        savetilesizeonlist()        
      }        
      else if (parent.indexOf("asset-list") > -1) {
        getLink()
      }
      else {        
        var lista = [];
        lista = JSON.parse(localStorage.getItem('allassets')) || [];
        var pos = parseInt(data.replace("all",""));
        lista.splice(pos, 1);  
        localStorage.setItem('allassets', JSON.stringify(lista));      
    }

    }
    else if (destiny.classList.contains("musiclist")) {
      setTimeout(() => {
        var list = document.getElementById("music-list");
        var musicN = list.childElementCount;
        list = list.children;
        //console.log(musicN)
        for (i = 0; i < musicN; i++) {
          console.log(list[i].getAttribute("src"))
          localStorage.setItem("music" + i, list[i].getAttribute("src"))
        }
        localStorage.setItem("musicN", musicN)  
      }, waittime);
      
    }
    event.target.style.filter = "";

    savetoplugin();
  }

  function drop_track(event) {
   event.preventDefault();
   event.target.style.border = "";
   var data = event.dataTransfer.getData("text");
   var destiny = document.getElementById(data);
   var oorigin  = event.target;

   if (destiny.className == "track_item") {
      if (destiny.style.order !== oorigin.style.order) {
        var old = destiny.style.order;
        destiny.style.order = oorigin.style.order
        oorigin.style.order = old;
        update_track();
      }        
   } else if (destiny.className == "token") {
     console.log(document.getElementById(data).src)
     oorigin.style.backgroundImage = "url('" + document.getElementById(data).src + "')";
     oorigin.firstElementChild.style.display = "";
     update_track();
   }
   
  }
          
  function drag_end_track(event) {
    event.target.style.opacity = "1";
    document.getElementById("left-trash").style.display = "none"
  }
  function drag_enter_track(event) {
       if ( event.target.className == "track_item" ) {
    event.target.style.border = "0.5rem dotted red";
    //event.target.style.filter = "brightness(1.5)";
       }
  }
  function drag_leave_track(event) {
   if ( event.target.className == "track_item" ) {
    event.target.style.border = "";
   }
  }
  function click_track(event) {

    poner = true;
    if (event.target.classList.contains("selected"))
      var poner = false;
    
    var lista = document.getElementById("track_bar").children;
    for (var i = 0; i < lista.length; i++) {
      lista[i].classList.remove("selected")
    }

    if (poner)
    event.target.classList.add("selected");

    var s = event.target.style.backgroundImage;
    s = s.substring(5, s.length-2);
    document.getElementById('token-map').value = s;
    update_track();
  }

  function drag_over_track(event) {
    event.preventDefault();
  }
  
  function update_track() {
    sendMessage(get_track());
  }

  function get_track() {
    
    var obj = new Object();
    obj.tracks = [];
    obj.track = true;
    obj.playerid          = user; 
    obj.request           = false;
    obj.names             = document.getElementById("view-names").checked;

    for (var i = 1 ; i < 9; i++) {
        var t = new Object();
        t.order = document.getElementById("track" + i).style.order;
        t.hp    = document.getElementById("track" + i).firstElementChild.value;
        t.src   = document.getElementById("track" + i).style.backgroundImage;
        t.class = document.getElementById("track" + i).className;
        localStorage.setItem("trackorder" + i, t.order);
        localStorage.setItem("trackhp" + i, t.hp);
        localStorage.setItem("tracksrc" + i, t.src);
        localStorage.setItem("trackclass" + i, t.class);
        obj.tracks.push(t);
    }
    return(obj);
  }

  function print_track(tracks) {
 
    for( i = 0 ; i < tracks.length; i++) {
      document.getElementById("track" + (i+1)).style.order = tracks[i].order;
      document.getElementById("track" + (i+1)).firstElementChild.value = tracks[i].hp;
      document.getElementById("track" + (i+1)).style.backgroundImage = tracks[i].src;
      document.getElementById("track" + (i+1)).className = tracks[i].class;
      if (tracks[i].src !== "") 
        document.getElementById("track" + (i+1)).firstElementChild.style.display = "";
        else 
      document.getElementById("track" + (i+1)).firstElementChild.style.display = "none";
    }
    
  }
  
  function sendLink(link) {

    if (link !== undefined) {

    }
    else {      
      link = checkurl(document.getElementById("asset-url").value);      
    }
    
    if (link == "")
      link = checkurl(document.getElementById("token-map").value);
          
    if ((link !== "") && (!checkSRC(link,document.getElementById("asset-list").childNodes))) {
     
      var img = document.createElement("img");
      img.classList.add("bglist");
      img.id = "assett" + document.getElementById("asset-list").childElementCount + 1;
      img.addEventListener('dragstart',  drag_scene_start, true);
      if (!document.getElementById("assetvisible").checked) 
        img.classList.add("grayed");

      if (link.indexOf('.webm')>0 || link.indexOf('.m4v')>0 || link.indexOf('.mp4')>0) {   
        img.src = IconVideo;        
        img.setAttribute('video', link)
      } 
      else {
        img.src = link;
      }
        
      var list = document.getElementById("asset-list");
        list.appendChild(img);

      if (list.childElementCount > maxItems)
        list.removeChild(list.childNodes[0])

      if (document.getElementById("assetvisible").checked) 
        sendMessage(getLink());
      
      addtoAllAssets(link)
      }

  }

  function update_assets(link) {

    if (!link.forced) {

    var list = document.getElementById("player-asset-list");
    list.innerHTML = "";
    
    if(link.assets.length > 0) {
      for ( var i = 0 ; i < link.assets.length ; i++) {      
      var asset = link.assets[i].src;
        if (IsVideo(asset)) {                  
          var img = document.createElement("img");
          img.src   = IconVideo;
          img.setAttribute('video', link.assets[i].src.replaceAll(" ","%20"));
          img.classList.add("bglist");
          img.id = "a"+i;          
          list.appendChild(img);
        }
        else {          
          var img = document.createElement("img");
          img.src = link.assets[i].src.replaceAll(" ","%20");
          img.classList.add("bglist");
          img.id = "a"+i;
          img.addEventListener("dragstart",drag, true);
          list.appendChild(img);      
        
      }
    }
    }
  } else {
        
    if (link.links == ""){
      document.getElementById("ontop").addEventListener('click', hide_menus);
      document.getElementById("ontop").style.display = "none";
    }
    else {
      setplayerasset(link.links)
      if(!checkAdmin()) {
        console.log("forcedlink")
        document.getElementById("ontop").removeEventListener('click', hide_menus);
      }    
    }
  }
}

  function checkSRC(id, lista) {

    var item = "";
    if (lista !== undefined) {
    for (var i = 0; i < lista.length; i++) {
     
      if (lista[i].getAttribute('src') == IconVideo) 
        item = lista[i].getAttribute('video');
      else 
        item = lista[i].getAttribute('src');
      if(item == id) return true;
    }
    return false;
  } else return false;
  }

  function checkSRCmp3(id, lista) {

    var item = "";
    if (lista !== undefined) {
    for (var i = 0; i < lista.length; i++) {     
      item = lista[i].getAttribute("src");     
      if(item == id) return true;
    }
    return false;
  } else return false;
  }

  function IsVideo(asset) {
    if (asset.indexOf('.webm')>0 || asset.indexOf('.m4v')>0 || asset.indexOf('.mp4')>0)
      return true
    else 
      return false
  }

  function chooseasset(event) {
    if (event.target.id == "asset-list") {
      hide_menus();
    } else {
    if (event.target.classList.contains("grayed"))
      event.target.classList.remove("grayed")
    else event.target.classList.add("grayed")
      sendMessage(getLink());
    }
  }

  function dblchooseasset(event) {
    var src = event.target.getAttribute('src');
    if (src == IconVideo)
      src = event.target.getAttribute('video');
    setplayerasset(src)    
    sendMessage(getForcedLink(src));
    document.getElementById("title-player-view").style.display = "";
    document.getElementById("ontop").style.width = "15vw";
    document.getElementById("ontop").style.height = "15vh";
    document.getElementById("ontop").style.left = "auto";
    document.getElementById("ontop").style.top = "auto";
    document.getElementById("ontop").style.bottom = "5vh";
    document.getElementById("ontop").style.right = "5vw";
    document.getElementById("asset-list").style.display = "none";
    document.getElementById("trash").style.display = "none";

  }

  function choose_all_asset(event) {

    if (typeof trash_delete_mode == 'undefined')                
      trash_delete_mode = false;

    if (trash_delete_mode) {
      console.log("delete mode on and event")
      
      var destiny = event.srcElement;
      if (destiny.nodeName == "IMG") {
        destiny.parentNode.removeChild(destiny);
        var lista = [];
        lista = JSON.parse(localStorage.getItem('allassets')) || [];
        var pos = parseInt(event.srcElement.id.replace("all",""));
        lista.splice(pos, 1);  
        localStorage.setItem('allassets', JSON.stringify(lista));      
        savetoplugin();  
      }
      
    } else {
        document.getElementById("token-map").value = event.target.src;
        document.getElementById("asset-url").value = event.target.src;
        document.getElementById("map-url").value = event.target.src;
        selfclose('allassets')
        document.getElementById("trash").style.display = "none";
    }
    
    url_token_input_change();    
    url_asset_input_change();
    url_map_input_change();

  }

  function chooseplayerasset(event) {
    var src = event.target.getAttribute('src');
    if (src == IconVideo)
      src = event.target.getAttribute('video');   
    setplayerasset(src)
    document.getElementById("inside-top").style.width  = "";
    document.getElementById("inside-top").style.height = "";
  }

  function setplayerasset(src) {

    src = src.replaceAll(" ","%20")

    if (IsVideo(src)) {
      var onvideo = document.getElementById('onvideo');
      if (!(onvideo.firstChild.src == src))        
       {
          onvideo.innerHTML = "";
          var source = document.createElement('source');
          source.src = src;
          onvideo.appendChild(source);
          onvideo.autoplay = true;
      }
      
      document.getElementById("onvideo").style.display = "";
      document.getElementById("inside-top").style.display = "none";

    } else {
        document.getElementById("onvideo").style.display = "none";
        document.getElementById("inside-top").style.display = "";
        document.getElementById("inside-top").style.backgroundImage = 'url(' + src + ')';        
    }
    document.getElementById("ontop").style.display = "";
  
    document.getElementById("inside-top").addEventListener("wheel", wheelAsset);

  }

  function wheelAsset() {

    var delta = (1 + event.deltaY/1000);
    console.log(delta)
    if (document.getElementById("inside-top").style.width == '') {
      var size = 100;
      document.getElementById("inside-top").style.width  = size * delta + "%"
      document.getElementById("inside-top").style.height = size * delta + "%"
    }
    else {
      var size = parseInt(document.getElementById("inside-top").style.width.replace('%',''))
      document.getElementById("inside-top").style.width  = size * delta + "%"
      document.getElementById("inside-top").style.height = size * delta + "%"
      console.log(size * delta + "%")
    }
    
    
    //event.stopPropagation;
  }

function addBackgroundtoList(bg) {

  var img = document.createElement("img");
  img.src = bg;
  img.className="bglist";
  img.id = "bckimg" + document.getElementById("background-list").childElementCount + 1;
  img.addEventListener('error',brokenlink);
  img.addEventListener('dragstart',  drag_scene_start, true);

  var list = document.getElementById("background-list");
  list.appendChild(img);
    
  if (list.childElementCount > maxItems)
    list.removeChild(list.childNodes[0])

}

function brokenlink(event) {
  console.log("broken!!" + event.srcElement)
  event.srcElement.removeEventListener('error',brokenlink);
  //event.srcElement.style.display = "none";
  
  if (event.srcElement.src.indexOf('.webm')>0 || event.srcElement.src.indexOf('.m4v')>0 || event.srcElement.src.indexOf('.mp4')>0) {
    event.srcElement.style.backgroundImage = "url('https://digitald20.com/vtt/img/video.jpg')";
    event.srcElement.style.backColor = "black";

    /*
    var video = document.createElement('video');
    video.width = 40;
    video.height = 25;
    video.crossOrigin = 'Anonymous';
    video.setAttribute('src', event.srcElement.src);	
    console.log(event.srcElement.src)						
    
    // Create thumbnail after video data loaded
    video.addEventListener('loadeddata', function() {
        this.play()
        setTimeout(() => {
          this.pause();
          var canvas = document.createElement("canvas");
          canvas.width = 40;
          canvas.height = 25;
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
          
          event.srcElement.style.backgroundImage = "url('"+ canvas.toDataURL() + "')";
          event.srcElement.style.backColor = "black";
          console.log(canvas.toDataURL())  
        }, 200);    
        
      }, false);
     */
  }

}

function deleteItem(event) {

  var id = event.srcElement.id;
  event.srcElement.removeEventListener('error',deleteItem);
  event.srcElement.parentNode.removeChild(event.srcElement);

  var lista = [];
  lista = JSON.parse(localStorage.getItem('allassets')) || [];
  var pos = parseInt(id.replace("all",""));
  lista.splice(pos, 1);  
  localStorage.setItem('allassets', JSON.stringify(lista));
 
}

  function choosebackground(event) {

    if (event.target.id == "background-list") {
      hide_menus();
    } else {

      if (document.getElementById("plotmode").checked) {
          plottileSize =  checkminTile(event.target.getAttribute("tile"));
      } else {
          tileSize =  checkminTile(event.target.getAttribute("tile"));
      }    

    if (document.getElementById("plotmode").checked) {
      plotBackground = event.target.src;  
    } else {
      mainBackground = event.target.src;
    }

    createBg(event.target.src)
    clearFogbutton();

    setTimeout(() => {
      updateBoard();
      setTimeout(() => {
        check_outside_tokens();
      }, 3*waittime);
    }, waittime);

    document.getElementById("metabackgrounds").style.display = "none";
    document.getElementById("trash").style.display = "none";
  }
  }

  function savetilesizeonlist() {
    var blist = document.getElementById("background-list").getElementsByTagName("img");

    for (i = 0; i < blist.length; i++)
    {
      console.log(blist[i].src)
      if(blist[i].src == canvas.backgroundImage._element.src)
        blist[i].setAttribute("tile",tileSize);
        localStorage.setItem("background" + i, blist[i].src)
        localStorage.setItem("backgroundTileSize" + i, tileSize)
    }
    localStorage.setItem("backgroundN", blist.length)
     
  }

  function show_backgrounds() {
    event.stopPropagation();

    document.getElementById("asset-list").style.display = "none";

    if (document.getElementById("metabackgrounds").style.display == "flex") {
      document.getElementById("background-list").style.display = "none";
      document.getElementById("trash").style.display = "none";
      document.getElementById("metabackgrounds").style.display = "none";
      document.getElementById("allscenes").style.display = "none";
    }
    else {
      document.getElementById("background-list").style.display = "flex";
      document.getElementById("trash").style.display = "";
      document.getElementById("metabackgrounds").style.display = "flex";
      document.getElementById("allscenes").style.display = "flex";
      load_scene();
    }
  }


  function show_asset() {
    event.stopPropagation();
    document.getElementById("background-list").style.display = "none";
     
    if ( document.getElementById("asset-list").style.display == "flex") {
    document.getElementById("asset-list").style.display = "none";
    document.getElementById("trash").style.display = "none";
  }
    else {
    document.getElementById("asset-list").style.display = "flex";
    document.getElementById("trash").style.display = "";
  }
  }

  function hide_menus(event) {

    trash_delete_mode = false;
    document.getElementById("trash").style.filter = ""
    
    if(checkAdmin() && (document.getElementById("ontop").style.display == "")) {

      document.getElementById("barra-derecha").style.width = "";
      document.getElementById("barra-derecha").style.color = "";

      /*
      document.getElementById("FogBar").style.display = "none";        
      document.getElementById("chat-area").style.display = "none";        
      document.getElementById("DiceBar").style.display = "none";        
      */

      document.getElementById("TokenBar").style.display = "none";  
      document.getElementById("AssetBar").style.display = "none";             
      document.getElementById("MapsBar").style.display = "none";              
      document.getElementById("DiceBar").style.display = "none";  
      document.getElementById("MusicBar").style.display = "none";  
      document.getElementById("OptionsBar").style.display = "none";  
      
      document.getElementById("hello").style.display = "none";  
      document.getElementById("uploadfile").style.display = "none";  
      document.getElementById("metabackgrounds").style.display = "none";
      document.getElementById("music-list").style.display = "none";
      document.getElementById("asset-list").style.display = "none";      
      document.getElementById("dice-select").style.display = "none";
      document.getElementById("allassets").style.display = "none";
      document.getElementById("allscenes").style.display = "none";
      document.getElementById("trash").style.display = "none";
      document.getElementById("url-iframe").style.display = "none";
      document.getElementById("message2").style.display="none"
      try {
        if(event.srcElement.id == "ontop" || event.srcElement.id == "title-player-view" || event.srcElement.id == "inside-top")
          document.getElementById("ontop").style.display = "none";      
          sendMessage(getForcedLink(""));      
        } catch (e) {}
    
    } else {

      document.getElementById("TokenBar").style.display = "none";  
      document.getElementById("AssetBar").style.display = "none";        
      document.getElementById("MapsBar").style.display = "none";   
      /*  
      document.getElementById("FogBar").style.display = "none";    
      document.getElementById("chat-area").style.display = "none";            
      document.getElementById("DiceBar").style.display = "none";  
      document.getElementById("PlayerAssetBar").style.display = "none";  
      */
      document.getElementById("MusicBar").style.display = "none";  
      document.getElementById("OptionsBar").style.display = "none";  
      

      document.getElementById("barra-derecha").style.width = "";
      document.getElementById("barra-derecha").style.color = "";

      document.getElementById("hello").style.display = "none";  
      document.getElementById("uploadfile").style.display = "none";        
      document.getElementById("metabackgrounds").style.display = "none";
      document.getElementById("music-list").style.display = "none";
      document.getElementById("asset-list").style.display = "none";
      document.getElementById("ontop").style.display = "none";
      document.getElementById("dice-select").style.display = "none";
      document.getElementById("allassets").style.display = "none";
      document.getElementById("allscenes").style.display = "none";
      document.getElementById("trash").style.display = "none";
      document.getElementById("url-iframe").style.display = "none";
      document.getElementById("message2").style.display="none"
    }
    
  }

  function selfclose(close) {
    document.getElementById(close).style.display="none";
  }

  function show_config_view() {
    document.getElementById("urltext").value = ""+ getURLforboard();
    hide_menus();
    if (document.getElementById("view-select").style.display == "flex")
      document.getElementById("view-select").style.display = "none";
    else
      document.getElementById("view-select").style.display = "flex";
  }

  function show_hide_chat() {
    
    //console.log("show hide chat")
    if (document.getElementById("chat-area").style.display == "none") {
      //console.log("muestro!!!!!!!!!!!!!!!!!!!!")
      document.getElementById("chat-area").style.display = "";
      document.getElementById("hide-chat").innerHTML = "Hide Chat";
      //var elements = document.getElementById("chat-log").getElementsByClassName('dice_result')          
      //  document.getElementById("chat-log").scrollTop = elements[elements.length - 1].offsetTop;  
      //document.getElementById("log").style.display = "none";

    } else {
      //console.log("escondo!!!!!!!!!!!!!!!!!!!!")
      document.getElementById("chat-area").style.display = "none";
      document.getElementById("hide-chat").innerHTML = "Show Chat";
      //document.getElementById("log").style.display = "";
    }
    //hide_menus();
  }

  function see_player_asset(event) {
    if (event.checked) 
      document.getElementById("player-asset-list").style.display = 'flex';
    else 
      document.getElementById("player-asset-list").style.display = 'none';
    console.log("player asset")
  }

  function checkboxClick(event) {
    if (event.checked) 
     document.getElementById(event.name).style.display = "";
    else 
     document.getElementById(event.name).style.display = "none";
  }

  function checkboxClick2(event) {
    if (!event.checked) 
     document.getElementById(event.name).style.display = "";
    else 
     document.getElementById(event.name).style.display = "none";
  }

  function checkboxBackground(event) {
    if (event.checked) {
      document.getElementById("superbar").classList.add("superbox");
    }
  
    else {
      document.getElementById("superbar").classList.remove("superbox");
    }
  
  }

  function checkboxBackground2(event) {
    if (event.checked) {
      canvas.backgroundColor = "black";
    }
  
  }

  function startvideo() {
    videobackground = true;
  }
  
  function stopvideo() {
    videobackground = false;
  }

  fabric.util.requestAnimFrame(function render() {
    if (videobackground)
      canvas.renderAll();
    fabric.util.requestAnimFrame(render);
    });

function IsInArray(e, lista) {
  for(var i = 0; i < lista.length; i++) {
   
    if(e.src == lista[i])
      return i;
  }
  return -1;
}
    
    function getURLforboard() {

      var bg = canvas.backgroundImage._element.src;
      if (bg == "")
        bg = canvas.backgroundImage._element.firstChild.src;
    
       
     //tileSize;
     
     var src = [ ];
     var n = [  ];
     var s = [  ];
     var x = [ [],[] ];
     var y = [ [],[] ];
        
     var i = 0, j = 0;
      canvas.forEachObject(function(o) {

        if (o._element !== undefined) {
          j = IsInArray(o._element, src)

          if (j > -1) {
            n[j]++;
            y[j].push(o.top);
            x[j].push(o.left); 
          } else if (j == -1) {                        
            src[i] = o._element.src;
            s[i] = Math.round(o.dd20size);
            n[i] = 1;            
            y[i] = [];
            x[i] = [];            
            y[i].push(o.top);
            x[i].push(o.left);
            i++;
          }          
      }
      });  
      
      //var url = "localhost/index.html?"
      var url = "board.digitald20.com/index.html?"
      url = url + "b=" + bg;
      url = url + "&t=" + Math.round(tileSize); 
      
      url = url + "&nt=" + (src.length + 1); 
      var Nassets = document.getElementById("asset-list").children.length;  
      if (Nassets > -1)
        url = url + "&na=" + Nassets;
      
      for (var i = 0; i < src.length; i++) {

          url = url + "&t"+(i+1)+"=" + src[i]
          url = url + "&s"+(i+1)+"=" + Math.round(s[i])
          url = url + "&n"+(i+1)+"=" + Math.round(n[i])
          url = url + "&c" + (i+1) + "=";
          for (var j = 0 ; j < n[i]; j++) {
            url = url + Math.round(x[i][j]) + "," + Math.round(y[i][j]) + ",";
          }
          url = url.substr(0, url.length-1);
        
      }

      var list = document.getElementById("asset-list").children;
      for (var i = 0; i < list.length; i++) {
        url = url + "&a" + (i+1) + "=" + list[i].src;
      }

      url = url.replaceAll(" ","%20").replaceAll("https://","");
      url = url + "&e=0";
     
      return("http://" + url);

    }
    
    function lighten(color, luminosity) {

      // validate hex string
      color = new String(color).replace(/[^0-9a-f]/gi, '');
      if (color.length < 6) {
        color = color[0]+ color[0]+ color[1]+ color[1]+ color[2]+ color[2];
      }
      luminosity = luminosity || 0;
    
      // convert to decimal and change luminosity
      var newColor = "#", c, i, black = 0, white = 255;
      for (i = 0; i < 3; i++) {
        c = parseInt(color.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(black, c + (luminosity * white)), white)).toString(16);
        newColor += ("00"+c).substr(c.length);
      }
      return newColor; 
    }

    /*
    function urlify(text) {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, function(url) {
        return '<a target="_blank" href="' + url + '">' + url + '</a>';
      })
      // or alternatively
      // return text.replace(urlRegex, '<a href="$1">$1</a>')
    }
*/
function urlify(text) {
  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  //var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url,b,c) {
      var url2 = (c == 'www.') ?  'http://' +url : url;
      return '<a href="' +url2+ '" target="_blank">' + url + '</a>';
  }) 
}

function notshowagain() {

  localStorage.setItem("notshowagain", true);    
  hide_menus();

}

function hiddenRoll() {

  if (document.getElementById("hidden-roll").className == "button")
    document.getElementById("hidden-roll").className = "button-pressed";
  else 
    document.getElementById("hidden-roll").className = "button";

}

function checkurl(url) {
  url = url.replaceAll(" ","%20");
  if (url.indexOf("www.dropbox.com") > 0) {
    return url.replace("?dl=0", "?raw=1");
  }
  else return url;
}

function save_url() {
  
  var name = prompt("Please enter the scene name", "ignotus");
  if (name == null) 
    name = "ignotus";

  var lista = [];
  var lista_names = [];
  
  lista        = JSON.parse(localStorage.getItem('allscenes')) || [];
  lista_names  = JSON.parse(localStorage.getItem('allscenesnames')) || [];
  lista_assets = JSON.parse(localStorage.getItem('allscnassets')) || [];
  lista_music  = JSON.parse(localStorage.getItem('allmusic')) || [];
  
  lista_assets.push(get_assets())
  lista_music.push(get_music_assets())

  var board = getboard();
  if (!checklistvalue(board,lista)) {
    lista.push(board);
    lista_names.push(name);
  }

  localStorage.setItem('allscenes', JSON.stringify(lista));
  localStorage.setItem('allscenesnames', JSON.stringify(lista_names));
  localStorage.setItem('allscnassets', JSON.stringify(lista_assets));
  localStorage.setItem('allmusic', JSON.stringify(lista_music));

  savetoplugin()
  
}

function get_assets() {

  var obj = new Object();
  var assetN = parseInt(localStorage.getItem("assetN"));
  obj.assets = []

  for (i = 0; i< assetN; i++) {                  
    var item = localStorage.getItem("asset" + i).replaceAll(" ","%20");
    obj.assets.push(item+"");          
    }

  return obj;
}

function get_music_assets() {

  var obj = new Object();
  var musicN = parseInt(localStorage.getItem("musicN"));
  obj.music = []

  for (i = 0; i< musicN; i++) {                  
    var item = localStorage.getItem("music" + i).replaceAll(" ","%20");
    obj.music.push(item+"");          
    }

  return obj;
}

// Mostramos las escenas
function load_scene() {

  event.stopPropagation();
  var scenes = document.getElementById("allscenes"); 
  var lista = [];
  var lista_names = [];
  lista        = JSON.parse(localStorage.getItem('allscenes')) || [];
  lista_names  = JSON.parse(localStorage.getItem('allscenesnames')) || [];  
  scenes.innerHTML = "";
 
  for (var i = 0; i < lista.length; i++) {
     var div = document.createElement("div");  
     var a = document.createElement("p");
    
     a.className = "centered-text";
     div.className = "bglisscene";
     a.innerHTML = lista_names[i];    
     //a.href = "#";
     a.id = "slink" + i;
     div.id = "sdiv" + i;
     //div.style.backgroundImage = "url('" + getbackgroundfromurl(lista[i]) + "')";
     div.style.backgroundImage = "url('" + lista[i].backgroundImage + "')";
     div.addEventListener('dragstart',  drag_scene_start, true);
     div.addEventListener('click',  load_scene_start, true);
     div.draggable = true;
     div.appendChild(a);                    
     scenes.appendChild(div);    
  }
 
 scenes.style.display = "";
 document.getElementById("trash").style.display = "";
 }

 // Cargamos una escena
 function load_scene_start(ev) {

  if (typeof (ev) !== 'undefined')
    var id = ("" + ev.srcElement.id).replace("sdiv","").replace("slink","");
  else {
    lista        = JSON.parse(localStorage.getItem('allscenes')) || [];
    id = lista.length -1
  }
  
  lista        = JSON.parse(localStorage.getItem('allscenes'))    || [];
  lista_assets = JSON.parse(localStorage.getItem('allscnassets')) || [];
  lista_music  = JSON.parse(localStorage.getItem('allmusic'))     || [];

  board      = lista[id]
  
  mainBackground = board.backgroundImage;
  plotBackground = board.plotBackground;
  tileSize = checkminTile(board.tileSize);
  
  if (checkAdmin()) {

    canvas.forEachObject(function(o) {
      if(o.fill !== '#c710875')
      canvas.remove(o);
    });

    createBg(mainBackground)      
    clearFogbutton();

    var tokens = board.tokens;
    var indice_token = 0;
    var clasictoken = "";
    tokens.forEach((item) => {

      // Sustituimos el token si es uno de los básicos por el primero que no este vacio de la barra lateral. 
      var es_basico = false;
      for (var i = 1 ; i < 7; i++) {
        if(item.src == document.getElementById('t' + i).src)
          es_basico = true;       
      }
      if (es_basico) {
        console.log("es uno de los basicos!!!!")
        indice_token = indice_token + 1;
        if (document.getElementById('track' + indice_token) !== null)
          clasictoken = document.getElementById('track' + indice_token).style.backgroundImage.replace('url("','').replace('")','');
        
        while (clasictoken == "") {          
          indice_token = indice_token + 1;
          if (document.getElementById('track' + indice_token) !== null)
            clasictoken = document.getElementById('track' + indice_token).style.backgroundImage.replace('url("','').replace('")','');
          if (indice_token > 6)
            break;
        }
        
        if (clasictoken !== "")
        {          
          console.log(indice_token + " " + clasictoken)
          item.src = clasictoken;                        
          createToken(item);   
        }
          
      } else {
        console.log("NO es uno de los basicos!!!!")
        console.log(item.src)
        createToken(item);      
      }     

    });
    
    try {
      assetslist = lista_assets[id].assets;
      for (i = 0; i < assetslist.length; i++) {
        sendLink(assetslist[i])
        }  
      } catch (e) {}
      
      try {
      musiclist  = lista_music[id].music;
      for (i = 0; i < musiclist.length; i++) {
        add_music(musiclist[i])
        }  
      } catch (e) {}
    
  } else {

    document.getElementById("plotmode").checked = true;
    canvas.forEachObject(function(o) {
      if(o.fill !== '#c710875')
        if (o.plot)
          canvas.remove(o);
        else
          o.visible = false;
    });

    createBg(board.plotBackground)  
    var tokens = board.tokens;
    tokens.forEach((item) => {
      if(item.plot)
      createToken(item);
    });

  }
    
  if (connected) {
    setTimeout(() => {
      sendMessage(getboard(), true);  
    }, 2*waittime);    
  }  

  } 


 /*
function load_scene() {
 var scenes = document.getElementById("allscenes"); 
 var lista = [];
 var lista_names = [];
 lista       = JSON.parse(localStorage.getItem('allscenes')) || [];
 lista_names = JSON.parse(localStorage.getItem('allscenesnames')) || [];
 scenes.innerHTML = "";

 for (var i = 0; i < lista.length; i++) {
    var div = document.createElement("div");  
    var a = document.createElement("a");
   
    a.className = "centered-text";
    div.className = "div-centered-text";
    a.innerHTML = lista_names[i];    
    a.href = lista[i];
    a.id = "slink" + i;
    div.id = "sdiv" + i;
    div.style.backgroundImage = "url('" + getbackgroundfromurl(lista[i]) + "')";
    div.addEventListener('dragstart',  drag_scene_start, true);
    div.draggable = true;
    div.appendChild(a);                    
    scenes.appendChild(div);    
 }

scenes.style.display = "";
document.getElementById("trash").style.display = "";
}
*/

function getbackgroundfromurl(url) {
  return "https://" + new URL(url).searchParams.get('b');
}

// Comunicate with plugin
// ------------------------------------
function savetoplugin() {

/*
  var every = LZString.compress(JSON.stringify(geteverything()));
  console.log(every)
  console.log(new Blob([every]).size)
  let every = geteverything();

  console.log(chromeid)
  console.log(geteverything())
  
  let request = new Object();
    request.action = 'savedata';
    request.message = geteverything();	
  chrome.runtime.sendMessage(chromeid, request);
    
*/

if (!startingapp)
setTimeout(() => {
  try {
    console.log("saving pluging...")
    chrome.runtime.sendMessage(chromeid, {data: geteverything()}, function(response) {
      console.log(response)      
    });
    } catch(error) {      
      console.log(error)
    }

}, 3000);
  
  }

function dd20Receive() {
  let scenes = document.getElementById("scenes-receive").value		
  //console.log(scenes)
  load_all_data(JSON.parse(scenes).data)
}

function geteverything() {

  var lista = [];
  var lista_names = [];
  var lista_assets = [];
  var lista_music = [];
  var lista_all = [];
  
  lista        = JSON.parse(localStorage.getItem('allscenes')) || [];
  lista_names  = JSON.parse(localStorage.getItem('allscenesnames')) || [];
  lista_all    = JSON.parse(localStorage.getItem('allassets')) || [];
  
  lista_assets =  [];
  lista_music  =  [];
  lista_assets.push(get_assets())
  lista_music.push(get_music_assets())
  
  var obj = new Object();
  obj.scenes  = lista; 
  obj.names   = lista_names; 
  obj.assets  = lista_assets;
  obj.music   = lista_music;  
  obj.all     = lista_all;    

  //console.log(obj)
  return obj;
}

function get_empty_everything() {

  var lista = [];
  var lista_names = [];
  var lista_assets = [];
  var lista_music = [];
  var lista_all = [];

  var assetsobj = new Object();
  assetsobj.assets = []
  var musicobj = new Object();
  musicobj.music = []

  lista_assets =  [];
  lista_music  =  [];
  lista_assets.push(assetsobj)
  lista_music.push(musicobj)
  
  var obj = new Object();
    obj.scenes  = lista; 
    obj.names   = lista_names; 
    obj.assets  = lista_assets;
    obj.music   = lista_music;  
    obj.all     = lista_all;    

  return obj;
}

function export_scene_file() {  

  var content = JSON.stringify(geteverything());
  var filename = "dd20-scenes.txt";
  download(filename, content);

}

function load_scene_file(event) {
  let file = event.target.files[0];
  const reader = new FileReader();
  console.log("Reading file.....")

  reader.addEventListener('load', (event) => {
    const result = event.target.result;
    load_all_data(JSON.parse(result))

  });
  reader.readAsText(file);

}

function load_all_data(obj) {

  //console.log(obj)

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

  if(checkAdmin()) {
    for (i = 0; i < assets[0].assets.length; i++) {    
      sendLink(assets[0].assets[i])
      }
  
    for (i = 0; i < music[0].music.length; i++) {
      add_music(music[0].music[i])
      }  
  }

}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function dice_color_change() {
  
  var doomedObj = canvas.getActiveObject(); 
console.log(doomedObj)
  if (  doomedObj !== null && (typeof doomedObj !== 'undefined') ) { 
    console.log("hay algo seleccionado")

    if ( doomedObj.get('type')== "textbox") {      
      doomedObj.backgroundColor = document.getElementById("fontcolor").value;           
      updateBoard(getboard())
    }

  } else {
    console.log("NO hay algo seleccionado")

  var fontColor = document.getElementById("fontcolor").value;
  var backColor = document.getElementById("backcolor").value;
  localStorage.setItem("dd20_fontcolor", fontColor);
  localStorage.setItem("dd20_backcolor", backColor);

  }
  }



function dice_color_load() {
  if (localStorage.getItem("dd20_fontcolor") !== null) {
    var fontColor = localStorage.getItem("dd20_fontcolor");
    var backColor = localStorage.getItem("dd20_backcolor");
    document.getElementById("fontcolor").value = fontColor;
    document.getElementById("backcolor").value = backColor;
}
}

const findInMap = (map, val) => {
  for (let [k, v] of map) {
    if (k === val) { 
      return true; 
    }
  }  
  return false;
}

function monsterReceived() {
  let monster = outsidelinks(document.getElementById("monster-receive").value);
  let monster_name = document.getElementById("monster-name").value.trim();
  
  let monster_token = document.getElementById("monster-token").value;
  
  addtokentolist(monster_token);  
  addtoAllAssets(monster_token)

  if(typeof monsters_list == 'undefined') {
    monsters_list = new Map();
    document.getElementById("monsterframe").innerHTML = monster;
  }
  
  if (!findInMap(monsters_list,monster_name)) {
    monsters_list.set(monster_name, monster);    
    var option = document.createElement("option");
    option.text = monster_name;
    document.getElementById("monster-list").add(option);
    
    var elements = document.getElementsByClassName("roller");
         
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', tools5edblclick, false);
    }
  }      
  else console.log("es viejo!")

}
function assetReceiveddnd() {
  addtoAllAssets(document.getElementById("monster-receive").value);
}

function monsterReceiveddnd() {
  let monster = addclasstoroll(outsidelinksdnd(document.getElementById("monster-receive").value));
  let monster_name = document.getElementById("monster-name").value.trim();
  let monster_token = document.getElementById("monster-token").value;

  addtokentolist(monster_token);  
  addtoAllAssets(monster_token)

  if(typeof monsters_list == 'undefined') {
    monsters_list = new Map();
    document.getElementById("monsterframe").innerHTML = monster;
    setTimeout(() => {
      var elements = document.getElementsByClassName("blue");
       
      for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', dd20dblclick, false);
      }  
      
    }, 2*waittime);
  }
  
  if (!findInMap(monsters_list,monster_name)) {
    monsters_list.set(monster_name, monster);  
    var option = document.createElement("option");
    option.text = monster_name;
    document.getElementById("monster-list").add(option);
  
  }
  
}

function myMonster() {

  document.getElementById("monsterframe").innerHTML =  monsters_list.get(document.getElementById("monster-list").value);
  lastmonstertoken.monster = document.getElementById("monster-list").value;

  setTimeout(() => {
    var elements = document.getElementsByClassName("blue");
     
    for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', dd20dblclick, false);
    }  

  }, 2*waittime);
  

}


function diceroll5e(text, pre) {
  var obj = JSON.parse(text);
  
  if(obj.subType == "d20") {
    console.log("d20!!")
    if(obj.name !== undefined) {	
      document.getElementById("dh1").innerHTML = pre + " " + obj.name;
    } else {
      document.getElementById("dh1").innerHTML = pre + " Dmg";
    }
  
        document.getElementById("d1").innerHTML = obj.toRoll;
        document.getElementById("d1").click();
  }
  
  if(obj.subType == "damage") {				
    console.log("daño!!")
    document.getElementById("dh2").innerHTML = pre;
          document.getElementById("d2").innerHTML = obj.toRoll;
          document.getElementById("d2").click();
  }
}

// 5e.tools
var PROF_DICE_MODE = 1 
var PROF_MODE_DICE = 1
var Renderer = {
 
  dice: {
    pRollerClickUseData: function pRollerClickUseData(event) {
      diceroll5e(event.path[0].getAttribute("data-packed-dice"), document.getElementsByClassName("stats-name")[0].innerHTML);
    },
    
    pRollerClick: function pRollerClick(event) {
      diceroll5e(event.path[0].getAttribute("data-packed-dice"), document.getElementsByClassName("stats-name")[0].innerHTML);      
    }
    
  },

  hover: {
    handlePredefinedMouseOver: function handlePredefinedMouseOver(event) {

    },
    handlePredefinedMouseMove: function handlePredefinedMouseMove(event) {

    },
    handlePredefinedMouseLeave: function handlePredefinedMouseLeave(event) {

    }, 
    handleTouchStart: function handleTouchStart(event) {

    },
    pHandleLinkMouseOver: function pHandleLinkMouseOver(event){

    }, 
    handleLinkMouseLeave: function handleLinkMouseLeave(event){

    }, 
    handleLinkMouseMove: function handleLinkMouseMove(event) {

    }, 
    handleTouchStart: function handleTouchStart(event) {

    }
    
  }

}; 

function outsidelinks(text) {

text = text.replaceAll('href="', 'href="https://5e.tools/');
return text;              

}

function outsidelinksdnd(text) {

  text = text.replaceAll('href="', 'href="https://www.dndbeyond.com/');
  return text;              
  
}

function addclasstoroll(text) {

  //var reg = new RegExp("(\\+.*)to hit", "gi");         
  //text = text.replace(reg, "<span class='blue'>$1 to hit</span>");   
  
  var reg = new RegExp("(<span) (data-dicenotation)", "gi");   
  text = text.replace(reg, "$1 class='blue' $2");   

  //var reg = new RegExp("(\\(\\dd[^\\)]*\\))", "gi");   
  //text = text.replace(reg, "<span class='blue'>$1</span>");   

  return text;
}

function setOption(selectElement, value) {
    var options = selectElement.options;
    for (var i = 0, optionsLength = options.length; i < optionsLength; i++) {
        if (options[i].value == value) {
            selectElement.selectedIndex = i;
            return true;
        }
    }
    return false;
}

function tools5edblclick(ev) {
  var monster = document.getElementById("monsterframe").getElementsByClassName('stats-name')[0].innerHTML;	
  //var text =  ev.path[0].innerHTML;
  var text =  ev.srcElement.innerHTML;
  console.log("Event fired!!!!!" + text + "   " + monster)

  if(text.indexOf("+") == 0) {
    document.getElementById("dh1").innerHTML = monster;
    document.getElementById("d1").innerHTML = "1d20" + text;
    document.getElementById("d1").click();  
  }
  else {
    document.getElementById("dh2").innerHTML = monster;
    document.getElementById("d2").innerHTML = text;
    document.getElementById("d2").click();  
  }

} 

function dd20dblclick(ev) {
	
  // Esto no va a funcionar bien, hay que arreglarlo. 

  
	var monster = document.getElementById("monsterframe").getElementsByClassName('mon-stat-block__name-link')[0].innerHTML;	
    
  console.log(ev)
    //var text =  ev.path[0].innerHTML;
    var text =  ev.srcElement.innerHTML;
    console.log("Event fired!!!!!" + text)
    if (text !== undefined) {
		
    var reg = new RegExp("<strong>(.*)</strong>", "gi"); 
		if (reg.test(text))
			var arma = text.match(reg)[0];		
    else var arma = "";

    var reg = new RegExp("\\+[0-9]+", "gi");         
        if (reg.test(text)) {
            var lista = text.match(reg);
            for ( var i = 0; i < lista.length ; i++) {    
 			        document.getElementById("dh" + 1).innerHTML = monster + " " + arma;
              document.getElementById("d" + 1).innerHTML = "1d20" + lista[i];
              document.getElementById("d" + 1).click();                
            }    
        }
        
        var reg = new RegExp("\\(\\d[^\\)]*\\)", "gi"); 
        
        if (reg.test(text)) {
            var lista = text.match(reg);
            for ( var i = 0; i < lista.length ; i++) {
              var [roll,n] = fixroll(lista[i]);            
			        document.getElementById("dh" + n).innerHTML = monster + " " + arma;
              document.getElementById("d" + n).innerHTML = roll;
              document.getElementById("d" + n).click();                               
            }    
        }
     
    }
} 

function fixroll(str) {
  if (str.indexOf("to hit") > -1)
      return [str.replace("to hit","").replace("+","1d20 + "), 1];
  else 
      return [str.replace("(","").replace(")",""), 2];
}

// ImageKit
function uploadfile(e) {
  e.preventDefault();
 
  var file = document.getElementById("file");
  
  document.getElementById("message2").style.display="";
  imagekit.upload({
      file: file.files[0],
      fileName: file.files[0].name,
      tags: ["d20"], // Comma seperated value of tags
      //responseFields: "tags" // Comma seperated values of fields you want in response e.g. tags, isPrivateFile etc
  }, function (err, result) {
      if (err) {         
          console.log(err);
          hide_menus()
      } else {

        if (document.getElementById("AssetBar").style.display == "") {
          document.getElementById("asset-url").value = result.url;
          url_asset_input_change();
        }          
          
        if (document.getElementById("TokenBar").style.display == ""){
          document.getElementById("token-map").value = result.url;
          url_token_input_change();
        }
          
        if (document.getElementById("MapsBar").style.display == "") {
          document.getElementById("map-url").value = result.url;
          url_map_input_change();
        }
        
        document.getElementById("message2").style.display = "none";
        addtoAllAssets(result.url)        
        console.log(result);
      }
  })
}

function checkuploadfile(event) {
  var file = document.getElementById("file");
  
  if(file.files[0].type == "application/pdf") {
    document.getElementById("upload_text").style.display = "none";
    document.getElementById("upload_pdf").style.display = "";

    pdfjsLib.getDocument(URL.createObjectURL(file.files[0])).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;
    pageNum = 1;
    renderPage(pageNum);
  });
  
  } else {
    document.getElementById("upload_text").style.display = "";
    document.getElementById("upload_pdf").style.display = "none";
  }

}

function uploadpdffile(file, name) {
  
  document.getElementById("message2").style.display=""
  imagekit.upload({
      file: file,
      fileName: name,
      tags: ["d20"], // Comma seperated value of tags
      responseFields: "tags" // Comma seperated values of fields you want in response e.g. tags, isPrivateFile etc
  }, function (err, result) {
      if (err) {         
          console.log(err);
          hide_menus();
      } else {
        document.getElementById("token-map").value = result.url;
        addtoAllAssets(result.url)
        hide_menus();
        console.log(result);
      }
  })
}

function renderPage(num) {
  pageRendering = true;
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function(page) {
    
    var c = document.getElementById("pdf-canvas");
    var ctx = c.getContext("2d");
    var viewport = page.getViewport({scale:0.8});
    
    c.height = viewport.height;
    c.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    // Wait for rendering to finish
    renderTask.promise.then(function() {
      pageRendering = false;
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    }); 
  });

  // Update page counters
  document.getElementById('page_num').textContent = num;
}

function uploadpdfimages() {

  var c = document.getElementById("pdf-subCanvas");
  var ctx = c.getContext("2d");
      
    pdfDoc.getPage(pageNum).then(function(page) {                  
            
      for (let imagen of Object.values(page.objs._objs)) {
        
        if (imagen.data.height > 100 && imagen.data.width > 100) {
          var img = new ImageData(toRGBA(imagen.data.data), imagen.data.width, imagen.data.height);
          c.height = imagen.data.height;
          c.width = imagen.data.width;
          ctx.putImageData(img, 0, 0);
          console.log(img);
        uploadpdffile(c.toDataURL("image/jpeg"), "frompdf");
      }
    }

    });
}

function uploadAllpdfimages() {
  pageNum = 1;
  renderAllPage();
}

function renderAllPage() {

  pdfDoc.getPage(pageNum).then(function(page) {

    var c = document.getElementById("pdf-canvas");
    var cc = document.getElementById("pdf-subCanvas");
    var ctx = c.getContext("2d");
    var ctxx = cc.getContext("2d");
    var viewport = page.getViewport({scale: 0.8});
    c.height = viewport.height;
    c.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function() {

      for (let imagen of Object.values(page.objs._objs)) {
        
        if (imagen.data.height > 100 && imagen.data.width > 100) {
        var img = new ImageData(toRGBA(imagen.data.data), imagen.data.width, imagen.data.height);
        cc.height = imagen.data.height;
        cc.width = imagen.data.width;
        ctxx.putImageData(img, 0, 0);
        uploadpdffile(cc.toDataURL("image/jpeg"), "frompdf");
      }
    }

      if (pageNum < pdfDoc.numPages) {
        pageNum++;
        renderAllPage();
      }
    });  
  });
}

function toRGBA(rgb) {
  
  var rgba = new Uint8ClampedArray((rgb.length / 3) * 4);
  for (let index = 0; index < rgba.length; index++) {
    // Set alpha channel to full
    if (index % 4 === 3) {
      rgba[index] = 255;
    }
    // Copy RGB channel components from the RGB array
    else {
      rgba[index] = rgb[~~(index / 4) * 3 + (index % 4)];
    }
  }
  return rgba;

}

/**
 * Displays previous page.
 */
 function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}


/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}

function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

function show_upload() {
  event.stopPropagation();
  if ( document.getElementById("uploadfile").style.display == "none") {
    document.getElementById("uploadfile").style.display = ""; }
  else {
    document.getElementById("uploadfile").style.display = "none";
}
}

document.onpaste = function(event) {

  var items = (event.clipboardData || event.originalEvent.clipboardData).items;
  for (index in items) {
    var item = items[index];
    if (item.kind === 'file') {
      var blob = item.getAsFile();
      console.log(blob)
      document.getElementById("message2").style.display=""
      imagekit.upload({
        file: blob,
        fileName: "clipboard",
        tags: ["d20"], // Comma seperated value of tags
        responseFields: "tags" // Comma seperated values of fields you want in response e.g. tags, isPrivateFile etc
    }, function (err, result) {
        if (err) {         
            console.log(err);
            hide_menus();
        } else {
          document.getElementById("token-map").value = result.url;
          document.getElementById("asset-url").value = result.url;
          document.getElementById("map-url").value = result.url;
          document.getElementById("free").checked = true;

          console.log(document.getElementById("AssetBar").style.display)

          if (document.getElementById("AssetBar").style.display == "")           
            sendLink()                      
          if (document.getElementById("TokenBar").style.display == "")
            addToken();
          if (document.getElementById("MapsBar").style.display == "")
            setBg();          
          
          if (document.getElementById("asset-by-default").checked)
            sendLink()
          else
            addToken();
            
          hide_menus();
          console.log(result);
        }
    })


      /*var reader = new FileReader();
      reader.onload = function(event){
        console.log(event.target.result)
      }; // data url!
      reader.readAsDataURL(blob);
      */

    } else if(item.kind == "string") {
      item.getAsString(function (s) {

        if (document.getElementById("AssetBar").style.display == "") {
          document.getElementById("asset-url").value = s;
          url_asset_input_change();
        }           
          
        if (document.getElementById("TokenBar").style.display == "") {
          document.getElementById("token-map").value = s;
          url_token_input_change();
        }
          
        if (document.getElementById("MapsBar").style.display == "") {
          document.getElementById("map-url").value = s;
          url_map_input_change();
        }
          
      });      
    } 
  }
}


function set_inmersivemode(mode, track, dice, chat, assets, plot, background) {  

  /*
  console.log(mode)
  console.log(track)
  console.log(dice)
  console.log(chat)
  console.log(assets)
  console.log(plot)
  console.log(background)
*/

  if (mode !== undefined) {
    if(mode) {

      if(!document.getElementById("inmersive-on").checked) {        
        document.getElementById("superbar").style.display = "none";    
        document.getElementById("view-distance").checked = false;  
        document.getElementById("distance-bar").style.display = "none";        
      }      

      if (plot) {
          document.getElementById("click-plot-view").style.display = "none";
      }

      if (background) {
        canvas.backgroundColor = "black";
    }

      if (track && !document.getElementById("inmersive-track").checked) {
        document.getElementById("inmersive-track").checked = true;
        document.getElementById("track_bar").style.display = "none";
      } 
      else if (!track && document.getElementById("inmersive-track").checked) {
        document.getElementById("inmersive-track").checked = false;
        document.getElementById("track_bar").style.display = "";
      }
      
      if (dice && !document.getElementById("inmersive-dice").checked) {
        document.getElementById("inmersive-dice").checked = true;
        document.getElementById("dice-bar").style.display = "none";
      }
      else if (!dice && document.getElementById("inmersive-dice").checked) {
        document.getElementById("inmersive-dice").checked = false;
        document.getElementById("dice-bar").style.display = "";
      }
      
      if (chat && !document.getElementById("inmersive-chat").checked) {
        document.getElementById("inmersive-chat").checked = true;
        document.getElementById("hide-chat").style.display = "none";
      }
      else if (!chat && document.getElementById("inmersive-chat").checked) {
        document.getElementById("inmersive-chat").checked = false;
        document.getElementById("hide-chat").style.display = "";
      }
      
      if (assets && !document.getElementById("inmersive-assets").checked) {
        document.getElementById("inmersive-assets").checked = true;
        document.getElementById("player-asset-list").style.display = "none";
      }
      else if (!assets && document.getElementById("inmersive-assets").checked) {
        document.getElementById("inmersive-assets").checked = false;
        document.getElementById("player-asset-list").style.display = "";
      }              
    }
    else if (!document.getElementById("inmersive-on").checked) {
/*
      document.getElementById("downbar").style.display = "";
      document.getElementById("url-token").style.display = "";
      document.getElementById("add-token-bar").style.display = "";
      document.getElementById("bplayername").style.display = "";    */

        document.getElementById("superbar").style.display = "";
        document.getElementById("hide-chat").style.display = "";
        document.getElementById("player-asset-list").style.display = "";
        document.getElementById("track_bar").style.display = "";
        document.getElementById("dice-bar").style.display = "";
    }
  }

  if (track)
    document.getElementById("track_bar").style.display = "none";
  
  if (background)
    canvas.backgroundColor = "black";
    
}

function set_musicmode(mode) {

  if(mode == undefined){
    mode = document.getElementById("player-audio").checked;
  }

    if(mode) {
      document.getElementById("player-audio").checked = true;
      localStorage.setItem("music_mode","true");
      if(!checkAdmin()) {
        var slides = document.getElementsByClassName("only-admin-music");
        for(var i = 0; i < slides.length; i++)  
          slides[i].style.display = "";
      }

    }
    else {
      document.getElementById("player-audio").checked = false;
      localStorage.setItem("music_mode","false");
      if(!checkAdmin()) {
        var slides = document.getElementsByClassName("only-admin-music");
        for(var i = 0; i < slides.length; i++)  
          slides[i].style.display = "none";
      }
    }
}  


function set_namemode(mode) {
  
  if (mode == undefined) {
    mode = document.getElementById("view-names").checked;
  }

    if (mode) {
      document.getElementById("view-names").checked = true;
      localStorage.setItem("named_mode","true");
      lista = document.getElementsByClassName("track_hp");
      for(var i = 0; i < lista.length; i++)
      {
        lista[i].type = "";
        lista[i].classList.add("track_name");
      }
    } else {
      document.getElementById("view-names").checked = false;
      localStorage.setItem("named_mode","false");
      lista = document.getElementsByClassName("track_hp");
      for(var i = 0; i < lista.length; i++)
      {
        lista[i].type = "number";
        lista[i].classList.remove("track_name");
      }
    }

  /*
  if (mode !== undefined) {
    if(mode && !document.getElementById("view-names").checked) {
      document.getElementById("view-names").checked = true;
      localStorage.setItem("named_mode","true");
      lista = document.getElementsByClassName("track_hp");
      for(var i = 0; i < lista.length; i++)
      {
        lista[i].type = "";
        lista[i].classList.add("track_name");
      }
    } else if(!mode && document.getElementById("view-names").checked) {
      document.getElementById("view-names").checked = false;
      localStorage.setItem("named_mode","false");
      lista = document.getElementsByClassName("track_hp");
      for(var i = 0; i < lista.length; i++)
      {
        lista[i].type = "number";
        lista[i].classList.remove("track_name");
      }
    }
  }
else {
if(document.getElementById("view-names").checked) {
  localStorage.setItem("named_mode","true");
  lista = document.getElementsByClassName("track_hp");
  for(var i = 0; i < lista.length; i++)
  {
    lista[i].type = "";
    lista[i].classList.add("track_name");
  }
} else {
  localStorage.setItem("named_mode","false");
  lista = document.getElementsByClassName("track_hp");
  for(var i = 0; i < lista.length; i++)
  {
    lista[i].type = "number";
    lista[i].classList.remove("track_name");
  }
}
}
*/
}

function show_all_audios(event) {  
  event.stopPropagation();  
   
  if ( document.getElementById("music-list").style.display == "flex") {
    document.getElementById("music-list").style.display = "none";
    document.getElementById("trash").style.display = "none";
 }
  else {
    document.getElementById("music-list").style.display = "flex";
    document.getElementById("trash").style.display = "";
}
}

function crea_nombre(link) {
  
  var reg = new RegExp("([^/]+)/?$", "gi"); 
  var nombre = link.match(reg)[0]
  nombre = nombre.split("?")[0]

  nombre = nombre.replace(".mp3","").replace(".orgg","").replace(".m4a","").replace(".ogg","")
  nombre = nombre.replaceAll("%20"," ").replaceAll("-"," ").replaceAll("_"," ");
  return nombre;
}

function add_music(url) {
   
  if (url !== undefined) {
    var link = url;  
  }
  else {
    var link = checkurl(document.getElementById("music-url").value);
    if (link == "")
      var link = checkurl(document.getElementById("token-map").value);
  }  

  if ((link !== "") && (!checkSRCmp3(link,document.getElementById("music-list").childNodes)) && (link.indexOf('.orgg')>0 || link.indexOf('.ogg')>0 || link.indexOf('.mp3')>0 || link.indexOf('.m4a')>0 ) ) {
    
    var div = document.createElement("div");
    div.classList.add("musiclist");
    div.id = "music" + document.getElementById("music-list").childElementCount;     
    div.setAttribute("src", link);  
    var nombre = crea_nombre(link)
    div.innerHTML = nombre;       
    var list = document.getElementById("music-list");
    div.addEventListener('dragstart',  drag_scene_start, true);    
    div.draggable = true;
    list.appendChild(div);
    
    var n = list.childElementCount
    localStorage.setItem("musicN", n)
    localStorage.setItem("music" + (n-1), link)
    savetoplugin();    
}
else if((link !== "") && (link.indexOf("dropbox") > 0)){
  console.log("es una carpeta dropbox")
}


}

function choosemusic() {
  
    if (event.target.id == "music-list") {
      hide_menus();
    } else {
    document.getElementById("audiosrc").src = event.target.getAttribute("src");
    document.getElementById("audiocontrol").load();
    setTimeout(() => {
      document.getElementById("audiocontrol").play();  
    }, waittime);
    
    sendMusic(event.target.getAttribute("src"));
  }
    
}

function sendMusic(text) {

  var obj = new Object();
  //obj.playerid          = user;
  obj.playerid          = "dm";
  obj.request           = false;
  obj.roll  = false;
  obj.chat  = false;
  obj.music = true;
  obj.musictime = document.getElementById("audiocontrol").currentTime;
  obj.text  = text;
  sendMessage(obj);

}

function playmusic(item) {

  
    if (item.text == "pause")
      document.getElementById("audiocontrol").pause();
    else if (item.text == "play") {
      document.getElementById("audiocontrol").currentTime = item.musictime;
      document.getElementById("audiocontrol").play();
    }
      
    else {
      document.getElementById("audiosrc").src = item.text;
      document.getElementById("audiocontrol").load();
      document.getElementById("audiocontrol").play();
      if(checkAdmin())      
        add_music(item.text)          
    }

}

function bpausemusic() {
  if(checkAdmin()) {
    sendMusic("pause");
  }
}

function bplaymusic() {
  if(checkAdmin()) {
    sendMusic("play");
  }
}

function checkminTile(tile) {
  if (tile < mintileSize)
    return mintileSize;
  else 
    return tile
}

function plotView() {

  var myboard = getboard();

    if (document.getElementById("plotmode").checked) {
      /*
      console.log("pasamos a modo plot")
      var bg = canvas.backgroundImage._element.src;
      if (bg == "")
        bg = canvas.backgroundImage._element.firstChild.src;

      mainBackground = bg;
      */
      if(!checkAdmin()) {
        document.getElementById("save-scene-player").style.display = "";
        document.getElementById("load-scene-player").style.display = "";
        document.getElementById("plotmodetext").style.display = "";
      }
      
    }
    else {
      // Corregimos el cambio
      myboard.backgroundImage = mainBackground;
      document.getElementById("save-scene-player").style.display = "none";
      document.getElementById("load-scene-player").style.display = "none";
      document.getElementById("plotmodetext").style.display = "none";
    }

    console.log(mainBackground)
    console.log(plotBackground)
    console.log(myboard)

  reDrawAll(myboard,addFog);

  /*setTimeout(() => {
    addFog();
  }, waittime);*/
  
  
}

function reset_app() {
 
  try {
    console.log("saving pluging...")
    chrome.runtime.sendMessage(chromeid, {data: get_empty_everything()}, function(response) {
      console.log(response)      
    });
    } catch(error) {      
      console.log(error)
    }

  localStorage.clear();

  setTimeout(() => {
    location.href = window.location.hostname;
  }, 3000);
  
}

function showTokenMenu(menu)
{
  trash_delete_mode = false;
  document.getElementById("trash").style.filter = "";    
  document.getElementById("TokenBar").style.display = "none";  
  document.getElementById("AssetBar").style.display = "none";        
  document.getElementById("MapsBar").style.display = "none";  
  document.getElementById("FogBar").style.display = "none";  
  document.getElementById("PlayerAssetBar").style.display = "none"; 
  document.getElementById("chat-area").style.display = "none";  
  document.getElementById("DiceBar").style.display = "none";  
  document.getElementById("MusicBar").style.display = "none";  
  document.getElementById("OptionsBar").style.display = "none";  
  document.getElementById("asset-list").style.display = "none";  
  document.getElementById("metabackgrounds").style.display = "none";  
  document.getElementById("allscenes").style.display = "none";  
  document.getElementById("allassets").style.display = "none";  

  /*desactivamos Fog*/
  document.getElementById("add-fog").innerHTML = "Reveal Area";
  document.getElementById("add-fog").className = "button";
  canvas.isDrawingfog = false;
  canvas.selection = true;

  if ((menu == "AssetBar") && !checkAdmin() ) 
    menu = "PlayerAssetBar"
  
  if (menu == "AssetBar")
    show_asset();
  if (menu =="MapsBar")    
    show_backgrounds();

  if (document.getElementById(menu).style.display == "none") {
    document.getElementById(menu).style.display = "";
    document.getElementById("barra-derecha").style.width = "inherit";
    document.getElementById("barra-derecha").style.color = "white";    
  }
  else {
    document.getElementById(menu).style.display = "none";
  }
  
}

function SwitchInterface() {
  url = window.location.href
  if(url.indexOf("newroom")> 0)
    url = url.replaceAll("newroom","room")
  else  
    url = url.replaceAll("room","newroom")
  window.location.href = url;
  }

  
  const keepAliveBoard = {
  // The function that will be fired every 5000 milliseconds
  myFunction: function() {
    updateBoardQuick();
    //console.log("keepalive");
  },

  // A method to start the timer
  startTimer: function(time) {
    this.timer = setInterval(() => {
      this.myFunction();
    }, time);
  },

  // A method to stop the timer
  stopTimer: function() {
    clearInterval(this.timer);
  },

  // A method to reset the timer
  resetTimer: function(time) {
    this.stopTimer();
    this.startTimer(time);
  }
};

function trash_dblclick(event) {
    
  if (document.getElementById("allassets").style.display == "") {

    if (typeof trash_delete_mode == 'undefined')                
    trash_delete_mode = false;

    if(!trash_delete_mode) {
      trash_delete_mode = true;
      event.target.style.filter = "hue-rotate(120deg) saturate(500%)";    
    }
    else {
      trash_delete_mode = false;
      event.target.style.filter = "";    
    }
    
  }
  
}

function url_token_input_change(event) {
  setTimeout(() => {
    document.getElementById("img-show-tokens").src = document.getElementById("token-map").value;          
  }, 1000); 
}

function url_asset_input_change(event) {
  setTimeout(() => {    
    document.getElementById("img-show-assets").src = document.getElementById("asset-url").value;      
  }, 1000);
}

function url_map_input_change(event) {
  setTimeout(() => {    
    document.getElementById("img-show-map").src = document.getElementById("map-url").value;      
  }, 1000);
}

function update_token_bar() {

  if(document.getElementById("t9").src == "https://digitald20.com/vtt/img/fire-ball.png") {

    document.getElementById("t12").src = "https://digitald20.com/vtt/img/cuadrado.png"
    document.getElementById("t10").src = "https://digitald20.com/vtt/img/pin-verde.png"
    document.getElementById("t11").src = "https://digitald20.com/vtt/img/pin-red.png"
    document.getElementById("t9").src = "https://digitald20.com/vtt/img/pin-morado.png"

  }

  else {

    document.getElementById("t9").src = "https://digitald20.com/vtt/img/fire-ball.png"
    document.getElementById("t10").src = "https://digitald20.com/vtt/img/cone-cold.png"
    document.getElementById("t11").src = "https://digitald20.com/vtt/img/ray.png"
    document.getElementById("t12").src = "https://digitald20.com/vtt/img/luz.png"

  }

}