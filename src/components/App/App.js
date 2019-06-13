import React from 'react'
import { Router } from '@reach/router'

import { ApiProvider } from '../../contexts/api'

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

import Home from '../Home/Home'
import Networks from '../Networks/Networks'

import Header from '../Header/Header'
import Logo from '../Logo/Logo'
import Nav from '../Nav/Nav'

import styles from './App.module.css'

const App = () => (
  <ApiProvider>
    <div className={styles.App}>
      <Header className={styles.Header}>
        <Logo />
        <Nav links={[['Home', '/'], ['Networks', '/networks']]} />
      </Header>
      <ErrorBoundary>
        <Router className={styles.Main}>
          <Home path="/" />
          <Networks path="/networks" />
        </Router>
      </ErrorBoundary>
    </div>
  </ApiProvider>
)
export default App
