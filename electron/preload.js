const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateProjectStatus: (callback) => ipcRenderer.on('update-project-status', (_event, value) => callback(value)),
  onOpenUrl: (value) => ipcRenderer.send('open-url', value),
})

window.addEventListener("DOMContentLoaded", () => {
  var ip = require("ip");
  sessionStorage.ip = ip.address();
});

