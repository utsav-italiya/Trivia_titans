import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const tableName = 'trivianotificationtable';

export const handler = async (event, context) => {
  try {
    for (const record of event.Records) {
      const messageBody = JSON.parse(record.body);
      const { userId = 'all', message } = messageBody;
      const read = false;
      const messageId = uuidv4();

      // Store the message in DynamoDB
      const params = {
        TableName: tableName,
        Item: {
          messageId: messageId,
          userId,
          message,
          read,
        },
      };

      console.log(params)

      await dynamodb.put(params).promise();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Messages processed and stored in DynamoDB.' }),
    };
  } catch (err) {
    console.error('Error storing messages in DynamoDB:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while processing the messages.' }),
    };
  }
};
