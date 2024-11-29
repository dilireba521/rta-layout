// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { isPortInUse } = require("../scripts/utils/tool");
const { run } = require("../scripts/run");
const kill = require("kill-port");
process.noAsar = true
// 前端项目列表
const projectList = [
  {
    port: "80",
    cwd: "D:/project/rta-layout",
  },
  {
    port: "5173",
    cwd: "D:/project/rta-quantization",
  },
  {
    port: "5174",
    cwd: "D:/project/treasure-fund",
  },
];

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "../public/favicon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      // 书写渲染进程中的配置
      nodeIntegration: true, //开启true这一步很重要,目的是为了vue文件中可以引入node和electron相关的API
      contextIsolation: true, // 可以使用require方法
      enableRemoteModule: true, // 可以使用remote方法
    },
  });

  
  // 配置热更新
  let env = "development2";
  if (env == "development") {
    const elePath = path.join(__dirname, "../node_modules/electron");
    require("electron-reload")("../", {
      electron: require(elePath),
    });
    // 热更新监听窗口
    mainWindow.loadURL("http://localhost:80");
    // 打开开发工具
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境中要加载文件，打包的版本
    // Menu.setApplicationMenu(null)

    // 打开开发工具
    mainWindow.webContents.openDevTools();
    // 加载 index.html
    mainWindow.loadFile(path.resolve(__dirname, "../dist/index.html")); // 新增
  }
}
// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  ipcMain.on("open-url", (_event, value) => {
    console.log(2);
    openUrl(value);
  });
  createWindow();

  app.on("activate", function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("ready", function () {
  changeProjectsStatus(true);
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on("window-all-closed", function () {
  changeProjectsStatus(false);
  setTimeout(() => {
    if (process.platform !== "darwin") app.quit();
  }, 5000);
});

// 启动,关闭所有前端项目
function changeProjectsStatus(isOpen) {
  for (i = 0; i < projectList.length; i++) {
    const _item = projectList[i];
    isPortInUse(_item.port, (isUse, server) => {
      if (!isUse && isOpen) {
        run(
          "npm run dev",
          {
            cwd: _item.cwd,
          },
          (data) => {
            const _mainWindowAll = BrowserWindow.getAllWindows();
            if (_mainWindowAll?.length > 0) {
              const _mainWindow = _mainWindowAll?.[0];
              _mainWindow.webContents.send(
                "update-project-status",
                JSON.stringify({
                  ..._item,
                  status: data.status,
                })
              );
            }
          }
        );
      } else if (isUse && !isOpen) {
        kill(_item.port, "tcp");
      }
    });
  }
}

// 创建浏览器窗口。
function openUrl(url) {
  shell?.openExternal(url);
}
