import { useRouter } from 'next/router'

import { useApis } from '@/features/apis/apis.context'
import { LegendPanel } from '@/features/networks/legend-panel'
import { NetworksPageContainer } from '@/features/networks/networks-page-container'
import { NodeDetailsPanel } from '@/features/networks/node-details-panel'
import { SearchBar } from '@/features/networks/search-bar'
import { SearchPanel } from '@/features/networks/search-panel'
import { SignInPage } from '@/features/networks/sign-in-page'
import { StatusPanel } from '@/features/networks/status-panel'
import { Visualisation } from '@/features/networks/visualisation'
import { VisualisationControlPanel } from '@/features/networks/visualisation-control-panel'

export default function NetworkPage(): JSX.Element {
  const router = useRouter()
  const { config, signIn } = useApis()
  const { instances } = config

  if (!router.isReady) {
    return <div />
  }

  const id = router.query['id'] as string

  if (!(id in instances)) {
    return <p className="grid place-items-center text-sm">Invalid id: {id}.</p>
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const instance = instances[id]!

  if (instance.access.type === 'restricted' && instance.access.user == null) {
    return <SignInPage instance={instance} signIn={signIn} />
  }

  return (
    <NetworksPageContainer>
      <SearchBar instance={instance} />
      <Visualisation instance={instance}>
        <div className="pointer-events-none absolute top-0 bottom-0 right-0 z-10 m-6 grid content-between gap-2">
          <div className="pointer-events-auto grid gap-2">
            <SearchPanel />
            <NodeDetailsPanel instance={instance} />
          </div>
          <div className="pointer-events-auto grid gap-2">
            <VisualisationControlPanel instance={instance} />
            <LegendPanel />
            <StatusPanel instance={instance} />
          </div>
        </div>
      </Visualisation>
    </NetworksPageContainer>
  )
}
