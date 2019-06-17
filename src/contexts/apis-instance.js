import React, { createContext, useContext, useReducer } from 'react'

import { APIS_APP_REG_ENDPOINT } from '../constants'

const ApisInstanceStateContext = createContext()
const SetApisInstanceContext = createContext()

const defaultLimit = 1000

const initialState = {
  availableInstances: {},
  selected: undefined,
  meta: {
    loading: false,
    error: null,
  },
}

const actions = {
  SET_AVAILABLE_INSTANCES: 'SET_AVAILABLE_INSTANCES',
  SET_AVAILABLE_INSTANCES_PENDING: 'SET_AVAILABLE_INSTANCES_PENDING',
  SET_AVAILABLE_INSTANCES_ERROR: 'SET_AVAILABLE_INSTANCES_ERROR',
  SELECT_INSTANCE: 'SELECT_INSTANCE',
}

const apisReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_AVAILABLE_INSTANCES: {
      return {
        ...state,
        availableInstances: action.payload.reduce((acc, instance) => {
          acc[instance.app_id] = {
            ...instance,
            basePath: instance.app_url,
            defaultLimit,
          }
          return acc
        }, {}),
        meta: {
          loading: false,
          error: null,
        },
      }
    }
    case actions.SET_AVAILABLE_INSTANCES_PENDING: {
      return {
        ...state,
        meta: {
          loading: true,
          error: null,
        },
      }
    }
    case actions.SET_AVAILABLE_INSTANCES_ERROR: {
      const error = action.payload
      return {
        ...state,
        meta: {
          loading: false,
          error,
        },
      }
    }
    case actions.SELECT_INSTANCE: {
      return {
        ...state,
        selected: action.payload,
      }
    }
    default:
      throw new Error(`Unrecognized action type ${action.type}`)
  }
}

export const ApisInstanceProvider = ({ children }) => {
  const [apisInstances, dispatch] = useReducer(apisReducer, initialState)
  return (
    <ApisInstanceStateContext.Provider value={apisInstances}>
      <SetApisInstanceContext.Provider value={dispatch}>
        {children}
      </SetApisInstanceContext.Provider>
    </ApisInstanceStateContext.Provider>
  )
}

export const useApisInstanceState = () => {
  const context = useContext(ApisInstanceStateContext)

  if (context === undefined) {
    throw new Error(
      'useApisInstanceState must be nested in an ApisInstanceProvider.'
    )
  }

  return context
}

export const useSetApisInstance = () => {
  const context = useContext(SetApisInstanceContext)

  if (context === undefined) {
    throw new Error(
      'useApisInstanceState must be nested in an ApisInstanceProvider.'
    )
  }

  return context
}

export const useApisInstance = () => {
  return [useApisInstanceState(), useSetApisInstance()]
}

export const fetchApisInstances = async dispatch => {
  dispatch({ type: actions.SET_AVAILABLE_INSTANCES_PENDING })

  try {
    const results = await fetch(APIS_APP_REG_ENDPOINT)
    const data = await results.json()
    dispatch({ type: actions.SET_AVAILABLE_INSTANCES, payload: data })
  } catch (error) {
    dispatch({
      type: actions.SET_AVAILABLE_INSTANCES_ERROR,
      error: true,
      payload: error,
    })
  }
}
