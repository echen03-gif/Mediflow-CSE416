import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Button, Typography, Container, Grid, Stack, Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import moment from 'moment-timezone';


export default function RequestAppointment() {
  const navigate = useNavigate();
  const [patientUser, setPatientUser] = useState("");
  const [process, setProcess] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [roomsList, setRooms] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentHeadList, setEquipmentHeadList] = useState([]);
  const [appointmentsList, setAppointmentList] = useState([]);
  const [procedureList, setProcedureList] = useState([]);
  const [staffSelections, setStaffSelections] = useState({});
  const [notification, setNotification] = useState('');



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

    axios.get('https://mediflow-cse416.onrender.com/equipmentHead', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setEquipmentHeadList(res.data) });

    axios.get('https://mediflow-cse416.onrender.com/appointments', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setAppointmentList(res.data) });

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

  const checkUserSchedule = (user, scheduledStartTime, scheduledEndTime) => {
    const scheduledStart = new Date(scheduledStartTime);
    const scheduledEnd = new Date(scheduledEndTime);

    const weekDay = scheduledStart.toLocaleString('en-us', { weekday: 'long' });

    const shifts = user.schedule[weekDay];


    let isInShift = false;

    for (let shift of shifts) {
      const shiftStart = new Date(`${scheduledStartTime.split('T')[0]}T${shift.start}`);
      const shiftEnd = new Date(`${scheduledStartTime.split('T')[0]}T${shift.end}`);

      if (scheduledStart >= shiftStart && scheduledEnd <= shiftEnd) {
        isInShift = true;
        break;
      }
    }
    console.log(isInShift);
    if (!isInShift) {
      return false;
    }

    for (let appointmentId of user.appointments) {

      const appointment = appointmentsList.find(appt => appt._id === appointmentId);

      for (let procedure of appointment.procedures) {

        if (procedure.staff.includes(user._id)) {
          const apptStart = new Date(procedure.scheduledStartTime);
          const apptEnd = new Date(procedure.scheduledEndTime);


          if ((apptStart < scheduledEnd) && (apptEnd > scheduledStart)) {
            return false;
          }
        }
      }
    }

    return true;
  };

  const checkEquipmentSchedule = (equipment, scheduledStartTime, scheduledEndTime) => {
    const scheduledStart = new Date(scheduledStartTime);
    const scheduledEnd = new Date(scheduledEndTime);

    for (let appointmentId of equipment.appointments) {

      const appointment = appointmentsList.find(appt => appt._id === appointmentId);

      for (let procedure of appointment.procedures) {

        if (procedure.equipment.includes(equipment._id)) {
          const apptStart = new Date(procedure.scheduledStartTime);
          const apptEnd = new Date(procedure.scheduledEndTime);


          if ((apptStart < scheduledEnd) && (apptEnd > scheduledStart)) {
            return false;
          }
        }
      }
    }

    return true;
  };

  const checkRoomSchedule = (room, scheduledStartTime, scheduledEndTime) => {
    const scheduledStart = new Date(scheduledStartTime);
    const scheduledEnd = new Date(scheduledEndTime);

    for (let appointmentId of room.appointments) {

      const appointment = appointmentsList.find(appt => appt._id === appointmentId);

      for (let procedure of appointment.procedures) {

        if (procedure.room === room._id) {
          const apptStart = new Date(procedure.scheduledStartTime);
          const apptEnd = new Date(procedure.scheduledEndTime);


          if ((apptStart < scheduledEnd) && (apptEnd > scheduledStart)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let checkAvaliability = true;
    let NonAvaliableProcedures = [];
    const procedures = Object.entries(staffSelections).map(([procedureId, { staff, equipment, scheduledStartTime, scheduledEndTime, roomId }]) => {

      let procedure = procedureList.find(procedure => procedure._id === procedureId);

      let numStaff = procedure.numStaff;
      let equipmentListName = procedure.requiredEquipment;

      let selectedStaff = [];

      const sortedUsersList = [...usersList].sort((a, b) => a.appointments.length - b.appointments.length);

      for (let i = 0; i < usersList.length; i++) {

        if (sortedUsersList[i].role === procedure.staffType) {

          if (checkUserSchedule(sortedUsersList[i], scheduledStartTime, scheduledEndTime)) {
            selectedStaff.push(sortedUsersList[i]);
          }
        }

        if (selectedStaff.length === numStaff) {
          break;
        }
      }

      let selectedEquipment = [];

      for (let equipmentName of equipmentListName) {

        let equipmentHead = equipmentHeadList.find(equipment => equipment.name === equipmentName);

        for (let equipmentId of equipmentHead.equipment) {

          let checkEquipment = equipmentList.find(equipmentSearch => equipmentSearch._id === equipmentId);

          if (checkEquipmentSchedule(checkEquipment, scheduledStartTime, scheduledEndTime) && checkEquipment.type === procedure.staffType) {
            selectedEquipment.push(checkEquipment);
            break;
          }
        }

      }

      let selectedRoom;

      for (let roomSearch of roomsList) {
        if (roomSearch.type === procedure.requiredRoomType) {
          if (checkRoomSchedule(roomSearch, scheduledStartTime, scheduledEndTime)) {
            selectedRoom = roomSearch;
            break;
          }
        }
      }

      if (selectedStaff.length !== numStaff || selectedEquipment.length !== equipmentListName.length) {
        checkAvaliability = false;
        NonAvaliableProcedures.push(procedure.name);

      }
      else if (procedure.requiredRoomType != null && selectedRoom == null) {
        checkAvaliability = false;
        NonAvaliableProcedures.push(procedure.name);

      }

      scheduledStartTime = moment.tz(scheduledStartTime, "YYYY-MM-DDTHH:mm:ss.SSS", 'America/New_York').utc().format();
      scheduledEndTime = moment.tz(scheduledEndTime, "YYYY-MM-DDTHH:mm:ss.SSS", 'America/New_York').utc().format();

      if (scheduledEndTime)
        return {
          procedure: procedureId,
          staff: selectedStaff,
          equipment: selectedEquipment,
          scheduledStartTime,
          scheduledEndTime,
          room: selectedRoom
        };
    });

    return;

    for (let i = 0; i < procedures.length - 1; i++) {
      let current = moment(procedures[i].scheduledStartTime);
      let next = moment(procedures[i + 1].scheduledStartTime);

      if (next.isBefore(current)) {
        checkAvaliability = false;
        setNotification(`Invalid! Start time of procedure ${procedureList.find(procedure => procedure._id === procedures[i + 1].procedure).name} is before start time of procedure ${procedureList.find(procedure => procedure._id === procedures[i].procedure).name}`);
        return;
      }
    }

    if (!checkAvaliability) {
      setNotification(`There are not enough available staff, room, or equipment at the selected time for ${NonAvaliableProcedures.join(", ")}`);
      return;
    }

    setNotification('');

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

      if (room) {
        uniqueRoomIds.add(room);
      }

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


    await Promise.all(Array.from(uniqueRoomIds).map(room => {
      console.log(room);
      return axios.put("https://mediflow-cse416.onrender.com/changeRoomAppointment", {
        roomObject: room,
        appointment: newAppointment.data,
      }, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      });
    }));


    navigate("/main/schedule");
  };


  const handleCreateProcess = () => {
    navigate("/main/createprocess");
  }

  const handleChange = (procedureId, field) => (event, newValue) => {


    setStaffSelections(prev => {

      const currentSettings = prev[procedureId] || {};

      const updatedSettings = {
        ...currentSettings,
        [field]: newValue?.map ? newValue.map(item => item) : newValue,
      };


      if (field === "scheduledStartTime") {

        const duration = procedureList.find(p => p._id === procedureId)?.estimatedDuration || 0;
        const startTime = new Date(newValue);
        const endTime = new Date(startTime.getTime() + duration * 60000);

        updatedSettings['scheduledEndTime'] = endTime.toISOString();
      }

      return {
        ...prev,
        [procedureId]: updatedSettings
      };
    });

  };


  // Display

  return (
    <Container maxWidth="lg" sx={{ display: "flex", mt: 4, height: '90vh', overflow: 'auto' }}>
      <Box sx={{ width: "70%", mr: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Add Appointment
        </Typography>
        {notification && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {notification}
          </Alert>
        )}
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

                <Typography variant="h6">Estimated Duration: {procedureList.find(item => item._id === procedure).estimatedDuration} mins</Typography>

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