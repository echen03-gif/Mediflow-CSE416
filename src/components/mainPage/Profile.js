import React, { useEffect, useState } from 'react';
import { Avatar, Button, Typography, Box, Card, CardContent, Grid, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const userId = sessionStorage.getItem('user');

      const response = await axios.post(`https://mediflow-cse416.onrender.com/profile-upload/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      sessionStorage.setItem("pfp", response.data.imagePath.split('/').pop());

      alert('Upload successful!');
      setUser({ ...user, profilePic: response.data.imagePath });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed!');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userId = sessionStorage.getItem('user');
      const userResponse = await axios.get(`https://mediflow-cse416.onrender.com/userID/${userId}`, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      });
      setUser(userResponse.data);
      console.log("user data" + userResponse.data);
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12} md={4}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={`https://mediflow-cse416.onrender.com/uploads/${sessionStorage.getItem('pfp')}`}
                sx={{ width: 80, height: 80, mr: 2 }}
              />
              <Box>
                <Typography variant="h5" data-testid="user-name">{user.name}</Typography>
                <Typography variant="subtitle1" color="textSecondary" data-testid="user-role">{user.role}</Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="textSecondary" data-testid="user-email">Email: {user.email}</Typography>
            <Typography variant="body2" color="textSecondary">Joined: {new Date(user.joined).toLocaleDateString()}</Typography>
            <Typography variant="body2" color="textSecondary" data-testid="user.staffID">Staff ID: {user.staffID}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={`https://mediflow-cse416.onrender.com/uploads/${sessionStorage.getItem('pfp')}`}
                sx={{ width: 90, height: 90, mb: 2 }}
                data-testid="profile-avatar"
              />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*"
                style={{ marginBottom: 20 }}
                data-testid="file-input"

              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!file}
                data-testid="upload-button"

              >
                Upload Image
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Weekly Schedule</Typography>
            {Object.entries(user.schedule).map(([day, shifts]) => (
              <Box key={day} sx={{ mb: 1 }}>
                <Typography variant="subtitle1">{day}:</Typography>
                {shifts.map((shift, index) => (
                  <Typography key={index} variant="body2" color="textSecondary">
                    {new Date(`1970-01-01T${shift.start}Z`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - 
                    {new Date(`1970-01-01T${shift.end}Z`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                  </Typography>
                ))}
              </Box>
            ))}
          </CardContent>
        </Card>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Processes Involved</Typography>
                <List dense>
                  {user.processes.map(process => (
                    <ListItem key={process._id}>
                      <ListItemText primary={process.name} secondary={`Created: ${new Date(process.created).toLocaleDateString()}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Procedures Involved</Typography>
                <List dense>
                  {user.procedures.map(procedure => (
                    <ListItem key={procedure._id}>
                      <ListItemText primary={procedure.name} secondary={`Duration: ${procedure.estimatedDuration} mins, Type: ${procedure.staffType}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Profile;
