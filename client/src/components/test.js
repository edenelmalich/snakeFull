import React, { useState, useEffect } from 'react';
// Components
import Snake from './Snake';
import Food from './Food';
import '../css/Game.css';

// componentDidMount() {
//   setInterval(this.moveSnake, this.state.speed);
//   document.onkeydown = this.onKeyDown;
// }

const GameArea = () => {
  // useState
  const [snakeDots, setSnakeDots] = useState([
    [0, 0],
    [2, 0]
  ]);
  const [obstacle] = useState([
    [0, 0],
    [0 + 2, 0],
    [0 + 4, 0],
    [0 + 4, 0 + 2],
    [0 + 4, 0 + 4],
    [0 + 4, 0 + 6]
  ]);

  const [speed, setSpeed] = useState(200);
  const [direction, setDirection] = useState('RIGHT');
  // Functions
  const getRandomCord = () => {
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    return [x, y];
  };
  const [food, setFood] = useState(getRandomCord());
  const createObstacle = () => {
    const obstacle = getRandomCord();
    return obstacle;
  };
  const obstacleCord = createObstacle();
  let cordX = obstacleCord.pop();
  let cordY = obstacleCord.pop();
  const onKeyDown = e => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        setDirection({ direction: 'UP' });
        break;
      case 40:
        setDirection({ direction: 'DOWN' });
        break;
      case 37:
        setDirection({ direction: 'LEFT' });
        break;
      case 39:
        setDirection({ direction: 'RIGHT' });
        break;
    }
  };
  const moveSnake = () => {
    let dots = [...snakeDots];
    let head = dots[dots.length - 1];

    switch (direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
    }
    dots.push(head);
    dots.shift();
    setSnakeDots(dots);
  };

  const onGameOver = () => {
    // alert(`Game Over. Snake length is ${this.state.snakeDots.length}`);
  };
  const increaseSpeed = () => {
    if (speed > 10) {
      setSpeed(speed - 10);
    }
  };
  const checkIfOutOfBorders = () => {
    let head = snakeDots[snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      onGameOver();
    }
  };
  const enlargeSnake = () => {
    let newSnake = [...snakeDots];
    newSnake.unshift([]);
    setSnakeDots(newSnake);
  };
  const checkIfTouch = () => {
    let head = snakeDots[snakeDots.length - 1];
    if (
      (head[0] === cordX && head[1] === cordY) ||
      (head[0] === cordX + 2 && head[1] === cordY) ||
      (head[0] === cordX + 4 && head[1] === cordY) ||
      (head[0] === cordX + 4 && head[1] === cordY + 2) ||
      (head[0] === cordX + 4 && head[1] === cordY + 4) ||
      (head[0] === cordX + 4 && head[1] === cordY + 6)
    ) {
      onGameOver();
    }
  };
  // const checkIfEat = () => {
  //   let head = snakeDots[snakeDots.length - 1];
  //   let food = food;
  //   if (head[0] === food[0] && head[1] === food[1]) {
  //     setFood(getRandomCord());
  //     enlargeSnake();
  //     increaseSpeed();
  //   }
  // };
  const checkIfCollapsed = () => {
    let snake = [...snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        onGameOver();
      }
    });
  };
  // ComponentDidMount
  useEffect(() => {
    setInterval(moveSnake(), speed);
    document.onkeydown = onKeyDown();
  }, []);
  // ComponentDidUpdate
  useEffect(() => {
    checkIfOutOfBorders();
    checkIfCollapsed();
    // checkIfEat();
    checkIfTouch();
  });
  return (
    <div className='game-area'>
      <Snake snake={snakeDots} />
      <Food food={food} />
      {/* <Obstacle1 obstacle={this.state.obstacle} />
      <Obstacle2 obstacle={this.state.obstacle} />
      <Obstacle3 obstacle={this.state.obstacle} /> */}
    </div>
  );
};

export default GameArea;
