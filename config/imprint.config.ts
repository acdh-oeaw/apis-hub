import { createUrl, createUrlSearchParams } from '@acdh-oeaw/lib'

import { env } from '~/config/env.config'

export const url = createUrl({
	baseUrl: 'https://imprint.acdh.oeaw.ac.at',
	pathname: `/${env.NEXT_PUBLIC_REDMINE_ID}`,
	searchParams: createUrlSearchParams( { locale: 'en' }),
})
