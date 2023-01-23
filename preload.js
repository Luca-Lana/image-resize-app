const os = require('os');
const path = require('path');
const Tostify = require('toastify-js')
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir(),
})

contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args),
})
contextBridge.exposeInMainWorld('Tostify', {
  toast: (options) => Tostify(options).showToast(),
})
