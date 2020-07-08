import pino from 'pino'

import { apps } from '../src/config/apps'
import { filterAppsByInstalled } from '../src/utils/filterAppsByInstalled'

const logger = pino({ prettyPrint: true })

filterAppsByInstalled(apps).then((installedApps) => logger.info(installedApps))
