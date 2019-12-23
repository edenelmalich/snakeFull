import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SnakeLogo from '../img/SnakeLogo.png';
import '../css/Game.css';
import { Redirect } from 'react-router-dom';
// Bootstrap import
import { Spinner } from 'react-bootstrap';
// Socket import
import socketIOClient from 'socket.io-client';
// Redux
import { connect } from 'react-redux';
import { setClientsCounter } from '../actions/gameAction';

const socket = socketIOClient.connect('http://localhost:4000');
const MainPage = ({ getClientsCounter, setClientsCounter }) => {
  // useState
  const [getName, setName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [spinner, setSpinner] = useState(false);

  //   function
  const onChange = e => {
    setName(e.target.value);
  };
  const onSubmit = e => {
    e.preventDefault();
    socket.emit('playerID', { socketID: socket.id, name: getName });

    if (!getClientsCounter) {
      setSpinner(true);
    }
  };
  socket.on('getPlayersName', data => {
    setPlayerName(data.playerA.name);
  });
  socket.on('success', success => {
    setClientsCounter(success);
  });

  if (getClientsCounter) {
    return (
      <Redirect
        to={{
          pathname: '/GameArea',
          state: { getName: getName, playerName: playerName }
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
  setClientsCounter: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  getClientsCounter: state.gameReducer.getClientsCounter
});
export default connect(mapStateToProps, { setClientsCounter })(MainPage);
