import { useEffect } from 'react'

import { Panel } from '@/features/networks/panel'
import { useVisualisation } from '@/features/networks/visualisation'
import { useForceRender } from '@/lib/use-force-render'
import type { ApisInstanceConfig } from '~/config/apis.config'

interface StatusPanelProps {
  instance: ApisInstanceConfig
}

export function StatusPanel(props: StatusPanelProps): JSX.Element {
  const { instance } = props

  const { renderer } = useVisualisation()
  const forceRender = useForceRender()

  const graph = renderer?.getGraph()
  const edgeCont = graph == null ? 0 : graph.size
  const nodeCount = graph == null ? 0 : graph.order

  useEffect(() => {
    const graph = renderer?.getGraph()
    if (graph == null) return

    graph.on('edgeAdded', forceRender)
    graph.on('cleared', forceRender)

    return () => {
      graph.off('edgeAdded', forceRender)
      graph.off('cleared', forceRender)
    }
  }, [renderer, forceRender])

  return (
    <Panel>
      <dl className="py-0.5 flex w-full gap-4 justify-end font-medium">
        <div>
          <dt className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Edges</dt>
          <dd>{edgeCont}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Nodes</dt>
          <dd>{nodeCount}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
            APIS Instance
          </dt>
          <dd>{instance.title}</dd>
        </div>
        {instance.access.type === 'restricted' ? (
          <div>
            <dt className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
              Signed in as
            </dt>
            <dd>{instance.access.user?.username}</dd>
          </div>
        ) : null}
      </dl>
    </Panel>
  )
}
