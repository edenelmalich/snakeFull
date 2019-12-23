import { SET_SCORE, SET_CLIENTS_COUNTER, SET_ENEMY_SCORE } from './typeAction';

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
