import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import moment from "moment-timezone";

export default function AdminAppointmentView() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [proceduresList, setProceduresList] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [roomsList, setRooms] = useState([]);
  const [selectedApptDetails, setSelectedApptDetails] = useState({});

  useEffect(() => {
    axios
      .get("https://mediflow-cse416.onrender.com/appointments", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
      .then((res) => setAppointments(res.data));

    axios
      .get("https://mediflow-cse416.onrender.com/users", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
      .then((res) => {
        setUsersList(res.data);
      });

    axios
      .get("https://mediflow-cse416.onrender.com/procedures", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
      .then((res) => {
        setProceduresList(res.data);
      });

    axios
      .get("https://mediflow-cse416.onrender.com/processes", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
      .then((res) => setProcessList(res.data));

    axios
      .get("https://mediflow-cse416.onrender.com/rooms", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
      .then((res) => {
        setRooms(res.data);
      })
      .then(console.log("found rooms"));
  }, []);

  useEffect(() => {
    if (selectedAppt) {
      const patient = usersList.find(
        (user) => user._id === selectedAppt.patient
      );
      const proceduresDetail = selectedAppt.procedures.map((procedureId) => {
        const procedure = proceduresList.filter((p) => p._id === procedureId);
        return procedure
          ? {
              id: procedure._id,
              name: procedure.name,
              description: procedure.description,
            }
          : null;
      });
      const roomsDetail = roomsList
        .filter((room) => room.appointments.includes(selectedAppt._id))
        .map((room) => room.name);

      setSelectedApptDetails({
        patientInfo: patient
          ? `Patient ID: ${patient._id}, Name: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}`
          : "Patient details not found",
        processName: processList.find(
          (process) => process._id === selectedAppt.process
        )?.name,
        procedures: selectedAppt.procedures,
        rooms: roomsDetail,
      });
      console.log(selectedApptDetails);
    }
  }, [selectedAppt, usersList, roomsList, proceduresList, processList]);

  const handleEventClick = (info) => {
    console.log(info);
    setSelectedAppt(info);
  };

  const handleClose = () => {
    setSelectedAppt(null);
  };

  const formatTime = (time) => {
    return moment(time).tz("America/New_York").format("M/D hh:mm A");
  };

  const fetchAppointments = async () => {
    const response = await axios.get(
      "https://mediflow-cse416.onrender.com/appointments/pending",
      {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    );
    console.log("appointments", response.data);
    setAppointments(response.data);
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    await axios.put(
      `https://mediflow-cse416.onrender.com/updateAppointmentStatus`,
      { appointmentId: appointmentId, status: newStatus },
      {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    );
    fetchAppointments(); // Refetch appointments to update the list
  };

  return (
    <Box sx={{ maxWidth: 650, m: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pending Appointments
      </Typography>
      <List>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <ListItem
              key={appointment._id}
              divider
              secondaryAction={
                <>
                  <Button
                    variant="contained"
                    color="grey"
                    sx={{ marginRight: 1 }}
                    onClick={() => handleEventClick(appointment)}
                  >
                    Info
                  </Button>
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
                primary={`${(() => {
                  const processName = processList.find(
                    (process) => process._id === appointment.process
                  );
                  return processName ? processName.name : "Unknown Process";
                })()} Appointment for ${(() => {
                  const patient = usersList.find(
                    (user) => user._id === appointment.patient
                  );
                  return patient ? patient.name : "Unknown Patient";
                })()}`}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No pending appointments." />
          </ListItem>
        )}
      </List>

      {selectedAppt && (
        <Dialog open={selectedAppt !== null} onClose={handleClose}>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogContent>
            <List>
              <ListItem>
                <ListItemText
                  primary={"Patient Information"}
                  secondary={(() => {
                    const patient = usersList.find(
                      (user) => user._id === selectedAppt.patient
                    );
                    if (patient) {
                      return `Patient ID: ${patient._id}, Name: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}`;
                    } else {
                      return "Patient details not found";
                    }
                  })()}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Date"
                  secondary={`${formatTime(
                    selectedAppt.created
                  )} - ${formatTime(
                    new Date(
                      new Date(selectedAppt.created).getTime() +
                        2 * 60 * 60 * 1000
                    ) // Assuming a duration of 2 hours for simplicity
                  )}`}
                />
              </ListItem>
              {selectedAppt.procedures.map((procedure) => {
                const procedureDetails = proceduresList.find(
                  (p) => p._id === procedure.procedure
                );
                const staffNames = procedure.staff
                  .map((staffId) => {
                    const staffMember = usersList.find(
                      (user) => user._id === staffId
                    );
                    return staffMember
                      ? staffMember.name
                      : "Staff details not found";
                  })
                  .join(", ");

                return (
                  <ListItem key={procedure._id}>
                    <ListItemText
                      primary={
                        procedureDetails
                          ? procedureDetails.name
                          : "Procedure details not found"
                      }
                      secondary={
                        <>
                          <div>
                            Description:{" "}
                            {procedureDetails
                              ? procedureDetails.description
                              : "No description available"}
                          </div>
                          <div>
                            Scheduled:{" "}
                            {moment(procedure.scheduledStartTime).format(
                              "M/D/YYYY hh:mm A"
                            )}{" "}
                            -{" "}
                            {moment(procedure.scheduledEndTime).format(
                              "M/D/YYYY hh:mm A"
                            )}
                          </div>
                          <div>Staff: {staffNames}</div>
                        </>
                      }
                    />
                  </ListItem>
                );
              })}
              <ListItem>
                <ListItemText
                  primary="Room"
                  secondary={selectedApptDetails.rooms.join(", ")}
                />
              </ListItem>
            </List>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ marginRight: 1 }}
                    onClick={() =>
                      handleUpdateStatus(selectedAppt._id, "accepted")
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() =>
                      handleUpdateStatus(selectedAppt._id, "rejected")
                    }
                  >
                    Reject
                  </Button>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}
