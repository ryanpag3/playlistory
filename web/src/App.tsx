import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory
} from 'react-router-dom';
import styled from 'styled-components';

import cookies from './util/cookies';
import CookieNames from './util/CookieNames';
import SignUpLogin from './screens/SignUpLogin';
import AccountLink from './screens/AccountLink';
import SpotifyRedirect from './screens/SpotifyRedirect';
import Home from './screens/Home';
import Playlist from './screens/Playlist';
import UpgradeAccount from './screens/UpgradeAccount';
import Settings from './screens/Settings';
import colors from './constants/colors';
import Error from './screens/Error';
import BackupReview from './screens/BackupReview';

function App() {
  const history = useHistory();

  function PrivateRoute({ children, ...rest }: any) {
    return (
      <Route {...rest} render={() => {
        if (cookies.get(CookieNames.TOKEN_EXISTS)) {
          return children;
        } else {
          history.replace('/login')
        }
      }} />
    )
  }

  return (
    <Switch>
      <Route path="/sign-up" children={<SignUpLogin formType="sign-up"/>}/>
      <Route path="/login" children={<SignUpLogin formType="login"/>}/>
      <Route path="/error" children={<Error/>}/>
      <PrivateRoute path="/backups" children={<BackupReview/>}/>
      <PrivateRoute path="/playlist/:id" children={<Playlist/>}/>
      <PrivateRoute path="/spotify" children={<SpotifyRedirect/>}/>
      <PrivateRoute path="/connections" children={<AccountLink/>}/>
      <PrivateRoute path="/upgrade" children={<UpgradeAccount/>}/>
      <PrivateRoute path="/settings" children={<Settings/>}/>
      <PrivateRoute path="/" children={<Home/>}/>
    </Switch>
  );
}

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  background-color: ${colors.DARK};
`;

export default App;
