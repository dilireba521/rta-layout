const { run } = require("./run");

function runInit() {
  run("npm run dev");
  run("npm run dev", {
    cwd: "../rta-quantization",
  });
  run("npm run dev", {
    cwd: "../treasure-fund",
  });
}
runInit();
