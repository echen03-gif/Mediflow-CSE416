import React, { useState } from 'react';
import { useEffect } from 'react';

import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Box, TablePagination, FormControl, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

function isRoomAvailable(roomName, date) {
  // For now, let's assume all rooms are available on even-numbered days.
  return date.getDate() % 2 === 0;
}

function Rooms() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [roomList, setRooms] = useState([]);
  const [appointmentList, setAppointmentList] = useState([]);
  const [appointmentIds, setAppointmentIds] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [roomPage, setRoomPage] = useState('default');
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  // DB API

  useEffect(() => {
    let userId = sessionStorage.getItem('user');

    axios.get('https://mediflow-cse416.onrender.com/rooms', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setRooms(res.data) }).then(console.log('found rooms'));

    axios.get('https://mediflow-cse416.onrender.com/users', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setUsersList(res.data) }).then(console.log('found users'));

    axios.get('https://mediflow-cse416.onrender.com/appointments', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setAppointmentList(res.data) });

    axios.get(`https://mediflow-cse416.onrender.com/userID/${userId}`, {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => setIsAdmin(res.data.role === 'admin'));

  }, []);

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

    } else {

      setAppointmentIds(room.appointments)

      setRoomPage('appointmentViewing')

    }
  }

  // Display

  switch (roomPage) {

    case 'appointmentViewing':
      return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Room Availability
          </Typography>
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
                type="date"
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
            <Button variant="contained" color="primary" onClick={navigateToAddRoom}> {/* Updated onClick handler */}
              Add Room
            </Button>
          }

          <TableContainer component={Paper} sx={{ height: 500 }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>{" "}
                  {/* Added this line */}
                  <TableCell>Appointment</TableCell>
                  <TableCell align="center">
                    Scheduled Dates
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointmentIds
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
                              room.roomNumber,
                              selectedDate
                            )
                              ? "green"
                              : "red",
                            marginRight: "10px",
                          }}
                        ></div>
                      </TableCell>
                      <TableCell>
                        {
                          usersList.find(userId => userId._id === appointmentList.find(
                            (appointment) =>
                              appointment._id ===
                              room
                          ).patient).name
                        }
                      </TableCell>
                      <TableCell align="center">
                        {
                          appointmentList.find(
                            (appointment) => appointment._id === room
                          ).procedures.map(procedure => {
                            const date = new Date(procedure.scheduledStartTime);
                            const endDate = new Date(procedure.scheduledEndTime);
                            return `${date.getMonth() + 1}/${date.getDate()} - ${endDate.getMonth() + 1}/${endDate.getDate()}`;
                          }).join(", ")

                        }
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
              <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={roomList.length}
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
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Room Availability
          </Typography>
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
                type="date"
                defaultValue={selectedDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Box>
          <Button variant="contained" color="primary" onClick={navigateToAddRoom}> {/* Updated onClick handler */}
            Add Room
          </Button>
          <TableContainer component={Paper} sx={{ height: 500 }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell> {/* Added this line */}
                  <TableCell>Room #</TableCell>
                  <TableCell align="right">Room Type</TableCell>
                  <TableCell align="right">Assigned Appointment</TableCell>
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
                              room.roomNumber,
                              selectedDate
                            )
                              ? "green"
                              : "red",
                            marginRight: "10px",
                          }}
                        ></div>
                      </TableCell>
                      <TableCell><Typography onClick={(e) => { e.preventDefault(); viewSpecificAppointments(room); }} style={{ cursor: 'pointer', textDecoration: 'none' }} onMouseEnter={(e) => { e.target.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.target.style.textDecoration = 'none'; }} >
                        {room.name}
                      </Typography>
                      </TableCell>
                      <TableCell align="right">{room.type}</TableCell>
                      <TableCell align="right">
                        Current Processes/Appointment
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
              <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={roomList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </TableContainer>
        </Box>
      );
    default:
      return;
  }

}
export default Rooms;

