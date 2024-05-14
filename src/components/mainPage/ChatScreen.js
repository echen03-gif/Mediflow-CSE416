import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, TextField, Button, Paper, Box } from '@mui/material';
import { getSocket } from '../socket';
import axios from 'axios';


function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { roomID } = useParams();
  const messagesEndRef = useRef(null);
  const [recipient, setRecipient] = useState('');

  const loggedInUser = sessionStorage.getItem('name')
  const senderId = sessionStorage.getItem('user');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  // DB API

  useEffect(() => {
    
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      if(roomID.indexOf("-") > -1){
      const userIds = roomID.split("-");
      const currentUserID = sessionStorage.getItem('user');
      const otherUserID = userIds.find(id => id !== currentUserID);
      const response = await axios.get(`https://mediflow-cse416.onrender.com/userID/${otherUserID}`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });
      setRecipient(response.data.name);
      } else {
        const recipient = await axios.get(`https://mediflow-cse416.onrender.com/userAppointments/${roomID}`, {
          headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
      });
        setRecipient(recipient.data)
      }
      
      try {
            
      
            const messagesResponse = await axios.get(`https://mediflow-cse416.onrender.com/messages/${roomID}`, {
              headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token')
              }
          });
            
            setMessages(messagesResponse.data);
        } catch (error) {
            // Handle error
            console.error('Error fetching user data:', error);
        }
    };

    fetchData();

}, [roomID]);



  useEffect(() => {

    const socket = getSocket();


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
      const socket = getSocket()
      socket.emit('sendMessage', { roomID, text: newMessage, sender: loggedInUser, senderId: senderId }); 
      setNewMessage('');
    }
  };
  

  // Display

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Chat with: {recipient}
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