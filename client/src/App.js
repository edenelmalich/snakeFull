import React, { Component } from 'react';
// Components
import GameArea from './components/GameArea';
import GameNav from './components/GameNav';
import MainPage from './components/MainPage';
import FinishGame from './components/FinishGame';
// React router dom
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient.connect('http://localhost:4000', {
  reconnection: true
});
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className='App'>
            <GameNav />
            <Switch>
              <Route
                path='/'
                render={props => <MainPage socket={socket} {...props} />}
                exact
              />
              <Route
                path='/GameArea'
                render={props => <GameArea socket={socket} {...props} />}
              />
              <Route
                path='/FinishGame'
                render={props => <FinishGame socket={socket} {...props} />}
              />
            </Switch>
            /
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
