import { apps } from '../src/config/apps'
import { filterAppsByInstalled } from '../src/main/utils/filter-apps-by-installed'

filterAppsByInstalled(apps).then((installedApps) => {
  // eslint-disable-next-line no-console
  console.table(installedApps)
})
