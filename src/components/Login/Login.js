import React, { useState } from 'react'

import { useUser, loginUser } from '../../contexts/user'

import Button from '../../elements/Button/Button'
import Centered from '../../elements/Centered/Centered'

import styles from './Login.module.css'

const Login = ({ instance }) => {
  const [
    {
      meta: { error },
    },
    dispatch,
  ] = useUser()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <Centered>
      <div>
        <h1>Login</h1>
        {error && <div className={styles.Error}>{error.message}</div>}
        <form
          className={styles.LoginForm}
          onSubmit={event => {
            event.preventDefault()
            const user = {
              username,
              password,
            }
            loginUser(dispatch, user, instance)
          }}
        >
          <label>
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={event => setUsername(event.target.value)}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </label>
          <Button type="submit">Login</Button>
        </form>
      </div>
    </Centered>
  )
}

export default Login
