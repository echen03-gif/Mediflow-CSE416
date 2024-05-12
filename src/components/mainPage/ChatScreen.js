import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, TextField, Button, Paper, Box } from '@mui/material';
import { socket } from '../MainPage'; 


function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { roomID } = useParams();
  const messagesEndRef = useRef(null);


  const loggedInUser = sessionStorage.getItem('name')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  // DB API

  useEffect(() => {
    
    scrollToBottom();
  }, [messages]);

  


  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages(messages => [...messages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // Functions

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit('sendMessage', { roomID, text: newMessage, sender: loggedInUser }); 
      setNewMessage('');
    }
  };
  

  // Display

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Chat in Room: {roomID}
      </Typography>
      <Paper sx={{ maxHeight: 400, overflowY: 'auto', padding: 2 }}>
        {messages.map((message, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: message.sender === loggedInUser ? 'flex-end' : 'flex-start' }}>
            <Box sx={{ 
              bgcolor: message.sender === loggedInUser ? 'lightblue' : 'lightgrey',
              padding: 1,
              borderRadius: '10px',
              margin: 1,
              maxWidth: '70%',  // Keeps the messages from being too wide
            }}>
              <Typography variant="body2" color="textSecondary">
                {message.sender}
              </Typography>
              <Typography variant="body1">
                {message.text}
              </Typography>
            </Box>
          </Box>
        ))}
      </Paper>
      <form onSubmit={handleMessageSubmit} style={{ marginTop: 16 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 8 }}>
          Send
        </Button>
      </form>
    </Box>
  );
}

export default ChatScreen;