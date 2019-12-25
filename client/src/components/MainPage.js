import React, { useState } from 'react';
import PropTypes from 'prop-types';
// snake main logo
import SnakeLogo from '../img/SnakeLogo.png';
// css import
import '../css/Game.css';
// react router dom import for redirect to pages
import { Redirect } from 'react-router-dom';
// Bootstrap import
import { Spinner } from 'react-bootstrap';
// Redux
import { connect } from 'react-redux';
import { setPlayer2Name, setPlayerName } from '../actions/gameAction';

const MainPage = ({ socket, setPlayer2Name, setPlayerName }) => {
  // useState
  const [getName, setName] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [enterGame, setEnterGame] = useState(false);
  const [checkReady, setReady] = useState(false);

  //   function
  const onChange = e => {
    setName(e.target.value);
  };
  //
  // A function that sends to server the details of the entered player
  const onSubmit = e => {
    e.preventDefault();
    setPlayerName(getName);
    socket.emit('playerDetails', socket.id, getName);
    socket.on('startGame', player2Name => {
      setPlayer2Name(player2Name);
      setEnterGame(true);
    });
    // A condition that checks if there are 2 connected users
    if (!enterGame) {
      setSpinner(true);
    }
  };
  // Each logged-in user waits for an answer if the other user is ready to play
  socket.on('ready', readyState => {
    if (readyState) {
      setReady(true);
    }
  });
  // If all the players are ready, move to the game page
  if (enterGame && checkReady) {
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
// PropTypes
MainPage.propTypes = {
  setPlayer2Name: PropTypes.func.isRequired,
  setPlayerName: PropTypes.func.isRequired,
  getStopState: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
  getStopState: state.gameReducer.getStopState
});
export default connect(mapStateToProps, {
  setPlayer2Name,
  setPlayerName
})(MainPage);
