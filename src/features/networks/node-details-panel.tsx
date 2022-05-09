import { capitalize } from '@stefanprobst/capitalize'
import { log } from '@stefanprobst/log'
import { Fragment, useEffect, useState } from 'react'

import { useGetApisEntityById } from '@/features/apis/api'
import type { ApisEntityType, ApisRelation } from '@/features/apis/types'
import { Panel } from '@/features/networks/panel'
import { Separator } from '@/features/networks/separator'
import { useVisualisation } from '@/features/networks/visualisation'
import { Spinner } from '@/features/ui/spinner'
import type { ApisInstanceConfig } from '~/config/apis.config'
import { colors, defaultNodeSize } from '~/config/visualisation.config'

interface InfoPanelProps {
  instance: ApisInstanceConfig
}

export function NodeDetailsPanel(props: InfoPanelProps): JSX.Element | null {
  const { instance } = props

  const { renderer } = useVisualisation()
  const [selectedNodeData, setSelectedNodeData] = useState<
    ApisRelation['source'] | ApisRelation['target'] | null
  >(null)
  const query = useGetApisEntityById(
    instance,
    selectedNodeData != null ? { id: selectedNodeData.id } : null,
    { enabled: selectedNodeData != null, keepPreviousData: false },
  )

  useEffect(() => {
    if (renderer == null) return

    renderer.on('clickNode', (payload) => {
      const { data } = renderer.getGraph().getNodeAttributes(payload.node)
      // TODO: center camera on node
      setSelectedNodeData(data)
    })
    renderer.on('clickStage', () => {
      setSelectedNodeData(null)
    })
  }, [renderer])

  function onAddEdges(edges: Array<any>) {
    const graph = renderer?.getGraph()
    if (graph == null) return

    edges.forEach((edge) => {
      const edgeId = String(edge.id)
      if (graph.hasEdge(edgeId)) return

      // UPSTREAM: target should never be null
      if (edge.source == null || edge.target == null) {
        log.error('Missing source or target node', edge)
        return
      }

      // NOTE: Source node will always be in the graph already (since it was clicked).
      const sourceId = String(edge.source.id)
      if (!graph.hasNode(sourceId)) {
        graph.addNode(sourceId, {
          color: colors.node[edge.source.entity_type as ApisEntityType],
          data: edge.source,
          label: edge.source.name,
          size: defaultNodeSize,
          x: Math.random(),
          y: Math.random(),
        })
      }

      const targetId = String(edge.target.id)
      if (!graph.hasNode(targetId)) {
        graph.addNode(targetId, {
          color: colors.node[edge.target.entity_type as ApisEntityType],
          data: edge.target,
          label: edge.target.name,
          size: defaultNodeSize,
          x: Math.random(),
          y: Math.random(),
        })
      }

      graph.addEdgeWithKey(edgeId, sourceId, targetId, {
        color: colors.edge,
        data: edge,
        label: edge.label,
      })
    })
  }

  if (selectedNodeData == null) return null

  const entity = query.data

  return (
    <Panel>
      <div className="py-0.5 grid w-full">
        <div className="flex gap-2 items-center font-medium">
          <div
            className="w-3 h-3 rounded flex-shrink-0"
            style={{ backgroundColor: colors.node[selectedNodeData.type] }}
          />{' '}
          {selectedNodeData.label}
        </div>
        {entity != null ? (
          <Fragment>
            {entity.kind != null ? <div className="text-gray-500">{entity.kind.label}</div> : null}
            <div>
              {[entity.start_date_written, entity.end_date_written].filter(Boolean).join(' - ')}
            </div>
            <div className="my-2">
              {entity.uris.map((uri) => {
                return (
                  <div key={uri.id}>
                    <a
                      className="underline hover:no-underline"
                      href={uri.uri}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {uri.uri}
                    </a>
                  </div>
                )
              })}
            </div>
            <Separator orientation="horizontal" />
            <div className="flex gap-4">
              {Object.entries(entity.relations).map(([_type, relations]) => {
                const count = relations.length
                if (count === 0) return null

                // UPSTREAM: why are entity types lowercased and pluralized here?
                const type = capitalize(_type).slice(0, -1) as ApisEntityType

                return (
                  <button
                    key={type}
                    className="flex gap-2 items-center"
                    onClick={() => {
                      onAddEdges(
                        relations.map((relation) => {
                          // UPSTREAM: GET relations returns `label`+`type` for source and target nodes, GET entity returns `name`+`entity_type`
                          return {
                            ...relation,
                            source: { ...entity, label: entity.name, type: entity.entity_type },
                            target: {
                              ...relation.target,
                              // @ts-expect-error UPSTREAM: I hate this API.
                              label: relation.target.name,
                              // UPSTREAM: missing
                              type,
                            },
                          }
                        }),
                      )
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: colors.node[type] }}
                    />{' '}
                    {count} {count === 1 ? type : type + 's'}
                  </button>
                )
              })}
            </div>
          </Fragment>
        ) : query.isLoading ? (
          <div className="flex justify-center my-4">
            <Spinner />
          </div>
        ) : null}
      </div>
    </Panel>
  )
}
