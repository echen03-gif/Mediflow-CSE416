// Updated LoginPage Component
import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleForgotPasswordClick = () => {
    navigate('/forgot-password');
  };

  const handleLogin = (event) => {
    event.preventDefault();
    try {
      if (username === '' || password === '') {
        document.getElementById('loginError').innerHTML = 'Invalid Input';
      } else {
        axios.post("https://mediflow-cse416.onrender.com/login", { username, password }, { withCredentials: true })
          .then(res => {
            if (res.data.success) {
              sessionStorage.setItem('token', res.data.token);
              sessionStorage.setItem('user', res.data.user);
              sessionStorage.setItem("name", res.data.name);
              sessionStorage.setItem("isAdmin", res.data.isAdmin);
              if(res.data.profilePic){
                sessionStorage.setItem("pfp", res.data.profilePic.split('/').pop());
              }
              navigate('/main/schedule');
            } else {
              document.getElementById('loginError').innerHTML = res.data.message;
            }
          })
          .catch(error => {
            document.getElementById('loginError').innerHTML = "Error, please try again!";
          });
      }
    } catch (error) {
      document.getElementById('loginError').innerHTML = "Error, please try again!";
    }
  };

  return (
    <Container
      sx={{
        backgroundColor: "#FAF3F3",
        padding: 4,
        borderRadius: 1,
        boxShadow: 5,
        textAlign: "center",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 4 }}>
        Welcome Back
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          inputProps={{ "data-testid": "username-input" }}
          autoComplete="username"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputProps={{ "data-testid": "password-input" }}
          autoComplete="current-password"
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            marginTop: 2,
            marginBottom: 1,
            background: "#FF8241",
            "&:hover": {
              background: "#FF5034",
            },
          }}
          data-testid="login-button"
        >
          Login
        </Button>
      </form>
      <Button
        color="secondary"
        onClick={handleForgotPasswordClick}
        data-testid="forgot-password-button"
      >
        Forgot Password
      </Button>
      <p id="loginError" data-testid="login-error"></p>
    </Container>
  );
}
