import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Button, Typography, Container, Grid, Autocomplete, Stack } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function RequestAppointment() {

  const [patientName, setPatientName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [process, setProcess] = useState("");

  const [usersList, setUsersList] = useState([]);
  const [roomsList, setRooms] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [procedureList, setProcedureList] = useState([]);

  const [staffSelections, setStaffSelections] = useState({});
  const [roomSelections, setRoomSelections] = useState({});


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const staffAssigned = Object.entries(staffSelections).map(([procedureId, { staff, equipment }]) => ({
      staff: staff,
      procedure: procedureId,
      equipment: equipment
    }));

    const roomAssigned = Object.entries(roomSelections).map(([procedureId, roomId]) => ({
      room: roomId,
      procedure: procedureId
    }));


    let newAppointment = await axios.post("https://mediflow-cse416.onrender.com/createAppointment", {

      name: patientName,
      procedures: staffAssigned,
      start: new Date(startTime),
      end: new Date(endTime),
      process: process,
      room: roomAssigned

    }).then(console.log("Added Appointment"));

    const uniqueStaffIds = new Set();
    const uniqueEquipmentIds = new Set();

    staffAssigned.forEach(({ staff, equipment }) => {
      staff.forEach(staffId => {
        uniqueStaffIds.add(staffId);
      });
      equipment.forEach(equipmentId => {
        uniqueEquipmentIds.add(equipmentId);
      });
    });

    await Promise.all([
      ...Array.from(uniqueStaffIds).map(staffId =>
        axios.put("https://mediflow-cse416.onrender.com/changeStaffAppointment", {
          staffName: staffId,
          appointment: newAppointment.data
        })
      ),
      ...Array.from(uniqueEquipmentIds).map(equipmentId =>
        axios.put("http://localhost:8000/changeEquipmentAppointment", {
          equipment: equipmentId,
          appointment: newAppointment.data
        })
      )
    ]);


    await Promise.all(roomAssigned.map(({ room }) => {
      return axios.put("https://mediflow-cse416.onrender.com/changeRoomAppointment", {
        roomName: room,
        appointment: newAppointment.data
      });
    }))

    // for each equipment, add appointments

    navigate("/main/schedule");
  };


  const handleCreateProcess = () => {
    navigate("/main/createprocess");
  }

  useEffect(() => {

    axios.get('https://mediflow-cse416.onrender.com/users').then(res => { setUsersList(res.data) });

    axios.get('https://mediflow-cse416.onrender.com/rooms').then(res => { setRooms(res.data) }).then(console.log('found rooms'));

    axios.get('https://mediflow-cse416.onrender.com/processes').then(res => { setProcessList(res.data) });

    axios.get('https://mediflow-cse416.onrender.com/procedures').then(res => { setProcedureList(res.data) });

    axios.get('https://mediflow-cse416.onrender.com/equipment').then(res => { setEquipmentList(res.data) });

  }, []);

  useEffect(() => {
    if (process) {
      const initStaff = {};
      const initRooms = {};
      process.components.forEach(proc => {
        initStaff[proc] = { staff: [], equipment: [] };
        initRooms[proc] = [];
      });
      setStaffSelections(initStaff);
      setRoomSelections(initRooms);
    }
  }, [process]);


  const handleStaffChange = (procedureId) => (event, newValue) => {
    setStaffSelections(prev => ({
      ...prev,
      [procedureId]: {
        ...prev[procedureId],
        staff: newValue.map(item => item)
      }
    }));
  };

  const handleEquipmentChange = (procedureId) => (event, newValue) => {
    setStaffSelections(prev => ({
      ...prev,
      [procedureId]: {
        ...prev[procedureId],
        equipment: newValue.map(item => item)
      }
    }));
  };

  const handleRoomChange = (procedureId) => (event, newValue) => {
    console.log("New room values for procedure", procedureId, newValue);
    setRoomSelections(prev => ({ ...prev, [procedureId]: newValue }));
  };


  console.log(staffSelections);

  return (
    <Container maxWidth="lg" sx={{ display: "flex", mt: 4, height: '90vh', overflow: 'auto' }}>
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
                  options={usersList}
                  getOptionLabel={(option) => option.name}
                  value={staffSelections[procedure]}
                  onChange={(event, newValue) => handleStaffChange(procedure)(event, newValue)}
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
                  value={roomSelections[procedure]}
                  onChange={(event, newValue) => handleRoomChange(procedure)(event, newValue)}
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
                  onChange={(event, newValue) => handleEquipmentChange(procedure)(event, newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Equipment"
                      variant="outlined"
                      fullWidth

                    />
                  )}
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
