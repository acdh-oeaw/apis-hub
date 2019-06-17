import React, { useEffect } from 'react'

import {
  useApisInstance,
  fetchApisInstances,
} from '../../contexts/apis-instance'

import Centered from '../../elements/Centered/Centered'

import styles from './Home.module.css'

const Home = () => {
  const [
    {
      availableInstances,
      selected,
      meta: { loading },
    },
    dispatch,
  ] = useApisInstance()

  useEffect(() => {
    if (!Object.keys(availableInstances).length && !loading) {
      fetchApisInstances(dispatch)
    }
  }, [availableInstances, loading, dispatch])

  return (
    <main className={styles.Home}>
      <Centered className={styles.Message}>
        <div>Welcome!</div>
        {Object.keys(availableInstances).length ? (
          <select
            onChange={value => {
              console.log(value)
            }}
            value={selected}
          >
            {Object.entries(availableInstances).map(([id, instance]) => {
              return (
                <option key={id} value={id}>
                  {instance.title}
                </option>
              )
            })}
          </select>
        ) : null}
      </Centered>
    </main>
  )
}

export default Home
