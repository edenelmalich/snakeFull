import { SET_MODAL, SET_MODAL_TEXT } from '../actions/typeAction';

const initialState = {
  getModalState: false,
  getModalText: false
};
const modalReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_MODAL:
      return { ...state, getModalState: !payload };
    case SET_MODAL_TEXT:
      return { ...state, getModalText: !payload };
    default:
      return state;
  }
};
export default modalReducer;
