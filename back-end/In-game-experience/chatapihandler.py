const AWS = require('aws-sdk');

const ENDPOINT = 'aij7henk9j.execute-api.us-east-1.amazonaws.com/production';
const client = new AWS.ApiGatewayManagementApi({endpoint: ENDPOINT});
const names = {};

//send to one feature
const sendToOne = async (id, body) =>{
  
  try{
    await client.postToConnection({
      "ConnectionId": id,
      "Data": Buffer.from(JSON.stringify(body)),
    }).promise();
  }
  catch(err){
    console.log(err);
  }
  
};

//sendToallFeature
const sendToAll = async (ids, body) => {
  const all = ids.map(i => sendToOne(i, body));
  return Promise.all(all);
  
};

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const routeKey = event.requestContext.routeKey;
  let body = {};

  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch (err) {
      console.error('Failed to parse body', err);
    }
  }

  switch (routeKey) {
    case '$connect':
      break;

    case '$disconnect':
      await sendToAll(Object.keys(names), {systemMessage: `${names[connectionId]} has left the chat`})
      delete names[connectionId];
      await sendToAll(Object.keys(names), {members: Object.values(names)})
      break;

    case 'setName':
      names[connectionId] = body.name;
      await sendToAll(Object.keys(names), {systemMessage: `${names[connectionId]} has joined the chat`})
      await sendToAll(Object.keys(names),{members: Object.values(names)})
      break;

    case 'sendPublic':
      await sendToAll(Object.keys(names), {publicMessage: `${names[connectionId]} : ${body.message}`} )
      break;

    default:
      console.error('Unknown routeKey', routeKey);
      break;
  }

  return { statusCode: 200 };
};

