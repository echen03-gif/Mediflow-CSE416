import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://mediflow-cse416.onrender.com/reset/${token}`, { password });
      alert('Password has been reset');
      navigate("/login")

    } catch (err) {
      console.log(err);
      alert('Error resetting password');
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
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Reset Password
          </Button>
        </form>
      </Box>
    </Container>
  );
}
