import { apps } from '../src/config/apps'
import { filterAppsByInstalled } from '../src/utils/filterAppsByInstalled'

filterAppsByInstalled(apps).then((installedApps) => {
  // eslint-disable-next-line no-console
  console.table(installedApps)
})
