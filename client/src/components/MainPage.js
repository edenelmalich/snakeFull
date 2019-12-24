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

const MainPage = ({
  getClientsCounter,
  setClientsCounter,
  socket,
  setPlayer2Name,
  setPlayerName
}) => {
  useEffect(() => {
    console.log(getClientsCounter);
  }, [getClientsCounter]);
  // useState
  const [getName, setName] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [enterGame, setEnterGame] = useState(false);

  //   function

  const onChange = e => {
    setName(e.target.value);
  };
  const onSubmit = e => {
    e.preventDefault();
    setPlayerName(getName);
    socket.emit('playerDetails', socket.id, getName);
    socket.on('startGame', player2Name => {
      setPlayer2Name(player2Name);
      setEnterGame(true);
    });

    if (!enterGame) {
      setSpinner(true);
    }
  };

  if (enterGame) {
    return <Redirect to='/GameArea' />;
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
