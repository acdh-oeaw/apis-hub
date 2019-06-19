import React, { createContext, useContext, useReducer } from 'react'

const UserStateContext = createContext()
const UserDispatchContext = createContext()

export const actions = {
  LOGIN_USER: 'LOGIN_USER',
  LOGIN_USER_PENDING: 'LOGIN_USER_PENDING',
  LOGIN_USER_ERROR: 'LOGIN_USER_ERROR',
}

const initialState = {
  meta: {
    loading: false,
    error: null,
  },
}

const userReducer = (state, action) => {
  switch (action.type) {
    case actions.LOGIN_USER: {
      const { username, password } = action.payload
      const instance = action.meta
      return {
        ...state,
        [instance.app_id]: {
          username,
          password,
        },
        meta: {
          loading: false,
          error: null,
        },
      }
    }
    case actions.LOGIN_USER_PENDING: {
      return {
        ...state,
        meta: {
          loading: true,
          error: null,
        },
      }
    }
    case actions.LOGIN_USER_ERROR: {
      const error = action.payload
      return {
        ...state,
        meta: {
          loading: false,
          error,
        },
      }
    }

    default:
      throw new Error(`Unrecognized action type ${action.type}`)
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  )
}

export const useUserState = () => {
  const context = useContext(UserStateContext)

  if (context === undefined) {
    throw new Error('useUserState must be nested in an UserProvider')
  }

  return context
}

export const useUserDispatch = () => {
  const context = useContext(UserDispatchContext)

  if (context === undefined) {
    throw new Error('useUserDispatch must be nested in an UserProvider')
  }

  return context
}

export const useUser = () => {
  return [useUserState(), useUserDispatch()]
}

// We don't really log a user in, we just check if the provided user data
// works with Basic Auth on the APIS instance, i.e. does not return 401
export const loginUser = async (dispatch, user, instance) => {
  dispatch({ type: actions.LOGIN_USER_PENDING })

  try {
    // Check if the APIS instance base path returns 401
    const url = instance.app_url + 'apis/api/'
    // We don't provide auth headers when checking if the instance endpoint is public
    const headers = user && {
      Authorization: 'Basic ' + btoa(user.username + ':' + user.password),
    }
    const results = await fetch(url, {
      headers,
    })
    if (!results.ok) {
      throw new Error(`${results.status}: ${results.statusText}`)
    } else {
      dispatch({ type: actions.LOGIN_USER, payload: user, meta: instance })
    }
  } catch (error) {
    dispatch({ type: actions.LOGIN_USER_ERROR, error: true, payload: error })
  }
}
