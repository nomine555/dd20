
// Set up socket.io
const socket = io(window.location.origin);

// Initialize a Feathers app
const app = feathers();
const channel = window.location.pathname;

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

// Canvas
//var canvas =  new fabric.Canvas("c", {
var canvas =  new fastCanvas("c", {

  hoverCursor: "pointer",
  fireRightClick: true
});

canvas.justDeleted = 0;
canvas.touchenable = false;
canvas.lastscale = 1;
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
var waittime = 500;
let animationtime = 500;
var tokenN = 1;
//var tokenS = 0;
var MaxTokens = 5;
var videobackground = false;
var lasthp;
var generalid = Math.floor(Math.random() * (5000));
// ----------------------------------------------------------------- //

function setViewDM() {
        var slides = document.getElementsByClassName("for-admin");
    for(var i = 0; i < slides.length; i++)
      {
        slides[i].style.display = "inherit";
      }

    document.getElementById("player-name").value = "Dungeon Master";
    document.getElementById("player-name").disabled = true;
}

function setViewPlayer() {
  document.getElementById("player-name").value = "name_" + user;
  var slides = document.getElementsByClassName("for-player");
for(var i = 0; i < slides.length; i++)
{
  slides[i].style.display = "inherit";
}

}

function starting() {

  // Start networking
  main();

  if (localStorage.getItem("dd20room") !== null) {
    room = localStorage.getItem("dd20room");
    user = localStorage.getItem("dd20user");
    if(!checkAdmin()) {
      user = "u" + getRandomInt(9999);
    }
  } else {
    user = "u" + getRandomInt(9999);
  }

  // Salvamos nuestras imágenes
  if (localStorage.getItem("tokenN")  !== null) {

    tokenN = parseInt(localStorage.getItem("tokenN"));
    //tokenS = parseInt(localStorage.getItem("tokenS"));
    //var hasta = tokenN;
    //if (tokenS > 1)
    //  hasta = MaxTokens + 1;

    for (var i = 1; i < MaxTokens + 1 ; i++) {
      document.getElementById("t" + i).addEventListener('error',changeSrc);
      document.getElementById("t" + i).src = localStorage.getItem("tokenurl" + i);
    }
  }

  if (checkAdmin()) {
    connected = true;

    setViewDM();
    var pboard = new URL(location.href).searchParams.get('b');
    var ptile = new URL(location.href).searchParams.get('t');
    var ex = new URL(location.href).searchParams.get('e');
    
    if (localStorage.getItem(room + 'data') !== null && ex == null) {
      var myboard = JSON.parse(localStorage.getItem(room + 'data'));

      if (pboard !== null) {
        myboard.backgroundImage = "https://" + pboard;
      }
      if (ptile !== null) {
        tileSize =  parseInt(ptile);
      }

      window.setTimeout(function() {
         
        tileSize = myboard.tileSize;
        reDrawAll(myboard);
        AddURLTokens();

       
      }, waittime);
      window.setTimeout(function() {
        // Miramos la iniciativa y los puntos de vida
        
        for (var i = 1 ; i < 9; i++) {
          try {
            document.getElementById('track'+i).style.backgroundImage = localStorage.getItem("tracksrc" + i);
          if(document.getElementById('track'+i).style.backgroundImage !== "") {
            document.getElementById('track'+i).style.order = localStorage.getItem("trackorder" + i);
            document.getElementById('track'+i).firstElementChild.value = parseInt(localStorage.getItem("trackhp" + i));
            document.getElementById('track'+i).firstElementChild.style.display = "";
          }
          } catch (e) {
          }
       }

       try{
        var backgroundN = parseInt(localStorage.getItem("backgroundN"));
        var list = document.getElementById("background-list");
        for (i = 0; i< backgroundN; i++) {
          var img = document.createElement("img");
          img.src = localStorage.getItem("background" + i);
          img.className="bglist";
          list.appendChild(img);
        }
      } catch (e) {console.log(e)}

      try{
        var assetN = parseInt(localStorage.getItem("assetN"));
        var list = document.getElementById("asset-list");
        for (i = 0; i< assetN; i++) {
        
          var img = document.createElement("img");
          img.src = localStorage.getItem("asset" + i);
          img.classList.add("bglist");
          img.classList.add("grayed");
          list.appendChild(img);
        }
      } catch (e) {console.log(e)}
     
      }, 2*waittime);

    }
    else {

      if (ex == null)
        var myboard = JSON.parse('{"backgroundImage":"https://play.digitald20.com/vtt/img/graveyard-map.jpg","background_width":1920,"background_heigth":960,"tileSize":60,"playerid":"dm","tokens":[{"src":"https://play.digitald20.com/vtt/img/thief.jpg","dd20size":1,"scaleX":0.10416666666666667,"scaleY":0.10416666666666667,"angle":0,"uprange":1,"zoomrange":1,"top":595,"left":537,"id":"dm50535"},{"src":"https://play.digitald20.com/vtt/img/mage.jpg","dd20size":1,"scaleX":0.10416666666666667,"scaleY":0.10416666666666667,"angle":0,"uprange":1,"zoomrange":1,"top":714,"left":240,"id":"dm241239"},{"src":"https://play.digitald20.com/vtt/img/fighter.jpg","dd20size":0.9999999999999999,"scaleX":0.10416666666666666,"scaleY":0.10416666666666666,"angle":0,"uprange":1,"zoomrange":1,"top":477.046439628483,"left":420.953560371517,"id":"dm261770"},{"src":"https://play.digitald20.com/vtt/img/ranger.jpg","dd20size":1,"scaleX":0.10416666666666667,"scaleY":0.10416666666666667,"angle":0,"uprange":1,"zoomrange":1,"top":475,"left":606,"id":"dm493210"},{"src":"https://play.digitald20.com/vtt/img/spectre.jpg","dd20size":2,"scaleX":0.20833333333333334,"scaleY":0.20833333333333334,"angle":0,"uprange":1,"zoomrange":1,"top":472,"left":483,"id":"dm281858"},{"src":"https://play.digitald20.com/vtt/img/halfling.jpg","dd20size":1,"scaleX":0.10416666666666667,"scaleY":0.10416666666666667,"angle":0,"uprange":1,"zoomrange":1,"top":231.6656346749225,"left":669.4148606811145,"id":"dm297252"},{"src":"https://play.digitald20.com/vtt/img/fire-ball.png","dd20size":-1,"scaleX":0.85,"scaleY":0.85,"angle":0,"leftrange":1,"uprange":1,"zoomrange":1,"top":420.0307406766989,"left":666.8785085506915,"id":"dm124446"}],"request":false,"squares":[],"roll":false}')
      else      
        var myboard = JSON.parse('{"backgroundImage":"","background_width":1920,"background_heigth":960,"tileSize":60,"playerid":"dm","tokens":[],"request":false,"squares":[],"roll":false}')
        
      
        if (pboard !== null) {
        myboard.backgroundImage = "https://" + pboard;
      }
      if (ptile !== null) {
        tileSize =  parseInt(ptile);
      }

      
      if (ex == null ) {
      var j = 0;
      for (var i = 1 ; i < 6; i++) {
        j = i + 1;
      document.getElementById('track'+j).style.backgroundImage = "url('"+ document.getElementById('t'+i).src + "')";
      document.getElementById('track'+j).firstElementChild.style.display = "";
      }
    }
      window.setTimeout(function() {
        reDrawAll(myboard);
        AddURLTokens();
      }, waittime);
     
    }
  }
  else {
    setViewPlayer();
    connected = false;
    window.setTimeout(function() {
      sendMessage(getrequest());
    }, 3*waittime);
  }

  var canvasWrapper = document.getElementById('cw');
  canvasWrapper.tabIndex = 1000;
  //canvasWrapper.addEventListener("keydown", onKey, false);

  var canvasContainer = document.getElementById('dice-canvas');
  //canvaContainer.addEventListener("keydown", onKey, false);
  box = new DiceBox(canvasContainer);

  document.addEventListener("keydown", onKey, false);
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
  
  for (var j = 1 ; j < 7 ; j++) {

  var ptoken = new URL(location.href).searchParams.get('t' + j);
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
            addToken(listacoor[i],listacoor[i+1],j);
          }
      else            
      for (var i = 0; i < Nt; i++) {
          addToken(null, null, j)
         }
  }
}
for (var j = 1 ; j < 7 ; j++) {

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

}

