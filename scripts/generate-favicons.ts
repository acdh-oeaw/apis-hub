import generateFavicons from '@stefanprobst/favicons'
import { log } from '@stefanprobst/log'
import path from 'path'

async function generate() {
  return generateFavicons({
    inputFilePath: path.join(process.cwd(), 'public', 'assets', 'images', 'logo.svg'),
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
