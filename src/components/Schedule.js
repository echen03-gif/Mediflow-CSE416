import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef(null);
  const navigate = useNavigate();

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    let calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('timeGridDay', arg.date);
  };

  const handleRequest = () => {
    navigate('/main/request');
  }

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
      <div style={{ flex: 1, overflow: "hidden", paddingRight: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h4>SCHEDULE</h4>
          <button
            style={{
              backgroundColor: "#CCEEFF",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleRequest}
          >
            + Request
          </button>
        </div>
        {/* Monthly grid calendar */}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          style={{ width: "100%" }}
        />
      </div>

      {/* Right div for hourly calendar */}
      <div style={{ flex: 2, overflow: "hidden" }}>
        {selectedDate && (
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridDay"
            visibleRange={{
              start: selectedDate,
              end: selectedDate,
            }}
            headerToolbar={false}
            height="100%"
          />
        )}
      </div>
    </div>
  );
}