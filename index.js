const {app, BrowserWindow, ipcMain} = require('electron')
const Path = require('path')
const Url = require('url')

const config = require('./config')
const Wunderground = require('./wunderground')

const wg = new Wunderground(config.WundergroundKey)

let win

app.on('ready', () => {
  createWindow()
  setupIPC()
})

function createWindow () {
  // Create the browser window
  win = new BrowserWindow({ width: 1100, height: 673 })

  // load the UI
  win.loadURL(Url.format({
    pathname: Path.join(__dirname, 'ui', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // win.webContents.openDevTools()
}

function setupIPC () {
  ipcMain.on('getConditions', getConditions)
  ipcMain.on('get10Day', get10Day)
  ipcMain.on('getForecast', getForecast)
}

async function getConditions (ev, arg) {
  arg = arg || undefined
  console.log('getConditions message received', arg)
  const data = await wg.currentConditions(arg).catch(fetchError)
  ev.sender.send('getConditions', data)
}

async function get10Day (ev, arg) {
  arg = arg || undefined
  console.log('get10Day message received', arg)
  const data = await wg.forecast10Day(arg).catch(fetchError)
  ev.sender.send('get10Day', data)
}

async function getForecast (ev, arg) {
  arg = arg || undefined
  console.log('getForecast message received', arg)
  const data = await wg.forecast10Day(arg).catch(fetchError)
  // const data = await wg.forecast(arg).catch(fetchError)
  ev.sender.send('getForecast', data)
}

function fetchError (err) {
  console.error('Fetch error:', err)
  return Promise.resolve({error: err})
}
