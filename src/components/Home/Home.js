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
      meta: { loading, error },
    },
    dispatch,
  ] = useApisInstance()

  useEffect(() => {
    if (!Object.keys(availableInstances).length && !loading && !error) {
      fetchApisInstances(dispatch)
    }
  }, [availableInstances, loading, error, dispatch])

  return (
    <main className={styles.Home}>
      <Centered className={styles.Message}>
        <div>Welcome!</div>
        <div>
          {loading ? 'Loading ...' : null}
          {Object.keys(availableInstances).length ? (
            <select
              onChange={event => {
                dispatch({
                  type: 'SELECT_INSTANCE',
                  payload: event.target.value,
                })
              }}
              value={selected}
            >
              <option>Select a APIS instance</option>
              {Object.entries(availableInstances).map(([id, instance]) => {
                return (
                  <option key={id} value={id}>
                    {instance.title}
                  </option>
                )
              })}
            </select>
          ) : null}
        </div>
      </Centered>
    </main>
  )
}

export default Home
