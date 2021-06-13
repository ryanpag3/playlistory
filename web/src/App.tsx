import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Login from './screens/Login';
import SignUpLogin from './screens/SignUpLogin';
import cookies from './util/cookies';
import CookieNames from 'shared/src/CookieNames';

function App() {
  return (
    <Fragment>
      <Router>
        <Switch>
          <Route path="/" render={() => {
            if (cookies.get(CookieNames.TOKEN_EXISTS)) {
              console.log('hello there');
            } else {
              console.log('noooo!')
            }
            return <SignUpLogin/>;
          }}/>
          <Route path="/sign-up" children={<SignUpLogin/>}/>
          <Route path="/login" children={<Login/>}/>
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
