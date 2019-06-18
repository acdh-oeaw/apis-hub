import React, { useEffect } from 'react'
import { navigate } from '@reach/router'

import {
  useApisInstance,
  fetchApisInstances,
} from '../../contexts/apis-instance'
import { useApiDispatch } from '../../contexts/api'

import Button from '../../elements/Button/Button'
import Centered from '../../elements/Centered/Centered'
import Select from '../../elements/Select/Select'
import Spinner from '../../elements/Spinner/Spinner'

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
  const dispatchRelations = useApiDispatch()

  const apisInstance = availableInstances[selected]

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
          <div className={styles.Select}>
            {loading ? <Spinner width="1em" /> : null}
            {Object.keys(availableInstances).length ? (
              <Select
                onSelect={event => {
                  dispatchRelations({
                    type: 'CLEAR_RELATIONS',
                  })
                  dispatch({
                    type: 'SELECT_INSTANCE',
                    payload: event.target.value,
                  })
                }}
                selected={selected}
                getLabel={o => o.title}
                options={[
                  { id: 0, title: 'Select an APIS instance' },
                  ...Object.entries(availableInstances).map(
                    ([id, instance]) => ({ id, title: instance.title })
                  ),
                ]}
              />
            ) : null}
          </div>
          {apisInstance ? (
            <Button onClick={() => navigate('/networks')}>Select</Button>
          ) : null}
        </div>
      </Centered>
    </main>
  )
}

export default Home
