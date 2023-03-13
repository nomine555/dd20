// ------------------------------------------------------------------- // 
// This function is call form login page

function ContinueRoom(){
  if (localStorage.getItem('lastdd20room') !== null) {
    var id = localStorage.getItem('lastdd20room');
    localStorage.setItem('dd20room', "/room/" + id);
    localStorage.setItem('dd20user', 'dm')
    localStorage.setItem('lastdd20room',id);
    window.location.assign("/newroom/" + id);
  }
  else getRoomid();
  
}

function getRoomid() {

    const id = Date.now() + "" + Math.floor(Math.random() * 1000000000);
        localStorage.setItem('dd20room', "/room/" + id);
        localStorage.setItem('dd20user', 'dm')
        localStorage.setItem('lastdd20room',id);
        window.location.assign("/newroom/" + id);
       
  }

  function init() {

    if(location.href.indexOf('?')> 0)
    {
      var resturl = location.href.substring(location.href.indexOf('?'));

      if (localStorage.getItem('lastdd20room') !== null) {
        var id = localStorage.getItem('lastdd20room');
        localStorage.setItem('dd20room', "/room/" + id);
        localStorage.setItem('dd20user', 'dm')
        //localStorage.setItem('lastdd20room',id);
        window.location.assign("/newroom/" + id + resturl);    
      } else {
        const id = Date.now() + "" + Math.floor(Math.random() * 1000000000);
        localStorage.setItem('dd20room', "/room/" + id);
        localStorage.setItem('dd20user', 'dm')
        localStorage.setItem('lastdd20room',id);
        window.location.assign("/newroom/" + id + resturl);
      }

    }
  }
    /*
    var board = new URL(location.href).searchParams.get('b');
    if (board !== null) {

      console.log(board)
    }
*/
  
  /*  
  var board = new URL(location.href).searchParams.get('board');
  if (board !== null) {
      console.log("Tenemos un tablero")
      const id = Date.now() + "" + Math.floor(Math.random() * 1000000000);
        localStorage.setItem('dd20room', "/room/" + id);
        localStorage.setItem('dd20user', 'dm')

        /*
        tokenN = parseInt(localStorage.getItem("tokenN"));
        tokenS = parseInt(localStorage.getItem("tokenS"));
        var myboard = JSON.parse(localStorage.getItem(room + 'data'));
        '{"backgroundImage":"../img/graveyard-map.jpg","background_width":1806,"background_heigth":960,"tileSize":60,"playerid":"dm","tokens":[{"src":"../img/thief.jpg","size":1,"top":595,"left":537,"id":"admin50535"},{"src":"../img/halfling.jpg","size":1,"top":231.6656346749225,"left":669.4148606811145,"id":"admin297252"},{"src":"../img/mage.jpg","size":1,"top":714,"left":240,"id":"admin241239"},{"src":"../img/fighter.jpg","size":0.9999999999999999,"top":477.046439628483,"left":420.953560371517,"id":"admin261770"},{"src":"../img/ranger.jpg","size":1,"top":475,"left":606,"id":"admin493210"},{"src":"../img/spectre.jpg","size":2,"top":472,"left":483,"id":"admin281858"}],"request":false}')


        window.location.assign("/room/" + id)
  }
*/

  
  /*
  //checking if user is an admin
  const checkAdmin = () => {
  if ((user === "admin") & (room === window.location.pathname)) {
    return true;
  } else {
    return false;
  }
  };
  
  //create random
  function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
  }
  
  function getLocation() {
  var location = window.location.pathname;
  return location;
  }
  */
  // ------------------------------------------------------------------- // 





