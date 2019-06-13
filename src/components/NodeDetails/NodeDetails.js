import React, { useEffect } from 'react'

import { useApi, fetchEntityDetails } from '../../contexts/api'

import Entity from '../Entity/Entity'

import Spinner from '../../elements/Spinner/Spinner'

const NodeDetails = ({
  centerNode,
  graph,
  selectedNodeIds,
  setSelectedNodeIds,
}) => {
  const [
    {
      entityDetails: {
        byId: entityDetailsById,
        meta: { isLoading: isLoadingEntityDetails },
      },
    },
    dispatch,
  ] = useApi()

  useEffect(() => {
    selectedNodeIds.forEach(id => {
      if (!entityDetailsById[id]) {
        fetchEntityDetails(dispatch, id)
      }
    })
  }, [selectedNodeIds, dispatch, entityDetailsById])

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
