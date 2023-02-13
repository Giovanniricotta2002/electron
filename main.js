const { app, BrowserWindow, Notification, shell, dialog, nativeTheme, ipcMain } = require('electron')
const { access, constants, mkdir } = require('node:fs/promises')
const path = require('path')

const fs = require("fs");

const { execFile } = require("node:child_process");
const pngquant = require("pngquant-bin");

let progressInterval

function accessOrCreateFolder(folderPath, mode = fs.constants.W_OK) {
  return new Promise((resolve, reject) => {
    const normalizePath = path.normalize(folderPath);

    let NOTIFICATION_TITLE = 'ss'
    try {
      let projectFolder = app.getPath('temp') + '/electron/';
      
      //let projectFolder = shell.openExternal(app.getPath('temp') + '/electron/') -> ouvre le dossier
    
      let createDir = mkdir(projectFolder, { recursive: true });
    
      new Notification({ title: NOTIFICATION_TITLE, body: "crée -> " + createDir }).show()
      resolve()
    } catch (err) {
      //showNotification(NOTIFICATION_TITLE, "pas crée -> " + err.message)
    }
  });
}



function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  nativeTheme.themeSource = 'dark'

  
  
  ipcMain.on("openFile", () => {
    let progress = 0;
    //win.setProgressBar(progress)
    dialog.showOpenDialog({
      filters: [{ name: "Images", extensions: ['jpg', "png"] }], 
      properties: ["openFile", "multiSelections"]
    }).then((result) => {
      accessOrCreateFolder(path.normalize(`${app.getPath("temp")}/electron`)).then(() => {

        let filePath = []
        result.filePaths.forEach(f => {
          filePath.push(path.basename(f.replaceAll('\'é', '_e').replaceAll(' ', '_')))

          execFile(pngquant, [
            '--quality=65-80', 
            '-o', 
            path.normalize(`${app.getPath('temp')}\\electron\\${path.basename(f.replaceAll('\'é', '_e').replaceAll(' ', '_'))}`), 
            f
          ], () => {
            setTimeout(() => {
              progress += 100 / result.filePaths.length / 100;
              win.setProgressBar(progress);
              
            }, 1000);
          }, err => {
            console.log('Image minified!' + `${app.getPath('temp')}\\electron\\`);
          });
        })
  
      }).then(() => {
        win.setProgressBar(-1);
        shell.openPath(path.normalize(`${app.getPath('temp')}\\electron`))
        //stopLoading()
        showNotification("Fichier compresé", "Le fichier a été comprés")
      })
    }).catch(err => {
      console.log(err)
    })
  })
  
  
  
  
  
  
  win.loadFile('index.html')
}









function folder() {
  let NOTIFICATION_TITLE = 'ss'
  try {
    let projectFolder = app.getPath('temp') + '/electron/';
    
    //let projectFolder = shell.openExternal(app.getPath('temp') + '/electron/') -> ouvre le dossier
  
    let createDir = mkdir(projectFolder, { recursive: true });
  
    //new Notification({ title: NOTIFICATION_TITLE, body: "crée -> " + createDir }).show()
  } catch (err) {
    showNotification(NOTIFICATION_TITLE, "pas crée -> " + err.message)
  }
}


function showNotification (title, body) {
  new Notification({ title: title, body: body }).show()
}

app.whenReady().then(createWindow).then(folder)

app.on('before-quit', () => {
  clearInterval(progressInterval)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})