function tokenChange() {

  var zoomrange = document.getElementById("zoomRange").value /100;
  var leftrange = document.getElementById("leftRange").value /100;
  var uprange = document.getElementById("upRange").value/100;
  var bgrange = document.getElementById("bgRange").value/100;
  
  var oImg = canvas.getActiveObject();  
  var size = oImg.dd20size;
  var shadow = {color: 'rgba(0,0,0,1)',  blur: 50, offsetX: 10, offsetY: 10, opacity: 0.6, fillShadow: true,  strokeShadow: true }

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
  oImg.setShadow(shadow);
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
    e.style.display = "block";
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
    "https://play.digitald20.com/vtt/img/mage.jpg", 
    "https://play.digitald20.com/vtt/img/fighter.jpg", 
    "https://play.digitald20.com/vtt/img/ranger.jpg", 
    "https://play.digitald20.com/vtt/img/spectre.jpg", 
    "https://play.digitald20.com/vtt/img/thief.jpg",
    "https://play.digitald20.com/vtt/img/spectre.jpg"
  ];
  var n = parseInt(this.id.replace('t',''));
    document.getElementById(this.id).removeEventListener('error',changeSrc);
    document.getElementById(this.id).src = urls[n-1];
}

//checking if user is an admin
const checkAdmin = () => {
  if ((user === "dm") & ((room === window.location.pathname) || (room + "/game" === window.location.pathname ))) {
    return true;
  } else {
    return false;
  }
  };

function viewportResize() {
  var viewportWidth = window.innerWidth;
  var viewportHeigth = window.innerHeight;

  canvas.setWidth( viewportWidth );
  canvas.setHeight( viewportHeigth );
  canvas.calcOffset();
}

function reDrawAll(board) {
  
  canvas.forEachObject(function(o) {
    if(o.fill !== '#c710875')
    canvas.remove(o);
  });

  createBg(board.backgroundImage)

  var tokens = board.tokens;
  tokens.forEach((item) => {
    createToken(item);
  });

}


