
const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const { router } = require("./routes/routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

exports.app = onRequest(app);
