import React from 'react'
import { Router, LocationProvider, createHistory } from '@reach/router'
import Matomo from 'react-piwik'

import { ApiProvider } from '../../contexts/api'
import {
  ApisInstanceProvider,
  useApisInstanceState,
} from '../../contexts/apis-instance'
import { useUserState, UserProvider } from '../../contexts/user'

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

import AboutPage from '../../screens/About/About'
import HomePage from '../../screens/Home/Home'
import ImprintPage from '../../screens/Imprint/Imprint'
import NetworksPage from '../../screens/Networks/Networks'

import Header from '../Header/Header'
import Login from '../Login/Login'
import Logo from '../Logo/Logo'
import Nav from '../Nav/Nav'

import styles from './App.module.css'

import { MATOMO_ENDPOINT, MATOMO_ID } from '../../constants'

// TODO: Roll our own
const matomo = new Matomo({
  url: MATOMO_ENDPOINT,
  phpFilename: 'matomo.php',
  jsFilename: 'matomo.js',
  siteId: MATOMO_ID,
  trackErrors: true,
})
const matomoHistory = createHistory(window)
matomoHistory.listen(({ location }) => {
  console.info('[tracked event] Route change', location)
  matomo.track(location)
})

const ProtectedRoute = ({ component: Component, instance }) => {
  const user = useUserState()

  return instance.public === 'public' || user[instance.app_id] ? (
    <Component />
  ) : (
    <Login instance={instance} />
  )
}

const Providers = ({ children }) => (
  <ApisInstanceProvider>
    <UserProvider>
      <ApiProvider>{children}</ApiProvider>
    </UserProvider>
  </ApisInstanceProvider>
)

const Layout = () => {
  const user = useUserState()
  const { availableInstances, selected } = useApisInstanceState()

  const apisInstance = selected ? availableInstances[selected] : null
  const currentUser = selected && user[selected] && user[selected].username

  return (
    <div className={styles.App}>
      <Header className={styles.Header}>
        <Logo />
        <div>
          {apisInstance && (
            <span className={styles.HeaderInfo}>{apisInstance.title}</span>
          )}
          {currentUser && (
            <span className={styles.HeaderInfo}>
              &nbsp;&nbsp;|&nbsp;&nbsp;{currentUser}
            </span>
          )}
        </div>
        <Nav
          links={
            apisInstance
              ? [
                  ['Home', '/'],
                  ['Networks', '/networks'],
                  ['About', '/about'],
                  ['Imprint', '/imprint'],
                ]
              : [['Home', '/'], ['About', '/about'], ['Imprint', '/imprint']]
          }
        />
      </Header>
      <ErrorBoundary>
        <Router className={styles.Main}>
          <HomePage path="/" default />
          {apisInstance ? (
            <ProtectedRoute
              path="/networks"
              component={NetworksPage}
              instance={apisInstance}
            />
          ) : null}
          <AboutPage path="/about" />
          <ImprintPage path="/imprint" />
        </Router>
      </ErrorBoundary>
    </div>
  )
}

const App = () => (
  <Providers>
    <LocationProvider history={matomoHistory}>
      <Layout />}
    </LocationProvider>
  </Providers>
)

export default App
