import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Button, Typography, Container, Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function RequestAppointment() {

  const [patientName, setPatientName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [staff, setStaff] = useState("");
  const [room, setRoom] = useState("");
  const [process, setProcess] = useState("");

  const [usersList, setUsersList] = useState([]);
  const [roomsList, setRooms] = useState([]);
  const [processList, setProcessList] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newAppointment = await axios.post("http://localhost:8000/createAppointment", {

        name: patientName,
        staff: [staff],
        start: new Date(startTime),
        end: new Date(endTime),
        process: process,
        room: room

    }).then(console.log("Added Appointment"));

    await axios.put("http://localhost:8000/changeStaffAppointment", {

        staffName: staff,
        appointment: newAppointment.data

      }).then(console.log("Updated Staff"));

    navigate("/main/schedule");
  };

  const handleCreateProcess = () => {
    navigate("/main/createprocess");
  }

  useEffect(() => {

    axios.get('https://mediflow-cse416.onrender.com/users').then(res => { setUsersList(res.data) });

    axios.get('https://mediflow-cse416.onrender.com/rooms').then(res => { setRooms(res.data) }).then(console.log('found rooms'));

    axios.get('https://mediflow-cse416.onrender.com/processes').then(res => { setProcessList(res.data) });

  }, []);


  console.log(startTime);

  return (
    <Container maxWidth="lg" sx={{ display: "flex", mt: 4 }}>
      <Box sx={{ width: "70%", mr: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Add Appointment
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Patient Name"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            name="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
          <TextField
            type="date"
            label="Scheduled Start Time"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            name="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{
              shrink: true,  
            }}
            required
          />

          <TextField
            type="date"
            label="Scheduled End Time"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            name="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
       
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <TextField
              select
              label="Process"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              name="process"
              value={process}
              onChange={(e) => setProcess(e.target.value)}
              required
            >
              {processList.map(user => (
            <MenuItem value={user}>
              {user.name}
            </MenuItem>
          ))}
            </TextField>
          </Grid>
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={handleCreateProcess}
              fullWidth
              sx={{
                color: "black",
                backgroundColor: "#CCEEFF",
                "&:hover": { backgroundColor: "#CCFFFF" },
              }}
            >
              Create Process
            </Button>
          </Grid>
        </Grid>
        <TextField
          select
          label="Staff"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          name="staff"
          value={staff}
          onChange={(e) => { setStaff(e.target.value) }}
          required
        >
          {usersList.map(user => (
            <MenuItem value={user}>
              {user.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Room"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          name="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          required
        >
          {roomsList.map(user => (
            <MenuItem value={user}>
              {user.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          variant="contained"
          sx={{
            color: "black",
            backgroundColor: "#CCEEFF",
            "&:hover": { backgroundColor: "#CCFFFF" },
          }}
        >
          Submit
        </Button>
      </form>
    </Box>
    </Container >
  );
}
