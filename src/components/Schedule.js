import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, Typography, List, ListItem, ListItemText } from '@mui/material';


export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null); // Add a state for the selected event
  const calendarRef = useRef(null);
  const navigate = useNavigate();


  const events = [
    { title: 'Appointment 1', date: '2024-04-01T10:00:00' },
    { title: 'Appointment 2', date: '2024-04-02T14:00:00' },
    { title: 'Appointment 3', date: '2024-04-05T16:00:00' },
    // Add more appointments as needed
  ];

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    let calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('timeGridDay', arg.date);
  };

  const handleRequest = () => {
    navigate('/main/request');
  }

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  const handleClose = () => {
    setSelectedEvent(null);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        overflowY: "hidden",
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
        width: "100%",
        backgroundColor: "white",
      }}
    >
      {/* Left div for schedule label, request button, and monthly grid calendar */}
      <div style={{ flex: 1, overflow: "hidden", paddingRight: "24px", paddingTop: "50px" }}>
        {/* ... */}
        {/* Monthly grid calendar */}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          style={{ width: "100%", height: "calc(100% - 50px)" }}
          events={events} // Add the events to the calendar
          eventClick={handleEventClick} // Add the eventClick handler
        />
      </div>

      {/* Right div for hourly calendar */}
      <div style={{ flex: 2, overflow: "hidden", paddingTop: "50px", paddingBottom: "50px" }}>
        {selectedDate && (
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridDay"
            visibleRange={{
              start: selectedDate,
              end: selectedDate,
            }}
            headerToolbar={false}
            height="calc(100% - 100px)" // Adjust the height
            events={events} // Add the events to the calendar
            eventClick={handleEventClick} // Add the eventClick handler
          />
        )}
      </div>

      {/* Dialog for displaying event details */}
      <Dialog
        open={selectedEvent !== null}
        onClose={handleClose}
      >
        <DialogTitle>Appointment With Patient 1</DialogTitle>
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
    </div>
  );
}