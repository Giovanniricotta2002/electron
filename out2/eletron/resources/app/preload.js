const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // send "openFile"
  openFile: () => {
    ipcRenderer.send("openFile");
  }
});