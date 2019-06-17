import React, { useState, useRef, useEffect } from 'react'

import { useApiDispatch } from '../../contexts/api'

import Controls from '../Controls/Controls'
import Graph from '../Graph/Graph'
import Notifications from '../Notifications/Notifications'
import SearchBar from '../SearchBar/SearchBar'

import styles from './Networks.module.css'

const Networks = () => {
  const dispatch = useApiDispatch()
  const [dagMode, setDagMode] = useState()
  const [zoom, setZoom] = useState()
  const [is3D, setIs3D] = useState(false)
  // const [isGraphLoading, setIsGraphLoading] = useState(false)
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [showNeighborsOnly, setShowNeighborsOnly] = useState(false)
  const [selectedNodeIds, setSelectedNodeIds] = useState(new Set())
  const [highlightedNodeIds, setHighlightedNodeIds] = useState(new Set())

  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false)
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false)

  const forceGraphRef = useRef()
  const forceGraphRef3D = useRef()
  // FIXME: useGraph()
  const graphRef = useRef()
  const graphRef3D = useRef()

  // FIXME: AWFUL!
  const [currentGraph, setCurrentGraph] = useState([graphRef, forceGraphRef])
  useEffect(() => {
    is3D
      ? setCurrentGraph([graphRef3D, forceGraphRef3D])
      : setCurrentGraph([graphRef, forceGraphRef])
  }, [is3D])

  const centerNode3D = node => {
    const distance = 100
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
    forceGraphRef3D.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
      node,
      1000
    )
  }

  const centerNode = node => {
    forceGraphRef.current.centerAt(node.x, node.y, 400)
  }

  return (
    <main className={styles.Networks}>
      <SearchBar />
      <Notifications />
      <Graph
        centerNode={is3D ? centerNode3D : centerNode}
        dagMode={dagMode}
        forceGraphRef={forceGraphRef}
        graphRef={graphRef}
        forceGraphRef3D={forceGraphRef3D}
        graphRef3D={graphRef3D}
        highlightedNodeIds={highlightedNodeIds}
        is3D={is3D}
        isLeftPanelOpen={isLeftPanelOpen}
        isRightPanelOpen={isRightPanelOpen}
        // onFinishLoading={() => setIsGraphLoading(false)}
        // onLoading={() => setIsGraphLoading(true)}
        onSimulationEnd={() => setIsSimulationRunning(false)}
        // Only show running simulation when there actually are nodes in the graph
        onSimulationTick={hasNodes => setIsSimulationRunning(hasNodes)}
        onZoom={setZoom}
        selectedNodeIds={selectedNodeIds}
        setIs3D={setIs3D}
        setIsLeftPanelOpen={setIsLeftPanelOpen}
        setIsRightPanelOpen={setIsRightPanelOpen}
        setSelectedNodeIds={setSelectedNodeIds}
        setShowNeighborsOnly={setShowNeighborsOnly}
        showNeighborsOnly={showNeighborsOnly}
        zoom={zoom}
      />
      <Controls
        dagMode={dagMode}
        dispatch={dispatch}
        forceGraph={currentGraph[1].current}
        graph={currentGraph[0].current}
        is3D={is3D}
        // isGraphLoading={isGraphLoading}
        isLeftPanelOpen={isLeftPanelOpen}
        isRightPanelOpen={isRightPanelOpen}
        isSimulationRunning={isSimulationRunning}
        onSelectDagMode={setDagMode}
        onSelectShowNeighborsOnly={setShowNeighborsOnly}
        onSelectZoom={setZoom}
        selectedNodeIds={selectedNodeIds}
        setIs3D={setIs3D}
        setHighlightedNodeIds={setHighlightedNodeIds}
        setIsLeftPanelOpen={setIsLeftPanelOpen}
        setIsRightPanelOpen={setIsRightPanelOpen}
        showNeighborsOnly={showNeighborsOnly}
        zoom={zoom}
      />
    </main>
  )
}

export default Networks
