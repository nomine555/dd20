const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const level = require("level");
const db = level("./db", { valueEncoding: "json" });
var path = require("path");

var bodyParser = require("body-parser");
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));

// A messages service that allows to create new
// and return all existing messages
class MessageService {
  constructor() {
    this.messages = [];
  }

  async find() {
    // Just return all our messages
    return this.messages;
  }

  async create(data) {
    // The new message is the data merged with a unique identifier
    // using the messages length since it changes whenever we add one
    const message = {
      id: this.messages.length,
      item: data.item,
    };

    // Add new message to the list
    this.messages = message;
    // this.messages.push(message);

    return message;
  }
}

// Creates an ExpressJS compatible Feathers application
const app = express(feathers());

// Parse HTTP JSON bodies
app.use(express.json());
// Parse URL-encoded params
app.use(express.urlencoded({ extended: true }));
// Host static files from the current folder
app.use(express.static("public"));
// Add REST API support
app.configure(express.rest());
// Configure Socket.io real-time APIs
app.configure(socketio());
// Register a nicer error handler than the default Express one
app.use(express.errorHandler());

// Add any new real-time connection to the `everybody` channel
app.on("connection", (connection) => app.channel("everybody").join(connection));
// Publish all events to the `everybody` channel
app.publish((data) => app.channel("everybody"));
//

//express route
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

/*
app.get("/game", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/game.html"));
});
*/


app.get("/room/:roomId", function (req, res) {
  app.use(`/room/${req.params.roomId}`, new MessageService());
  //sending file
  res.sendFile(path.join(__dirname + "/public/game.html"));
});


app.get("/room/:roomId/game", function (req, res) {
  app.use(`/room/${req.params.roomId}/game`, new MessageService());
  //sending file
  res.sendFile(path.join(__dirname + "/public/game.html"));
});


//saving data from room
app.post("/save", function (req, res) {
  var room_id = req.body.id;
  var background = req.body.background;

  //saving data to level
  db.put(room_id, { background: background }, function (err) {
    if (err) throw err;

    db.get(room_id, function (err, value) {
      if (err) throw err;
      console.log(value);
      res.send("hello").status(200);
    });
  });
});

// Start the server
app
  .listen(process.env.PORT || 80)
  .on("listening", () =>
    console.log("Feathers server listening on localhost:80")
  );
