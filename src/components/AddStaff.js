import React, { useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AddStaff = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();

    const [startHour, startMinutes] = shiftStart.split(':');
    const [endHour, endMinutes] = shiftEnd.split(':');
    

    const schedule = {
      Monday: [{ start: startHour + ':' + startMinutes, end: endHour + ':' + endMinutes }],
      Tuesday: [{ start: startHour + ':' + startMinutes, end: endHour + ':' + endMinutes }],
      Wednesday: [{ start: startHour + ':' + startMinutes, end: endHour + ':' + endMinutes }],
      Thursday: [{ start: startHour + ':' + startMinutes, end: endHour + ':' + endMinutes }],
      Friday: [{ start: startHour + ':' + startMinutes, end: endHour + ':' + endMinutes }],
      Saturday: [{ start: startHour + ':' + startMinutes, end: endHour + ':' + endMinutes }],
      Sunday: [{ start: startHour + ':' + startMinutes, end: endHour + ':' + endMinutes }],
      
    };
    
    axios.post("https://mediflow-cse416.onrender.com/createUser", {
      admin: isAdmin,
      name: firstName + " " + lastName,
      email: email,
      password: password,
      role: position,
      schedule: schedule,
    }).then(navigate("/main/staff"));
    
  };

  return (
    <Box sx={{ mt: 8, mx: 4 }}>
      <Typography variant="h6">Add Staff Member</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="firstName"
          label="First Name"
          name="firstName"
          autoComplete="fname"
          autoFocus
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          autoComplete="lname"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="dateOfBirth"
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
                <TextField
          margin="normal"
          required
          fullWidth
          id="shiftStart"
          label="Shift Start Time"
          name="shiftStart"
          type="time"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          value={shiftStart}
          onChange={(e) => setShiftStart(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="shiftEnd"
          label="Shift End Time"
          name="shiftEnd"
          type="time"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          value={shiftEnd}
          onChange={(e) => setShiftEnd(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="position-label">Position</InputLabel>
          <Select
            labelId="position-label"
            id="position"
            value={position}
            label="Position"
            onChange={(e) => setPosition(e.target.value)}
          >
            <MenuItem value={"Doctor"}>Doctor</MenuItem>
            <MenuItem value={"Nurse"}>Nurse</MenuItem>
            <MenuItem value={"Administrator"}>Administrator</MenuItem>
            <MenuItem value={"Support Staff"}>Support Staff</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
          }
          label="Admin Privileges"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Add Staff
        </Button>
      </form>
    </Box>
  );
};

export default AddStaff;
