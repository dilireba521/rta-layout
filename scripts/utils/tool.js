const net = require("net");

// 检查端口是否被占用
exports.isPortInUse = function (port, callback) {
  const server = net.createServer();
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE") {
      callback(true, server);
    } else {
      callback(false);
    }
  });
  server.once("listening", () => {
    server.close();
    callback(false);
  });
  server.listen(port);
};
