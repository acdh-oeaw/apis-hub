import { assert } from '@stefanprobst/assert'
import { log } from '@stefanprobst/log'
import Graph from 'graphology'
import type { SerializedEdge, SerializedNode } from 'graphology-types'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

import type { ApisInstanceConfig } from '~/config/apis.config'
import { defaultNodeSize } from '~/config/visualisation.config'

interface GraphNode {
  id: number | string
}

interface GraphEdge {
  id: number | string
  source: GraphNode
  target: GraphNode
}

type GraphId = ApisInstanceConfig['id']

interface GraphState {
  graph: Graph
}

type GraphsState = Record<GraphId, GraphState>

interface GraphsContextValue {
  graphs: GraphsState
  addEdges: <T extends GraphEdge>(
    id: GraphId,
    edges: Array<T>,
    getEdgeLabel: (edge: T) => string,
    getEdgeColor: (edge: T) => string,
    getNodeLabel: (node: T['source'] | T['target']) => string,
    getNodeColor: (node: T['source'] | T['target']) => string,
  ) => void
  clearGraph: (id: GraphId) => void
}

const GraphsContext = createContext<GraphsContextValue | null>(null)

const initialState: GraphsState = {}

interface GraphsProviderProps {
  children: ReactNode
}

export function GraphsProvider(props: GraphsProviderProps): JSX.Element {
  const { children } = props

  const [graphs, setGraphs] = useState<GraphsState>(initialState)

  const value: GraphsContextValue = useMemo(() => {
    function addEdges<T extends GraphEdge>(
      id: GraphId,
      edges: Array<T>,
      getEdgeLabel: (edge: T) => string,
      getEdgeColor: (edge: T) => string,
      getNodeLabel: (node: T['source'] | T['target']) => string,
      getNodeColor: (node: T['source'] | T['target']) => string,
    ): void {
      if (edges.length === 0) return

      setGraphs((state) => {
        const current = state[id] ?? { graph: createGraph(id) }
        const { graph } = current

        const _nodes = new Map<string, SerializedNode>()
        const _edges = new Map<string, SerializedEdge>()

        edges.forEach((edge) => {
          const edgeId = String(edge.id)
          if (graph.hasEdge(edgeId)) return

          // UPSTREAM: this should never happen, but it does
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (edge.source == null || edge.target == null) {
            log.error('Missing source or target node', edge)
            return
          }

          const sourceId = String(edge.source.id)

          if (!graph.hasNode(sourceId) && !_nodes.has(sourceId)) {
            const _source: SerializedNode = {
              key: String(edge.source.id),
              attributes: {
                color: getNodeColor(edge.source),
                data: edge.source,
                label: getNodeLabel(edge.source),
                size: defaultNodeSize,
                x: Math.random(),
                y: Math.random(),
              },
            }
            _nodes.set(sourceId, _source)
          }

          const targetId = String(edge.target.id)

          if (!graph.hasNode(targetId) && !_nodes.has(targetId)) {
            const _target: SerializedNode = {
              key: String(edge.target.id),
              attributes: {
                color: getNodeColor(edge.target),
                data: edge.target,
                label: getNodeLabel(edge.target),
                size: defaultNodeSize,
                x: Math.random(),
                y: Math.random(),
              },
            }
            _nodes.set(targetId, _target)
          }

          const _edge: SerializedEdge = {
            key: edgeId,
            source: sourceId,
            target: targetId,
            attributes: {
              color: getEdgeColor(edge),
              data: edge,
              label: getEdgeLabel(edge),
            },
            undirected: false,
          }
          _edges.set(edgeId, _edge)
        })

        /** Avoid adding nodes and edges one by one, to only trigger relayout once. */
        // TODO: check if this is actually true since we are still emitting `nodeAdded` and `edgeAdded` events for every new node/edge.
        graph.import({ nodes: Array.from(_nodes.values()), edges: Array.from(_edges.values()) })

        return { ...state, [id]: { ...current, graph } }
      })
    }

    function clearGraph(id: GraphId): void {
      setGraphs((state) => {
        const current = state[id]
        if (current == null) return state
        const { graph } = current
        graph.clear()
        return { ...state, [id]: { ...current, graph } }
      })
    }

    return {
      graphs,
      addEdges,
      clearGraph,
    }
  }, [graphs])

  return <GraphsContext.Provider value={value}>{children}</GraphsContext.Provider>
}

export function useGraphs(): GraphsContextValue {
  const value = useContext(GraphsContext)

  assert(value != null, '`useGraphs` must be used within a `GraphsProvider`.')

  return value
}

function createGraph(id: string): Graph {
  const graph = new Graph({ multi: true, type: 'directed' })
  graph.setAttribute('id', id)
  return graph
}
