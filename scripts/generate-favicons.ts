import generateFavicons from '@stefanprobst/favicons'
import { log } from '@stefanprobst/log'
import path from 'path'

import { metadata } from '~/config/metadata.config'

async function generate() {
  return generateFavicons({
    name: metadata.title,
    color: '#fab300;',
    inputFilePath: path.join(process.cwd(), 'public', metadata.logo.href),
    outputFolder: path.join(process.cwd(), 'public'),
  })
}

generate()
  .then(() => {
    log.success('Successfully generated favicons.')
  })
  .catch((error) => {
    log.error('Failed to generated favicons.\n', error)
  })
