import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
// Bootstrap imports
import { Modal, Button } from 'react-bootstrap';
// Redux
import { connect } from 'react-redux';
import { setModal, setModalText } from '../actions/modalAction';
import { Redirect } from 'react-router-dom';

const ModalGame = ({ getModalState, setModal, getScore, getModalText }) => {
  const [exit, setExit] = useState(false);
  if (exit) {
    setModal(getModalState);
    return <Redirect to='/' />;
  }

  return (
    <Fragment>
      <Modal show={getModalState} onHide={() => setModal(getModalState)}>
        <Modal.Header closeButton>
          <Modal.Title>Game over</Modal.Title>
        </Modal.Header>
        {!getModalText ? (
          <Fragment>
            <Modal.Body>Game Over. Your score is: {getScore} </Modal.Body>
          </Fragment>
        ) : (
          <Fragment>
            <Modal.Body>Draw</Modal.Body>
          </Fragment>
        )}
        <Modal.Footer>
          <Button onClick={() => setExit(true)} variant='secondary'>
            Exit
          </Button>
          <Button onClick={() => setModal(getModalState)} variant='primary'>
            Play again
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};
ModalGame.propType = {
  getModalState: PropTypes.bool.isRequired,
  setModal: PropTypes.func.isRequired,
  getScore: PropTypes.number.isRequired,
  getModalText: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
  getModalState: state.modalReducer.getModalState,
  getScore: state.gameReducer.getScore,
  setModalText: state.modalReducer.setModalText
});
export default connect(mapStateToProps, { setModal })(ModalGame);
