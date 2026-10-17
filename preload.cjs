const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("mcsr", {
  get: (endpoint) => ipcRenderer.invoke("mcsr:get", endpoint),
  speedrun: (endpoint) => ipcRenderer.invoke("speedrun:get", endpoint)
});
