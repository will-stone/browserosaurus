const electron = require('electron')

electron.ipcRenderer.on('updateAvailable', (event, updateUrl) => {
  const update = document.getElementById('update')
  const downloadButton = document.getElementById('downloadButton')

  if (updateUrl) {
    downloadButton.addEventListener('click', () =>
      electron.ipcRenderer.send('open-download-link', updateUrl)
    )
    update.classList.add('updateAvailable')
  } else {
    update.classList.add('noUpdate')
  }
})

electron.ipcRenderer.send('check-for-update')