function setBg() {

  try {
    var ibackground_width  = canvas.backgroundImage._element.width;
    var ibackground_heigth = canvas.backgroundImage._element.height;
    var srcbackground = canvas.backgroundImage._element.src;
  } catch (e) {console.log(e)}


  var bg = checkurl(document.getElementById("token-map").value);
  if ((bg !== "") && (bg !== srcbackground)) {
 // &&  (!checkSRC(bg.value,document.getElementById("background-list").childNodes))
  createBg(bg);

  addBackgroundtoList(bg) 
  canvas.setZoom(getmaxZoom())
  
  window.setTimeout(function() {

    /*
    if (srcbackground !== canvas.backgroundImage._element.src)
      addtokentolist(bg.value);
    */

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
}
}

function createNewBg(imgurl) {
  console.log("new background")

  try {
    var ibackground_width  = canvas.backgroundImage._element.width;
    var ibackground_heigth = canvas.backgroundImage._element.height;
  } catch (e) {console.log(e)}

 
  createBg(imgurl);

  window.setTimeout(function() {

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

      } catch (e) {console.log(e)}

  }, waittime);
  
}

function createBg(imgurl) {

  if ((imgurl.indexOf(".webm") > 0) || (imgurl.indexOf(".m4v") > 0)) {
    
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
    }else {
      stopvideo();
      canvas.setBackgroundImage(imgurl, canvas.renderAll.bind(canvas), {
        backgroundImageStretch: false,
    });
    }
    setTimeout(() => {
      canvas.setZoom(getmaxhZoom())  
  }, waittime);
    
}

function setUrl(free) {
  if (free !== undefined) {
    document.getElementById("free").checked = true;
  }
 var texto = document.getElementById(event.srcElement.id).src;
 document.getElementById("bg-map").value = texto;
 document.getElementById("token-map").value = texto;
}


function addtokentolist(src,n) {
 
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
}




// Functions to add token
const addToken = (x,y,n) => {

  if (x !== undefined) {
    var XX = parseInt(x);
    var YY = parseInt(y);
  } else {
    var XX = getRandomInt(((canvas.getWidth() / canvas.getZoom()) / 4)) - canvas.viewportTransform[4] / canvas.getZoom() + (canvas.getWidth() / canvas.getZoom()) / 10;
    var YY = (getRandomInt(((canvas.getHeight() / canvas.getZoom()) / 4)) + ((canvas.getHeight() / canvas.getZoom()) / 8)) - canvas.viewportTransform[5] / canvas.getZoom();
  }

  var tokenimg = checkurl(document.getElementById("token-map").value) //.replaceAll(" ","%20");

if (tokenimg !== "") {
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
      addtrackwhentoken(oImg._element.src,n);

    if (oImg._element.naturalWidth > oImg._element.naturalHeight)
      var scale = tokensize * tileSize / oImg._element.naturalWidth;
    else 
      var scale = tokensize * tileSize / oImg._element.naturalHeight;

    /*
    oImg.set({
        clipTo: function (ctx) {
        ctx.arc(0, 0, oImg._element.naturalWidth/2, 0, Math.PI * 2, true);
      },
    })
*/
var shadow = {color: 'rgba(0,0,0,1)',blur: 50,offsetX: 10, offsetY: 10, opacity: 0.6, fillShadow: true, strokeShadow: true }

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
      oImg.setShadow(shadow);
      oImg.scale(scale);
    }

    oImg.dd20size = tokensize;
    oImg.zoomrange = 1;
    oImg.leftrange = 1;
    oImg.uprange = 1;
    oImg.hp = 0;
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
};

//createToken
const createToken = (item) => {
  // Check if Token is in list of images
  // Add to the list of images

  addtokentolist(item.src);
  
  fabric.Image.fromURL(item.src, function (oImg) {
    oImg.set({
      id: item.id,
      left: item.left,
      top: item.top,
      hasControls: false,
    });

  if (oImg._element.naturalWidth > oImg._element.naturalHeight) {
    var scale = item.dd20size * tileSize / oImg._element.naturalWidth;
    var clipPath = new fabric.Circle({ radius: oImg._element.naturalWidth/2, top: -oImg._element.naturalWidth*item.uprange/2, left: -oImg._element.naturalWidth*item.leftrange/2 });
  }
  else {
    var scale = item.dd20size * tileSize / oImg._element.naturalHeight;
    var clipPath = new fabric.Circle({ radius: oImg._element.naturalHeight/(2), top: -oImg._element.naturalHeight*item.uprange/(2), left: -oImg._element.naturalHeight*item.leftrange/2 });
  }

    var shadow = {color: 'rgba(0,0,0,1)', blur: 50, offsetX: 10, offsetY: 10, opacity: 0.6, fillShadow: true, strokeShadow: true }

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
      oImg.setShadow(shadow);
    }
    oImg.dd20size = item.dd20size;
    oImg.zoomrange = item.zoomrange;
    oImg.leftrange = item.leftrange;
    oImg.uprange = item.uprange;
    oImg.hp = item.hp;
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
  }

  if (combineDice) {
    document.getElementById("combine-dice").value = document.getElementById("combine-dice").value + " + " + dice;
  } else {
    document.getElementById("dice-select").style.display = "none";
    if (document.getElementById("hidden-roll").className == "button-pressed")
     {
      console.log("local")
      printdice(localDices(dice))
    }
    else    
    sendDices(dice);
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
  for (i = 0; i < alist.length; i++){
    localStorage.setItem("asset" + i, alist[i].src)
    if (!alist[i].classList.contains("grayed"))
    {
      var dobj = new Object();
      dobj.src = alist[i].src;
      obj.assets.push(dobj);  
    }
  }
      
  localStorage.setItem("assetN", alist.length)

  return(obj);

}

function sendDices(dice) {

  var obj = new Object();
  obj.roll = true;
  obj.playerid          = user; 
  obj.request           = false;
  obj.dices = getdices(dice);;
  sendMessage(obj);

}


function localDices(dice) {

  var obj = new Object();
  obj.roll = true;
  obj.playerid          = user; 
  obj.request           = false;
  obj.dices = getdices(dice);;
  return obj;

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
  var last20 = false;

  var g = dice.split("+");
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
        
        if (last20 && parseInt(d[1]) == 20) // Ha habido algún dado de 20 y este es de 20. 
          backColor = lighten(backColor,0.25);
        if(parseInt(d[1]) == 20)
          last20 = true;

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
diceroll(dados);

for(var k = 0; k < dice.dices.length; k++) {

  let dados = dice.dices[k].dices;
  let bonus = dice.dices[k].bonus;
  var text = dice.playerid + " rolled: ";
  var text = "";
  var total = 0;
  var N;
  var subtext;

  console.log(dados)
  if(dados.length == 1) {
    let item = dados[0];
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
          subtext = "(" + item.result + ",";
        } 
        text = text + N + "d" + Ndice + subtext.substring(0,subtext.length-1) + ") ";
        N = 1;
        Ndice = item.sides;
        subtext = "(" + item.result + ",";
        total = total + item.result;
      } 
      else if (i == (dados.length - 1)) {   // Ultimo dado
        N++;    
        total = total + item.result;
        subtext = subtext + item.result + ",";
        text = text + N + "d" + Ndice + subtext.substring(0,subtext.length-1) + ") ";
      
      } else {
        N++;    // Otro dado igual
        total = total + item.result;
        subtext = subtext + item.result + ",";
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
  obj2.text = text.replaceAll(dice.playerid,"");
  obj2.playerid = dice.playerid;
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
  
}

function rollDie(sides)
{
  if(!sides) sides = 6;
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
  localStorage.setItem(room + "dd20user", user);
}

// ------------------------------------------------------------- //
// Fog
function startFogbutton() {
  canvas.isDrawingfog = false;
  canvas.selection = true;

  if(canvas.fogEnabled) {
    canvas.fogEnabled = false;

    document.getElementById("add-fog").disabled = true;
    document.getElementById("clear-fog").disabled = true;
    document.getElementById("enable-fog").innerHTML = "Enable Fog";
    document.getElementById("add-fog").innerHTML = "Reveal Area";
    document.getElementById("add-fog").className = "button";
    
    canvas.remove(fog);
    canvas.renderAll();
  }
  else {
  canvas.fogEnabled = true;
  document.getElementById("add-fog").disabled = false;
  document.getElementById("clear-fog").disabled = false;
  document.getElementById("enable-fog").innerHTML = "Disable Fog";
    
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
  console.log("addfog")

  if (left == "update")
    var broadcast = false;
  else
    var broadcast = true;

    if (canvas.fogEnabled) {
  if (top !== undefined) {
    fogHoles.push({top,left,width,height});
  }

  var clipPath = [];

fogHoles.forEach((item,index) => {
  clipPath[index] = new fabric.Rect({ top: item.top, left: item.left ,width: item.width, height: item.height });
});

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
  fill: '#c710875'
});

canvas.preserveObjectStacking = true;
canvas.add(fog); 
canvas.remove(square);
canvas.sendToBack(fog);
canvas.renderAll();

if(checkAdmin() && broadcast) {
  sendMessage(getboard());
  localStorage.setItem(room + 'data', JSON.stringify(getboard()));
}
}
}

// ----------------------------------------------------------------- //
// Response to canvas events


function setTile() {
  document.getElementById('message').style.display = "block";
  canvas.isDrawing = true;
  canvas.selection = false;
}

function onKey(e) {
   
  if (46 === e.keyCode) {
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

function getmaxhZoom() {
  console.log("get max hzoom")
  var zoomx = canvas.getWidth() / canvas.backgroundImage._element.width;
   return(zoomx);
  }


function checkBorders() 
{
  console.log("checkborders!")
    let borde = 100;
    var vpt = canvas.viewportTransform;
    var zoom = canvas.getZoom();
    console.log(" " + (canvas.backgroundImage._element.height*zoom + vpt[5]) + " " + canvas.backgroundImage._element.height*zoom + " " + canvas.getHeight() )
    if (vpt[4] > borde) {
      canvas.viewportTransform[4] = borde;
      canvas.requestRenderAll();
    } else if ((canvas.getWidth()-vpt[4]) > (canvas.backgroundImage._element.width*zoom + borde)  ) {
      canvas.viewportTransform[4] = canvas.getWidth() - (canvas.backgroundImage._element.width*zoom) - borde;
      canvas.requestRenderAll();
    }
    if (vpt[5] > borde) {
      canvas.viewportTransform[5] = borde;
      canvas.requestRenderAll();
    }     
    else if (( canvas.getHeight() > (canvas.backgroundImage._element.height*zoom + vpt[5]) ) && (canvas.backgroundImage._element.height*zoom > canvas.getHeight()) ) {
      console.log("te pasas " + " " + vpt[5]+(canvas.backgroundImage._element.height*zoom + vpt[5]) + " " + canvas.backgroundImage._element.height*zoom + " " + canvas.getHeight() )
      canvas.viewportTransform[5] = canvas.getHeight() - canvas.backgroundImage._element.height*zoom - borde;
      //canvas.viewportTransform[5] = canvas.backgroundImage._element.height*zoom - canvas.getHeight();
      //canvas.viewportTransform[5] = borde;
      canvas.requestRenderAll();
    }


canvas.forEachObject(function(o) {
  o.selectable = true;
  o.setCoords();
});

}

function updateBoard(oldtilesize) {
console.log("updateboard")
savetilesizeonlist();

  if (connected)
        window.setTimeout(function() {
          sendMessage(getboard(oldtilesize));
          reDrawAll(getboard(oldtilesize));
        }, waittime);
      if(checkAdmin()) {
        console.log(getboard())
        localStorage.setItem(room + 'data', JSON.stringify(getboard()));
      }
      if (canvas.fogEnabled)
      window.setTimeout(function() {
        addFog('update');
      }, 2*waittime);

      
}

function updateBoardQuick() {

  if (connected) {
    sendMessage(getboard());
}

  if(checkAdmin()){
    // Put the object into storage
    localStorage.setItem(room + 'data', JSON.stringify(getboard()));
  }
}

// Functions for touch screens
// Touch-enabled
function touchpan (ev) {
  if ((ev.deltaX*ev.deltaX + ev.deltaY*ev.deltaY) > 20) {
    canvas.viewportTransform[4] = canvas.lastPosX +ev.deltaX;
    canvas.viewportTransform[5] = canvas.lastPosY +ev.deltaY;
    canvas.requestRenderAll();
  }
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

//Mouse down, can be many things
canvas.on("mouse:down", function (opt) {
  hide_menus()
  //console.log("mouse down:" + this.isDrawing +" "+ this.isDrawingfog  + " " +  this.Started + " " + this.with2clicks + " " + this.selection );
  this.lastPosX = opt.e.clientX;
  this.lastPosY = opt.e.clientY;
  var e = opt.e;
    // Drawing a poligon
  if(this.isDrawing || this.isDrawingfog) {
    document.getElementById('message').style.display = "none";

    // Drawing a poligon with two clicks, last click
    if(this.with2clicks) {
      console.log("ultimo click")
      var oldtilesize = tileSize;
      
      this.isDrawing = false;
      this.Started = false;
      this.with2clicks =  false;
      canvas.remove(square);

      if(!this.isDrawingfog) {
        tileSize = Math.abs(this.squarewidth);
        updateBoard(oldtilesize)
        
      } else {
        addFog(square.left - canvas.backgroundImage._element.width/2, square.top - canvas.backgroundImage._element.height/2, square.width, square.height);
        canvas.remove(square);
        canvas.isDrawingfog = true;
        canvas.selection = false;
      }

    }
    else {

    this.Started = true;
    var zoom = canvas.getZoom();

    square = new fabric.Rect({ 
        width: 0, 
        height: 0, 
        left:  (e.clientX - this.viewportTransform[4])/zoom, 
        top:   (e.clientY - this.viewportTransform[5])/zoom, 
        opacity: 0.5,
        fill: '#c710875'
    });

    canvas.add(square); 
    canvas.renderAll();
    canvas.setActiveObject(square); 
    }
    // Rigth mouse to pan background
  } else if(event.button == 2) {
    this.isDragging = true;
    this.selection = false;
  } 

});

canvas.on("mouse:move", function (opt) {
  
  var zoom = canvas.getZoom();
  var e = opt.e;
  if((this.isDrawing || this.isDrawingfog) && this.Started) {
    //var square = canvas.getActiveObject(); 
    this.squarewidth = square.width;
    this.squareheigth = square.height;
    square.set('width', (e.clientX - this.lastPosX)/zoom).set('height', (e.clientY - this.lastPosY)/zoom);
    canvas.renderAll(); 
  } else if (canvas.isDragging) {
    this.viewportTransform[4] += e.clientX - this.lastPosX;
    this.viewportTransform[5] += e.clientY - this.lastPosY;
    this.requestRenderAll();
    this.lastPosX = e.clientX;
    this.lastPosY = e.clientY;
  } else {
      // Estamos encima de un token
       var hoverTarget = canvas.findTarget(event, false);
       var hp = document.getElementById("hp");
       if (hoverTarget !== undefined && hoverTarget !== lasthp && hoverTarget.dd20size !== -1) {         
         lasthp = hoverTarget;         
         hp.style.display="";
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

});

canvas.on("mouse:up", function (opt) {
  console.log("mouse up:");

  this.isDragging = false;
  if(!this.touchenable)
    this.selection = true;
          
  if((this.isDrawing || canvas.isDrawingfog) && !this.with2clicks) {
    //var square = canvas.getActiveObject(); 
    if (square.width !== 0) {
        var oldtilesize = tileSize;
        canvas.remove(square);
        this.isDrawing = false;
        this.Started = false;

        if (!canvas.isDrawingfog) {
          tileSize = Math.abs(square.width);
          updateBoard(oldtilesize)
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
  } else {
      checkBorders();
      setTimeout(function(){ addFog('update'); }, waittime);
 }

});

canvas.on('object:modified', function(options) {
  var doomedObj = canvas.getActiveObject();
  if ((doomedObj.left < (-tileSize/2)) || (doomedObj.top < (-tileSize/2)) )  {
    deleteObj();
  }
  else {
    updateBoardQuick();
    setTimeout(function(){ addFog('update'); }, 4*waittime);
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

canvas.on('selection:created',function(ev) {
console.log("selection created: " + ev.target)

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
    canvas.sendToBack(fog);
    fog.set({selectable: false});
    canvas.preserveObjectStacking = true;
    canvas.renderAll();*/
  
  
  /*
      var activeObjects = ev.target.getObjects();
      if (activeObjects ){
      for (let i in activeObjects) {
          if(activeObjects[i].cacheWidth > 0) {
            ev.target.removeWithUpdate(activeObjects[i]);
            canvas.renderAll();
          }
      }
    }
    */
});

//function for recreating tokens
const DrawItems = (data) => {

  console.log("redibujamos mensaje")
  // First time we receive a packet
  if(!connected) {
    console.log("First paquet!")
    createBg(data.item.backgroundImage)
    connected = true;
    setTimeout(function(){ DrawItems(data) }, waittime); 
    if(data.item.playerid == "dm")
          setTimeout(function(){ DrawFog(data) }, waittime); 
    return;
  }

  try {
    // Get background and TileSize
    var myboard = getboard();
    if (myboard.backgroundImage !== data.item.backgroundImage) {
      console.log("new background!")
      createNewBg(data.item.backgroundImage)
      return;
    }
  } catch (e) {console.log(e)}

    // If it is just a move, we just make a move
    var ok = true;
    var selected = "";
    var lista;
    try {
      selected = canvas.getActiveObject().id;
    } catch (e) {
    }
    try {
      lista = canvas.getActiveObject()._objects;
    } catch (e) {
    }

    if ((canvas._objects.length == data.item.tokens.length) && (tileSize == data.item.tileSize) ) {
      console.log("just move!");
        var i = 0;
        canvas.forEachObject(function(o) {
          console.log(o.id + " " + data.item.tokens[i].id)
          if (o.id  == data.item.tokens[i].id ) { //&& o.id
            if(o.id !== selected && !checklista(o.id,lista)) {
            
            adjustToken(o, data.item.tokens[i].zoomrange, data.item.tokens[i].leftrange, data.item.tokens[i].uprange)
            if (o.dd20size < 0) {
              o.set({hasControls: true, scaleX:data.item.tokens[i].scaleX,scaleY:data.item.tokens[i].scaleY, angle:data.item.tokens[i].angle });
            } 
            o.hp = data.item.tokens[i].hp;
            if (o.left !== data.item.tokens[i].left || o.top !== data.item.tokens[i].top )
            o.animate({left: data.item.tokens[i].left, top: data.item.tokens[i].top }, {
              duration: animationtime,
              onChange: canvas.renderAll.bind(canvas),
           });
            } else
            console.log("no movemos el seleccionado")
          }
          else {
            ok = false;
            console.log("hay algun error")
          }    
          i++;
        });
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
    if (tileSize !== data.item.tileSize) {
      console.log("tile size change!")
      tileSize = data.item.tileSize;
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
          if (o.left !== tokens[t].left || o.top !== tokens[t].top )
          o.animate({left: tokens[t].left, top: tokens[t].top }, {
            duration: animationtime,
            onChange: canvas.renderAll.bind(canvas),
         });
         o.hp = tokens[t].hp;
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
    

  } }
  
  //canvas.requestRenderAll();
  
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

function getboard(tiles) {

  tiles = tiles || tileSize;

  var bg = canvas.backgroundImage._element.src;
  if (bg == "")
    bg = canvas.backgroundImage._element.firstChild.src;

  var obj = new Object();
  obj.backgroundImage   = bg;
  obj.background_width  = canvas.backgroundImage._element.width;
  obj.background_heigth = canvas.backgroundImage._element.height;
  obj.tileSize          = tileSize;
  obj.playerid          = user;
  obj.tokens            = [];
  obj.request           = false;
  obj.fog               = canvas.fogEnabled;
  obj.squares   = [];
  obj.roll = false;

  canvas.forEachObject(function(o) {
    if (o._element !== undefined) {
      var token = new Object();
      token.src  = o._element.src;
      //token.dd20size = o.scaleX * o._element.naturalWidth / (tiles);
      token.dd20size = o.dd20size;
      token.scaleX = o.scaleX;
      token.scaleY = o.scaleY;
      token.angle = o.angle;
      token.leftrange = o.leftrange;
      token.uprange = o.uprange;
      token.zoomrange = o.zoomrange;
      token.hp = o.hp;
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

  function deleteObj(){
    var doomedObj = canvas.getActiveObject();
      if (doomedObj.type === 'activeSelection') {
          doomedObj.canvas = canvas;
          doomedObj.forEachObject(function(obj) {
          canvas.justDeleted++;
          canvas.remove(obj);
          });
          updateBoardQuick()
     }
      else{
      var activeObject = canvas.getActiveObject();
        if(activeObject !== null ) {
          canvas.justDeleted++;
          canvas.remove(activeObject);
          updateBoardQuick()
        }
      }
    }


// ---------------------------------------------------------- //
// Communication to server 
async function sendMessage(token) {
  console.log(token)
  var messageToSend = { item: token };
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

function sendChat_beyond() {

  console.log("from beyond")

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
  log.innerHTML = log.innerHTML +"<br><span class='playerid'>" + item.playerid + ":</span><div draggable='true' ondragstart='drag_roll_start(event)' ondragend='drag_roll_end(event)' class='dice_result' id='g"+generalid+++"'>" + text + "</div>";
}


// Receive data from server from async function
function addMessage(item) {

  console.log("message received!")

  
  if(item.item.roll) 
    printdice(item.item)

  if(item.item.link) {
    update_assets(item.item)
  }
    
  if(item.item.chat) 
    printchat(item.item)
  

// If it is our message we do nothing
if (user !== item.item.playerid) {

  if(item.item.track) 
  print_track(item.item.tracks)

  if (item.item.request == false) {
    if(!item.item.roll && !item.item.link && !item.item.track && !item.item.chat) 
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
  messages.forEach(addMessage);

  // Add any newly created message to the list in real-time
  app.service(channel).on("created", addMessage);
};

// ------------------------------------------------------------------- // 


//create random
function getRandomInt(max) {
return Math.floor(Math.random() * Math.floor(max));
}


// ------------------------------------------------------------------- // 

function addtrackwhentoken(src,n) {
  if (n == null) {
  // Comprobamos que no sea una bola de fuego
  for (var i = 6 ; i < 11; i++) {
    var tr = document.getElementById("t" + i).src;
    if(tr == src)
    return;
  }
  if (!document.getElementById("free").checked){
    for (var i = 1 ; i < 9; i++) {
      var tr = document.getElementById("track" + i).style.backgroundImage;
      if (tr == "") {
        document.getElementById("track" + i).style.backgroundImage = "url('" + src + "')";
        document.getElementById("track" + i).firstElementChild.style.display = "";
        break;
      }
    }
}} else {
 
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
    console.log("drop" + destiny.className)
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
    else if (destiny.className == "track_item") {
      destiny.style.backgroundImage = "";
      destiny.firstElementChild.style.display = "none";
      update_track();    
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

        //console.log(top + " " + left + " " + heigth + " " + width + "--" + ev.clientY + " " + ev.clientX)
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
      console.log("encima")
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
  function drag_roll_end(event) {
    document.querySelectorAll('.thp').forEach(e => e.remove());
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
        destiny.style.order = oorigin.style.order;
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
    var s = event.target.style.backgroundImage;
    s = s.substring(5, s.length-2);
    document.getElementById('token-map').value = s;
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

    for (var i = 1 ; i < 9; i++) {
        var t = new Object();
        t.order = document.getElementById("track" + i).style.order;
        t.hp    = document.getElementById("track" + i).firstElementChild.value;
        t.src   = document.getElementById("track" + i).style.backgroundImage;
        localStorage.setItem("trackorder" + i, t.order);
        localStorage.setItem("trackhp" + i, t.hp);
        localStorage.setItem("tracksrc" + i, t.src);
        console.log(t.src);
        obj.tracks.push(t);
    }
    return(obj);
  }

  function print_track(tracks) {
    console.log(tracks);
    for( i = 0 ; i < tracks.length; i++) {
      document.getElementById("track" + (i+1)).style.order = tracks[i].order;
      document.getElementById("track" + (i+1)).firstElementChild.value = tracks[i].hp;
      document.getElementById("track" + (i+1)).style.backgroundImage = tracks[i].src;
      if (tracks[i].src !== "") 
        document.getElementById("track" + (i+1)).firstElementChild.style.display = "";
        else 
      document.getElementById("track" + (i+1)).firstElementChild.style.display = "none";
    }
    
  }
  
  function sendLink() {

    var link = checkurl(document.getElementById("token-map").value);

    if ((link !== "") && (!checkSRC(link,document.getElementById("asset-list").childNodes))) {

    var img = document.createElement("img");
    img.src = link;
    img.classList.add("bglist");

    if (!document.getElementById("assetvisible").checked) 
      img.classList.add("grayed");

    var list = document.getElementById("asset-list");
    list.appendChild(img);

    if (list.childElementCount > 6)
      list.removeChild(list.childNodes[0])


    if (document.getElementById("assetvisible").checked) 
      sendMessage(getLink());

  }

  }

  function update_assets(link) {

    var list = document.getElementById("player-asset-list");
    list.innerHTML = "";

    console.log("update Assets!!!!!!!")
    if(link.assets.length > 0) {
      for ( var i = 0; i < link.assets.length; i++) {
        var img = document.createElement("img");
        img.src = link.assets[i].src;
        img.classList.add("bglist");
        img.id = "a"+i;
        img.addEventListener("dragstart",drag, true);
        list.appendChild(img);
        console.log(link.assets[i].src)
      }
    }

  }

  function checkSRC(id, lista) {
    if (lista !== undefined) {
    for (var i = 0; i < lista.length; i++) {
      if(lista[i].src == id) return true;
    }
    return false;
  } else return false;
  }

  function chooseasset(event) {
    if (event.target.classList.contains("grayed"))
    event.target.classList.remove("grayed")
    else event.target.classList.add("grayed")
    sendMessage(getLink());
  }

  function chooseplayerasset(event) {
    var src = event.target.src;
    document.getElementById("ontop").style.backgroundImage = 'url(' + src + ')';
    document.getElementById("ontop").style.display = "";
  }

function addBackgroundtoList(bg) {

  var img = document.createElement("img");
  img.src = bg;
  img.className="bglist";
  img.addEventListener('error',brokenlink);

  var list = document.getElementById("background-list");
  list.appendChild(img);
    
  if (list.childElementCount > 6)
    list.removeChild(list.childNodes[0])

}
function brokenlink(event) {
  console.log("broken!!" + event.srcElement)
  event.srcElement.removeEventListener('error',brokenlink);
  //event.srcElement.style.display = "none";
  if (event.srcElement.src.indexOf('.webm')>0 || event.srcElement.src.indexOf('.m4v')>0) {
    event.srcElement.style.backgroundImage = "url('https://play.digitald20.com/vtt/img/video.jpg')";
    event.srcElement.style.backColor = "black";
  }
  
}

  function choosebackground(event) {
    var oldtilesize = tileSize;
    tileSize =  event.target.getAttribute("tile")
    createBg(event.target.src)
    setTimeout(() => {
      updateBoard(oldtilesize)
    }, waittime);
   
  }

  function savetilesizeonlist() {
    var blist = document.getElementById("background-list").getElementsByTagName("img");

    for (i = 0; i < blist.length; i++)
    {
      console.log(blist[i].src)
      if(blist[i].src == canvas.backgroundImage._element.src)
        blist[i].setAttribute("tile",tileSize);
        localStorage.setItem("background" + i, blist[i].src)
    }
    localStorage.setItem("backgroundN", blist.length)
     
  }

  function show_backgrounds() {
    event.stopPropagation();

    document.getElementById("asset-list").style.display = "none";

    if (document.getElementById("background-list").style.display == "flex")
      document.getElementById("background-list").style.display = "none";
    else
      document.getElementById("background-list").style.display = "flex";
  }
  function show_asset() {
    event.stopPropagation();
    document.getElementById("background-list").style.display = "none";
     
    if ( document.getElementById("asset-list").style.display == "flex")
    document.getElementById("asset-list").style.display = "none";
    else 
    document.getElementById("asset-list").style.display = "flex";
  }

  function hide_menus() {
    document.getElementById("hello").style.display = "none";  
    document.getElementById("background-list").style.display = "none";
    document.getElementById("asset-list").style.display = "none";
    document.getElementById("ontop").style.display = "none";
    document.getElementById("dice-select").style.display = "none";

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
    hide_menus();
    if (document.getElementById("chat-area").style.display == "") {
      document.getElementById("chat-area").style.display = "none";
      document.getElementById("hide-chat").innerHTML = "Show Chat";
      document.getElementById("log").style.display = "";
    }
      
    else {
      document.getElementById("chat-area").style.display = "";
      document.getElementById("hide-chat").innerHTML = "Hide Chat";
      document.getElementById("log").style.display = "none";
    }
  }

  function checkboxClick(event) {
    if (event.checked)
     document.getElementById(event.name).style.display = "";
    else 
     document.getElementById(event.name).style.display = "none";
  }

  function checkboxBackground(event) {
    if (event.checked) {
      document.getElementById("main-menu").classList.add("superbox");
    }
  
    else {
      document.getElementById("main-menu").classList.remove("superbox");
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

    
    function getURLforboard() {

      var bg = canvas.backgroundImage._element.src;
      if (bg == "")
        bg = canvas.backgroundImage._element.firstChild.src;
    
      
     //tileSize;
     
     var i = 0;
     var j;
     var src = ["","",""];
     var n = [0,0,0,0,0,0];
     var s = [0,0,0,0,0,0];
     var x = [[],[],[],[],[],[] ];
     var y = [ [],[],[],[],[],[] ];

     
      canvas.forEachObject(function(o) {
        if (o._element !== undefined) {
          if (o._element.src !== src[0] && o._element.src !== src[1] && o._element.src !== src[2] && o._element.src !== src[3] && o._element.src !== src[4] 
            && o._element.src !== src[5] && i < 6) {
            src[i] = o._element.src;
            s[i] = Math.round(o.dd20size);
            i++;
          }
          j = -1;
          if (o._element.src == src[0])
            j = 0;
          else if (o._element.src == src[1])
            j = 1;
          else if (o._element.src == src[2])
            j = 2;
            else if (o._element.src == src[3])
            j = 3;
            else if (o._element.src == src[4])
            j = 4;
            else if (o._element.src == src[5])
            j = 5;
          
            if (j > -1) {
            n[j]++;
            y[j].push(o.top);
            x[j].push(o.left); 
            }
      }
      });  
      
      //var url = "localhost/index.html?"
      var url = "board.digitald20.com/index.html?"
      url = url + "b=" + bg;
      url = url + "&t=" + Math.round(tileSize); 

      for (var i = 0; i < 6;i++) {
        if (n[i]> 0) {
          url = url + "&t"+(i+1)+"=" + src[i]
          url = url + "&s"+(i+1)+"=" + Math.round(s[i])
          url = url + "&n"+(i+1)+"=" + Math.round(n[i])
          url = url + "&c" + (i+1) + "=";
          for (var j = 0 ; j < n[i]; j++) {
            url = url + Math.round(x[i][j]) + "," + Math.round(y[i][j]) + ",";
          }
          url = url.substr(0, url.length-1);
        }
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
  c = document.getElementById("hidden-roll").className;
  if (document.getElementById("hidden-roll").className == "button")
    document.getElementById("hidden-roll").className = "button-pressed"
  else 
    document.getElementById("hidden-roll").className = "button"

  console.log(document.getElementById("hidden-roll").className)
}

function checkurl(url) {
  console.log(url)
  if (url.indexOf("www.dropbox.com") > 0) {
    return url.replace("?dl=0", "?dl=1");
  }
  else return url;
}