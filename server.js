const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3300");
app.set("port", port);

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

const onlineUsers = {};
io.on("connection", socket => {

  socket.on("attack", adat => {
    io.to(adat.enemy).emit("attack", adat);
  });

  socket.on("win", (adat)=>{
    io.to(adat.channel).emit("win");
  })
  
  socket.on("enter", username => {
    onlineUsers[username]=socket.id;
    io.emit("online", onlineUsers);
  });

  socket.on("leave", username => {
    delete onlineUsers[username];
    io.emit("online", onlineUsers);
  });


  socket.on("challenge", challengeObject=>{
    io.to(challengeObject.challengedSocketId).emit("challenge", challengeObject.challenger);
  })

  socket.on("withdrawn", challengedSocketId=>{
    io.to(challengedSocketId).emit("withdrawn");
  })

  socket.on("challengeAccepted", socketId=>{
    io.to(socketId).emit("challengeAccepted");
  })

})

server.on("error", onError);
server.on("listening", onListening);
server.listen(port);




