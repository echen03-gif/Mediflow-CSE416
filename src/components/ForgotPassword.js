import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://mediflow-cse416.onrender.com/forgot-password', { email });
      alert('Password reset link sent!');
      navigate("/login")
    } catch (err) {
      console.log(err);
      alert('Error sending reset link');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        mt={5}
        p={3}
        bgcolor="white"
        borderRadius={4}
        boxShadow={3}
        textAlign="center"
      >
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <Button type="submit" variant="contained" sx={{
            marginTop: 2,
            marginBottom: 1,
            background: '#FF8241',
            '&:hover': {
              background: '#FF5034',
            },
          }}
           fullWidth>
            Send Reset Link
          </Button>
        </form>
      </Box>
    </Container>
  );
}
