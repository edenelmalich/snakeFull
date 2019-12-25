const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 4000;
const path = require('path');
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
    socketID: null
  },
  playerB: {
    name: '',
    socketID: null
  }
};
io.on('connection', socket => {
  console.log('New user connected');
  // The server gets the details of the players and checks to see if there are enough players to start the game
  socket.on('playerDetails', (id, name) => {
    if (gameSession.playerA.socketID === null) {
      gameSession.playerA.socketID = id;
      gameSession.playerA.name = name;
      socket.broadcast.emit('ready', true);
    } else {
      gameSession.playerB.socketID = id;
      gameSession.playerB.name = name;
      socket.emit('startGame', gameSession.playerA.name);
      socket.broadcast.emit('startGame', gameSession.playerB.name);
      socket.broadcast.emit('ready', true);
    }
  });
  socket.on('directionChange', data => {
    //letting the other player know that this player has changed direction
    socket.broadcast.emit('enemyChangedDirection', {
      direction: data.direction
    });
  });
  socket.on('snakeAte', data => {
    socket.broadcast.emit('enemyAte', {
      name: data.name
    });
    //get random new apple coordinates and send to all players
    io.emit('newAppleCord', { food: getRandomCord() });
  });
  socket.on('snakeAtePoison', data => {
    socket.broadcast.emit('enemyAtePoison', {
      name: data.name
    });
    //get random new apple coordinates and send to all players
    io.emit('newApplePoisonCord', { poison: getRandomCord() });
  });
  socket.on('gameOver', () => {
    io.emit('endGame', {});
  });
  socket.on('disconnect', () => {
    console.log('User disconnect');

    gameSession.playerA.socketID = null;
    gameSession.playerB.socketID = null;
  });
});

server.listen(PORT, () => console.log(`Listening server on port ${PORT}`));
