import { ipcRenderer } from 'electron'
import * as mousetrap from 'mousetrap'
import { useEffect, useState } from 'react'
import { activities, ActivityName } from '../../config/activities'
import { ACTIVITIES_SET, ACTIVITY_RUN, FAV_SET } from '../../config/events'

export const useActivities = (): ActivityName[] => {
  const [activityNames, setActivityNames] = useState<ActivityName[]>([])
  const [favName, setFavName] = useState<ActivityName>('Safari')

  useEffect(() => {
    ipcRenderer.on(FAV_SET, (_: unknown, name: ActivityName) => {
      setFavName(name)
      mousetrap.unbind(['enter', 'option+enter'])
      name &&
        mousetrap.bind(['enter', 'option+enter'], e => {
          // When a browser has been selected with the mouse, it gets (invisible) focus.
          // This means when enter is pressed next, it will activate the focused activity AND fire
          // this key binding, causing two identical tabs to open in the selected browser.
          // This fixes that.
          e.preventDefault()
          ipcRenderer.send(ACTIVITY_RUN, name)
        })
    })

    return function cleanup() {
      ipcRenderer.removeAllListeners(FAV_SET)
    }
  }, [])

  useEffect(() => {
    ipcRenderer.on(
      ACTIVITIES_SET,
      (_: unknown, installedActivityNames: ActivityName[]) => {
        // setup hotkeys
        installedActivityNames.forEach(actName => {
          const act = activities[actName]
          if (act && act.hotKey) {
            mousetrap.bind([act.hotKey, 'option+' + act.hotKey], e => {
              e.preventDefault()
              ipcRenderer.send(ACTIVITY_RUN, actName)
            })
          }
        })
        setActivityNames(installedActivityNames)
      },
    )

    return function cleanup() {
      ipcRenderer.removeAllListeners(ACTIVITIES_SET)
    }
  }, [])

  return [favName, ...activityNames.filter(name => name !== favName)]
}
