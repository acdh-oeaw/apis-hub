import React, { useEffect } from 'react'
import { navigate } from '@reach/router'

import {
  useApisInstance,
  fetchApisInstances,
} from '../../contexts/apis-instance'
import { useApiDispatch } from '../../contexts/api'

import Tile from '../Tile/Tile'

import Centered from '../../elements/Centered/Centered'
import Spinner from '../../elements/Spinner/Spinner'

import styles from './Home.module.css'

const Home = () => {
  const [
    {
      availableInstances,
      meta: { loading, error },
    },
    dispatch,
  ] = useApisInstance()
  const dispatchRelations = useApiDispatch()

  useEffect(() => {
    if (!Object.keys(availableInstances).length && !loading && !error) {
      fetchApisInstances(dispatch)
    }
  }, [availableInstances, loading, error, dispatch])

  return (
    <main className={styles.Home}>
      <Centered className={styles.Message}>
        <div className={styles.Block}>
          <div>Welcome!</div>
          {loading ? (
            <div className={styles.Spinner}>
              <Spinner width="1em" />
            </div>
          ) : null}
          {Object.keys(availableInstances).length ? (
            <div className={styles.Tiles}>
              {Object.values(availableInstances).map(instance => (
                <Tile
                  className={styles.Tile}
                  key={instance.app_id}
                  {...instance}
                  onClick={() => {
                    dispatchRelations({
                      type: 'CLEAR_EVERYTHING',
                    })
                    dispatch({
                      type: 'SELECT_INSTANCE',
                      payload: instance.app_id,
                    })
                    navigate('/networks')
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </Centered>
    </main>
  )
}

export default Home
