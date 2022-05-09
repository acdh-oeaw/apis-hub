import { createUrl } from '@stefanprobst/request'

export const url = createUrl({
  baseUrl: 'https://shared.acdh.oeaw.ac.at',
  pathname: '/acdh-common-assets/api/imprint.php',
  searchParams: { outputLang: 'en', serviceID: 14595 },
})
