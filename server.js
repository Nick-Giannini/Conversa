const express = require('express');
const session = require('express-session');
const routes = require('./controllers');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();


const http = require('http').Server(app);
const io = require('socket.io')(http);
const {Messages} = require('./models/');


const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const PORT = process.env.PORT || 3001;
//use .env because we don't know what port the server will use

const sess = {
  secret: 'Super secret secret', //in industry you will use uuid to generate a random key
  cookie: {},// use max and min for when user logs out?
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);




var usernames = {};
var rooms = [
  { name: "global", creator: "Anonymous" },
  { name: "chess", creator: "Anonymous" },
];

io.on("connection", function (socket) {
  console.log(`User connected to server.`);

  socket.on("createUser", function (username) {
    socket.username = username;
    usernames[username] = username;
    socket.currentRoom = "global";
    socket.join("global");

    console.log(`User ${username} created on server successfully.`);

    socket.emit("updateChat", "INFO", "You have joined global room");
    socket.broadcast
      .to("global")
      .emit("updateChat", "INFO", username + " has joined global room");
    io.sockets.emit("updateUsers", usernames);
    socket.emit("updateRooms", rooms, "global");
  });

  socket.on("sendMessage", function (data) {
    io.sockets.to(socket.currentRoom).emit("updateChat", socket.username, data);
  });

  socket.on("createRoom", function (room) {
    if (room != null) {
      rooms.push({ name: room, creator: socket.username });
      io.sockets.emit("updateRooms", rooms, null);
    }
  });

  socket.on("updateRooms", function (room) {
    socket.broadcast
      .to(socket.currentRoom)
      .emit("updateChat", "INFO", socket.username + " left room");
    socket.leave(socket.currentRoom);
    socket.currentRoom = room;
    socket.join(room);
    socket.emit("updateChat", "INFO", "You have joined " + room + " room");
    socket.broadcast
      .to(room)
      .emit(
        "updateChat",
        "INFO",
        socket.username + " has joined " + room + " room"
      );
  });

  socket.on("disconnect", function () {
    console.log(`User ${socket.username} disconnected from server.`);
    delete usernames[socket.username];
    io.sockets.emit("updateUsers", usernames);
    socket.broadcast.emit(
      "updateChat",
      "INFO",
      socket.username + " has disconnected"
    );
  });
});





sequelize.sync({ force: false }).then(() => {
  http.listen(PORT, () => console.log(`Now listening http://localhost:${PORT}/`));
});