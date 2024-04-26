import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

export default function AdminAppointmentView() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const response = await axios.get(
      "https://mediflow-cse416.onrender.com/api/appointments/pending",
      {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    );
    setAppointments(response.data);
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    await axios.put(
      `https://mediflow-cse416.onrender.com/api/appointments/update/${appointmentId}`,
      { status: newStatus },
      {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    );
    fetchAppointments(); // Refetch appointments to update the list
  };

  return (
    <Box sx={{ maxWidth: 600, m: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pending Appointments
      </Typography>
      <List>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <ListItem
              key={appointment.id}
              divider
              secondaryAction={
                <>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ marginRight: 1 }}
                    onClick={() =>
                      handleUpdateStatus(appointment.id, "accepted")
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() =>
                      handleUpdateStatus(appointment.id, "rejected")
                    }
                  >
                    Reject
                  </Button>
                </>
              }
            >
              <ListItemText
                primary={`Appointment for ${appointment.patient}`}
                secondary={`Scheduled on ${appointment.scheduledStartTime}`}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No pending appointments." />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
