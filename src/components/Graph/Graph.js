import React from 'react'
import useResizeAware from 'react-resize-aware'

import NodeDetails from '../NodeDetails/NodeDetails'
import Panel from '../Panel/Panel'
import Visualization from '../Visualization/Visualization'
import Visualization3D from '../Visualization3D/Visualization3D'

import styles from './Graph.module.css'

import classNames from '../../utils/class-names'

const Graph = ({
  centerNode,
  className,
  dagMode,
  forceGraphRef,
  graphRef,
  highlightedNodeIds,
  is3D,
  isLeftPanelOpen,
  isRightPanelOpen,
  // onFinishLoading,
  // onLoading,
  onSimulationEnd,
  onSimulationTick,
  onZoom,
  selectedNodeIds,
  setIs3D,
  setIsLeftPanelOpen,
  setIsRightPanelOpen,
  setSelectedNodeIds,
  setShowNeighborsOnly,
  showNeighborsOnly,
  zoom,
  ...rest
}) => {
  const [resizeListener, sizes] = useResizeAware()

  return (
    <div className={classNames(styles.Graph, className)} {...rest}>
      <Panel
        isOpen={isLeftPanelOpen}
        setIsOpen={setIsLeftPanelOpen}
        title="Select relations"
      >
        Select a relation
      </Panel>

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {resizeListener}
        {is3D ? (
          <Visualization3D
            centerNode={centerNode}
            dagMode={dagMode}
            forceGraphRef={forceGraphRef}
            graphRef={graphRef}
            highlightedNodeIds={highlightedNodeIds}
            // is3D={is3D}
            // onFinishLoading={onFinishLoading}
            // onLoading={onLoading}
            onSimulationEnd={onSimulationEnd}
            onSimulationTick={onSimulationTick}
            selectedNodeIds={selectedNodeIds}
            // setIs3D={setIs3D}
            setSelectedNodeIds={setSelectedNodeIds}
            setShowNeighborsOnly={setShowNeighborsOnly}
            showNeighborsOnly={showNeighborsOnly}
            sizes={sizes}
          />
        ) : (
          <Visualization
            centerNode={centerNode}
            dagMode={dagMode}
            forceGraphRef={forceGraphRef}
            graphRef={graphRef}
            highlightedNodeIds={highlightedNodeIds}
            // is3D={is3D}
            // onFinishLoading={onFinishLoading}
            // onLoading={onLoading}
            onSimulationEnd={onSimulationEnd}
            onSimulationTick={onSimulationTick}
            onZoom={onZoom}
            selectedNodeIds={selectedNodeIds}
            // setIs3D={setIs3D}
            setSelectedNodeIds={setSelectedNodeIds}
            setShowNeighborsOnly={setShowNeighborsOnly}
            showNeighborsOnly={showNeighborsOnly}
            sizes={sizes}
            // zoom={zoom}
          />
        )}
        {!graphRef.current || !graphRef.current.nodes.size ? (
          <div
            style={{
              color: 'var(--color-grey)',
              fontSize: '2rem',
              position: 'absolute',
            }}
          >
            Add some nodes and edges!
          </div>
        ) : null}
      </div>

      <Panel
        isOpen={isRightPanelOpen}
        right
        setIsOpen={setIsRightPanelOpen}
        title="Selection details"
      >
        <NodeDetails
          centerNode={centerNode}
          graph={graphRef.current}
          selectedNodeIds={selectedNodeIds}
          setSelectedNodeIds={setSelectedNodeIds}
        />
      </Panel>
    </div>
  )
}

export default Graph
