import { combineReducers } from 'redux';
import modalReducer from './modalReducer';
import gameReducer from './gameReducer';

export default combineReducers({
  modalReducer,
  gameReducer
});
