import React from 'react'
import { Router } from '@reach/router'

import { ApiProvider } from '../../contexts/api'
import {
  ApisInstanceProvider,
  useApisInstanceState,
} from '../../contexts/apis-instance'

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

import Home from '../Home/Home'
import Networks from '../Networks/Networks'

import Header from '../Header/Header'
import Logo from '../Logo/Logo'
import Nav from '../Nav/Nav'

import styles from './App.module.css'

const Providers = ({ children }) => (
  <ApisInstanceProvider>
    <ApiProvider>{children}</ApiProvider>
  </ApisInstanceProvider>
)

const Layout = () => {
  const { availableInstances, selected } = useApisInstanceState()
  const apisInstance = selected ? availableInstances[selected] : null

  return (
    <div className={styles.App}>
      <Header className={styles.Header}>
        <Logo />
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
          {apisInstance ? <Networks path="/networks" /> : null}
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
