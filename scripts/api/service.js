const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const { isPortInUse } = require("../utils/tool");
const _port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/ip", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

// 检查端口是否被占用
isPortInUse(_port, (isUse, server) => {
  if (!isUse) {
    console.log("端口3000未被占用");
    app.listen(_port, () => {
      console.log(`Server running at http://localhost:${_port}/`);
    });
  }
});
