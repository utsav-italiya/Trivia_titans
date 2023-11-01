const serverless = require("serverless-http");
const express = require("express");
const router = require("./routes/Routes");
const app = express();
const cors = require("cors");

const corsOptions = {
    origin: '*',
    methods: ['OPTIONS', 'POST', 'GET'],
    allowedHeaders: 'Content-Type',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/auth", router);

module.exports.handler = serverless(app);
