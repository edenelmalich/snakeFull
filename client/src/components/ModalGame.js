import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
// Bootstrap imports
import { Modal } from 'react-bootstrap';
// Redux
import { connect } from 'react-redux';
import { setModal } from '../actions/modalAction';
import { setScore, setEnemyScore } from '../actions/gameAction';
import { Redirect } from 'react-router-dom';

const ModalGame = ({
  getModalState,
  setModal,
  getScore,
  getModalText,
  getEnemyScore,
  setScore,
  setEnemyScore
}) => {
  const [exit, setExit] = useState(false);

  const onHide = () => {
    setExit(true);
  };
  if (exit) {
    return <Redirect to='/' />;
  }
  return (
    <Fragment>
      <Modal show={getModalState} onHide={() => onHide()}>
        <Modal.Header closeButton>
          <Modal.Title>Game over</Modal.Title>
        </Modal.Header>
        {!getModalText ? (
          <Fragment>
            <Modal.Body>
              {getScore > getEnemyScore ? (
                <Fragment>
                  You Win. Your score is: {getScore}
                  {() => setExit(true)}
                </Fragment>
              ) : null}
              {getScore < getEnemyScore ? (
                <Fragment>
                  <Modal.Body>You Lose. Your score is: {getScore}</Modal.Body>
                </Fragment>
              ) : null}

              {getScore === getEnemyScore ? (
                <Fragment>
                  <Modal.Body>Draw</Modal.Body>
                </Fragment>
              ) : null}
            </Modal.Body>
          </Fragment>
        ) : (
          <Fragment>
            <Modal.Body>Draw</Modal.Body>
          </Fragment>
        )}
      </Modal>
    </Fragment>
  );
};
ModalGame.propType = {
  getModalState: PropTypes.bool.isRequired,
  setModal: PropTypes.func.isRequired,
  getScore: PropTypes.number.isRequired,
  getEnemyScore: PropTypes.number.isRequired,
  getModalText: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
  getModalState: state.modalReducer.getModalState,
  getScore: state.gameReducer.getScore,
  getEnemyScore: state.gameReducer.getEnemyScore,
  setModalText: state.modalReducer.setModalText
});
export default connect(mapStateToProps, { setModal, setEnemyScore, setScore })(
  ModalGame
);
