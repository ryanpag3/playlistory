import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import cookiesNames from './constants/cookies-names';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import cookies from './util/cookies';

function App() {
  return (
    <Fragment>
      <Router>
        <Switch>
          <Route path="/" render={() => {
            if (cookies.get(cookiesNames.TOKEN_EXISTS)) {
              console.log('hello there');
            } else {
              console.log(JSON.stringify(cookies.getAll()));
              console.log('noooo!')
            }
            return <SignUp/>;
          }}/>
          <Route path="/sign-up" children={<SignUp/>}/>
          <Route path="/login" children={<Login/>}/>
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
