import React, { createContext, useContext, useReducer } from 'react'

import { createApi, entities, handleReverse } from '../utils/api'

const ApiStateContext = createContext()
const ApiDispatchContext = createContext()

export const actions = {
  SET_AUTOCOMPLETE: 'SET_AUTOCOMPLETE',
  SET_AUTOCOMPLETE_PENDING: 'SET_AUTOCOMPLETE_PENDING',
  SET_AUTOCOMPLETE_ERROR: 'SET_AUTOCOMPLETE_ERROR',

  SET_ENTITY_DETAILS: 'SET_ENTITY_DETAILS',
  SET_ENTITY_DETAILS_PENDING: 'SET_ENTITY_DETAILS_PENDING',
  SET_ENTITY_DETAILS_ERROR: 'SET_ENTITY_DETAILS_ERROR',

  SET_ENTITIES: 'SET_ENTITIES',
  SET_ENTITIES_PENDING: 'SET_ENTITIES_PENDING',
  SET_ENTITIES_ERROR: 'SET_ENTITIES_ERROR',

  CLEAR_RELATIONS: 'CLEAR_RELATIONS',
  SET_RELATIONS: 'SET_RELATIONS',
  SET_RELATIONS_PENDING: 'SET_RELATIONS_PENDING',
  SET_RELATIONS_ERROR: 'SET_RELATIONS_ERROR',
  SET_POST_LOAD_RELATIONS_NOTIFICATION: 'SET_POST_LOAD_RELATIONS_NOTIFICATION',
  CLEAR_POST_LOAD_RELATIONS_NOTIFICATION:
    'CLEAR_POST_LOAD_RELATIONS_NOTIFICATION',

  SET_RELATION_TYPES: 'SET_RELATION_TYPES',
  SET_RELATION_TYPES_PENDING: 'SET_RELATION_TYPES_PENDING',
  SET_RELATION_TYPES_ERROR: 'SET_RELATION_TYPES_ERROR',
}

const createRelationsMap = entities =>
  entities.reduce((acc, from) => {
    acc[from] = entities.reduce((acc, to) => {
      acc[to] = null
      return acc
    }, {})
    return acc
  }, {})

const initialState = {
  autoComplete: {
    byEntityType: entities.reduce((acc, type) => {
      acc[type] = null // FIXME: We should probably not fetch all autocompletes per entity type in one go
      return acc
    }, {}),
    meta: {
      isLoading: false,
      error: null,
    },
  },
  entities: {
    byId: {},
    ids: [],
    meta: {
      isLoading: false,
      error: null,
    },
  },
  entityDetails: {
    byId: {},
    ids: [],
    meta: {
      isLoading: 0,
      error: null,
    },
  },
  relations: {
    byId: {},
    ids: [],
    meta: {
      isLoading: false,
      error: null,
    },
  },
  relationTypes: {
    byId: {},
    ids: [],
    // Remember when looking those up we need to check
    // `relations[from][to]` whether to use `name_reverse` or `name`
    byEntityType: createRelationsMap(entities),
    meta: {
      isLoading: false,
      error: null,
    },
  },
}

// FIXME: This should not be necessary with upstream api changes
const normalizeEntityDetailsRelations = (relation, source) => {
  return normalizeRelation(
    {
      ...relation,
      target: { ...relation.target, label: relation.target.name },
      source,
    },
    source.entity_type,
    relation.target.entity_type
  )
}

