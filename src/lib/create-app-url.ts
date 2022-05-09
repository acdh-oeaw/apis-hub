import type { UrlInit } from '@stefanprobst/request'
import { createUrl } from '@stefanprobst/request'

import { baseUrl } from '~/config/site.config'

type CreateAppUrlArgs = Omit<UrlInit, 'baseUrl'>

export function createAppUrl(args: CreateAppUrlArgs): URL {
  return createUrl({ ...args, baseUrl })
}
