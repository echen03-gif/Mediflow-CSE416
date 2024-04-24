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
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [shifts, setShifts] = useState({
    Monday: { start: "", end: "", isWorking: true },
    Tuesday: { start: "", end: "", isWorking: true },
    Wednesday: { start: "", end: "", isWorking: true },
    Thursday: { start: "", end: "", isWorking: true },
    Friday: { start: "", end: "", isWorking: true },
    Saturday: { start: "", end: "", isWorking: true },
    Sunday: { start: "", end: "", isWorking: true },
  });

  // Functions

  const handleSubmit = (e) => {
    e.preventDefault();

    const schedule = {};
    for (const day in shifts) {
      if (shifts[day].isWorking) {
        const [startHour, startMinutes] = shifts[day].start.split(':');
        const [endHour, endMinutes] = shifts[day].end.split(':');
        schedule[day] = [{ start: startHour + ':' + startMinutes, end: endHour + ':' + endMinutes }];
      } else {
        schedule[day] = [];
      }
    }

    axios.post("https://mediflow-cse416.onrender.com/createUser", {
      admin: isAdmin,
      name: firstName + " " + lastName,
      email: email,
      password: password,
      role: position,
      schedule: schedule,
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(navigate("/main/staff"));

  };

  // Display

  return (
    <Box pt={5} sx={{ flexGrow: 1 }}>
      <div style={{ overflowY: 'auto', maxHeight: '90vh', padding: "1%" }}>
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
          {Object.keys(shifts).map((day) => (
            <React.Fragment key={day}>
              <Typography variant="h6">{day}</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={shifts[day].isWorking}
                    onChange={(e) => setShifts({ ...shifts, [day]: { ...shifts[day], isWorking: e.target.checked } })}
                  />
                }
                label="Scheduled To Work"
              />
              {shifts[day].isWorking && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id={`${day}ShiftStart`}
                    label="Shift Start Time"
                    name={`${day}ShiftStart`}
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    value={shifts[day].start}
                    onChange={(e) => setShifts({ ...shifts, [day]: { ...shifts[day], start: e.target.value } })}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id={`${day}ShiftEnd`}
                    label="Shift End Time"
                    name={`${day}ShiftEnd`}
                    type="time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    value={shifts[day].end}
                    onChange={(e) => setShifts({ ...shifts, [day]: { ...shifts[day], end: e.target.value } })}
                  />
                </>
              )}
            </React.Fragment>
          ))}

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
      </div>
    </Box>
  );
};

export default AddStaff;
