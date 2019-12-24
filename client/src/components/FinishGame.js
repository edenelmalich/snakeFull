import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Snake Logo
import SnakeLogo from '../img/SnakeLogo.png';
// Redux
import { connect } from 'react-redux';
import { setStop } from '../actions/gameAction';
import { Redirect } from 'react-router-dom';

const FinishGame = ({
  getScore,
  getDrawState,
  getEnemyScore,
  socket,
  player
}) => {
  const [finishGame, setFinish] = useState(false);
  if (finishGame) {
    socket.disconnect();
    return <Redirect to='/' />;
  }
  return (
    <div>
      <header className='finish-header'>Game over</header>
      <img id='FinishLogo' src={SnakeLogo} alt='snake logo' />
      {!getDrawState ? (
        <div>
          {getScore > getEnemyScore ? (
            <div className='finish-text'>
              {player} You Win. Your score is: {getScore}
            </div>
          ) : null}
          {getScore < getEnemyScore ? (
            <div className='finish-text'>
              {player} You Lose. Your score is: {getScore}
            </div>
          ) : null}

          {getScore === getEnemyScore ? (
            <div className='finish-text'>Draw</div>
          ) : null}
        </div>
      ) : (
        <div className='finish-text'>Draw</div>
      )}
      <button className='finish-btn' onClick={() => setFinish(true)}>
        Finish game
      </button>
    </div>
  );
};
FinishGame.propType = {
  getScore: PropTypes.number.isRequired,
  getEnemyScore: PropTypes.number.isRequired,
  getDrawState: PropTypes.bool.isRequired,
  setStop: PropTypes.func.isRequired,
  player: PropTypes.string.isRequired
};
const mapStateToProps = state => ({
  getScore: state.gameReducer.getScore,
  getEnemyScore: state.gameReducer.getEnemyScore,
  getDrawState: state.gameReducer.getDrawState,
  player: state.gameReducer.player
});
export default connect(mapStateToProps, { setStop })(FinishGame);
