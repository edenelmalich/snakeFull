import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import Snake from './Snake';
import Food from './Food';
import Obstacles from './Obstacles';
import Poison from './Poison';
import ModalGame from './ModalGame';
// Socket import
import socketIOClient from 'socket.io-client';
// Css import
import '../css/Game.css';
// Redux
import { connect } from 'react-redux';
import { setModal, setModalText } from '../actions/modalAction';
import { setScore, setEnemyScore } from '../actions/gameAction';

// Function to get random cord
const getRandomCord = () => {
  let min = 1;
  let max = 97;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};
// Default state for the game
const initialState = {
  food: getRandomCord(),
  poison: getRandomCord(),
  speed: 100,
  direction: 'RIGHT',
  enemyDirection: 'RIGHT',
  snakeDots: [
    [0, 0],
    [2, 0]
  ],
  snake2Dots: [
    [0, 40],
    [2, 40]
  ],
  obstacle: [8, 10, 12, 14, 16],
  obstacle1: [60, 62, 64, 66, 68],
  spinner: false
};

// socket = io.connect( 'http://127.0.0.1:3000', {
//     reconnection: true,
//     reconnectionDelay: 1000,
//     reconnectionDelayMax : 5000,
//     reconnectionAttempts: 99999
// } );

// socket.on('initialState', receivedInitialState => {
//   initialState = receivedInitialState;
// });

const socket = socketIOClient.connect('http://localhost:4000');

// socket.on('enemyChangedDirection', receivedPayload => {
//   this.setState({ enemyDirection: receivedPayload.direction });
// });

