const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mysql = require("mysql2");



//middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(cors());

// //เชื่อม database
// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "project_36",
// });





app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
