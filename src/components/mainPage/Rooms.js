import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Box, TablePagination, FormControl, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import moment from 'moment-timezone';

function Rooms() {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [roomList, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('');
  const [appointmentList, setAppointmentList] = useState([]);
  const [procedureList, setProcedureList] = useState([]);
  const [appointmentIds, setAppointmentIds] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [roomPage, setRoomPage] = useState('default');
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [availabilityCache, setAvailabilityCache] = useState({});
  const [itemCount, setItemCount] = useState(0); // New state variable

  // DB API

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userId = sessionStorage.getItem('user');

        const roomsResponse = await axios.get('https://mediflow-cse416.onrender.com/rooms', {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        });
        setRooms(roomsResponse.data);
        setItemCount(roomsResponse.data.length); // Set initial item count for rooms
        console.log('Found rooms');

        const usersResponse = await axios.get('https://mediflow-cse416.onrender.com/users', {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        });
        setUsersList(usersResponse.data);
        console.log('Found users');

        const appointmentsResponse = await axios.get('https://mediflow-cse416.onrender.com/appointments', {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        });
        setAppointmentList(appointmentsResponse.data);
        console.log('Found appointments');

        const proceduresResponse = await axios.get('https://mediflow-cse416.onrender.com/procedures', {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        });
        setProcedureList(proceduresResponse.data);
        console.log('Found appointments');

        const userResponse = await axios.get(`https://mediflow-cse416.onrender.com/userID/${userId}`, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        });
        setIsAdmin(userResponse.data.role === 'admin');
        console.log(isAdmin);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    setLoading(false);

    fetchData();
  }, []);

  useEffect(() => {
    const newCache = { ...availabilityCache };
    roomList.forEach(room => {
      const roomKey = `${room._id}-${selectedDate.toISOString().split("T")[0]}`;
      if (newCache[roomKey] === undefined) {
        newCache[roomKey] = isRoomAvailable(room, selectedDate);
      }
    });
    setAvailabilityCache(newCache);
  }, [roomList, appointmentList, selectedDate]);

  // Functions

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
  };

  const navigateToAddRoom = () => {
    navigate("/main/addroom");
  };

  const viewSpecificAppointments = (room) => {
    if (room.appointments.length === 0) {
      // No appointments to view
    } else {
      setCurrentRoom(room);
      setAppointmentIds(room.appointments);
      setItemCount(room.appointments.length); // Update item count for appointments
      setRoomPage('appointmentViewing');
    }
  };

  function isRoomAvailable(room, date) {
    const dateKey = date.toISOString().split("T")[0];
    const roomKey = `${room._id}-${dateKey}`;

    if (availabilityCache[roomKey] !== undefined) {
      return availabilityCache[roomKey];
    }

    if (appointmentList.length > 0) {
      const currentDate = date.getTime();

      const isAvailable = !room.appointments.some(appointmentId => {
        const appointmentData = appointmentList.find(appointment => appointment._id === appointmentId);
        return appointmentData && appointmentData.procedures.some(procedure => {
          const start = new Date(procedure.scheduledStartTime).getTime();
          const end = new Date(procedure.scheduledEndTime).getTime();
          return currentDate >= start && currentDate <= end;
        });
      });

      setAvailabilityCache(prev => ({ ...prev, [roomKey]: isAvailable }));
      return isAvailable;
    }
    return true;
  }

  // Display

  if (loading) {
    return <Typography>Loading...</Typography>;
  } else {
    switch (roomPage) {
      case 'appointmentViewing':
        return (
          <Box sx={{ height: '100%', overflow: 'auto' }}>
            <h1>
              Room Availability
            </h1>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 2,
              }}
            >
              <TextField label="Search" variant="outlined" />
              <FormControl variant="outlined">
                <TextField
                  id="date"
                  label="Date"
                  type="datetime-local"
                  defaultValue={selectedDate.toISOString().split("T")[0]}
                  onChange={handleDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ 'data-testid': 'date-input' }}
                />
              </FormControl>
            </Box>
            {
              isAdmin &&
              <Button variant="contained" color="primary" onClick={navigateToAddRoom} data-testid="add-room-button">
                Add Room
              </Button>
            }

            <TableContainer component={Paper} sx={{ height: 500 }}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>{" "}
                    <TableCell>Patient</TableCell>
                    <TableCell>Procedure</TableCell>
                    <TableCell align="center">Scheduled Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointmentIds
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .flatMap((appointmentId) =>
                      appointmentList
                        .filter((appointment) => appointment._id === appointmentId)
                        .flatMap((individualAppointment) =>
                          individualAppointment.procedures
                            .filter((procedure) => procedure.room === currentRoom._id)
                            .map((procedure) => (
                              <TableRow key={procedure}>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  style={{ padding: "10px", paddingRight: "0" }}
                                >
                                </TableCell>
                                <TableCell>
                                  {usersList.find((user) => user._id === individualAppointment.patient).name}
                                </TableCell>
                                <TableCell>
                                  {procedureList.find((procedureName) => procedureName._id === procedure.procedure).name}
                                </TableCell>
                                <TableCell align="center">
                                  {moment(procedure.scheduledStartTime).tz('America/New_York').format('M/D hh:mm A') + " - " + moment(procedure.scheduledEndTime).tz('America/New_York').format('M/D hh:mm A')}
                                </TableCell>
                              </TableRow>
                            ))
                        )
                    )}
                </TableBody>
              </Table>
              <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
                <TablePagination
                  rowsPerPageOptions={[10]}
                  component="div"
                  count={itemCount} // Update the count dynamically
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            </TableContainer>
          </Box>
        );

      case 'default':
        return (
          <Box sx={{ height: '100%', overflow: 'auto' }}>
            <h1>
              Room Availability
            </h1>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 2,
              }}
            >
              <TextField label="Search" variant="outlined" />
              <FormControl variant="outlined">
                <TextField
                  id="date"
                  label="Date"
                  type="datetime-local"
                  defaultValue={selectedDate.toISOString().split("T")[0]}
                  onChange={handleDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </Box>
            {
              isAdmin &&
              <Button variant="contained" color="primary" onClick={navigateToAddRoom}>
                Add Room
              </Button>
            }

            <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Room #</TableCell>
                    <TableCell align="right">Room Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roomList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((room) => (
                      <TableRow key={room.roomNumber}>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ padding: "10px", paddingRight: "0" }}
                        >
                          <div
                            style={{
                              width: "15px",
                              height: "30px",
                              backgroundColor: isRoomAvailable(
                                room,
                                selectedDate
                              )
                                ? "green"
                                : "red",
                              marginRight: "10px",

                            }}
                            data-testid={`room-availability-${room._id}`}

                          ></div>
                        </TableCell>
                        <TableCell>
                          <Typography onClick={(e) => { e.preventDefault(); viewSpecificAppointments(room); }} style={{ cursor: 'pointer', textDecoration: 'none' }} onMouseEnter={(e) => { e.target.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.target.style.textDecoration = 'none'; }}>
                            {room.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{room.type}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
              <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={itemCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </Box>
        );
      default:
        return;
    }
  }
}

export default Rooms;
