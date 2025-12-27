const { feathers } = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const { Level } = require("level");
var path = require("path");

var serveIndex = require('serve-index');


// Image Kit
const ImageKit = require("imagekit");
const fs = require('fs')
var imagekit = new ImageKit({
  publicKey : "public_DYilnmhVRFXigmTUrGtuCcGZpok=",
  privateKey : "private_8TVOnRhhlGeWW4/sSOZXtleIo/Y=",
  urlEndpoint : "https://ik.imagekit.io/fiade"
});
// ---

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
    this.messages.push(message);

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

//express route
app.get("/new", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/new-index.html"));
});

//express route
app.get("/load", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/load.html"));
});

app.use('/img', serveIndex('public/img',  {icons: true, view: 'details'}) );

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

app.get("/newroom/:roomId", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/new-game.html"));
});

app.get("/newroom/:roomId/game", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/new-game.html"));
});

app.get("/n/:roomId", function (req, res) {
  //sending file
  res.sendFile(path.join(__dirname + "/public/create-room.html"));
});

// Image Kit
app.get('/signature', (req, res) => {
  var authentcationParameters = imagekit.getAuthenticationParameters();
  res.send(authentcationParameters);
})
// ----


// Register message services for Socket.io (after all Express routes)
const messageService = new MessageService();
app.use('/messages', messageService);

// Start the server
const start = async () => {
  const port = process.env.PORT || 81;
  await app.listen(port);
  console.log(`Feathers server listening on localhost:${port}`);
};

start().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