// FIXME: in relations, we shoud get the relation_type.id; and we want the relation's start and end date;
// and the target should have label instead of name
const normalizeEntityDetails = entityDetails => {
  const {
    id,
    name,
    start_date,
    end_date,
    entity_type,
    uris,
    labels,
    relations,
  } = entityDetails
  const source = { id, label: name, type: entity_type }
  return {
    id,
    label: name,
    startDate: start_date,
    endDate: end_date,
    type: entity_type,
    uris: uris.map(({ uri }) => uri),
    alternativeNames: labels.map(({ label }) => label), // FIXME: are labels always alternative names?
    // TODO: Make more generic (don't use explicit entity types)
    relations: {
      Event: relations.events.map(relation =>
        normalizeEntityDetailsRelations(relation, source)
      ),
      Institution: relations.institutions.map(relation =>
        normalizeEntityDetailsRelations(relation, source)
      ),
      Person: relations.persons.map(relation =>
        normalizeEntityDetailsRelations(relation, source)
      ),
      Place: relations.places.map(relation =>
        normalizeEntityDetailsRelations(relation, source)
      ),
      Work: relations.works.map(relation =>
        normalizeEntityDetailsRelations(relation, source)
      ),
    },
  }
}

// const normalizeEntity = entity => entity

// TODO: We need to preserve the source/target entity type,
// because the response does not include them!
// FIXME: This should be included in the response really!
const normalizeRelation = (relation, from, to) => {
  const { id, source, target, relation_type, start_date, end_date } = relation
  return {
    id,
    source: {
      id: source.id,
      label: source.label,
      type: from,
    },
    target: {
      id: target.id,
      label: target.label,
      type: to,
    },
    type: {
      id: relation_type.id,
      label: relation_type.label,
    },
    startDate: start_date,
    endDate: end_date,
  }
}

const normalizeRelationType = relationType => relationType

