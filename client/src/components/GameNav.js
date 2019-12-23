import React, { Fragment } from 'react';
import { Navbar } from 'react-bootstrap';
const GameNav = () => {
  return (
    <Fragment>
      <Navbar bg='dark' variant='dark'>
        <Navbar.Brand href='#home'>Snake Game</Navbar.Brand>
      </Navbar>
    </Fragment>
  );
};
export default GameNav;
