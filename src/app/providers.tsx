import { HttpError } from '@stefanprobst/request'
import type { ReactNode } from 'react'
import type { SWRConfiguration } from 'swr'
import { SWRConfig } from 'swr'

import { ApisProvider } from '@/features/apis/apis.context'
import { GraphsProvider } from '@/features/networks/graphs.context'
import { toast } from '@/features/toast/toast'

interface ProvidersProps {
  children: ReactNode
}

export function Providers(props: ProvidersProps): JSX.Element {
  const { children } = props

  return (
    <ApisProvider>
      <GraphsProvider>
        <SWRConfig value={swrConfig}>{children}</SWRConfig>
      </GraphsProvider>
    </ApisProvider>
  )
}

const swrConfig: SWRConfiguration = {
  onError(error) {
    const message = error instanceof HttpError ? error.response.statusText : String(error)
    toast.error(message)
  },
}
