const version = '10.11.1'

const downloadButton = document.querySelector('#js-download-button')
downloadButton.href = `https://github.com/will-stone/browserosaurus/releases/download/v${version}/Browserosaurus-${version}.dmg`

downloadButton.innerHTML = `Download Browserosaurus v${version}`
