import React from 'react';
import './App.scss';

import {
  Navbar,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import { Helmet } from 'react-helmet';

import Card from './Card';
import NotFound from './NotFound';

const App = () => {

  return (
    <Router>
      <div>
        <Helmet defaultTitle="Add-on Card Preview" titleTemplate="%s - Add-on Card Preview" />
        <Navbar bg="dark" variant="dark">
          <LinkContainer to="/">
            <Navbar.Brand>Add-on Card Preview</Navbar.Brand>
          </LinkContainer>
        </Navbar>
        <Switch>
          <Route exact path="/:slug([\w-_. ]+)/" component={Card}/>
          <Route component={NotFound}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App
