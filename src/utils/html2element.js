function html2element(html) {
  var el = document.createElement('div')
  el.innerHTML = html
  return el.firstChild
}

export default html2element
