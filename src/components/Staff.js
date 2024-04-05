import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Avatar, Typography, TextField, Box } from '@mui/material';


const Staff = () => {
  const [search, setSearch] = useState('');
  const [usersList, setUsers] = useState([]);

  useEffect(() => {

    axios.get('https://mediflow-cse416.onrender.com/users').then(res => { setUsers(res.data) });

  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <Box pt={5} sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
              Staff
            </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="search"
            label="Search Staff"
            name="search"
            autoComplete="search"
            autoFocus
            value={search}
            onChange={handleSearch}
          />
        </Grid>

        {['ON DUTY', 'ON CALL', 'NOT AVAILABLE'].map((status) => (
          <Grid item xs={12} key={status}>
            <Typography variant="h6" align='center'>{status}</Typography>
            <Grid container spacing={2} justifyContent='center'>
              {usersList
                .filter((staff) => staff.status === status && staff.name.toLowerCase().includes(search.toLowerCase()))
                .map((staff) => (
                  <Grid item key={staff.name}>
                    <Avatar alt={staff.name} src={''} style={{ width: 60, height: 60 }} />
                    <Typography>{staff.name}</Typography>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Staff;
