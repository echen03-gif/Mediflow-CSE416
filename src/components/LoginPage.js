// LoginPage.js

import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    console.log("Handling Login")
    event.preventDefault();
    try {
      if (username === '' || password === '') {
        document.getElementById('loginError').innerHTML = 'Invalid Input';
      } else {
        axios.post("https://mediflow-cse416.onrender.com/login", { username, password }, { withCredentials: true })
          .then(res => {
            console.log(res.data)
            if (res.data.success) {
              navigate('/main/schedule');
            } else {
              console.log("Error")
              document.getElementById('loginError').innerHTML = res.data.message;
            }
          })
          .catch(error => {
            document.getElementById('loginError').innerHTML = "Error, please try again!";
            console.log(error);
          });
      }
    } catch (error) {
      document.getElementById('loginError').innerHTML = "Error, please try again!";
      console.log(error);
    }
  };
  

  return (
    <Container
      sx={{
        backgroundColor: '#FAF3F3',
        padding: 4,
        borderRadius: 1,
        boxShadow: 5,
        textAlign: 'center',
        maxWidth: '400px',
        margin: 'auto',
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 4 }}>
        Welcome Back, Login.
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            marginTop: 2,
            marginBottom: 1,
            background: '#FF8241',
            '&:hover': {
              background: '#FF5034',
            },
          }}
        >
          Login
        </Button>
      </form>
      <Button color="secondary">Forgot Password</Button>
      <p id="loginError"></p>
    </Container>
  );
}