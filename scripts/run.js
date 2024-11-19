import { exec } from "child_process";

export function run(cmd, options) {
  const ls = exec(cmd,options, function (err, stdout, stderr) {
    if (err) {
      console.log("exec error: ", err);
    }
  });
  ls.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });
  ls.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
  ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}
run("npm run dev");
run("npm run dev",{
  cwd:'../rta-quantization'
});
run("npm run dev",{
  cwd:'../treasure-fund'
});
