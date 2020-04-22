import electron from 'electron'
import * as React from 'react'
import { shallowEqual, useDispatch } from 'react-redux'

import { Browser } from '../config/browsers'
import { BROWSERS_SET, URL_RECEIVED } from '../config/events'
import BrowserButton from './components/BrowserButton'
import { useSelector } from './store'
import {
  appLoaded,
  browsersReceived,
  keyPress,
  urlReceived,
} from './store/actions'

const { useEffect } = React

const App: React.FC = () => {
  const dispatch = useDispatch()
  const browsers = useSelector((state) => state.browsers, shallowEqual)
  const currentUrl = useSelector((state) => state.app.currentUrl)

  useEffect(() => {
    dispatch(appLoaded())

    /**
     * Setup main->renderer listeners
     */

    // Receive browsers
    electron.ipcRenderer.on(
      BROWSERS_SET,
      (_: unknown, installedBrowsers: Browser[]) => {
        dispatch(browsersReceived(installedBrowsers))
      },
    )

    // Receive URL
    electron.ipcRenderer.on(URL_RECEIVED, (_: unknown, url: string) => {
      dispatch(urlReceived(url))
    })

    // Detect key presses
    document.addEventListener('keydown', (event) => {
      dispatch(keyPress(event))
    })
  }, [dispatch])

  return (
    <>
      <div className="h-4 border-solid border-b border-black">
        Browserosaurus
      </div>
      <div>
        <div>{currentUrl}</div>
        <div>
          <div>
            <div>
              {browsers.map((browser) => (
                <BrowserButton key={browser.id} browser={browser} />
              ))}
            </div>
          </div>
          <div>
            <div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vestibulum faucibus lacus est. Pellentesque ac enim nisl. Proin
                eget neque convallis, egestas risus eu, bibendum magna. Morbi
                ultricies, ex vitae facilisis posuere, eros odio fringilla
                mauris, sit amet lacinia purus elit consequat orci. Nunc
                consequat quam purus, id convallis urna condimentum at. Fusce id
                mollis tortor. Nullam semper magna vel sapien faucibus auctor.
                Etiam eget dui vitae metus interdum tempus ut a velit. Nulla
                efficitur magna a metus fermentum posuere. Suspendisse potenti.
                Phasellus consectetur sem tortor, a tincidunt arcu placerat non.
                Maecenas interdum sit amet neque in cursus. Mauris mi nulla,
                hendrerit in placerat sed, mollis sit amet arcu. Ut sit amet
                metus quam. Morbi vulputate quam vitae libero varius dictum.
                Maecenas in porta nibh. Aenean sed leo non magna accumsan
                dignissim et in nulla. Aenean eleifend fermentum risus, sit amet
                pulvinar velit pulvinar vulputate. In et leo neque. Phasellus
                placerat metus at ex dignissim euismod. Morbi gravida turpis a
                ullamcorper bibendum. Nullam neque ipsum, tempor nec euismod
                eget, congue sed erat. Nulla pretium orci tortor, a gravida quam
                fringilla et. Donec id magna massa. Nullam aliquet urna eros, a
                tempus ligula rhoncus ut. Pellentesque semper, mi eget fermentum
                molestie, nisl mauris porttitor nisl, vitae iaculis odio urna id
                nulla. Nulla consectetur ultricies posuere. Integer a imperdiet
                diam. Duis scelerisque elit at dapibus congue. Praesent
                venenatis neque quis enim aliquet consectetur. In dignissim
                mattis urna, a convallis nunc laoreet in. Sed mollis nec ligula
                quis sollicitudin. Aenean massa dolor, fringilla ut urna eu,
                porttitor tincidunt neque. Nulla facilisi. Suspendisse in leo
                pellentesque, facilisis lorem non, convallis ante. Maecenas
                volutpat vestibulum leo, ac dapibus erat dapibus ut. Cras
                aliquet scelerisque metus eu gravida. Duis in pellentesque
                magna. Fusce sit amet massa et metus rhoncus pulvinar. Fusce sed
                urna vitae lorem egestas cursus blandit ut lacus. Aenean ex
                ante, dapibus ut justo at, ullamcorper lobortis massa. Sed
                tincidunt vel enim id dapibus. Aliquam sed finibus nibh, nec
                ultrices tortor. Nunc vel turpis id purus mollis posuere. In
                ultrices dapibus justo quis aliquam. Proin vitae libero enim.
                Nulla sed sagittis augue, in fermentum ligula. Nunc dignissim
                lorem et ante semper efficitur. Morbi consequat, nisi cursus
                malesuada accumsan, lacus augue venenatis nibh, eu varius dolor
                eros non metus. Vivamus lacinia neque magna, at tempor nisi
                vehicula a. Nunc commodo neque sed odio maximus, ut ornare eros
                venenatis. Nulla facilisi. In hendrerit quam porttitor turpis
                bibendum rutrum. Curabitur nisl magna, tempor sit amet elit
                quis, egestas viverra tellus. Curabitur consectetur justo vel
                feugiat tincidunt. Donec sed turpis vestibulum augue laoreet
                molestie consequat et odio. Sed mattis mauris orci, sollicitudin
                porta mi iaculis sit amet. Maecenas varius vitae elit eget
                euismod. Duis sollicitudin, massa ut volutpat consectetur, felis
                odio vulputate turpis, ac eleifend ipsum tellus viverra purus.
                Morbi fringilla dolor at condimentum congue. Donec sollicitudin
                tortor nibh, a fermentum eros blandit et. Phasellus eget euismod
                mauris.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div />
    </>
  )
}

export default App
