import {
  SET_SCORE,
  SET_CLIENTS_COUNTER,
  SET_ENEMY_SCORE
} from '../actions/typeAction';

const initialState = {
  getScore: 0,
  getEnemyScore: 0,
  getClientsCounter: false
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

    default:
      return state;
  }
};
export default gameReducer;
