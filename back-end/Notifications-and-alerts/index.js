const serverless = require("serverless-http");
const express = require("express");
const app = express();
const cors = require("cors");
const AWS = require('aws-sdk');

const corsOptions = {
    origin: '*',
    methods: ['OPTIONS', 'POST', 'GET'],
    allowedHeaders: 'Content-Type',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
const sqs = new AWS.SQS();

app.post('/api/storeMessage', async (req, res) => {
  try {
    console.log(req.body);

    const params = {
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/262272685619/MyTriviaNotificationQueue',
      MessageBody: JSON.stringify(req.body),
    };

    await sqs.sendMessage(params).promise();

    res.status(200).send({
      status: 'Success',
      message: 'Message stored successfully in the SQS queue.',
    });
  } catch (error) {
    console.error('Error storing message:', error);
    res.status(500).send({
      status: 'Error',
      message: 'Error storing message.',
    });
  }
});


module.exports.handler = serverless(app);
