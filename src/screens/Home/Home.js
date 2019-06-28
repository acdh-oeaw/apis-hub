import React, { useEffect } from 'react'

import {
  useApisInstance,
  fetchApisInstances,
} from '../../contexts/apis-instance'
import { useApiDispatch } from '../../contexts/api'

import Tile from '../../components/Tile/Tile'

import ACDHLogo from '../../elements/ACDHLogo/ACDHLogo'
import Centered from '../../elements/Centered/Centered'
import Spinner from '../../elements/Spinner/Spinner'

import styles from './Home.module.css'

const HomePage = ({ navigate }) => {
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
    <>
      <main className={styles.Home}>
        <Centered className={styles.Message}>
          <div className={styles.Block}>
            <div className={styles.Title}>Welcome!</div>
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
      <Footer />
    </>
  )
}

const Footer = () => (
  <footer>
    <div className={styles.FooterContainer}>
      <div>
        <h4>Contact</h4>
        <div>ACDH-ÖAW</div>
        <div>Austrian Centre for Digital Humanities</div>
        <div className={styles.Spacer}>Austrian Academy of Sciences</div>
        <div>Sonnenfelsgasse 19</div>
        <div className={styles.Spacer}>1010 Vienna</div>
        <div className={styles.Spacer}>T: +43 1 51581-2200</div>
        <div>
          E:{' '}
          <a href="mailto:acdh-helpdesk@oeaw.ac.at">
            acdh-helpdesk(at)oeaw.ac.at
          </a>
        </div>
      </div>
      <div>
        <a href="https://www.oeaw.ac.at/acdh/acdh-home/">
          <ACDHLogo color="var(--color-grey)" />
        </a>
      </div>
      <div>
        <h4>Helpdesk</h4>
        <div>
          ACDH runs a helpdesk offering advice for questions related to various
          digital humanities topics.
        </div>
        <a className={styles.Spacer} href="mailto:acdh-helpdesk@oeaw.ac.at">
          Ask us!
        </a>
      </div>
    </div>
  </footer>
)

export default HomePage
