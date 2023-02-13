const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const { access, constants } = require('node:fs/promises');
const path = require('path')


let progressInterval

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'dark'
  })

  const INCREMENT = 0.03
  const INTERVAL_DELAY = 100 // ms

  let c = 0
  progressInterval = setInterval(() => {
    // update progress bar to next value
    // values between 0 and 1 will show progress, >1 will show indeterminate or stick at 100%
    win.setProgressBar(c)

    // increment or reset progress bar
    if (c < 2) {
      c += INCREMENT
    } else {
      c = (-INCREMENT * 5) // reset to a bit less than 0 to show reset state
    }
  }, INTERVAL_DELAY)
}


function showNotification () {
    let NOTIFICATION_TITLE = 'ss'
    try {
        access('C:/Users/giova/AppData/Local/Temp/{0B25F571-265F-458E-BCAF-B76019FF1DEE}', constants.R_OK | constants.W_OK);
        new Notification({ title: NOTIFICATION_TITLE, body: "Marche" }).show()
    } catch {
        new Notification({ title: NOTIFICATION_TITLE, body: "marche pas" }).show()
      }
}


app.on('before-quit', () => {
    clearInterval(progressInterval)
  })


app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
}).then(showNotification)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})