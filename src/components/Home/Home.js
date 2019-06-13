import React from 'react'

import Centered from '../../elements/Centered/Centered'

import styles from './Home.module.css'

const Home = () => (
  <main className={styles.Home}>
    <Centered className={styles.Message}>Welcome!</Centered>
  </main>
)

export default Home
