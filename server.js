const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const PORT = process.env.PORT || 4000;

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

const getRandomCord = () => {
  let min = 1;
  let max = 97;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

let gameSession = {
  playerA: {
    name: '',
    currentScore: 0,
    socket: null,
    socketID: null
  },
  playerB: {
    name: '',
    currentScore: 0,
    socket: null,
    socketID: null
  }
};
app.use(express.static(path.join(__dirname, '../../build')));
app.get('/', (req, res, next) => {
  res.sendFile(__dirname + './index.html');
});
io.on('connection', socket => {
  console.log('New user connected');

  socket.on('directionChange', data => {
    //letting the other player know that this player has changed direction
    socket.broadcast.emit('enemyChangedDirection', {
      direction: data.direction
    });
  });
  ///
  socket.on('playerID', ({ id, name }) => {
    if (io.engine.clientsCount > 1) {
      gameSession.playerB.socketID = id;
      gameSession.playerB.name = name;
    } else {
      gameSession.playerA.socketID = id;
      gameSession.playerA.name = name;
    }
  });
  // ------------------------------------------------

  socket.on('snakeAte', data => {
    socket.broadcast.emit('enemyAte', {
      name: data.name
    });
    //get random new apple coordinates and send to all players
    io.emit('newAppleCord', { food: getRandomCord() });
  });

  setInterval(() => {
    io.emit('success', gameSession.playerB.socketID !== null ? true : false);
  }, 2000);
  io.emit('getPlayersName', gameSession);
  socket.on('disconnect', () => {
    console.log('User disconnect');
    gameSession.playerB.socketID === null;
    gameSession.playerA.socketID === null;
  });
});

server.listen(PORT, () => console.log(`Listening server on port ${PORT}`));
