// const version = '12.3.1'

const downloadButton = document.querySelector('#js-download-button')
// TODO figure out how to detect arch
downloadButton.href = `https://github.com/will-stone/browserosaurus/releases/latest`

downloadButton.innerHTML = `Download Browserosaurus`
