import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Typography,
  TextField,
  Box,
  Button,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Staff = () => {
  const [search, setSearch] = useState("");
  const [usersList, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://mediflow-cse416.onrender.com/users").then((res) => {
      const usersWithStatus = res.data.map(user => {
        return {...user, status: getStatus(user.schedule)};
      });
      setUsers(usersWithStatus);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const navigateToAddStaff = () => {
    navigate("/main/addstaff");
  };

  const getStatus = (schedule) => {
    
  
    const now = new Date();
    const currentDay = now.toLocaleString('default', { weekday: 'long' });
    const currentTime = now.getHours() * 60 + now.getMinutes();  // Current time in minutes since midnight
  
    const todaysSchedule = schedule[currentDay];
    console.log(todaysSchedule, currentDay)
  
    if (!todaysSchedule) {
      return "NOT AVAILABLE";
    }
  
    for(let i = 0; i < todaysSchedule.length; i++) {
      const shiftStart = parseInt(todaysSchedule[i].start.split(':')[0]) * 60 + parseInt(todaysSchedule[i].start.split(':')[1]);  // Shift start time in minutes since midnight
      const shiftEnd = parseInt(todaysSchedule[i].end.split(':')[0]) * 60 + parseInt(todaysSchedule[i].end.split(':')[1]);  // Shift end time in minutes since midnight
      console.log(shiftEnd)
      console.log(shiftStart)
      if(currentTime >= shiftStart && currentTime <= shiftEnd) {
        return "ON DUTY";
      }
    }
  
    return "NOT AVAILABLE";
  };
  
  return (
    <Box pt={5} sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Staff
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={navigateToAddStaff}
          >
            Add Staff
          </Button>
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

        {["ON DUTY", "ON CALL", "NOT AVAILABLE"].map((status) => (
          <Grid item xs={12} key={status}>
            <Typography variant="h6" align="center">
              {status}
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {usersList
                .filter(
                  (staff) =>
                    staff.status === status &&
                    staff.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((staff) => (
                  <Grid item key={staff.name}>
                    <Avatar
                      alt={staff.name}
                      src={""}
                      style={{ width: 60, height: 60 }}
                    />
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
