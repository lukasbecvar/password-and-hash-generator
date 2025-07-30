/* electron main */
const path = require('path')
const { app, BrowserWindow } = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true,
        icon: path.join(__dirname, './app-icon.png'),
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // load app index
    win.loadFile(path.join(__dirname, '../dist/index.html'))
}

// create app window
app.whenReady().then(createWindow)

// close app window
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
