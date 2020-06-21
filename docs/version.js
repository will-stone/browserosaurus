const version = '10.9.0'

const downloadButton = document.querySelector('#js-download-button')
downloadButton.href = `https://github.com/will-stone/browserosaurus/releases/download/v${version}/Browserosaurus-${version}.dmg`

downloadButton.innerHTML = `Download Browserosaurus v${version} for Mac`
