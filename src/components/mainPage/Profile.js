import React, { useEffect, useState } from 'react';
import { Avatar, Button, Typography, Box, Card, CardContent, Grid, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [processes, setProcesses] = useState([]);
 // const [procedures, setProcedures] = useState([]);
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('profilePic', file);
  
    try {
      const userId = sessionStorage.getItem('user');

      const response = await axios.post(`https://mediflow-cse416.onrender.com/profile-upload/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`  // Assuming you are using bearer token authentication
        }
      });
      sessionStorage.setItem("pfp", response.data.imagePath.split('/').pop())

      alert('Upload successful!');
      setUser({...user, profilePic: response.data.imagePath}); // Update user profile picture path
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
      console.log("user data" + userResponse.data)

      // Assuming the user's processes and procedures need to be fetched separately
      const processesResponse = await axios.get(`https://mediflow-cse416.onrender.com/processes/user/${userId}`, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      });
      setProcesses(processesResponse.data);

      // const proceduresResponse = await axios.get(`http://localhost:8000/procedures/user/${userId}`, {
      //   headers: {
      //     'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      //   }
      // });
      // setProcedures(proceduresResponse.data);
    };

    fetchUser();
  }, []);

//   <List dense>
//   {procedures.map(procedure => (
//     <ListItem key={procedure._id}>
//       <ListItemText primary={procedure.name} secondary={`Duration: ${procedure.estimatedDuration} mins, Type: ${procedure.staffType}`} />
//     </ListItem>
//   ))}
// </List>

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={6}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Weekly Schedule
            </Typography>
            {Object.entries(user.schedule).map(([day, shifts]) => (
              <Box key={day} sx={{ mb: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {day}:
                </Typography>
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
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Processes Involved
            </Typography>
            <List dense>
              {processes.map(process => (
                <ListItem key={process._id}>
                  <ListItemText primary={process.name} secondary={`Created: ${new Date(process.created).toLocaleDateString()}`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar             src={`https://mediflow-cse416.onrender.com/uploads/${sessionStorage.getItem('pfp')}`}
 sx={{ width: 56, height: 56, mr: 2 }} />
              <Box>
                <Typography variant="h5">{user.name}</Typography>
                <Typography variant="subtitle1" color="textSecondary">{user.role}</Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Email: {user.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Joined: {new Date(user.joined).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Staff ID: {user.staffID}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Procedures Involved
            </Typography>

          </CardContent>
        </Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src={`https://mediflow-cse416.onrender.com/uploads/${sessionStorage.getItem('pfp')}`} sx={{ width: 90, height: 90, mb: 2 }} />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/*"
              style={{ marginBottom: 20 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!file}
            >
              Upload Image
            </Button>
          </Box>
        </CardContent>

      </Grid>
    </Grid>
  );
}

export default Profile;