import 'tailwindcss/tailwind.css'
import '@/styles/index.css'

import { ErrorBoundary } from '@stefanprobst/next-error-boundary'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import Head from 'next/head'
import { Fragment } from 'react'

import { ErrorPage } from '@/app/error-page'
import { PageLayout } from '@/app/page.layout'
import { Providers } from '@/app/providers'
import { AnalyticsScript } from '@/features/analytics/analytics-script'
import { reportPageView } from '@/features/analytics/analytics-service'
import { ToastContainer } from '@/features/toast/toast-container'

export default function App(props: AppProps): JSX.Element {
  const { Component, pageProps } = props

  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>APIS Hub</title>
        <meta
          name="description"
          content="Visually explore social networks in APIS (Austrian Prosopographical | Biographical Information System) datasets."
        />
      </Head>
      <AnalyticsScript />
      <ErrorBoundary fallback={<ErrorPage />}>
        <Providers>
          <PageLayout>
            <Component {...pageProps} />
          </PageLayout>
          <ToastContainer />
        </Providers>
      </ErrorBoundary>
    </Fragment>
  )
}

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  switch (metric.name) {
    case 'Next.js-hydration':
      /** Register right after hydration. */
      break
    case 'Next.js-route-change-to-render':
      /** Register page views after client-side transitions. */
      reportPageView()
      break
    default:
      break
  }
}
