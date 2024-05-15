import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Box, TablePagination, FormControl, Button, Alert } from '@mui/material';
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
  const [itemCount, setItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState('');
  
  // DB API
  const api = axios.create({
    baseURL: "https://mediflow-cse416.onrender.com",
  });

  // Add an interceptor to add Authorization header to each request
  api.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Caching functions
  const cacheData = (key, data) => {
    const cache = {
      data,
      timestamp: new Date().getTime(),
    };
    sessionStorage.setItem(key, JSON.stringify(cache));
  };

  const getCachedData = (key, expiration = 3600000) => { // default expiration is 1 hour
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (new Date().getTime() - timestamp > expiration) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  };

  const fetchDataAndCompare = async (endpoint, key, setStateFunction) => {
    try {
      const cachedData = getCachedData(key);
      const response = await api.get(endpoint);
      const fetchedData = response.data;

      if (!cachedData || JSON.stringify(cachedData) !== JSON.stringify(fetchedData)) {
        cacheData(key, fetchedData);
        setStateFunction(fetchedData);
      } else {
        setStateFunction(cachedData);
      }
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userId = sessionStorage.getItem('user');

        await fetchDataAndCompare('/rooms', 'rooms', (data) => {
          setRooms(data);
          setItemCount(data.length);
        });
        await fetchDataAndCompare('/users', 'users', setUsersList);
        await fetchDataAndCompare('/appointments', 'appointments', setAppointmentList);
        await fetchDataAndCompare('/procedures', 'procedures', setProcedureList);

        const userRoleCacheKey = `userRole_${userId}`;
        const cachedUserRole = getCachedData(userRoleCacheKey);

        if (!cachedUserRole) {
          const userResponse = await api.get(`/userID/${userId}`);
          const userRole = userResponse.data.role;
          cacheData(userRoleCacheKey, userRole);
          setIsAdmin(userRole === 'admin');
        } else {
          setIsAdmin(cachedUserRole === 'admin');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

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
      setNotification(`No Appointments`);
    } else {
      setCurrentRoom(room);
      setPage(0);
      setAppointmentIds(room.appointments);
      setItemCount(room.appointments.length);
      setRoomPage('appointmentViewing');
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  function isRoomAvailable(room, date) {
    const dateKey = date.toISOString().split("T")[0];
    const roomKey = `${room._id}-${dateKey}`;

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

      return isAvailable;
    }
    return true;
  }

  // Filtered list based on search query
  const filteredRoomList = roomList.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <TextField label="Search" variant="outlined" value={searchQuery} onChange={handleSearchChange} />
              <FormControl variant="outlined">
                <TextField
                  id="date"
                  label="Date"
                  type="datetime-local"
                  defaultValue={`${selectedDate.toISOString().split("T")[0]}T${selectedDate.toTimeString().split(" ")[0].substring(0, 5)}`}
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
                  count={itemCount}
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
            {notification && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {notification}
              </Alert>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 2,
              }}
            >
              <TextField label="Search" variant="outlined" value={searchQuery} onChange={handleSearchChange} />
              <FormControl variant="outlined">
                <TextField
                  id="date"
                  label="Date"
                  type="datetime-local"
                  defaultValue={`${selectedDate.toISOString().split("T")[0]}T${selectedDate.toTimeString().split(" ")[0].substring(0, 5)}`}
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
                  {filteredRoomList
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
