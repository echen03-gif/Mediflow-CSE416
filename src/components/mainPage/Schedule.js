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
  const [appointmentsList, setAppointmentList] = useState([]);
  const [fullCalendar, setFullCalendar] = useState([]);
  const navigate = useNavigate();

  // DB API

  const checkSession = () => {
    axios.get("https://mediflow-cse416.onrender.com/check-session",
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
  }

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

  }, []);

  useEffect(() => {

    setFullCalendar(userAppointments.map(appointment => ({
      title: appointmentsList.find(item => item._id === appointment).patientName,
      start: appointmentsList.find(item => item._id === appointment).scheduledStartTime,
      end: appointmentsList.find(item => item._id === appointment).scheduledEndTime
    })))


  }, [appointmentsList]);


  // Functions

  const handleRequest = () => {
    checkSession()
    navigate('/main/request');
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
        overflowY: "hidden",
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
        width: "100%",
        backgroundColor: "white",
      }}
    >
      <div style={{ flex: 1, overflow: "hidden", paddingRight: "24px", paddingTop: "30px" }}>
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
          + Request
        </button>

        <FullCalendar
          key={selectedDate}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          dateClick={(info) => setSelectedDate(info.date)}
          events={fullCalendar}
          eventClick={handleEventClick}
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
              <ListItemText primary="Patient 1" secondary="Age: 30, Gender: Male" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Time" secondary="10:00 AM - 11:00 AM" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Purpose/Specifications" secondary="Regular Checkup" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Other Staff" secondary="Nurse 1, Nurse 2" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Room" secondary="Room 1" />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    } 
    </div>
  );
}
