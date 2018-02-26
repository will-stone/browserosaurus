import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { MemoryRouter } from 'react-router'

import { Route } from 'react-router-dom'

import App from '../components/App'
import NavBar from '../components/NavBar'
import NavBarButton from '../components/NavBarButton'
import TitleBar from '../components/TitleBar'
import Tab from '../components/Tab'

import WithBrowsers from '../utils/WithBrowsers'

import Browsers from './tabs/Browsers'
import About from './tabs/About'

ReactDOM.render(
  <MemoryRouter initialEntries={['/browsers']} initialIndex={0}>
    <App>
      <WithBrowsers>
        {({ browsers, state }, onRescan) => (
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
                  <Browsers
                    {...routeProps}
                    browsers={browsers}
                    state={state}
                    onRescan={onRescan}
                  />
                )}
              />
              <Route path="/about" component={About} />
            </Tab>
          </Fragment>
        )}
      </WithBrowsers>
    </App>
  </MemoryRouter>,
  document.getElementById('prefs-root')
)