// TODO: Cleanup!
const apiReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_ENTITY_DETAILS: {
      const result = action.payload

      const { byId, ids } = state.entityDetails
      const newById = {}
      const newIds = []

      const { id } = result
      if (!byId[id]) {
        newById[id] = normalizeEntityDetails(result)
        newIds.push(id)
      }

      return {
        ...state,
        entityDetails: {
          ...state.entityDetails,
          byId: { ...byId, ...newById },
          ids: [...ids, ...newIds],
          meta: {
            isLoading: state.entityDetails.meta.isLoading - 1,
            error: null,
          },
        },
      }
    }
    case actions.SET_ENTITY_DETAILS_PENDING: {
      return {
        ...state,
        entityDetails: {
          ...state.entityDetails,
          meta: {
            isLoading: state.entityDetails.meta.isLoading + 1,
            error: null,
          },
        },
      }
    }
    case actions.SET_ENTITY_DETAILS_ERROR: {
      const error = action.payload
      return {
        ...state,
        entityDetails: {
          ...state.entityDetails,
          meta: {
            isLoading: state.entityDetails.meta.isLoading - 1,
            error,
          },
        },
      }
    }

    case actions.SET_ENTITIES: {
      return state
    }
    case actions.SET_ENTITIES_PENDING: {
      return state
    }
    case actions.SET_ENTITIES_ERROR: {
      return state
    }

    case actions.CLEAR_RELATIONS: {
      return {
        ...state,
        relations: {
          ...initialState.relations,
        },
      }
    }
    case actions.SET_RELATIONS: {
      const { results } = action.payload
      const { source, target } = action.meta

      const { byId, ids } = state.relations
      const newById = {}
      const newIds = []

      results.forEach(result => {
        const { id } = result
        if (!byId[id]) {
          // This should not happen - but it does, at least with apis-dev
          if (!result.source || !result.target) {
            console.error(
              `You tried adding an edge without source or target. Edge ID: ${id}.`
            )
            return
          }
          newById[id] = normalizeRelation(result, source, target)
          newIds.push(id)
        }
      })

      return {
        ...state,
        relations: {
          ...state.relations,
          byId: { ...byId, ...newById },
          ids: [...ids, ...newIds],
          meta: {
            isLoading: false,
            error: null,
          },
        },
      }
    }
    case actions.SET_RELATIONS_PENDING: {
      return {
        ...state,
        relations: {
          ...state.relations,
          meta: {
            isLoading: true,
            error: null,
          },
        },
      }
    }
    case actions.SET_RELATIONS_ERROR: {
      const error = action.payload
      return {
        ...state,
        relations: {
          ...state.relations,
          meta: {
            isLoading: false,
            error,
          },
        },
      }
    }
    case actions.SET_POST_LOAD_RELATIONS_NOTIFICATION: {
      const { defaultLimit } = action.meta
      return {
        ...state,
        relations: {
          ...state.relations,
          meta: {
            ...state.relations.meta,
            notification: {
              ...action.payload,
              offset:
                ((state.relations.meta.notification &&
                  state.relations.meta.notification.offset) ||
                  0) + defaultLimit,
            },
          },
        },
      }
    }
    case actions.CLEAR_POST_LOAD_RELATIONS_NOTIFICATION: {
      return {
        ...state,
        relations: {
          ...state.relations,
          meta: {
            ...state.relations.meta,
            notification: null,
          },
        },
      }
    }

    case actions.SET_RELATION_TYPES: {
      const { results } = action.payload
      const { source, target } = action.meta

      const { byId, ids, byEntityType } = state.relationTypes
      const newById = {}
      const newIds = []

      results.forEach(result => {
        const { id } = result
        if (!byId[id]) {
          newById[id] = normalizeRelationType(result)
          newIds.push(id)
        }
      })

      // targetDO: Use `immer` for this abomination
      return {
        ...state,
        relationTypes: {
          ...state.relationTypes,
          byId: { ...byId, ...newById },
          ids: [...ids, ...newIds],
          byEntityType: {
            ...byEntityType,
            [source]: {
              ...byEntityType[source],
              // [target]: [...byEntityType[source][target], ...newIds],
              [target]: [...newIds],
            },
            [target]: {
              ...byEntityType[target],
              // [source]: [...byEntityType[target][source], ...newIds],
              [source]: [...newIds],
            },
          },
          meta: {
            isLoading: false,
            error: null,
          },
        },
      }
    }
    case actions.SET_RELATION_TYPES_PENDING: {
      return {
        ...state,
        relationTypes: {
          ...state.relationTypes,
          meta: {
            isLoading: true,
            error: null,
          },
        },
      }
    }
    case actions.SET_RELATION_TYPES_ERROR: {
      const error = action.payload
      return {
        ...state,
        relationTypes: {
          ...state.relationTypes,
          meta: {
            isLoading: false,
            error,
          },
        },
      }
    }

    case actions.SET_AUTOCOMPLETE: {
      const { results } = action.payload
      const { type } = action.meta
      return {
        ...state,
        autoComplete: {
          ...state.autoComplete,
          byEntityType: {
            ...state.autoComplete.byEntityType,
            [type]: results,
          },
          meta: {
            isLoading: false,
            error: null,
          },
        },
      }
    }
    case actions.SET_AUTOCOMPLETE_PENDING: {
      return {
        ...state,
        autoComplete: {
          ...state.autoComplete,
          meta: {
            isLoading: true,
            error: null,
          },
        },
      }
    }
    case actions.SET_AUTOCOMPLETE_ERROR: {
      const error = action.payload
      return {
        ...state,
        autoComplete: {
          ...state.autoComplete,
          meta: {
            isLoading: false,
            error,
          },
        },
      }
    }

    default:
      throw new Error(`Unrecognized action type: ${action.type}.`)
    // return state
  }
}

export const ApiProvider = ({ children }) => {
  const [state, dispatch] = useReducer(apiReducer, initialState)

  return (
    <ApiStateContext.Provider value={state}>
      <ApiDispatchContext.Provider value={dispatch}>
        {children}
      </ApiDispatchContext.Provider>
    </ApiStateContext.Provider>
  )
}

export const useApiState = () => {
  const context = useContext(ApiStateContext)

  if (context === undefined) {
    throw new Error('useApiState must be nested in an ApiProvider.')
  }

  return context
}

export const useApiDispatch = () => {
  const context = useContext(ApiDispatchContext)

  if (context === undefined) {
    throw new Error('useApiDispatch must be nested in an ApiProvider.')
  }

  return context
}

export const useApi = () => {
  return [useApiState(), useApiDispatch()]
}

