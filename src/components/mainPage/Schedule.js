import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userAppointments, setUserAppointments] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [appointmentsList, setAppointmentList] = useState([]);
  const [roomsList, setRooms] = useState([]);
  const [proceduresList, setProceduresList] = useState([]);
  const [fullCalendar, setFullCalendar] = useState([]);
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
        const start = new Date(procedure.scheduledStartTime);
        const end = new Date(procedure.scheduledEndTime);

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

        <FullCalendar
          key={selectedDate}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
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
              <ListItemText primary="Date" secondary={`${new Date(selectedEvent._def.extendedProps.procedureDetails.scheduledStartTime).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })} 
              ${new Date(selectedEvent._def.extendedProps.procedureDetails.scheduledStartTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} - 
              ${new Date(selectedEvent._def.extendedProps.procedureDetails.scheduledEndTime).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })} 
              ${new Date(selectedEvent._def.extendedProps.procedureDetails.scheduledEndTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Purpose/Specifications" secondary={proceduresList.find(procedureItem => procedureItem._id === selectedEvent._def.extendedProps.procedureDetails.procedure).name} />
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
              <ListItemText primary="Room" secondary={roomsList.find(room => room._id === selectedEvent._def.extendedProps.procedureDetails.room).name} />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
      }
    </div>
  );
}
