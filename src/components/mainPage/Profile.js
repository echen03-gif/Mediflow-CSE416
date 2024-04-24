import React, { useEffect, useState } from 'react';
import { Avatar, Typography, Box, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userEmail = sessionStorage.getItem('user');
      const response = await axios.get(`https://mediflow-cse416.onrender.com/user/${userEmail}`,{ 
        headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      });
      setUser(response.data);
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card sx={{ minWidth: 275, mb: 2 }}>
          {/* Weekly Schedule */}
          <CardContent>
            <Typography variant="h6" component="div">
              Weekly Schedule
            </Typography>
            {Object.entries(user.schedule).map(([day, shifts]) => (
                <Box key={day}>
                    <Typography variant="subtitle1" component="h2">
                    {day}:
                    </Typography>
                    {shifts.map((shift, index) => {
                    // Convert 24-hour time format to 12-hour format
                    const start = new Date(`1970-01-01T${shift.start}Z`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                    const end = new Date(`1970-01-01T${shift.end}Z`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                    return (
                        <Typography key={index} variant="body2" color="textSecondary">
                        {start} - {end}
                        </Typography>
                    );
                    })}
                </Box>
                ))}
          </CardContent>

        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ minWidth: 275, mb: 2 }}>
          {/* User Information */}
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Avatar
                alt={user.name}
                src="https://mui.com/static/images/avatar/1.jpg"
                sx={{ width: 75, height: 75 }}
              />
              <Box
                sx={{
                  ml: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h5" component="div">
                  {user.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {user.role}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="textSecondary">
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
      </Grid>
    </Grid>
  );
}

export default Profile;
