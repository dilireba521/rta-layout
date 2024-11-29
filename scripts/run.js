const { exec } = require("child_process");

exports.run = function (cmd, options, cb) {
  const ls = exec(cmd, options, function (err, stdout, stderr) {
    if (err) {
      cb &&
        cb({
          status: "error",
          data: err,
        });
      console.log("exec error: ", err);
    }
  });
  ls.stdout.on("data", (data) => {
    cb &&
      cb({
        status: "success",
        data: data,
      });
    console.log(`stdout: ${data}`);
  });
  ls.stderr.on("data", (data) => {
    cb &&
      cb({
        status: "error",
        data: data,
      });
    console.error(`stderr: ${data}`);
  });
  ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
};
