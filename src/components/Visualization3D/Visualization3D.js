import React, { useEffect, useRef } from 'react'
import ForceGraph from '3d-force-graph'
import SpriteText from 'three-spritetext'

import { useApiState } from '../../contexts/api'

import { colors } from '../../utils/api'
import { createGraph } from '../../utils/graph'

const Visualization3D = ({
  centerNode,
  dagMode,
  forceGraphRef,
  graphRef,
  highlightedNodeIds,
  onSimulationEnd,
  onSimulationTick,
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
    const isNeighborOfSelectedNode = node =>
      selectedNodeIds.has(node.id) ||
      [...selectedNodeIds].some(id =>
        graphRef.current.nodes.get(id).neighbors.has(node.id)
      )

    forceGraphRef.current.nodeColor(node => {
      if (selectedNodeIds.has(node.id)) {
        return colors.selected
      }
      if (highlightedNodeIds.has(node.id)) {
        return colors.highlighted
      }
      if (
        !(showNeighborsOnly && selectedNodeIds.size) ||
        isNeighborOfSelectedNode(node)
      ) {
        return colors[node.type]
      }
      return 'transparent'
    })

    forceGraphRef.current.nodeThreeObjectExtend(true)
    forceGraphRef.current.nodeThreeObject((node, ctx, globalScale) => {
      // const nodeVal = node.neighbors.size
      // const radius = Math.sqrt(Math.max(0, nodeVal || 1)) * NODE_R

      // if (highlightedNodeIds.has(node.id)) {
      //   // Draw highlighted ring around selected nodes
      // }

      // if (selectedNodeIds.has(node.id)) {
      //   // Draw highlighted ring around selected nodes
      // }

      // if (
      //   !(showNeighborsOnly && selectedNodeIds.size) ||
      //   isNeighborOfSelectedNode(node)
      // ) {
      //   // Draw default node
      // }

      // Always show label for selected nodes
      if (selectedNodeIds.has(node.id)) {
        const sprite = new SpriteText(node.label)
        sprite.color = 'lightgrey'
        sprite.textHeight = 2
        return sprite
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
    forceGraphRef.current.onEngineStop(onSimulationEnd)
    forceGraphRef.current.onEngineTick(() => {
      onSimulationTick(Boolean(graphRef.current.nodes.size))
    })
    // TODO: Zoom/Camera position
  }, [onSimulationEnd, onSimulationTick, graphRef, forceGraphRef])

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

export default Visualization3D
