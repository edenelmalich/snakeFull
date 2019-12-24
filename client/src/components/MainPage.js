import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SnakeLogo from '../img/SnakeLogo.png';
import '../css/Game.css';
import { Redirect } from 'react-router-dom';
// Bootstrap import
import { Spinner } from 'react-bootstrap';
// Redux
import { connect } from 'react-redux';
import {
  setClientsCounter,
  setPlayer2Name,
  setPlayerName
} from '../actions/gameAction';

const MainPage = ({ getClientsCounter, setClientsCounter, socket }) => {
  // useState
  const [getName, setName] = useState('');
  const [spinner, setSpinner] = useState(false);

  //   function
  const onChange = e => {
    setName(e.target.value);
  };
  const onSubmit = e => {
    e.preventDefault();
    socket.emit('playerDetails', socket.id, getName);
    socket.on('numberOfClients', clients => {
      if (clients === 2) {
        socket.emit('playGame', {});
      }
    });
    if (!getClientsCounter) {
      setSpinner(true);
    }
  };
  socket.on('startGame', success => {
    setClientsCounter(success);
  });
  socket.on('enemyName', player => {
    console.log(player);
    // setPlayer2Name(player);
  });

  if (getClientsCounter) {
    return (
      <Redirect
        to={{
          pathname: '/GameArea',
          state: { player: getName }
        }}
      />
    );
  }
  return (
    <div className='main'>
      <header className='header'>Snake Game</header>
      <img src={SnakeLogo} alt='snake logo' />
      <form className='MainForm' onSubmit={e => onSubmit(e)}>
        <input
          type='text'
          placeholder='Please enter your name'
          onChange={e => onChange(e)}
          value={getName}
          required
        />
        <input type='submit' value='Play' />
        {spinner ? (
          <span>
            <div className='Spinner-text'>Please wait for more player</div>
            <Spinner animation='border' variant='dark' />
          </span>
        ) : null}
      </form>
    </div>
  );
};
MainPage.propTypes = {
  getClientsCounter: PropTypes.bool.isRequired,
  setClientsCounter: PropTypes.func.isRequired,
  setPlayer2Name: PropTypes.func.isRequired,
  setPlayerName: PropTypes.func.isRequired,
  getStopState: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
  getClientsCounter: state.gameReducer.getClientsCounter,
  getStopState: state.gameReducer.getStopState
});
export default connect(mapStateToProps, {
  setClientsCounter,
  setPlayer2Name,
  setPlayerName
})(MainPage);
