const version = '12.3.1'

const downloadButton = document.querySelector('#js-download-button')
downloadButton.href = `https://github.com/will-stone/browserosaurus/releases/download/v${version}/Browserosaurus-${version}.dmg`

downloadButton.innerHTML = `Download Browserosaurus v${version}`

const homebrewCaskCommand = "brew install browserosaurus --cask"
const homebrewCaskButton = document.querySelector("#js-homebrew-cask-button")
homebrewCaskButton.onclick = function () {
  navigator.clipboard.writeText(homebrewCaskCommand)
}

$().ready(function () {
  $('[data-toggle="tooltip"]').tooltip()
})