import type { ReactNode } from 'react'

interface PanelProps {
  children: ReactNode
}

export function Panel(props: PanelProps): JSX.Element {
  const { children } = props

  return (
    <aside className="text-sm bg-white rounded border-2 border-transparent px-4 py-2 text-gray-500 flex gap-2 shadow-md overflow-x-hidden overflow-y-auto max-h-72 focus-within:border-primary focus-within:border-2">
      {children}
    </aside>
  )
}
