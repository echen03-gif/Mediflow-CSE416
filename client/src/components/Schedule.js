import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Box } from '@mui/material';

function Schedule() {
  return (
    <Box>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: 'Appointment with Patient 1', date: '2024-03-17' },
          { title: 'Surgery with Patient 2', date: '2024-03-19' },
        ]}
      />
    </Box>
  );
}

export default Schedule;
