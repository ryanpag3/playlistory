import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import Login from './screens/Login';

function App() {
  return (
    <Router>
      <Route path="/login" children={<Login/>}/>
    </Router>
  );
}

export default App;
