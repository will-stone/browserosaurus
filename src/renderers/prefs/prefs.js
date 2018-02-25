import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { MemoryRouter } from 'react-router'

import { Route } from 'react-router-dom'

import NavBar from './components/NavBar'
import NavBarButton from './components/NavBarButton'
import TitleBar from './components/TitleBar'
import Tab from './components/Tab'

import Browsers from './tabs/Browsers'
import About from './tabs/About'

import WithBrowsers from '../shared/WithBrowsers'

ReactDOM.render(
  <MemoryRouter initialEntries={['/browsers']} initialIndex={0}>
    <WithBrowsers>
      {browsers => (
        <Fragment>
          <TitleBar>Preferences</TitleBar>

          <NavBar>
            <NavBarButton to="/browsers">Browsers</NavBarButton>
            <NavBarButton to="/about">About</NavBarButton>
          </NavBar>

          <Tab>
            <Route
              path="/browsers"
              render={routeProps => (
                <Browsers {...routeProps} browsers={browsers} />
              )}
            />
            <Route path="/about" component={About} />
          </Tab>
        </Fragment>
      )}
    </WithBrowsers>
  </MemoryRouter>,
  document.getElementById('root')
)
