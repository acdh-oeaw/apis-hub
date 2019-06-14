const { DEFAULT_LIMIT } = require(`../constants`)

const createUrl = ({ path, basePath, query }) => {
  const url = new URL(path.toLowerCase(), basePath)

  Object.entries(query).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  return url
}

const request = async ({ path, basePath, query, options }) => {
  const url = createUrl({ path, basePath, query })

  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const data = await response.json()

  return data
}

export const createApi = ({ basePath, authToken }) => {
  const options = { headers: { Authorization: authToken } }

  return {
    basePath,

    // NOTE: There seems to be no way to batch-get entity details
    getEntityDetails(id) {
      const query = { format: 'json' }
      const path = `/apis/api2/entity/${id}/`
      return request({ path, basePath, query, options })
    },

    getEntitiesAutoComplete(type, search) {
      const query = { q: search }
      const path = `/apis/api/entities/autocomplete-network/${type.toLowerCase()}/`
      return request({ path, basePath, query, options })
    },

    getEntity(type, id) {
      const query = {}
      const path = `/apis/api2/entities/${type}/${id}/`
      return request({ path, basePath, query, options })
    },

    getEntities(type) {
      const query = {}
      const path = `/apis/api2/entities/${type}/`
      return request({ path, basePath, query, options })
    },

    // FIXME: It looks like this does not currently work with `format=json+net`
    getRelation(from, to, id) {
      const query = { format: 'json+net' }
      const endpoint = handleReverse(from, to).join('')
      const path = `/apis/api/relations/${endpoint}/${id}/`
      return request({ path, basePath, query, options })
    },

    getRelations(from, to, offset = 0) {
      const query = { format: 'json+net', limit: DEFAULT_LIMIT, offset }
      const endpoint = handleReverse(from, to).join('')
      const path = `/apis/api/relations/${endpoint}/`
      return request({ path, basePath, query, options })
    },

    getRelationTypes(from, to) {
      // FIXME: Do we need to increase `limit` for relation types?
      const query = {}
      const endpoint = handleReverse(from, to).join('')
      const path = `/apis/api/vocabularies/${endpoint}relation/`
      return request({ path, basePath, query, options })
    },
  }
}

export const handleReverse = (from, to) => {
  const reverse = relations[from][to]
  return reverse ? [to, from] : [from, to]
}

// Boolean values indicate if the endpoint/relationType name should be constructed in reverse
export const relations = {
  Event: {
    Event: false,
    Institution: true,
    Person: true,
    Place: true,
    Work: false,
  },
  Institution: {
    Event: false,
    Institution: false,
    Person: true,
    Place: false,
    Work: false,
  },
  Person: {
    Event: false,
    Institution: false,
    Person: false,
    Place: false,
    Work: false,
  },
  Place: {
    Event: false,
    Institution: true,
    Person: true,
    Place: false,
    Work: false,
  },
  Work: {
    Event: true,
    Institution: true,
    Person: true,
    Place: true,
    Work: false,
  },
}

export const entities = Object.keys(relations)

// Work needs a lighter color, something like a darker blue
// the event green could be a bit more saturated as well
export const colors = {
  Event: '#1b998b',
  Institution: '#18bfff',
  Person: '#f82b60',
  Place: '#fcb400',
  Work: '#2d3047',
  highlighted: 'lime',
  selected: 'hotpink',
}
