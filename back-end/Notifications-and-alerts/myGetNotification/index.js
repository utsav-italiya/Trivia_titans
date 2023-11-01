const serverless = require("serverless-http");
const express = require("express");
const app = express();
const cors = require("cors");
const AWS = require('aws-sdk');

const corsOptions = {
  origin: '*',
  methods: ['OPTIONS', 'POST', 'GET'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const tableName = 'trivianotificationtable';

app.post('/get-notification', async (req, res) => {
  try {
    console.log("this is true", req.body.userId);
    const { userId } = req.body;
    console.log("this is true", !userId);

    if (!userId) {
      return res.status(400).json({ error: 'userId parameter is missing.' });
    }

    const params = {
      TableName: tableName,
      FilterExpression: '(userId = :userId OR userId = :all) AND #read = :readValue',
      ExpressionAttributeNames: {
        '#read': 'read',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':all': 'all',
        ':readValue': false,
      },
    };

    const result = await dynamodb.scan(params).promise();
    res.status(200).send(result.Items);
  } catch (err) {
    console.error('Error retrieving messages from DynamoDB:', err);
    res.status(500).send({ error: 'An error occurred while retrieving the messages.' });
  }
});

app.post('/update-message-read-status', async (req, res) => {
  try {
    const { messageId } = req.body;

    if (!messageId) {
      return res.status(400).json({ error: 'messageId parameter is missing.' });
    }

    const params = {
      TableName: tableName,
      Key: {
        messageId: messageId,
      },
      UpdateExpression: 'SET #read = :readValue',
      ExpressionAttributeNames: {
        '#read': 'read',
      },
      ExpressionAttributeValues: {
        ':readValue': true,
      },
      ReturnValues: 'ALL_NEW', // Return the updated item in the response
    };

    const result = await dynamodb.update(params).promise();
    res.status(200).send(result.Attributes);
  } catch (err) {
    console.error('Error updating message read status in DynamoDB:', err);
    res.status(500).send({ error: 'An error occurred while updating the message read status.' });
  }
});



module.exports.handler = serverless(app);
