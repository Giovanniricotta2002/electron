const { app, BrowserWindow } = require('electron')
const { maxHeaderSize } = require('http')
const path = require('path')

function loading_bar()
{
  const INCREMENT = 0.03
  const INTERVAL_DELAY = 100 // ms
  let c = 0
  progressInterval = setInterval(() => {
    win.setProgressBar(c)
    if (c < 2) {
      c += INCREMENT
    } else {
      c = (-INCREMENT * 5) // reset to a bit less than 0 to show reset state
    }
  }, INTERVAL_DELAY)
}

function createWindow () {
  const win = new BrowserWindow({
    width: maxHeaderSize,
    height: maxHeaderSize,
    icon: 'src/compress.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



