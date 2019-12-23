import { SET_MODAL, SET_MODAL_TEXT } from './typeAction';
export const setModal = modal => dispatch => {
  dispatch({
    type: SET_MODAL,
    payload: modal
  });
};
export const setModalText = modalState => dispatch => {
  dispatch({
    type: SET_MODAL_TEXT,
    payload: modalState
  });
};
