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
  const [filter, setFilter] = useState("ALL");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // DB API
  useEffect(() => {
    const fetchData = async () => {
      try {
        let userId = sessionStorage.getItem('user');

        const usersResponse = await axios.get("https://mediflow-cse416.onrender.com/users", {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        });

        const doctors = usersResponse.data.filter(user => user.role !== "patient");

        const usersWithStatus = doctors.map(doctor => {
          return { ...doctor, status: getStatus(doctor.schedule) };
        });

        setUsers(usersWithStatus);

        const userResponse = await axios.get(`https://mediflow-cse416.onrender.com/userID/${userId}`, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        });
        setIsAdmin(userResponse.data.role === 'admin');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Functions
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

    if (!todaysSchedule) {
      return "NOT AVAILABLE";
    }

    for (let i = 0; i < todaysSchedule.length; i++) {
      const shiftStart = parseInt(todaysSchedule[i].start.split(':')[0]) * 60 + parseInt(todaysSchedule[i].start.split(':')[1]);  // Shift start time in minutes since midnight
      const shiftEnd = parseInt(todaysSchedule[i].end.split(':')[0]) * 60 + parseInt(todaysSchedule[i].end.split(':')[1]);  // Shift end time in minutes since midnight
      if (currentTime >= shiftStart && currentTime <= shiftEnd) {
        return "ON DUTY";
      }
    }

    return "NOT AVAILABLE";
  };

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  // Display
  return (
    <Box pt={5} sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Staff
          </Typography>
          {
            isAdmin && 
            <Button
              variant="contained"
              color="primary"
              onClick={navigateToAddStaff}
              style={{ marginBottom: "20px" }}
            >
              Add Staff
            </Button>
          }
          
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

          <Grid container justifyContent="flex-end" style={{ marginBottom: "20px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleFilterChange("ALL")}
              style={{ margin: "0 5px" }}
            >
              All
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleFilterChange("ON DUTY")}
              style={{ margin: "0 5px" }}
            >
              On Duty
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleFilterChange("NOT AVAILABLE")}
              style={{ margin: "0 5px" }}
            >
              Not Available
            </Button>
          </Grid>
        </Grid>

        {usersList
          .filter(
            (staff) =>
              (filter === "ALL" || staff.status === filter) &&
              staff.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((staff) => (
            <Grid item xs={3} key={staff.name}>
              <Box textAlign="center">
                <Avatar
                  alt={staff.name}
                  src={`https://mediflow-cse416.onrender.com/uploads/${staff.profilePic.split('/').pop()}`}
                  style={{ width: "7vh", height: "7vh", margin: "0 auto" }}
                />
                <Typography>{staff.name}</Typography>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Staff;
