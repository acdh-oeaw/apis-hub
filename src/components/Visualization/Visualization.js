import React, { useEffect, useRef } from 'react'
import ForceGraph from 'force-graph'

import { useApiState } from '../../contexts/api'

import { colors } from '../../utils/api'
import { createGraph } from '../../utils/graph'

const Visualization = ({
  centerNode,
  dagMode,
  forceGraphRef, // FIXME: Lift up
  graphRef, // FIXME: Lift up
  highlightedNodeIds,
  // onFinishLoading,
  // onLoading,
  onSimulationEnd,
  onSimulationTick,
  onZoom,
  selectedNodeIds,
  setSelectedNodeIds,
  setShowNeighborsOnly,
  showNeighborsOnly,
  sizes,
}) => {
  const wrapperRef = useRef()
  const {
    relations: { byId: relationsById },
  } = useApiState()

  const { width, height } = sizes
  const NODE_R = 6

  useEffect(() => {
    graphRef.current = createGraph()
    graphRef.current.emitter.on('edgesAdded', () => {
      forceGraphRef.current.graphData({
        nodes: graphRef.current.getNodes(),
        links: graphRef.current.getEdges(),
      })
    })
    graphRef.current.emitter.on('graphCleared', () => {
      forceGraphRef.current.graphData({
        nodes: [],
        links: [],
      })
    })
  }, [graphRef, forceGraphRef])

  useEffect(() => {
    forceGraphRef.current = ForceGraph()(wrapperRef.current)

    forceGraphRef.current.nodeVal(node => node.neighbors.size)
    forceGraphRef.current.nodeRelSize(NODE_R)
    forceGraphRef.current.linkLabel(link => link.type.label)
    forceGraphRef.current.linkDirectionalParticles(2)

    forceGraphRef.current.graphData({
      nodes: graphRef.current.getNodes(),
      links: graphRef.current.getEdges(),
    })
  }, [forceGraphRef, graphRef])

  useEffect(() => {
    if (!selectedNodeIds.size && showNeighborsOnly) {
      setShowNeighborsOnly(false)
    }

    forceGraphRef.current.onNodeClick(node => {
      if (selectedNodeIds.has(node.id)) {
        setSelectedNodeIds(
          new Set([...selectedNodeIds].filter(id => id !== node.id))
        )
      } else {
        setSelectedNodeIds(new Set([node.id, ...selectedNodeIds]))
      }

      centerNode(node)
    })
  }, [
    centerNode,
    selectedNodeIds,
    setSelectedNodeIds,
    showNeighborsOnly,
    setShowNeighborsOnly,
    forceGraphRef,
  ])

  useEffect(() => {
    // FIXME: memoize this (or at least don't recalculate for every paint)
    // => just calculate the visible nodes *once* per render (and put selectedNodes into state)
    const isNeighborOfSelectedNode = node =>
      selectedNodeIds.has(node.id) ||
      [...selectedNodeIds].some(id =>
        graphRef.current.nodes.get(id).neighbors.has(node.id)
      )

    forceGraphRef.current.nodeCanvasObject((node, ctx, globalScale) => {
      const nodeVal = node.neighbors.size
      const radius = Math.sqrt(Math.max(0, nodeVal || 1)) * NODE_R

      // Draw highlighted ring around selected nodes
      if (highlightedNodeIds.has(node.id)) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius * 1.4, 0, 2 * Math.PI, false)
        ctx.fillStyle = colors.highlighted
        ctx.fill()
      }

      if (selectedNodeIds.has(node.id)) {
        // TODO: Would be better if we had access to force-graph state
        // inside this callback. Just pass `state` here:
        // https://github.com/vasturiano/force-graph/blob/998e2b3453869a68f32b3a36e5dc69ebaab1ea57/src/canvas-force-graph.js#L133
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius * 1.4, 0, 2 * Math.PI, false)
        ctx.fillStyle = colors.selected
        ctx.fill()
      }

      // FIXME: force-graph adds 1px extra radius when state.isShadow
      if (
        !(showNeighborsOnly && selectedNodeIds.size) ||
        isNeighborOfSelectedNode(node)
      ) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = colors[node.type] || 'rgba(31, 120, 180, 0.92)'
        ctx.fill()
      }

      // Always show label for selected nodes
      if (selectedNodeIds.has(node.id)) {
        const { label } = node
        const fontSize = 12 / globalScale
        ctx.font = `${fontSize}px Sans-Serif`
        const textWidth = ctx.measureText(label).width
        const [width, height] = [textWidth, fontSize].map(
          n => n + fontSize * 0.2
        )

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fillRect(node.x - width / 2, node.y - height / 2, width, height)

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = colors[node.type]
        ctx.fillText(label, node.x, node.y)
      }
    })

    forceGraphRef.current.linkVisibility(
      link =>
        !showNeighborsOnly ||
        (isNeighborOfSelectedNode(link.source) &&
          isNeighborOfSelectedNode(link.target))
    )

    // TODO: Would be better if we had nodeVisibility, similar to linkVisibility
    forceGraphRef.current.nodeLabel(node => {
      return showNeighborsOnly && !isNeighborOfSelectedNode(node)
        ? null
        : node.label
    })
  }, [
    showNeighborsOnly,
    selectedNodeIds,
    highlightedNodeIds,
    graphRef,
    forceGraphRef,
  ])

  useEffect(() => {
    forceGraphRef.current.dagMode(dagMode)
  }, [dagMode, forceGraphRef])

  useEffect(() => {
    // FIXME: onLoading and onFinishLoading need to be exposed here:
    // https://github.com/vasturiano/force-graph/blob/998e2b3453869a68f32b3a36e5dc69ebaab1ea57/src/force-graph.js#L45
    forceGraphRef.current.onEngineStop(onSimulationEnd)
    // Workaround: we pass on `nodes.length` so we don't show initial engine
    // running when no nodes have been loaded. This could be avoided by checking
    // here: https://github.com/vasturiano/force-graph/blob/998e2b3453869a68f32b3a36e5dc69ebaab1ea57/src/canvas-force-graph.js#L456
    forceGraphRef.current.onEngineTick(() => {
      onSimulationTick(Boolean(graphRef.current.nodes.size))
    })
    forceGraphRef.current.onZoom(onZoom)
  }, [onSimulationEnd, onSimulationTick, onZoom, graphRef, forceGraphRef])

  useEffect(() => {
    if (width && height) {
      forceGraphRef.current.width(width)
      forceGraphRef.current.height(height)
    } else {
      // FIXME: Needed when resizeListener not yet available
      const { clientWidth, clientHeight } = wrapperRef.current
      forceGraphRef.current.width(clientWidth)
      forceGraphRef.current.height(clientHeight)
    }
  }, [width, height, forceGraphRef])

  useEffect(() => {
    graphRef.current.addEdges(Object.values(relationsById))
  }, [relationsById, graphRef])

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
    />
  )
}

Visualization.defaultProps = {
  // onFinishLoading: () => {},
  // onLoading: () => {},
  onSimulationEnd: () => {},
  onSimulationTick: () => {},
  onZoom: () => {},
  showNeighborsOnly: false,
}

export default Visualization
