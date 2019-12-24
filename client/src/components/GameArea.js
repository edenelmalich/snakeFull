import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import Snake from './Snake';
import Food from './Food';
import Obstacles from './Obstacles';
import Poison from './Poison';
// Css import
import '../css/Game.css';
// Redux
import { connect } from 'react-redux';
import {
  setScore,
  setEnemyScore,
  setStop,
  setDraw
} from '../actions/gameAction';
//  lodash imports
import { debounce } from 'lodash';
import { Redirect } from 'react-router-dom';

const emitSnakeAte = debounce(socket => {
  socket.emit('snakeAte', {});
}, 250);
const emitSnakeAtePoison = debounce(socket => {
  socket.emit('snakeAtePoison', {});
}, 250);
let move;
let moveEnemy;
// Default state for the game
const initialState = {
  food: [30, 30],
  poison: [80, 80],
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
  spinner: false,
  player1: '',
  player2: '',
  finishGame: false
};

class GameArea extends Component {
  state = initialState;

  componentDidMount() {
    move = setInterval(this.moveSnake, this.state.speed);
    // setInterval(this.moveEnemySnake, this.state.speed);

    this.props.socket.on('enemyChangedDirection', receivedPayload => {
      this.setState({ enemyDirection: receivedPayload.direction });
    });

    this.props.socket.on('newEnemySnake', receivedPayload => {
      this.setState({ snake2Dots: receivedPayload.snakeEnemyDots });
    });
    // get the apple cord from the server
    this.props.socket.on('newAppleCord', receivedPayload => {
      this.setState({ food: receivedPayload.food });
    });
    this.props.socket.on('enemyAte', () => {
      this.props.setEnemyScore(this.props.getEnemyScore + 1);
      const isPlayerSnake = false;
      this.enlargeSnake(isPlayerSnake);
    });
    // get the poison cord from the server
    this.props.socket.on('newApplePoisonCord', receivedPayload => {
      this.setState({ poison: receivedPayload.poison });
    });
    this.props.socket.on('enemyAtePoison', () => {
      if (this.props.getEnemyScore > 0) {
        this.props.setEnemyScore(this.props.getEnemyScore - 1);
      }
      const isPlayerSnake = false;
      this.enlargeSnake(isPlayerSnake);
    });
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate() {
    if (this.state.snakeDots.length === 0 || this.state.snake2Dots === 0) {
      this.GameOver();
    } else {
      this.checkIfOutOfBorders();
      this.checkIfCollapsed();
      this.checkIfEnemyCollapsed();
      this.checkIfEat();
      this.checkIfTouch();
      this.checkIfEatPoison();
      this.checkIfDraw();
    }
  }

  onKeyDown = e => {
    switch (e.keyCode) {
      case 38:
        this.setState({ direction: 'UP' });
        this.props.socket.emit('directionChange', {
          playerName: this.state.player2,
          direction: 'UP'
        });
        break;
      case 40:
        this.setState({ direction: 'DOWN' });
        this.props.socket.emit('directionChange', {
          playerName: this.state.player2,
          direction: 'DOWN'
        });
        break;
      case 37:
        this.setState({ direction: 'LEFT' });
        this.props.socket.emit('directionChange', {
          playerName: this.state.player2,
          direction: 'LEFT'
        });
        break;
      case 39:
        this.setState({ direction: 'RIGHT' });
        this.props.socket.emit('directionChange', {
          playerName: this.state.player2,
          direction: 'RIGHT'
        });
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
    let food = this.state.food;
    if (head[0] === food[0] && head[1] === food[1]) {
      this.setState({ food: [-50, -50] });
      emitSnakeAte(this.props.socket);
      this.props.setScore(this.props.getScore + 1);
      this.enlargeSnake('snake');
      this.increaseSpeed();
    }
  };
  checkIfEatPoison = () => {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let poison = this.state.poison;
    if (head[0] === poison[0] && head[1] === poison[1]) {
      this.setState({ poison: [-50, -50] });
      emitSnakeAtePoison(this.props.socket);
      if (this.props.getScore > 0) {
        this.props.setScore(this.props.getScore - 1);
      }
      this.SnakePoison('snake');
      this.increaseSpeed();
    }
  };
  checkIfOutOfBorders = () => {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let headEnemy = this.state.snake2Dots[this.state.snake2Dots.length - 1];
    if (
      head[0] >= 100 ||
      head[1] >= 100 ||
      headEnemy[0] >= 100 ||
      headEnemy[1] >= 100 ||
      head[0] < 0 ||
      head[1] < 0 ||
      headEnemy[0] < 0 ||
      headEnemy[1] < 0
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
  // A function that checks for draw
  checkIfDraw = () => {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let headEnemy = this.state.snake2Dots[this.state.snake2Dots.length - 1];
    if (head[0] === headEnemy[0] && head[1] === headEnemy[1]) {
      this.props.setDraw(true);
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
  checkIfEnemyCollapsed = () => {
    let snake = [...this.state.snake2Dots];
    let headEnemy = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (headEnemy[0] === dot[0] && headEnemy[1] === dot[1]) {
        this.GameOver();
      }
    });
  };

  enlargeSnake = isPlayerSnake => {
    let newSnake;
    if (isPlayerSnake) {
      newSnake = [...this.state.snakeDots];
      newSnake.unshift([]);
      this.setState({
        snakeDots: newSnake
      });
    } else {
      newSnake = [...this.state.snake2Dots];
      newSnake.unshift([]);
      this.setState({
        snake2Dots: newSnake
      });
    }
  };

  SnakePoison = isPlayerSnake => {
    let newSnake;
    if (isPlayerSnake) {
      newSnake = [...this.state.snakeDots];
      newSnake.shift();
      this.setState({
        snakeDots: newSnake
      });
    } else {
      newSnake = [...this.state.snake2Dots];
      newSnake.shift();
      this.setState({
        snake2Dots: newSnake
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
    clearInterval(move);
    clearInterval(moveEnemy);
    this.setState({
      finishGame: true
    });
  };

  render() {
    if (this.state.finishGame) {
      return <Redirect to='/FinishGame' />;
    }
    return (
      <div className='game-container'>
        <span className='Score'>
          {this.props.player} Your Score is: {this.props.getScore}
        </span>
        <span className='ScorePlayer2'>
          {this.props.player2} Your Score is: {this.props.getEnemyScore}
        </span>
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
// PropTypes
GameArea.propTypes = {
  setStop: PropTypes.func.isRequired,
  setScore: PropTypes.func.isRequired,
  getScore: PropTypes.number.isRequired,
  getEnemyScore: PropTypes.number.isRequired,
  setEnemyScore: PropTypes.func.isRequired,
  setDraw: PropTypes.func.isRequired,
  getStopState: PropTypes.bool.isRequired
};
// Redux state Reducer
const mapStateToProps = state => ({
  getScore: state.gameReducer.getScore,
  getEnemyScore: state.gameReducer.getEnemyScore,
  player: state.gameReducer.player,
  player2: state.gameReducer.player2,
  getStopState: state.gameReducer.getStopState
});
export default connect(mapStateToProps, {
  setScore,
  setEnemyScore,
  setStop,
  setDraw
})(GameArea);
