import React, { Component } from 'react';
// Components
import GameArea from './components/GameArea';
import GameNav from './components/GameNav';
import MainPage from './components/MainPage';
// React router dom
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// Redux
import { Provider } from 'react-redux';
import store from './store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className='App'>
            <GameNav />
            <Switch>
              <Route path='/' component={MainPage} exact />
              <Route path='/GameArea' component={GameArea} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
