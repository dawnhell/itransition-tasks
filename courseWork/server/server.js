const bodyParser = require("body-parser");
const express    = require("express");
const path       = require("path");
const http       = require("http");

const app        = express();
const port       = process.env.Port || 3131;
const router     = require("./routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({ extended: false }));
app.use(express.static(path.join(__dirname, "../dist")));
// app.use("/home", router);
app.use("/user", router);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

http.createServer(app).listen(port, function () {
  console.log("Server is running on localhost:" + port);
});
