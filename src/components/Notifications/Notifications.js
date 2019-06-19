import React from 'react'

import { useApi, fetchRelations } from '../../contexts/api'
import { useApisInstanceState } from '../../contexts/apis-instance'
import { useUserState } from '../../contexts/user'

import Button from '../../elements/Button/Button'

import styles from './Notifications.module.css'

const Notifications = () => {
  const [
    {
      relations: {
        meta: { notification, offset },
      },
    },
    dispatch,
  ] = useApi()
  const { availableInstances, selected } = useApisInstanceState()
  const apisInstance = availableInstances[selected]

  const user = useUserState()
  const currentUser = user[selected]

  return notification ? (
    <div className={styles.Notification}>
      <span>{notification.message}</span>
      <Button
        className={styles.Button}
        onClick={() => {
          const {
            from,
            to,
            relationType,
            sourceEntity,
            targetEntity,
          } = notification
          fetchRelations({
            apisInstance,
            dispatch,
            from,
            to,
            offset,
            relationType,
            sourceEntity,
            targetEntity,
            user: currentUser,
          })
          dispatch({ type: `CLEAR_POST_LOAD_RELATIONS_NOTIFICATION` })
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
