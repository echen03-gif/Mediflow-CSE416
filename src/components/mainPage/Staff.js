import React, { useEffect, useState } from "react";
import { useData } from "./DataContext"; // Import useData from where it is defined
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
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  // Use context to get users list and admin status
  const { usersList, isAdmin, api, updateData } = useData(); // Assuming isAdmin and api are part of your context

  // Effect to fetch users if the users list is empty
  useEffect(() => {
    if (usersList.length === 0) {
      api.get("/users").then((res) => {
        const usersWithStatus = res.data.map((user) => ({
          ...user,
          status: getStatus(user.schedule),
        }));
        updateData({ usersList: usersWithStatus });
      });
    }
  }, [usersList, api, updateData]);

  // Function to handle search input changes
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // Navigation to add staff page
  const navigateToAddStaff = () => {
    navigate("/main/addstaff");
  };

  // Function to get status based on schedule
  const getStatus = (schedule) => {
    const now = new Date();
    const currentDay = now.toLocaleString("default", { weekday: "long" });
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes since midnight

    const todaysSchedule = schedule[currentDay];
    if (!todaysSchedule) return "NOT AVAILABLE";
    for (let period of todaysSchedule) {
      const [startHour, startMinute] = period.start.split(":").map(Number);
      const [endHour, endMinute] = period.end.split(":").map(Number);
      const shiftStart = startHour * 60 + startMinute;
      const shiftEnd = endHour * 60 + endMinute;
      if (currentTime >= shiftStart && currentTime <= shiftEnd) {
        return "ON DUTY";
      }
    }
    return "NOT AVAILABLE";
  };

  // Function to handle filter changes
  const handleFilterChange = (status) => {
    setFilter(status);
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
          <Grid
            container
            justifyContent="flex-end"
            style={{ marginBottom: "20px" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleFilterChange("ALL")}
            >
              All
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleFilterChange("ON DUTY")}
            >
              On Duty
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleFilterChange("NOT AVAILABLE")}
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
              <Grid container spacing={1} justifyContent="center">
                <Grid item key={staff.name} style={{ textAlign: "center" }}>
                  <Avatar
                    alt={staff.name}
                    src={staff.photo || ""}
                    style={{ width: "7vh", height: "7vh" }}
                  />
                  <Typography>{staff.name}</Typography>
                </Grid>
              </Grid>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Staff;
