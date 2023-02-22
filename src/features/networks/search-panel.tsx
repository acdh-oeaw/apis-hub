import type { FormEvent } from 'react'

import { Panel } from '@/features/networks/panel'
import { useVisualisation } from '@/features/networks/visualisation'

export function SearchPanel(): JSX.Element {
  const { renderer } = useVisualisation()
  const graph = renderer?.getGraph()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const q = formData.get('q') as string
    const searchTerm = q.trim().toLowerCase()

    graph?.forEachNode((node, attributes) => {
      if (searchTerm.length === 0) {
        graph.setNodeAttribute(node, 'highlighted', false)
      } else if ((attributes['label'] as string).toLowerCase().includes(searchTerm)) {
        graph.setNodeAttribute(node, 'highlighted', true)
      }
    })
  }

  return (
    <Panel>
      <form className="grid w-full py-0.5" onSubmit={onSubmit}>
        <input
          aria-label="Search node"
          className="focus:outline-none"
          name="q"
          placeholder="Search node"
          type="search"
        />
      </form>
    </Panel>
  )
}
