const serverless = require("serverless-http");
const express = require("express");
const router = require("./routes/route");
const app = express();
const cors = require("cors");


app.use(cors());
app.use(express.json());
app.use(router);

module.exports.handler = serverless(app);
