import { Panel } from '@/features/networks/panel'
import { colors } from '~/config/visualisation.config'

export function LegendPanel(): JSX.Element {
  return (
    <Panel>
      <div className="py-0.5 flex w-full gap-4 font-medium">
        {Object.entries(colors.node).map(([label, color]) => {
          return (
            <div key={label} className="flex gap-2 items-center">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} /> {label}
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
