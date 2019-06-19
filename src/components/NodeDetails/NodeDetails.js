import React, { useEffect } from 'react'

import { useApi, fetchEntityDetails } from '../../contexts/api'
import { useApisInstanceState } from '../../contexts/apis-instance'
import { useUserState } from '../../contexts/user'

import Entity from '../Entity/Entity'

import Spinner from '../../elements/Spinner/Spinner'

const NodeDetails = ({
  centerNode,
  graph,
  selectedNodeIds,
  setSelectedNodeIds,
}) => {
  const { availableInstances, selected } = useApisInstanceState()
  const apisInstance = availableInstances[selected]
  const [
    {
      entityDetails: {
        byId: entityDetailsById,
        meta: { isLoading: isLoadingEntityDetails },
      },
    },
    dispatch,
  ] = useApi()

  const user = useUserState()
  const currentUser = user[selected]

  useEffect(() => {
    selectedNodeIds.forEach(id => {
      if (!entityDetailsById[id]) {
        fetchEntityDetails({ apisInstance, dispatch, id, user: currentUser })
      }
    })
  }, [selectedNodeIds, dispatch, entityDetailsById, apisInstance, currentUser])

  return (
    <div>
      {isLoadingEntityDetails ? <Spinner height="40" /> : null}
      {[...selectedNodeIds].map(id => (
        <Entity
          centerNode={centerNode}
          entity={entityDetailsById[id]}
          graph={graph}
          key={id}
          selectedNodeIds={selectedNodeIds}
          setSelectedNodeIds={setSelectedNodeIds}
        />
      ))}
    </div>
  )
}

// Memoize to not re-render on every zoom/pan state change
export default React.memo(NodeDetails)
