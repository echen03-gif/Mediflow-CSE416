import React, { useState, useEffect } from 'react';
//import { useParams } from 'react-router-dom';
import { Typography, TextField, Button, Paper, Box } from '@mui/material';

function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const dummyMessages = [
      { id: 1, sender: 'TestAdmin', text: 'Hello, how can I help you?' },
      { id: 2, sender: 'You', text: 'Hi TestAdmin, I have a question about my appointment.' },
      { id: 3, sender: 'TestAdmin', text: 'Sure, go ahead and ask.' },
    ];
    setMessages(dummyMessages);
  }, []);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    const newMessageObj = { id: messages.length + 1, sender: 'You', text: newMessage };
    setMessages([...messages, newMessageObj]);
    setNewMessage(''); // Clear input field after sending message
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Chat with TestAdmin
      </Typography>
      <Paper sx={{ maxHeight: 400, overflowY: 'auto', padding: 2 }}>
        {messages.map((message) => (
          <Box key={message.id} mb={1}>
            <Typography variant="body1">
              {message.sender}: {message.text}
            </Typography>
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
