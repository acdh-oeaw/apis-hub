import React from 'react'

import { useApi, fetchRelations } from '../../contexts/api'

import Button from '../../elements/Button/Button'

import styles from './Notifications.module.css'

const Notifications = () => {
  const [
    {
      relations: {
        meta: { notification },
      },
    },
    dispatch,
  ] = useApi()

  return notification ? (
    <div className={styles.Notification}>
      <span>{notification.message}</span>
      <Button
        className={styles.Button}
        onClick={() => {
          const { from, to, offset } = notification
          dispatch({ type: `CLEAR_POST_LOAD_RELATIONS_NOTIFICATION` })
          fetchRelations(dispatch, from, to, offset)
        }}
      >
        Yes
      </Button>
      <Button
        className={styles.Button}
        onClick={() => {
          dispatch({ type: `CLEAR_POST_LOAD_RELATIONS_NOTIFICATION` })
        }}
      >
        No
      </Button>
    </div>
  ) : null
}

export default Notifications
