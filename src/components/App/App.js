import React from 'react'
import { Router } from '@reach/router'

import { ApiProvider } from '../../contexts/api'
import {
  ApisInstanceProvider,
  useApisInstanceState,
} from '../../contexts/apis-instance'
import { useUserState, UserProvider } from '../../contexts/user'

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

import Home from '../Home/Home'
import Networks from '../Networks/Networks'

import Header from '../Header/Header'
import Login from '../Login/Login'
import Logo from '../Logo/Logo'
import Nav from '../Nav/Nav'

import styles from './App.module.css'

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
              ? [['Home', '/'], ['Networks', '/networks']]
              : [['Home', '/']]
          }
        />
      </Header>
      <ErrorBoundary>
        <Router className={styles.Main}>
          <Home path="/" default />
          {apisInstance ? (
            <ProtectedRoute
              path="/networks"
              component={Networks}
              instance={apisInstance}
            />
          ) : null}
        </Router>
      </ErrorBoundary>
    </div>
  )
}

const App = () => (
  <Providers>
    <Layout />
  </Providers>
)

export default App
