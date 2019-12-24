import {
  SET_SCORE,
  SET_CLIENTS_COUNTER,
  SET_ENEMY_SCORE,
  SET_PLAYER2_NAME,
  SET_PLAYER_NAME,
  SET_STOP_GAME,
  SET_DRAW
} from './typeAction';

export const setScore = score => dispatch => {
  dispatch({
    type: SET_SCORE,
    payload: score
  });
};
export const setEnemyScore = score => dispatch => {
  dispatch({
    type: SET_ENEMY_SCORE,
    payload: score
  });
};
export const setClientsCounter = stateSuccess => dispatch => {
  dispatch({
    type: SET_CLIENTS_COUNTER,
    payload: stateSuccess
  });
};
export const setPlayerName = player => dispatch => {
  console.log(player);
  dispatch({
    type: SET_PLAYER_NAME,
    payload: player
  });
};
export const setPlayer2Name = player2 => dispatch => {
  console.log(player2);
  dispatch({
    type: SET_PLAYER2_NAME,
    payload: player2
  });
};
export const setStop = stopState => dispatch => {
  dispatch({
    type: SET_STOP_GAME,
    payload: stopState
  });
};
export const setDraw = drawState => dispatch => {
  dispatch({
    type: SET_DRAW,
    payload: drawState
  });
};
