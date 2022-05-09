import type { ReactNode } from 'react'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { ApisProvider } from '@/features/apis/apis.context'
import { GraphsProvider } from '@/features/networks/graphs.context'

interface ProvidersProps {
  children: ReactNode
}

export function Providers(props: ProvidersProps): JSX.Element {
  const { children } = props

  const [client] = useState(createQueryClient)

  return (
    <ApisProvider>
      <GraphsProvider>
        <QueryClientProvider client={client}>
          {children}
          <ReactQueryDevtools />
        </QueryClientProvider>
      </GraphsProvider>
    </ApisProvider>
  )
}

function createQueryClient(): QueryClient {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
      },
    },
  })

  return client
}
