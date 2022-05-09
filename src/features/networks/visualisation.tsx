import type Graph from 'graphology'
import type FA2LayoutSupervisor from 'graphology-layout-forceatlas2/worker'
import type { ReactNode, RefObject } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type Sigma from 'sigma'

import { useGraphs } from '@/features/networks/graphs.context'
import styles from '@/features/networks/visualisation.module.css'
import { useDebouncedValue } from '@/lib/use-debounced-value'
import type { ApisInstanceConfig } from '~/config/apis.config'
import {
  colors,
  edgeHighlightSize,
  layoutOptions,
  rendererOptions,
} from '~/config/visualisation.config'

interface VisualisationProps {
  children?: ReactNode
  instance: ApisInstanceConfig
}

export function Visualisation(props: VisualisationProps): JSX.Element {
  const { children, instance } = props

  const { graphs } = useGraphs()
  const { graph } = graphs[instance.id] ?? {}

  if (graph == null || graph.order === 0) {
    return <div className={styles['container']}>Nothing to see yet.</div>
  }

  return <VisualisationProvider graph={graph}>{children}</VisualisationProvider>
}

interface VisualisationContextValue {
  layout: FA2LayoutSupervisor | null
  renderer: Sigma | null
}

const initialValue = { layout: null, renderer: null }

const VisualisationContext = createContext<VisualisationContextValue>(initialValue)

interface VisualisationProviderProps {
  children?: ReactNode
  graph: Graph
}

function VisualisationProvider(props: VisualisationProviderProps): JSX.Element {
  const { children, graph } = props

  const ref = useRef<HTMLDivElement>(null)
  const value = useVisualisationInstance(graph, ref)

  return (
    <VisualisationContext.Provider value={value}>
      <div data-visualisation ref={ref} className={styles['container']}>
        {children}
      </div>
    </VisualisationContext.Provider>
  )
}

export function useVisualisation(): VisualisationContextValue {
  const value = useContext(VisualisationContext)

  return value
}

function useVisualisationInstance(
  graph: Graph | null,
  ref: RefObject<HTMLElement>,
): VisualisationContextValue {
  const [instance, setInstance] = useState<VisualisationContextValue>(initialValue)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const debouncedHoveredNode = useDebouncedValue(hoveredNode, 100)

  useEffect(() => {
    let canceled = false
    let renderer: Sigma | null = null
    let layout: FA2LayoutSupervisor | null = null

    async function createVisualisation() {
      const container = ref.current
      if (container == null) return
      if (graph == null) return

      const Layout = await import('graphology-layout-forceatlas2/worker').then((module) => {
        return module.default
      })
      const Sigma = await import('sigma').then((module) => {
        return module.default
      })

      if (!canceled) {
        layout = new Layout(graph, { settings: layoutOptions })
        renderer = new Sigma(graph, container, rendererOptions)

        renderer.on('enterNode', (payload) => {
          setHoveredNode(payload.node)
        })
        renderer.on('leaveNode', () => {
          setHoveredNode(null)
        })

        setInstance({ layout, renderer })
      }
    }

    createVisualisation()

    return () => {
      canceled = true
      layout?.kill()
      // renderer?.clear()
      renderer?.kill()
      layout = null
      renderer = null
    }
  }, [graph, ref])

  useEffect(() => {
    const { renderer } = instance
    if (renderer == null) return
    const graph = renderer.getGraph()

    const hoveredColor =
      debouncedHoveredNode != null
        ? renderer.getNodeDisplayData(debouncedHoveredNode)?.color
        : undefined

    renderer.setSetting(
      'nodeReducer',
      debouncedHoveredNode != null
        ? (node, data) => {
            if (
              node === debouncedHoveredNode ||
              graph.hasEdge(node, debouncedHoveredNode) ||
              graph.hasEdge(debouncedHoveredNode, node)
            ) {
              return { ...data, zIndex: 1 }
            }

            return {
              ...data,
              zIndex: 0,
              label: '',
              color: colors.fade.node,
              image: null,
              highlighted: false,
            }
          }
        : null,
    )
    renderer.setSetting(
      'edgeReducer',
      debouncedHoveredNode != null
        ? (edge, data) => {
            if (graph.hasExtremity(edge, debouncedHoveredNode)) {
              return { ...data, color: hoveredColor, size: edgeHighlightSize }
            }

            return { ...data, color: colors.fade.edge, hidden: true }
          }
        : null,
    )
  }, [instance, debouncedHoveredNode])

  return instance
}
