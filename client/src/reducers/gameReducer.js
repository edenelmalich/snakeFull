import {
  SET_SCORE,
  SET_CLIENTS_COUNTER,
  SET_ENEMY_SCORE,
  SET_PLAYER2_NAME,
  SET_PLAYER_NAME,
  SET_STOP_GAME
} from '../actions/typeAction';

const initialState = {
  getScore: 0,
  getEnemyScore: 0,
  getClientsCounter: false,
  player: '',
  player2: '',
  getStopState: false
};
const gameReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_SCORE:
      return { ...state, getScore: payload };
    case SET_ENEMY_SCORE:
      return { ...state, getEnemyScore: payload };
    case SET_CLIENTS_COUNTER:
      return { ...state, getClientsCounter: payload };
    case SET_PLAYER2_NAME:
      return { ...state, player2: payload };
    case SET_PLAYER_NAME:
      return { ...state, player: payload };
    case SET_STOP_GAME:
      return { ...state, getStopState: payload };
    default:
      return state;
  }
};
export default gameReducer;
