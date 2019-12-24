import React, { useState } from 'react';
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

const MainPage = ({
  getClientsCounter,
  setClientsCounter,
  socket,
  setPlayerName
}) => {
  // useState
  const [getName, setName] = useState('');
  const [spinner, setSpinner] = useState(false);

  //   function
  const onChange = e => {
    setName(e.target.value);
  };
  const onSubmit = e => {
    e.preventDefault();
    socket.emit('playerID', socket.id, getName);

    if (!getClientsCounter) {
      setSpinner(true);
    }
  };
  socket.on('success', success => {
    setClientsCounter(success);
  });
  socket.on('setPlayer1', player2 => {
    setPlayer2Name(player2);
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
  setPlayerName: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  getClientsCounter: state.gameReducer.getClientsCounter
});
export default connect(mapStateToProps, {
  setClientsCounter,
  setPlayer2Name,
  setPlayerName
})(MainPage);