// For use in class components
export const ApiConsumer = ({ children }) => {
  return (
    <ApiStateContext.Consumer>
      {state => (
        <ApiDispatchContext.Consumer>
          {dispatch => children(state, dispatch)}
        </ApiDispatchContext.Consumer>
      )}
    </ApiStateContext.Consumer>
  )
}

// FIXME: Should we return this in useApi directly?
// TODO: Why not get dispatch directly from context? And make this useEntityDetails (which will fetch if it does not have a cached version)
// TODO: We don't need this at all if we use `useAsync` (with onResolve/onReject)
// TODO: extend Error constructor
export const fetchEntityDetails = async (apisInstance, dispatch, id) => {
  const { basePath, authToken, defaultLimit } = apisInstance
  const Api = createApi({ basePath, authToken, defaultLimit })

  dispatch({ type: actions.SET_ENTITY_DETAILS_PENDING })

  try {
    const data = await Api.getEntityDetails(id)
    dispatch({ type: actions.SET_ENTITY_DETAILS, payload: data })
  } catch (error) {
    dispatch({
      type: actions.SET_ENTITY_DETAILS_ERROR,
      payload: error,
      error: true,
    })
  }
}

export const fetchRelations = async ({
  apisInstance,
  dispatch,
  from,
  to,
  offset,
  relationType,
  sourceEntity,
  targetEntity,
}) => {
  const { basePath, authToken, defaultLimit } = apisInstance
  const Api = createApi({ basePath, authToken, defaultLimit })

  dispatch({ type: actions.SET_RELATIONS_PENDING })

  try {
    const data = await Api.getRelations(
      from,
      to,
      relationType,
      sourceEntity,
      targetEntity,
      offset
    )
    const [source, target] = handleReverse(from, to)
    dispatch({
      type: actions.SET_RELATIONS,
      payload: data,
      meta: { source, target },
    })

    // FIXME: PLEASE NO!
    if (Array.isArray(data.results) && data.results.length >= defaultLimit) {
      dispatch({
        type: actions.SET_POST_LOAD_RELATIONS_NOTIFICATION,
        meta: { defaultLimit },
        payload: {
          from,
          to,
          relationType,
          sourceEntity,
          targetEntity,
          message: `You tried to load more than ${defaultLimit} relations. This might slow things down. Do you want to continue loading?`,
        },
      })
    }
  } catch (error) {
    dispatch({ type: actions.SET_RELATIONS_ERROR, payload: error, error: true })
  }
}

export const fetchRelationTypes = async (apisInstance, dispatch, from, to) => {
  const { basePath, authToken, defaultLimit } = apisInstance
  const Api = createApi({ basePath, authToken, defaultLimit })

  dispatch({ type: actions.SET_RELATION_TYPES_PENDING })

  try {
    const data = await Api.getRelationTypes(from, to)
    const [source, target] = handleReverse(from, to)
    dispatch({
      type: actions.SET_RELATION_TYPES,
      payload: data,
      meta: { source, target },
    })
  } catch (error) {
    dispatch({
      type: actions.SET_RELATION_TYPES_ERROR,
      payload: error,
      error: true,
    })
  }
}

// FIXME: Aaaargh!!
const autoCompletePromises = {}

export const fetchAutoComplete = async (
  apisInstance,
  dispatch,
  type,
  search = ''
) => {
  if (autoCompletePromises[type] != null) return

  const { basePath, authToken, defaultLimit } = apisInstance
  const Api = createApi({ basePath, authToken, defaultLimit })

  dispatch({ type: actions.SET_AUTOCOMPLETE_PENDING })

  try {
    autoCompletePromises[type] = Api.getEntitiesAutoComplete(type, search)
    const data = await autoCompletePromises[type]
    dispatch({
      type: actions.SET_AUTOCOMPLETE,
      payload: data,
      meta: { type },
    })
  } catch (error) {
    dispatch({
      type: actions.SET_AUTOCOMPLETE_ERROR,
      payload: error,
      error: true,
    })
  } finally {
    autoCompletePromises[type] = null
  }
}
