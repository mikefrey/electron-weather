const {ipcRenderer} = require('electron')
const template = require('lodash/template')

module.exports = {
  start () {
    this.app = document.getElementById('app')
    this.tmplHome = template(document.getElementById('tmplHome').innerHTML)
    this.tmplWeather = template(document.getElementById('tmplWeather').innerHTML)

    this.render(this.app, this.tmplHome, {})

    this.app.addEventListener('click', ev => {
      if (ev.srcElement.id === 'search') {
        const inLocation = document.getElementById('location')
        const location = inLocation.value || undefined
        this.showWeather(location)
      }
    })
    this.app.addEventListener('keypress', ev => {
      if (ev.srcElement.id === 'location' && ev.key === 'Enter') {
        const location = ev.srcElement.value || undefined
        this.showWeather(location)
      }
    })
  },

  async showWeather (location) {
    const weather = await getWeather(location)
    console.log(weather)
    this.render(this.app, this.tmplWeather, weather)
  },

  render (app, tmpl, data) {
    const html = tmpl(data)
    app.innerHTML = html
  }
}

async function getWeather (location) {
  const currentConditions = await ipc('getConditions', location)
  const forecast = await ipc('getForecast', location)
  return {
    forecast,
    currentConditions
  }
}

function ipc (channel, value) {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(channel, value)
    ipcRenderer.once(channel, (resp, result) => {
      resolve(result)
    })
  })
}
