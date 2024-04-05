import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography, Container } from '@mui/material';
import { useNavigate } from "react-router-dom";

export default function RequestAppointment() {
  const [appointmentData, setAppointmentData] = useState({
    patientName: '',
    date: '',
    staff: '',
    equipment: '',
    room: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/main/schedule");
  };

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
            value={appointmentData.patientName}
            onChange={handleChange}
            required
          />
          <TextField
            select
            label="Date"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            name="date"
            value={appointmentData.date}
            onChange={handleChange}
            required
          >
            <MenuItem value="">--Select--</MenuItem>
          </TextField>
          <TextField
            select
            label="Staff"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            name="staff"
            value={appointmentData.staff}
            onChange={handleChange}
            required
          >
            <MenuItem value="">--Select--</MenuItem>
          </TextField>
          <TextField
            select
            label="Equipment"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            name="equipment"
            value={appointmentData.equipment}
            onChange={handleChange}
            required
          >
            <MenuItem value="">--Select--</MenuItem>
          </TextField>
          <TextField
            select
            label="Room"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            name="room"
            value={appointmentData.room}
            onChange={handleChange}
            required
          >
            <MenuItem value="">--Select--</MenuItem>
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
    </Container>
  );
}