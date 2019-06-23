import { ipcRenderer } from 'electron'
import * as mousetrap from 'mousetrap'
import { useEffect, useState } from 'react'
import { Activities, Activity } from '../../config/activities'
import { ACTIVITIES_SET, ACTIVITY_RUN, FAV_SET } from '../../config/events'

export const useActivities = (): [Activities | {}, Activity | undefined] => {
  const [activities, setActivities] = useState<Activities | {}>({})
  const [favName, setFavName] = useState<string>('')

  useEffect(() => {
    ipcRenderer.on(FAV_SET, (_: unknown, name: string) => {
      setFavName(name)
      mousetrap.bind('enter', e => {
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
      (_: unknown, installedActivities: Activities) => {
        // setup hotkeys
        Object.keys(installedActivities).forEach(actName => {
          const act = installedActivities[actName]
          if (act && act.hotKey) {
            mousetrap.bind(act.hotKey, e => {
              e.preventDefault()
              ipcRenderer.send(ACTIVITY_RUN, actName)
            })
          }
        })
        setActivities(installedActivities)
      },
    )

    return function cleanup() {
      ipcRenderer.removeAllListeners(ACTIVITIES_SET)
    }
  }, [])

  const activitiesWithoutFav = Object.keys(activities).reduce(
    (acc, cur) => {
      if (cur !== favName) acc[cur] = activities[cur]
      return acc
    },
    {} as Activities,
  )

  return [activitiesWithoutFav, activities[favName]]
}
