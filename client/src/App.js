import React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import Board from './components/Board';
import Homepage from './components/Homepage';

const App = () => (
  <div>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/board" component={Board} />
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;
