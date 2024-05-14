import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import moment from 'moment-timezone';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userAppointments, setUserAppointments] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [appointmentsList, setAppointmentList] = useState([]);
  const [roomsList, setRooms] = useState([]);
  const [proceduresList, setProceduresList] = useState([]);
  const [fullCalendar, setFullCalendar] = useState([]);
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const navigate = useNavigate();

  // DB API

  /* const checkSession = () => {
    axios.get("http://localhost:8000/check-session",
      {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      })
      .then(res => {
        if (res.data.loggedIn) {
          console.log("User is logged in");

        } else {
          console.log("User is not logged in");

        }
      })
      .catch(error => {
        console.log("Error checking session", error);
      });
  } */

  useEffect(() => {
    let userId = sessionStorage.getItem('user');

    axios.get('https://mediflow-cse416.onrender.com/appointments', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => setAppointmentList(res.data));

    axios.get(`https://mediflow-cse416.onrender.com/userID/${userId}`, {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => setUserAppointments(res.data.appointments));

    axios.get('https://mediflow-cse416.onrender.com/users', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setUsersList(res.data) });

    axios.get('https://mediflow-cse416.onrender.com/procedures', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setProceduresList(res.data) });

    axios.get('https://mediflow-cse416.onrender.com/rooms', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(res => { setRooms(res.data) }).then(console.log('found rooms'));

  }, []);

  useEffect(() => {
    if (!userAppointments || !appointmentsList || !usersList) {
      return;
    }

    setFullCalendar(userAppointments.flatMap(appointmentId => {
      let appointmentItem = appointmentsList.find(item => item._id === appointmentId);
      if (!appointmentItem) return [];

      return appointmentItem.procedures.map(procedure => {
        const patient = usersList.find(patient => patient._id === appointmentItem.patient);
        if (!patient) return null;

        console.log(procedure.scheduledStartTime)

        const start = moment(procedure.scheduledStartTime).tz('America/New_York').format();
        const end = moment(procedure.scheduledEndTime).tz('America/New_York').format();

        console.log(start);

        return {
          title: patient.name,
          start: start,
          end: end,
          extendedProps: {
            patient: patient,
            appointmentDetais: appointmentItem,
            procedureDetails: procedure
          }
        };
      }).filter(item => item !== null);
    }));
  }, [userAppointments, appointmentsList, usersList]);

  // Functions

  const handleRequest = () => {
    //checkSession()
    navigate('/main/request');
  }

  const handlePending = () => {
    //checkSession();
    navigate("/main/pending");
  }

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  const handleClose = () => {
    setSelectedEvent(null);
  };

  const formatTime = (time) => {
    return moment(time).tz('America/New_York').format('M/D hh:mm A');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };
  // Display

  return (
    <div
      style={{
        display: "flex",
        height: "93%",
        overflowY: "auto",
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
        width: "100%",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: "auto",
          paddingRight: "24px",
          paddingTop: "30px",
        }}
      >
        <h2>SCHEDULE</h2>
        <button
          style={{
            backgroundColor: "#1976D2",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={handleRequest}
        >
          Request Appointment
        </button>

        <button
          style={{
            display: "none",
            backgroundColor: "#1976D2",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={handlePending}
        >
          {/* THIS WILL BE FOR ADMIN VIEW LATER */}
          Pending Appointments

        </button>

        <div>
        <button onClick={() => handleViewChange('dayGridMonth')}>Month View</button>
        <button onClick={() => handleViewChange('timeGridWeek')}>Week View</button>
        <button onClick={() => handleViewChange('listWeek')}>List View</button>
      </div>
        <FullCalendar
          key={currentView}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={currentView}
          dateClick={(info) => setSelectedDate(info.date)}
          events={fullCalendar}
          eventClick={handleEventClick}
          height="auto"
          contentHeight="auto"
        />

      </div>
      {selectedEvent && <Dialog
        open={selectedEvent !== null}
        onClose={handleClose}
      >
        <DialogTitle>{selectedEvent._def.title}</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText primary={"Patient Information"} secondary={"Age: " + selectedEvent._def.extendedProps.patient.age + ", Gender: " + selectedEvent._def.extendedProps.patient.gender} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Date" secondary={`${formatTime(selectedEvent._def.extendedProps.procedureDetails.scheduledStartTime)} - ${formatTime(selectedEvent._def.extendedProps.procedureDetails.scheduledEndTime)}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Purpose/Specifications" secondary={proceduresList.find(procedureItem => procedureItem._id === selectedEvent._def.extendedProps.procedureDetails.procedure).name + " - " + proceduresList.find(procedureItem => procedureItem._id === selectedEvent._def.extendedProps.procedureDetails.procedure).description} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Other Staff" secondary={
                (() => {
                  const currentUserId = sessionStorage.getItem('user');
                  const filteredStaffNames = selectedEvent._def.extendedProps.procedureDetails.staff
                    .map(staffId => usersList.find(user => user._id === staffId))
                    .filter(user => user && user._id !== currentUserId)
                    .map(user => user.name);

                  if (filteredStaffNames.length === 0) {
                    return "N/A";
                  } else {
                    return filteredStaffNames.join(', ');
                  }
                })()
              } />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Room"
                secondary={
                  selectedEvent._def.extendedProps.procedureDetails.room
                    ? roomsList.find(room => room._id === selectedEvent._def.extendedProps.procedureDetails.room).name
                    : 'None'
                }
              />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
      }
    </div>
  );
}
