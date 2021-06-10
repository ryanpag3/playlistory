import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import GlobalStyle from './GlobalStyle';
import Login from './screens/Login';
import SignUp from './screens/SignUp';

function App() {
  return (
    <Fragment>
      <Router>
        <Switch>
          <Route path="/login" children={<Login/>}/>
          <Route path="/sign-up" children={<SignUp/>}/>
        </Switch>
      </Router>
    </Fragment>

  );
}

export default App;
