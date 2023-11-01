import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';

// ChatClient component responsible for rendering the chat interface
const ChatClient = (props) => {
  return (
    <div style={{
      position: 'absolute',
      width: '35%',
      height: '100%',
      backgroundColor: '#f4ede3',
      display: 'flex',
      alignItems: 'center',
    }}>
      <CssBaseline />
      <Container maxWidth="lg" style={{ height: '90%' }}>
        <Grid container style={{ height: '100%' }}>
          {/* <Grid item xs={2} style={{ backgroundColor: '#3e103f', color: 'white' }}>
            <List component="nav">
              {props.members.map(item =>
                <ListItem key={item} onClick={() => { props.onPrivateMessage(item); }} button>
                  <ListItemText style={{ fontWeight: 800 }} primary={item} />
                </ListItem>
              )}
            </List>
          </Grid> */}
          <Grid style={{ position: 'relative' }} item container direction="column" xs={10} >
            <Paper style={{ flex: 1 }}>
              <Grid item container style={{ height: '100%' }} direction="column">
                <Grid item container style={{ flex: 1 }}>
                  <ul style={{
                    paddingTop: 20,
                    paddingLeft: 44,
                    listStyleType: 'none',
                  }}>
                    {props.chatRows.map((item, i) =>
                      <li key={i} style={{ paddingBottom: 9 }}>{item}</li>
                    )}
                  </ul>
                </Grid>
                <Grid item style={{ margin: 10 }}>
                  {props.isConnected && <Button style={{ marginRight: 7 }} variant="outlined" size="small" disableElevation onClick={props.onPublicMessage}>Send Public Message</Button>}
                  {props.isConnected && <Button variant="outlined" size="small" disableElevation onClick={props.onDisconnect}>Disconnect</Button>}
                  {!props.isConnected && <Button variant="outlined" size="small" disableElevation onClick={props.onConnect}>Connect</Button>}
                </Grid>
              </Grid>
              <div style={{
                position: 'absolute',
                right: 9,
                top: 8,
                width: 12,
                height: 12,
                backgroundColor: props.isConnected ? '#00da00' : '#e2e2e2',
                borderRadius: 50,
              }} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div >
  );
};

  const URL = 'wss://aij7henk9j.execute-api.us-east-1.amazonaws.com/production'; //websocket URL

  // Chat component responsible for managing the WebSocket connection and chat functionality 
  const Chat = () => {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [members, setMembers] = useState([]);
  const [chatRows, setChatRows] = useState([]);

  
   // Event handlers for WebSocket connection
  const onSocketOpen = useCallback(() => {
    setIsConnected(true);
    const name = prompt('Enter your name');
    socket.current?.send(JSON.stringify({ action: 'setName', name }));
  }, []);
  
   // Connecting to the WebSocket server
  const onSocketClose = useCallback(() => {
    setMembers([]);
    setIsConnected(false);
    setChatRows([]);
  }, []);
  
  // Closing WebSocket connection when component is unmounted
  const onSocketMessage = useCallback((dataStr) => {
    const data = JSON.parse(dataStr);
    if (data.members) {
      setMembers(data.members);
    } else if (data.publicMessage) {
      setChatRows(oldArray => [...oldArray, <span><b>{data.publicMessage}</b></span>]);
    } else if (data.privateMessage) {
      alert(data.privateMessage);
    } else if (data.systemMessage) {
      setChatRows(oldArray => [...oldArray, <span><i>{data.systemMessage}</i></span>]);
    } 
  }, []);
  
  // Closing WebSocket connection when component is unmounted
  const onConnect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      socket.current = new WebSocket(URL);
      socket.current.addEventListener('open', onSocketOpen);
      socket.current.addEventListener('close', onSocketClose);
      socket.current.addEventListener('message', (event) => {
        onSocketMessage(event.data);
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      socket.current?.close();
    };
  }, []);
  
  // Sending private message logic
  const onSendPrivateMessage = useCallback((to) => {
    const message = prompt('Enter private message for ' + to);
    socket.current?.send(JSON.stringify({
      action: 'sendPrivate',
      message,
      to,
    }));
  }, []);
  

  // Sending public message logic
  const onSendPublicMessage = useCallback(() => {
    const message = prompt('Enter public message');
    socket.current?.send(JSON.stringify({
      action: 'sendPublic',
      message,
    }));
  }, []);
  
  // Disconnecting from the WebSocket server
  const onDisconnect = useCallback(() => {
    if (isConnected) {
      socket.current?.close();
    }
  }, [isConnected]);

  return (
    <ChatClient
      isConnected={isConnected}
      members={members}
      chatRows={chatRows}
      onPublicMessage={onSendPublicMessage}
      onPrivateMessage={onSendPrivateMessage}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
    />
  );
};

export default Chat;
