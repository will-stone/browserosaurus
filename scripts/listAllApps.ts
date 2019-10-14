import { scanForApps } from '../src/utils/scanForApps'

// eslint-disable-next-line no-console
scanForApps().then(apps => console.log(apps))
