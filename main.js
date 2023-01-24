const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')
const resizeImg = require('resize-img')

process.env.NODE_ENV = 'production'

const isDev = (process.env.NODE_ENV !== 'production')
const isMac = (process.platform === 'darwin')

//make mainWindow global
let mainWindow

//Creating the main window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: isDev ? 1000 : 500,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, './preload.js'),
    }
  })

  //Open dev tools if in dev env
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadFile(path.join(__dirname, './renderer/index.html'))
}
//Create about window
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: "About Image Resizer",
    width: 300,
    height: 300,
  })

  aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'))
}

// App is ready
app.whenReady().then(() => {
  createMainWindow()

  //Implements menu
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

  //remove mainwindow on memory when close
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

//Menu template
const menu = [
  {
    role: 'fileMenu'
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click: createAboutWindow
      }
    ]
  }
]

//Respond to ipcRenderer resize
ipcMain.on('image:resize', (e, options) => {
  options.dest = path.join(os.homedir(), 'imagesizer')
  resizeImage(options);
})

// Resize the image
async function resizeImage(options) {
  try {
    const { imgPath, height, width, dest } = options
    const newPath = await resizeImg(fs.readFileSync(imgPath), {
      width: +width,
      height: +height,
    })
    //create file name
    const filename = path.basename(imgPath)
    //create destination folder if not exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest)
    }
    //write file to destination
    fs.writeFileSync(path.join(dest, filename), newPath)
    //send success message
    mainWindow.webContents.send('image:done')
    //open de destination folder
    shell.openPath(dest)
  } catch (error) {
    console.error(error)
  }
}

app.on('window-all-close', () => {
  if (!isMac) {
    app.quit()
  }
})