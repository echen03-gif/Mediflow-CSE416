import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Button, Typography, Container, Grid, Autocomplete, Stack } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function RequestAppointment() {
  const navigate = useNavigate();
  const [patientUser, setPatientUser] = useState("");
  const [process, setProcess] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [roomsList, setRooms] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [procedureList, setProcedureList] = useState([]);
  const [staffSelections, setStaffSelections] = useState({});
  

  // DB API

  useEffect(() => {

    axios.get('https://mediflow-cse416.onrender.com/users', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setUsersList(res.data) });

    axios.get('https://mediflow-cse416.onrender.com/rooms', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setRooms(res.data) }).then(console.log('found rooms'));

    axios.get('https://mediflow-cse416.onrender.com/processes', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setProcessList(res.data) });

    axios.get('https://mediflow-cse416.onrender.com/procedures', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setProcedureList(res.data) });

    axios.get('https://mediflow-cse416.onrender.com/equipment', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setEquipmentList(res.data) });

  }, []);

  useEffect(() => {
    if (process) {
      const initStaff = {};
      process.components.forEach(proc => {
        initStaff[proc] = { staff: [], equipment: [], scheduledStartTime: '', scheduledEndTime: '', roomId: '' };
      });
      setStaffSelections(initStaff);
    }
  }, [process]);

  // Functions

  const handleSubmit = async (e) => {
    e.preventDefault();

    const procedures = Object.entries(staffSelections).map(([procedureId, { staff, equipment, scheduledStartTime, scheduledEndTime, roomId }]) => ({
      procedure: procedureId,
      staff,
      equipment,
      scheduledStartTime,
      scheduledEndTime,
      room: roomId
    }));


    let newAppointment = await axios.post("https://mediflow-cse416.onrender.com/requestAppointment", {
      patient: patientUser,
      procedures: procedures,
      process: process,
    }, {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(console.log("Added Appointment"));

    const uniqueStaffIds = new Set();
    const uniqueEquipmentIds = new Set();
    const uniqueRoomIds = new Set();

    procedures.forEach(({ staff, equipment, room }) => {
      staff.forEach(staffId => {
        uniqueStaffIds.add(staffId);
      });
      equipment.forEach(equipmentId => {
        uniqueEquipmentIds.add(equipmentId);
      });

      uniqueRoomIds.add(room);

    });

    await Promise.all([
      ...Array.from(uniqueStaffIds).map(staffId =>
        axios.put("https://mediflow-cse416.onrender.com/changeStaffAppointment", {
          staffName: staffId,
          appointment: newAppointment.data,
        }, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        })
      ),
      ...Array.from(uniqueEquipmentIds).map(equipmentId =>
        axios.put("https://mediflow-cse416.onrender.com/changeEquipmentAppointment", {
          equipment: equipmentId,
          appointment: newAppointment.data,

        }, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        })
      )
    ]);


    await Promise.all(uniqueRoomIds.map(({ room }) => {
      return axios.put("https://mediflow-cse416.onrender.com/changeRoomAppointment", {
        roomName: room,
        appointment: newAppointment.data,

      }, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      });

    }))

    navigate("/main/schedule");
  };


  const handleCreateProcess = () => {
    navigate("/main/createprocess");
  }

  const handleChange = (procedureId, field) => (event, newValue) => {
    setStaffSelections(prev => ({
      ...prev,
      [procedureId]: {
        ...prev[procedureId],
        [field]: newValue?.map ? newValue.map(item => item) : newValue
      }
    }));
  };

  // Display

  return (
    <Container maxWidth="lg" sx={{ display: "flex", mt: 4, height: '90vh', overflow: 'auto' }}>
      <Box sx={{ width: "70%", mr: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Add Appointment
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Patient"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            name="patientUser"
            value={patientUser}
            onChange={(e) => setPatientUser(e.target.value)}
            required
          >
            {usersList.filter(user => user.role === 'patient').map(user => (
              <MenuItem key={user._id} value={user}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
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
                {processList.map(process => (
                  <MenuItem key={process._id} value={process}>
                    {process.name}
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

          <Stack spacing={2} sx={{ width: '100%', mt: 4 }}>
            {process && process.components.map(procedure => (
              <Box key={procedure}>
                <Typography variant="h6">{procedureList.find(item => item._id === procedure).name}</Typography>

                <Autocomplete
                  multiple
                  options={usersList.filter(user => user.role === 'doctor')}
                  getOptionLabel={(option) => option.name}
                  value={staffSelections[procedure]}
                  onChange={handleChange(procedure, 'staff')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Staff"
                      variant="outlined"
                      fullWidth

                    />
                  )}
                />
                <Autocomplete
                  options={roomsList}
                  getOptionLabel={(option) => option.name}
                  value={staffSelections[procedure]}
                  onChange={handleChange(procedure, 'roomId')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Room"
                      variant="outlined"
                      fullWidth

                    />
                  )}
                />
                <Autocomplete
                  multiple
                  options={equipmentList}
                  getOptionLabel={(option) => option.name}
                  value={staffSelections[procedure]}
                  onChange={handleChange(procedure, 'equipment')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Equipment"
                      variant="outlined"
                      fullWidth

                    />
                  )}
                />

                <TextField
                  type="datetime-local"
                  label="Scheduled Start Time"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  name="scheduledStartTime"
                  value={staffSelections[procedure]?.scheduledStartTime || ''}
                  onChange={(e) => handleChange(procedure, 'scheduledStartTime')(e, e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
                <TextField
                  type="datetime-local"
                  label="Scheduled End Time"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  name="scheduledEndTime"
                  value={staffSelections[procedure]?.scheduledEndTime || ''}
                  onChange={(e) => handleChange(procedure, 'scheduledEndTime')(e, e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Box>
            ))}
          </Stack>
          <Button
            type="submit"
            variant="contained"
            sx={{
              color: "black",
              backgroundColor: "#CCEEFF",
              "&:hover": { backgroundColor: "#CCFFFF" },
              mt: 2,
              mb: 4
            }}
          >
            Submit
          </Button>

        </form>
      </Box>
    </Container>
  );

}
