import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import cookies from './util/cookies';
import CookieNames from './util/CookieNames';
import SignUpLogin from './screens/SignUpLogin';
import AccountLink from './screens/AccountLink';
import SpotifyRedirect from './screens/SpotifyRedirect';
import Home from './screens/Home';
import Playlist from './screens/Playlist';

function App() {
  return (
    <Fragment>
      <Router>
        <Switch>
          <Route path="/playlist/:id" children={<Playlist/>}/>
          <Route path="/spotify" children={<SpotifyRedirect/>}/>
          <Route path="/sign-up" children={<SignUpLogin formType="sign-up"/>}/>
          <Route path="/login" children={<SignUpLogin formType="login"/>}/>
          <Route path="/connections" children={<AccountLink/>}/>
          <Route path="/" render={() => {
            if (cookies.get(CookieNames.TOKEN_EXISTS)) {
              return <Home/>
            } else {
              return <SignUpLogin formType="login"/>;
            }
          }}/>
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
