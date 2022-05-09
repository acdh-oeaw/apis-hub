// @ts-expect-error Missing module declaration.
import createBundleAnalyzer from '@next/bundle-analyzer'
import { log } from '@stefanprobst/log'

/** @typedef {import('next').NextConfig} NextConfig */

const isProductionDeploy =
  process.env['NEXT_PUBLIC_BASE_URL'] === 'https://apis-hub.acdh-dev.oeaw.ac.at'

/** @type {NextConfig} */
const config = {
  experimental: {
    newNextLinkBehavior: true,
    outputStandalone: true,
  },
  async headers() {
    const headers = [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/assets/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
    ]

    if (!isProductionDeploy) {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      })

      log.warn('Indexing by search engines is disallowed.')
    }

    return headers
  },
  pageExtensions: ['api.ts', 'page.tsx'],
  reactStrictMode: true,
}

/** Array<(config: NextConfig) => NextConfig> */
const plugins = [createBundleAnalyzer({ enabled: process.env['BUNDLE_ANALYZER'] === 'enabled' })]

export default plugins.reduce((config, plugin) => {
  return plugin(config)
}, config)