class GameArea extends Component {
  state = initialState;
  // ComponentWillMount
  componentWillMount() {}
  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    setInterval(this.moveEnemySnake, this.state.speed);
    socket.on('enemyChangedDirection', receivedPayload => {
      this.setState({ enemyDirection: receivedPayload.direction });
    });
    document.onkeydown = this.onKeyDown;
  }
  componentDidUpdate() {
    if (this.state.snakeDots.length === 0) {
      this.onGameOver();
    } else {
      this.checkIfOutOfBorders();
      this.checkIfCollapsed();
      this.checkIfEat();
      this.checkIfTouch();
      this.checkIfEatPoison();
      this.checkIfDraw();
    }
  }

  onKeyDown = e => {
    const playerName = this.props.location.state.playerName;
    switch (e.keyCode) {
      case 38:
        this.setState({ direction: 'UP' });
        socket.emit('directionChange', { playerName, direction: 'UP' });
        break;
      case 40:
        this.setState({ direction: 'DOWN' });
        socket.emit('directionChange', { playerName, direction: 'DOWN' });
        break;
      case 37:
        this.setState({ direction: 'LEFT' });
        socket.emit('directionChange', { playerName, direction: 'LEFT' });
        break;
      case 39:
        this.setState({ direction: 'RIGHT' });
        socket.emit('directionChange', { playerName, direction: 'RIGHT' });
        break;
    }
  };

  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    switch (this.state.direction) {
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
    this.setState({
      snakeDots: dots
    });
  };
  moveEnemySnake = () => {
    let dots = [...this.state.snake2Dots];
    let head = dots[dots.length - 1];

    switch (this.state.enemyDirection) {
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
    this.setState({
      snake2Dots: dots
    });
  };
  checkIfEat = () => {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let headEnemy = this.state.snake2Dots[this.state.snake2Dots.length - 1];
    let food = this.state.food;
    if (head[0] === food[0] && head[1] === food[1]) {
      this.setState({
        food: getRandomCord()
      });
      this.props.setScore(this.props.getScore + 1);
      this.enlargeSnake('snake');
      this.increaseSpeed();
    }
    if (headEnemy[0] === food[0] && headEnemy[1] === food[1]) {
      this.setState({
        food: getRandomCord()
      });
      this.props.setEnemyScore(this.props.getEnemyScore + 1);
      this.enlargeSnake('snakeEnemy');
      this.increaseSpeed();
    }
  };
  checkIfEatPoison = () => {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let headEnemy = this.state.snake2Dots[this.state.snake2Dots.length - 1];
    let poison = this.state.poison;
    if (head[0] === poison[0] && head[1] === poison[1]) {
      this.setState({
        poison: getRandomCord()
      });
      if (this.props.getScore > 0) {
        this.prop.setScore(this.props.getScore - 1);
      }
      this.SnakePoison('snake');
      this.decreaseSpeed();
    }
    if (headEnemy[0] === poison[0] && headEnemy[1] === poison[1]) {
      this.setState({
        poison: getRandomCord()
      });
      if (this.props.getEnemyScore > 0) {
        this.prop.setEnemyScore(this.props.getEnemyScore - 1);
      }
      this.SnakePoison('snakeEnemy');
      this.decreaseSpeed();
    }
  };
  checkIfOutOfBorders = () => {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let headEnemy = this.state.snake2Dots[this.state.snake2Dots.length - 1];
    if (
      head[0] >= 100 ||
      headEnemy[0] >= 100 ||
      headEnemy[1] >= 100 ||
      head[1] >= 100 ||
      head[0] < 0 ||
      headEnemy[0] < 0 ||
      headEnemy[1] < 0 ||
      head[1] < 0
    ) {
      this.GameOver();
    }
  };
  checkIfTouch = () => {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let headEnemy = this.state.snake2Dots[this.state.snake2Dots.length - 1];
    this.state.obstacle.forEach(cord => {
      if (
        (head[0] === 80 && head[1] === cord) ||
        (headEnemy[0] === 80 && headEnemy[1] === cord)
      ) {
        this.GameOver();
      }
    });
    this.state.obstacle1.forEach(cord => {
      if (
        (head[0] === 50 && head[1] === cord) ||
        (headEnemy[0] === 50 && headEnemy[1] === cord)
      ) {
        this.GameOver();
      }
    });
  };
  checkIfDraw = () => {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let headEnemy = this.state.snake2Dots[this.state.snake2Dots.length - 1];
    if (head[0] === headEnemy[0] && head[1] === headEnemy[1]) {
      this.prop.setModalText(this.props.getModalText);
      this.GameOver();
    }
  };
  checkIfCollapsed = () => {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        this.GameOver();
      }
    });
  };

  enlargeSnake = snakeType => {
    let newSnake = [...this.state.snakeDots];
    let newEnemySnake = [...this.state.snake2Dots];
    if (snakeType === 'snake') {
      newSnake.unshift([]);
      this.setState({
        snakeDots: newSnake
      });
    } else {
      newEnemySnake.unshift([]);
      this.setState({
        snake2Dots: newEnemySnake
      });
    }
  };

  SnakePoison = snakeType => {
    let newSnake = [...this.state.snakeDots];
    let newEnemySnake = [...this.state.snake2Dots];
    if (snakeType === 'snake') {
      newSnake.shift([]);
      this.setState({
        snakeDots: newSnake
      });
    } else {
      newEnemySnake.shift([]);
      this.setState({
        snake2Dots: newEnemySnake
      });
    }
  };

  increaseSpeed = () => {
    if (this.state.speed > 10) {
      this.setState({
        speed: this.state.speed - 10
      });
    }
  };
  decreaseSpeed = () => {
    this.setState({
      speed: this.state.speed + 10
    });
  };

  GameOver = () => {
    this.props.setModal(this.props.getModalState);
    this.setState(initialState);
  };

  render() {
    return (
      <div className='game-container'>
        <span className='Score'>
          {this.props.location.state.playerName} Your Score is:{' '}
          {this.props.getScore}
        </span>
        <span className='ScorePlayer2'>
          {this.props.location.state.getName} Your Score is:{' '}
          {this.props.getEnemyScore}
        </span>
        {/* {this.props.getModalState ? <ModalGame /> : null} */}
        <div className='game-area'>
          <Snake snake={this.state.snakeDots} bg={'#00e676'} />
          <Snake snake={this.state.snake2Dots} bg={'blue'} />
          <Food food={this.state.food} />
          <Poison poison={this.state.poison} />
          <Obstacles obstacle={this.state.obstacle} top={80} />
          <Obstacles obstacle={this.state.obstacle1} top={50} />
        </div>
      </div>
    );
  }
}
GameArea.propTypes = {
  getModalState: PropTypes.bool.isRequired,
  setModal: PropTypes.func.isRequired,
  setScore: PropTypes.func.isRequired,
  getScore: PropTypes.number.isRequired,
  getEnemyScore: PropTypes.number.isRequired,
  setModalText: PropTypes.func.isRequired,
  getModalText: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
  getModalState: state.modalReducer.getModalState,
  getScore: state.gameReducer.getScore,
  getEnemyScore: state.gameReducer.getEnemyScore,
  getModalText: state.modalReducer.getModalText
});
export default connect(mapStateToProps, {
  setModal,
  setScore,
  setEnemyScore,
  setModalText
})(GameArea);
